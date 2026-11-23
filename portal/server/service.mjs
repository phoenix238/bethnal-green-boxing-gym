import {
  account,
  apply,
  decide,
  effects,
  initial,
  requireValue,
  suggestions,
  WAIVER,
  WAIVER_TEXT,
  HOUR,
} from "./model.mjs";

import { seedEvents } from "./seed.mjs";
const vals = Object.values;
export async function door(env, now = Date.now()) {
  const { state } = await replay(env.DB);
  return {
    open: vals(state.classes).some(
      (c) => now >= c.start - HOUR && now <= c.start + c.late * 60000,
    ),
  };
}
const uuid = () => crypto.randomUUID();
const sql = "SELECT seq, payload FROM portal_events ORDER BY seq";
export async function replay(db) {
  const { results } = await db.prepare(sql).all();
  const events = results.map((r) => JSON.parse(r.payload));
  return {
    state: events.reduce(apply, initial()),
    events,
    version: results.at(-1)?.seq ?? 0,
  };
}
function permission(state, identity, env) {
  if (
    identity.id &&
    [env.ADMIN_EMAIL, env.JB_EMAIL].some(
      (email) => email && email.toLowerCase() === identity.email.toLowerCase(),
    )
  )
    return "admin";
  return (
    state.roles[identity.id] ??
    (vals(state.members).some(
      (m) => m.claimedBy === identity.id && !!identity.id,
    )
      ? "member"
      : "visitor")
  );
}
async function hash(text) {
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}
export function identityFrom(request) {
  return {
    id: request.headers.get("oai-authenticated-user-id") || "",
    email: request.headers.get("oai-authenticated-user-email") || "",
  };
}
function pendingReminder(s, m, now) {
  const cls = m.summary.classId;
  return (
    !s.feed?.ok ||
    now - s.feed.at > 300000 ||
    !account(s, m.ref).attendance.some((v) => v.classId === cls && v.due > 0) ||
    vals(s.payments).some(
      (p) =>
        !p.ref &&
        !p.void &&
        (!suggestions(s, p).length || suggestions(s, p).includes(m.ref)),
    )
  );
}
function mockDelivery(s, now, actor, outage) {
  const mail = vals(s.emails).find(
    (m) =>
      !["Delivered in rehearsal", "Cancelled"].includes(m.status) &&
      (m.id.startsWith("receipt/") || !pendingReminder(s, m, now)),
  );
  if (!mail) return null;
  // The rehearsal provider receipt is committed together with the job update.
  const summary = { ...mail.summary };
  if (mail.id.startsWith("reminder/"))
    summary.due = account(s, mail.ref).attendance.find(
      (v) => v.classId === summary.classId,
    ).due;
  return {
    actor,
    kind: "mail",
    at: now,
    data: {
      id: mail.id,
      summary,
      status: outage ? "Email unavailable" : "Delivered in rehearsal",
      receipt: outage ? null : mail.id,
    },
  };
}
const cleanRequestKey = (key) =>
  typeof key === "string" && /^[0-9a-f-]{36}$/i.test(key);
