// All monetary values are integer pence. The worker appends one immutable event per command.
export const WAIVER = "rehearsal-v1";
export const WAIVER_TEXT =
  "Rehearsal only. I understand this is a fictional class registration and agree to take part in this practice check-in.";
export const HOUR = 3600000;
export function requireValue(ok, message, status = 400) {
  if (!ok) throw Object.assign(new Error(message), { status });
}
function string(value, label, limit = 180) {
  requireValue(
    typeof value === "string" && value.trim().length && value.length <= limit,
    "Enter a valid " + label,
  );
  return value.trim();
}
function money(value) {
  requireValue(
    Number.isSafeInteger(value) && value > 0 && value <= 1000000,
    "Enter a positive amount in pence",
  );
  return value;
}
function time(value) {
  const stamp = Date.parse(value);
  requireValue(Number.isFinite(stamp), "Enter a valid date and time");
  return stamp;
}
const values = (obj) => Object.values(obj);
export function initial() {
  return {
    members: {},
    classes: {},
    visits: {},
    payments: {},
    roles: {},
    invites: {},
    posts: [],
    emails: {},
    assessments: {},
    feed: null,
    price: 7000,
    referral: 0,
    awards: {},
    seen: {},
  };
}
export function apply(s, e) {
  const p = e.data;
  switch (e.kind) {
    case "seed":
      for (const item of p.events) apply(s, item);
      break;
    case "signup":
      s.members[p.ref] = {
        ...p,
        claimedBy: p.owner,
        consent: p.minor ? "Pending" : "Adult",
        cleared: !p.minor,
      };
      break;
    case "invite":
      s.invites[p.digest] = p;
      break;
    case "claim": {
      const invite = s.invites[p.digest];
      if (invite.role === "member") s.members[invite.ref].claimedBy = e.actor;
      else s.roles[e.actor] = invite.role;
      delete s.invites[p.digest];
      break;
    }
    case "consent":
      Object.assign(s.members[p.ref], { consent: "Recorded", verbal: p });
      break;
    case "clear":
      s.members[p.ref].cleared = p.cleared;
      break;
    case "class":
      s.classes[p.id] = p;
      break;
    case "visit":
      s.visits[p.id] = p;
      break;
    case "payment":
      s.payments[p.id] = p;
      break;
    case "feed":
      for (const item of p.items) s.payments[item.id] = item;
      s.feed = { at: e.at, ok: p.ok };
      break;
    case "price":
      s.price = p.price;
      s.referral = p.referral;
      break;
    case "post":
      s.posts.push(p);
      break;
    case "assess":
      s.assessments = {};
      for (const item of p.rows) s.assessments[item.id] = item;
      break;
    case "mail":
      Object.assign(s.emails[p.id], p);
      break;
  }
  for (const mail of e.messages ?? []) s.emails[mail.id] = mail;
  for (const ref of e.eligible ?? []) s.awards[ref] = e.gifts[ref];
  if (e.key) s.seen[e.key] = true;
  return s;
}
function nextMonth(start) {
  // Membership renews on the same London calendar day, including month-end and DST.
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const parts = Object.fromEntries(
    formatter.formatToParts(start).map((p) => [p.type, Number(p.value)]),
  );
  const lastDay = new Date(
    Date.UTC(parts.year, parts.month + 1, 0),
  ).getUTCDate();
  const target = Date.UTC(
    parts.year,
    parts.month,
    Math.min(parts.day, lastDay),
  );
  const isSummer = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    timeZoneName: "shortOffset",
  })
    .formatToParts(target - HOUR)
    .some((p) => p.value === "GMT+1");
  return target - (isSummer ? HOUR : 0);
}
function passes(s, ref) {
  let previous = 0;
  return values(s.payments)
    .filter((p) => p.ref === ref && p.type === "membership" && !p.void)
    .sort((a, b) => a.matched - b.matched || a.id.localeCompare(b.id))
    .map((p) => {
      const first =
        p.start ??
        values(s.classes)
          .filter((c) => c.start >= p.matched)
          .sort((a, b) => a.start - b.start)[0]?.start;
      if (first == null) return { start: null, end: null };
      const start = Math.max(first, previous);
      previous = nextMonth(start);
      return { start, end: previous };
    });
}
export function account(s, ref) {
  const member = s.members[ref],
    periods = passes(s, ref);
  const visits = values(s.visits)
    .filter((v) => v.ref === ref && v.present)
    .sort(
      (a, b) =>
        s.classes[a.classId].start - s.classes[b.classId].start ||
        a.id.localeCompare(b.id),
    );
  const payments = values(s.payments).filter((p) => p.ref === ref && !p.void);
  let wallet = payments.reduce(
    (n, p) => n + (p.type === "topup" ? p.amount : 0),
    0,
  );
  let credit = 0;
  for (const gift of values(s.awards))
    if (gift.ref === ref && gift.active !== false) credit += gift.amount;
  wallet += credit;
  const attendance = visits.map((v) => {
    const cls = s.classes[v.classId],
      covered = periods.some(
        (p) => p.start != null && cls.start >= p.start && cls.start < p.end,
      );
    const fee = v.billable && !covered ? cls.fee : 0;
    const due = Math.max(0, fee - Math.max(0, wallet));
    wallet -= fee;
    return { ...v, start: cls.start, fee, due, covered };
  });
  return {
    ref,
    name: member.name,
    consent: member.consent,
    cleared: member.cleared,
    balance: wallet,
    credit,
    periods,
    attendance,
    progress: attendance.filter((v) => v.billable).length,
    payments: payments.map((p) => ({
      id: p.id,
      type: p.type,
      amount: p.amount,
      at: p.matched,
    })),
  };
}
function createVisit(s, ref, cls, present, billable, reason) {
  return {
    id: cls.id + "/" + ref,
    ref,
    classId: cls.id,
    present,
    billable: present && billable,
    reason,
  };
}
function knownMember(s, ref) {
  requireValue(Object.hasOwn(s.members, ref), "Check the member reference");
  return s.members[ref];
}
function matching(s, raw) {
  const code = raw.trim().toUpperCase();
  const type = code.startsWith("MEMBER") ? "membership" : "topup";
  const ref = type === "membership" ? code.slice(6) : code;
  return Object.hasOwn(s.members, ref) ? { ref, type } : null;
}
function matched(s, p, ref, type, at) {
  knownMember(s, ref);
  requireValue(["topup", "membership"].includes(type), "Choose a payment type");
  if (type === "membership")
    requireValue(
      p.amount === s.price,
      "Membership payment must equal the current monthly price",
    );
  return {
    ...p,
    ref,
    type,
    matched: at,
    start:
      type === "membership"
        ? (values(s.classes)
            .filter((c) => c.start >= at)
            .sort((a, b) => a.start - b.start)[0]?.start ?? null)
        : null,
  };
}
function bankItem(s, row, at) {
  const id = "bank/" + string(row.transactionId, "transaction ID");
  const amount = money(row.amount);
  const raw = String(row.reference ?? "").slice(0, 200);
  const p = {
    id,
    source: "bank",
    transactionId: row.transactionId,
    amount,
    raw,
    payer: String(row.payer ?? "").slice(0, 180),
    at,
    ref: null,
  };
  const match = matching(s, raw);
  return match && (match.type === "topup" || amount === s.price)
    ? matched(s, p, match.ref, match.type, at)
    : p;
}
export function suggestions(s, p) {
  const norm = (v) => v.trim().toLowerCase().replace(/\s+/g, " ");
  return values(s.members)
    .filter((m) => p.payer && norm(p.payer) === norm(m.name))
    .map((m) => m.ref);
}
export function decide(s, action, b, ctx) {
  const { actor, role, now } = ctx;
  const staff = role === "admin";
  const admin = () => requireValue(staff, "JB access required", 403);
  const signed = () =>
    requireValue(actor && role !== "kiosk", "Personal sign-in required", 403);
  const reason = () => string(b.reason, "reason");
  const ref = String(b.ref ?? "")
    .trim()
    .toUpperCase();
  const member = () => knownMember(s, ref);
  const memberForUser = () =>
    values(s.members).find((m) => m.claimedBy === actor);
  const event = (kind, data) => ({
    kind,
    data,
    at: now,
    actor: actor || "wall",
  });
  switch (action) {
    case "signup": {
      signed();
      if (!staff)
        requireValue(
          !memberForUser() && role === "visitor",
          "Account already in use",
          409,
        );
      const name = string(b.name, "full name", 100),
        signer = string(b.signer, "waiver signer", 100);
      requireValue(
        b.accepted === true && b.version === WAIVER,
        "Read and accept the current waiver",
      );
      requireValue(/^\d{4}-\d{2}-\d{2}$/.test(b.dob), "Enter a date of birth");
      const date = time(b.dob + "T00:00:00Z");
      requireValue(
        date <= now &&
          new Date(date).toISOString().slice(0, 10) === b.dob &&
          date >= Date.UTC(1900, 0, 1),
        "Check the date of birth",
      );
      const today = new Intl.DateTimeFormat("sv-SE", {
        timeZone: "Europe/London",
      }).format(now);
      const minor =
        today < String(Number(b.dob.slice(0, 4)) + 18) + b.dob.slice(4);
      const email = String(b.email ?? "").trim();
      requireValue(
        !email ||
          (email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
        "Check email address",
      );
      const guardian = minor
        ? {
            name: string(b.guardian, "guardian name"),
            contact: string(b.contact, "guardian phone or email"),
          }
        : null;
      const referredBy = String(b.referredBy ?? "")
        .trim()
        .toUpperCase();
      if (referredBy) knownMember(s, referredBy);
      const newRef = ctx.newRef;
      requireValue(!s.members[newRef], "Reference in use", 409);
      return event("signup", {
        ref: newRef,
        name,
        dob: b.dob,
        email,
        minor,
        guardian,
        owner: staff ? null : actor,
        waiver: { signer, version: WAIVER, at: now, actor },
        media: b.media === true,
        referredBy,
      });
    }
    case "invite": {
      admin();
      requireValue(
        ["member", "coach", "kiosk"].includes(b.role),
        "Choose an access level",
      );
      if (b.role === "member")
        requireValue(!member().claimedBy, "Member already has a sign-in");
      return event("invite", {
        digest: ctx.digest,
        ref,
        role: b.role,
        expires: now + HOUR,
      });
    }
    case "claim": {
      signed();
      requireValue(role === "visitor", "Use a fresh personal sign-in");
      const i = s.invites[ctx.digest];
      requireValue(
        i &&
          now < i.expires &&
          (i.role !== "member" || !s.members[i.ref].claimedBy),
        "Invitation expired or already used",
      );
      return event("claim", { digest: ctx.digest });
    }
    case "consent": {
      admin();
      requireValue(member().minor, "This member is an adult");
      const at = time(b.when);
      requireValue(at <= now, "Consent time must be in the past");
      return event("consent", {
        ref,
        guardian: string(b.guardian, "guardian name"),
        relationship: string(b.relationship, "relationship"),
        terms: string(b.terms, "agreed terms", 1200),
        at,
        staff: actor,
      });
    }
    case "clear": {
      admin();
      const m = member();
      requireValue(
        !b.cleared || m.consent !== "Pending",
        "Record guardian approval first",
      );
      return event("clear", {
        ref,
        cleared: b.cleared === true,
        reason: reason(),
      });
    }
    case "class": {
      admin();
      const start = time(b.start),
        end = time(b.end);
      requireValue(
        end > start && end - start <= 12 * HOUR,
        "Check the class times",
      );
      requireValue(
        Number.isInteger(b.late) &&
          b.late >= 0 &&
          b.late <= 240 &&
          start + b.late * 60000 <= end,
        "Check the late window",
      );
      requireValue(
        !values(s.classes).some(
          (c) =>
            start - HOUR <= c.start + c.late * 60000 &&
            c.start - HOUR <= start + b.late * 60000,
        ),
        "Check-in windows overlap",
      );
      return event("class", {
        id: ctx.id,
        start,
        end,
        late: b.late,
        fee: money(b.fee),
      });
    }
    case "checkin": {
      const cls = values(s.classes).find(
        (c) => now >= c.start - HOUR && now <= c.start + c.late * 60000,
      );
      requireValue(cls, "Check-in is closed. Please see JB.");
      // Identical public response for unknown, corrected or duplicate references.
      if (!Object.hasOwn(s.members, ref) || s.visits[cls.id + "/" + ref])
        return null;
      return event(
        "visit",
        createVisit(s, ref, cls, true, member().cleared, "Door check-in"),
      );
    }
    case "attendance": {
      admin();
      const m = member(),
        cls = s.classes[b.classId];
      requireValue(
        cls && now >= cls.start - HOUR,
        "Choose a current or past class",
      );
      requireValue(!b.billable || m.cleared, "Clearance to train required");
      return event(
        "visit",
        createVisit(
          s,
          ref,
          cls,
          b.present === true,
          b.billable === true,
          reason(),
        ),
      );
    }
    case "cash": {
      admin();
      return event(
        "payment",
        matched(
          s,
          {
            id: "cash/" + ctx.id,
            source: "cash",
            amount: money(b.amount),
            at: now,
          },
          ref,
          b.type,
          now,
        ),
      );
    }
    case "manualBank": {
      admin();
      const item = bankItem(s, b, now);
      if (s.payments[item.id]) return null;
      return event("payment", { ...item, manual: true, reason: reason() });
    }
    case "review": {
      admin();
      const p = s.payments[b.id];
      requireValue(p && !p.void, "Choose an existing payment");
      if (p.ref === ref && p.type === b.type) return null;
      return event("payment", {
        ...matched(s, p, ref, b.type, now),
        reason: reason(),
      });
    }
    case "void": {
      admin();
      const p = s.payments[b.id];
      requireValue(p && !p.void, "Choose an active payment");
      return event("payment", { ...p, void: true, reason: reason() });
    }
    case "import": {
      requireValue(role === "service", "Bank worker access required", 403);
      const seen = new Set();
      const items = b.rows
        .map((row) => bankItem(s, row, now))
        .filter((p) => {
          if (s.payments[p.id] || seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });
      return event("feed", { items, ok: b.ok === true });
    }
    case "assess": {
      requireValue(role === "service", "Bank worker access required", 403);
      const rows = [];
      for (const m of values(s.members))
        for (const v of account(s, m.ref).attendance) {
          if (now < s.classes[v.classId].end + HOUR / 2 || !v.due) continue;
          const unresolved = values(s.payments).filter(
            (p) => !p.ref && !p.void,
          );
          const uncertain = unresolved.some(
            (p) =>
              !suggestions(s, p).length ||
              suggestions(s, p).includes(m.ref) ||
              matching(s, p.raw)?.ref === m.ref,
          );
          const hold =
            !s.feed?.ok ||
            s.feed.at < s.classes[v.classId].end + HOUR / 2 ||
            now - s.feed.at > 5 * 60000
              ? "Bank refresh overdue"
              : uncertain
                ? "Transfer awaiting JB review"
                : !m.email
                  ? "No member email"
                  : null;
          rows.push({ id: v.id, ref: m.ref, due: v.due, hold });
        }
      return event("assess", { rows });
    }
    case "settings":
      admin();
      requireValue(
        Number.isSafeInteger(b.referral) &&
          b.referral >= 0 &&
          b.referral <= 10000,
        "Check referral amount",
      );
      return event("price", { price: money(b.price), referral: b.referral });
    case "post": {
      admin();
      const start = time(b.start),
        end = time(b.end);
      requireValue(end > start, "Check announcement dates");
      return event("post", {
        start,
        end,
        text: string(b.text, "announcement", 800),
      });
    }
    default:
      throw Object.assign(new Error("Unknown operation"), { status: 404 });
  }
}
export function effects(s, e) {
  const after = structuredClone(s);
  apply(after, e);
  e.gifts = {};
  e.eligible = [];
  // Referrers exist before their referrals. Settle the newest member first so a
  // corrected payment can also reverse credit that funded an earlier member's class.
  for (const m of values(after.members).reverse()) {
    if (!m.referredBy) continue;
    const existing = after.awards[m.ref],
      amount = existing?.amount ?? after.referral;
    if (!amount) continue;
    const qualified = account(after, m.ref).attendance.some(
      (v) => v.billable && !v.due,
    );
    if (qualified === Boolean(existing && existing.active !== false)) continue;
    e.eligible.push(m.ref);
    e.gifts[m.ref] = { ref: m.referredBy, amount, active: qualified };
    after.awards[m.ref] = e.gifts[m.ref];
  }
  const messages = [];
  const add = (id, ref, summary) => {
    if (after.members[ref]?.email && !after.emails[id])
      messages.push({ id, ref, summary, status: "Queued for rehearsal" });
  };
  const items =
    e.kind === "payment" ? [e.data] : e.kind === "feed" ? e.data.items : [];
  for (const p of items)
    if (p.ref && !p.void) {
      const a = account(after, p.ref);
      const receipt = after.emails["receipt/" + p.id];
      if (receipt && receipt.status !== "Delivered in rehearsal")
        delete after.emails[receipt.id];
      add("receipt/" + p.id, p.ref, {
        amount: p.amount,
        covered: p.type,
        balance: a.balance,
        renewal: a.periods.at(-1)?.end ?? null,
      });
    }
  for (const p of items)
    if (
      p.void &&
      after.emails["receipt/" + p.id] &&
      after.emails["receipt/" + p.id].status !== "Delivered in rehearsal"
    ) {
      messages.push({
        ...after.emails["receipt/" + p.id],
        status: "Cancelled",
      });
    }
  if (e.kind === "assess")
    for (const r of e.data.rows)
      if (!r.hold)
        add("reminder/" + r.id, r.ref, {
          due: r.due,
          classId: r.id.split("/")[0],
        });
  e.messages = messages;
}