export async function command(env, identity, action, b, key, clock = Date.now) {
  requireValue(cleanRequestKey(key), "Resubmit using the portal");
  requireValue(b && typeof b === "object" && !Array.isArray(b), "Invalid form");
  const db = env.DB,
    id = uuid(),
    secret = action === "invite" ? uuid() + uuid() : "";
  const digest =
    action === "invite" || action === "claim"
      ? await hash(secret || String(b.code))
      : null;
  const initials = String(b.name ?? "")
    .trim()
    .split(/\s+/)
    .map((x) => x[0])
    .join("")
    .replace(/[^A-Za-z]/g, "")
    .toUpperCase();
  const prefix = (initials[0] || "B") + (initials.at(-1) || "C");
  for (let attempt = 0; attempt < 12; attempt++) {
    const { state: s, events, version } = await replay(db);
    const role = permission(s, identity, env),
      actor = identity.id || "wall",
      now = clock();
    const keyId = actor + "/" + action + "/" + key;
    const previous = events.find((e) => e.key === keyId);
    if (previous)
      return previous.kind === "signup"
        ? { ref: previous.data.ref }
        : { ok: true };
    let ref;
    do {
      ref =
        prefix + (10 + (crypto.getRandomValues(new Uint32Array(1))[0] % 99990));
    } while (s.members[ref]);
    const ctx = { role, actor: identity.id, now, id, digest, newRef: ref };
    let e;
    if (action === "seed") {
      requireValue(role === "admin", "JB access required", 403);
      if (events.some((e) => e.kind === "seed")) return { ok: true };
      requireValue(
        !vals(s.members).length && !vals(s.classes).length,
        "Seed the rehearsal before creating records",
      );
      e = {
        kind: "seed",
        at: now,
        actor,
        data: { events: seedEvents(now, actor) },
      };
    } else if (action === "refresh") {
      requireValue(role === "admin", "JB access required", 403);
      // Rehearsal-only feed. A failed read can never advance a successful watermark.
      requireValue(
        Array.isArray(b.rows) && b.rows.length <= 25,
        "Use up to 25 rehearsal rows",
      );
      e = decide(
        s,
        "import",
        { rows: b.outage ? [] : b.rows, ok: !b.outage },
        { ...ctx, role: "service" },
      );
    } else if (action === "assessNow") {
      requireValue(role === "admin", "JB access required", 403);
      e = decide(s, "assess", {}, { ...ctx, role: "service" });
    } else if (action === "deliver") {
      requireValue(role === "admin", "JB access required", 403);
      e = mockDelivery(s, now, actor, b.outage === true);
    } else e = decide(s, action, b, ctx);
    if (!e) return { ok: true };
    e.key = keyId;
    effects(s, e);
    const r = await db
      .prepare(
        "INSERT INTO portal_events(seq,payload) SELECT ?,? WHERE (SELECT COALESCE(MAX(seq),0) FROM portal_events)=?",
      )
      .bind(version + 1, JSON.stringify(e), version)
      .run();
    if (r.meta.changes)
      return e.kind === "signup"
        ? { ref: e.data.ref }
        : secret
          ? { code: secret }
          : { ok: true, changed: true };
  }
  requireValue(false, "The register is busy. Try that entry again.", 503);
}
export async function view(env, identity, now = Date.now()) {
  const { state: s, events } = await replay(env.DB);
  const role = permission(s, identity, env);
  const base = {
    role,
    signed: !!identity.id,
    waiver: WAIVER,
    waiverText: WAIVER_TEXT,
    open: vals(s.classes).some(
      (c) => now >= c.start - HOUR && now <= c.start + c.late * 60000,
    ),
  };
  if (role === "admin") {
    return {
      ...base,
      price: s.price,
      referral: s.referral,
      classes: vals(s.classes),
      members: vals(s.members).map((m) => ({ ...m, ...account(s, m.ref) })),
      payments: vals(s.payments).map((p) => ({
        ...p,
        suggestions: p.ref ? [] : suggestions(s, p),
      })),
      feed: s.feed,
      assessments: vals(s.assessments).filter((r) =>
        account(s, r.ref).attendance.some((v) => v.id === r.id && v.due),
      ),
      emails: vals(s.emails),
      audit: events
        .slice(-60)
        .reverse()
        .map((e) => ({
          at: e.at,
          actor: e.actor,
          kind: e.kind,
          ref: e.data.ref ?? "",
          reason: e.data.reason ?? "",
        })),
    };
  }
  if (role === "coach")
    return {
      ...base,
      classes: vals(s.classes).map(({ start, end }) => ({ start, end })),
    };
  if (role === "member") {
    const m = vals(s.members).find((m) => m.claimedBy === identity.id);
    return {
      ...base,
      account: account(s, m.ref),
      posts: s.posts.filter((p) => p.start <= now && now < p.end),
    };
  }
  return base;
}

export async function backup(env, identity) {
  const { state, events, version } = await replay(env.DB);
  requireValue(
    permission(state, identity, env) === "admin",
    "JB access required",
    403,
  );
  const content = JSON.stringify(events);
  return {
    format: "bgbc-register-v1",
    version,
    sha256: await hash(content),
    events,
  };
}
