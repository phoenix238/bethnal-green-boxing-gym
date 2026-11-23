import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { localDB } from "./local-db.mjs";
import { command, view, replay } from "../server/service.mjs";
import { handle } from "../server/handler.mjs";
const admin = { id: "staff-one", email: "jb@example.invalid" },
  person = { id: "athlete-one", email: "athlete@example.invalid" },
  wall = { id: "", email: "" };
const base = Date.parse("2026-11-24T18:00:00Z"),
  min = 60000;
const iso = (t) => new Date(t).toISOString();
const registration = {
  name: "Demo Morgan",
  dob: "1995-04-10",
  signer: "Demo Morgan",
  version: "rehearsal-v1",
  accepted: true,
  email: "demo@example.invalid",
};
function fixture(path) {
  const env = { DB: localDB(path), ADMIN_EMAIL: admin.email };
  let now = base;
  const run = (who, op, data = {}, key = crypto.randomUUID()) =>
    command(env, who, op, data, key, () => now);
  const state = (who) => view(env, who, now);
  const schedule = (start = base) =>
    run(admin, "class", {
      start: iso(start),
      end: iso(start + 60 * min),
      late: 15,
      fee: 1000,
    });
  const signup = (who = person, extra = {}) =>
    run(who, "signup", { ...registration, ...extra }).then((x) => x.ref);
  return {
    env,
    run,
    state,
    schedule,
    signup,
    at(t) {
      now = t;
    },
  };
}
test("phone signup, signed waiver, no duplicate attendance under concurrency, class opens and closes on the minute", async () => {
  const f = fixture();
  await assert.rejects(f.signup(person, { accepted: false }), /waiver/);
  const ref = await f.signup();
  await f.schedule();
  f.at(base - 60 * min - 1);
  await assert.rejects(f.run(wall, "checkin", { ref }), /closed/);
  f.at(base - 60 * min);
  await Promise.all(
    Array.from({ length: 5 }, () => f.run(wall, "checkin", { ref })),
  );
  assert.equal((await f.state(person)).account.balance, -1000);
  const member = (await f.state(admin)).members[0];
  assert.equal(member.waiver.actor, person.id);
  assert.equal(member.media, false);
  f.at(base + 15 * min);
  await f.run(wall, "checkin", { ref });
  f.at(base + 15 * min + 1);
  await assert.rejects(f.run(wall, "checkin", { ref }), /closed/);
  const id = (await f.state(admin)).classes[0].id;
  await f.run(admin, "attendance", {
    ref,
    classId: id,
    present: false,
    billable: false,
    reason: "Register correction",
  });
  assert.equal((await f.state(person)).account.balance, 0);
  await f.run(admin, "attendance", {
    ref,
    classId: id,
    present: true,
    billable: true,
    reason: "Actual late arrival",
  });
  assert.equal((await f.state(person)).account.balance, -1000);
});
test("assisted junior, separate attendance and clearance, one-time personal account claim; coach and kiosk have limited records", async () => {
  const f = fixture();
  await f.schedule();
  const ref = await f.signup(admin, {
    dob: "2012-04-09",
    guardian: "Demo Parent",
    contact: "07000000000",
  });
  await f.run(wall, "checkin", { ref });
  assert.equal((await f.state(admin)).members[0].balance, 0);
  await assert.rejects(
    f.run(admin, "clear", { ref, cleared: true, reason: "Ready" }),
    /guardian/,
  );
  await f.run(admin, "consent", {
    ref,
    guardian: "Demo Parent",
    relationship: "Parent",
    terms: "Rehearsal class only",
    when: iso(base - min),
  });
  assert.equal((await f.state(admin)).members[0].cleared, false);
  await f.run(admin, "clear", {
    ref,
    cleared: true,
    reason: "Rehearsal approval",
  });
  const invited = await f.run(admin, "invite", { ref, role: "member" });
  await f.run(person, "claim", { code: invited.code });
  await assert.rejects(
    f.run({ id: "second", email: "" }, "claim", { code: invited.code }),
    /expired/,
  );
  assert.equal((await f.state(person)).account.ref, ref);
  for (const role of ["coach", "kiosk"]) {
    const who = { id: role, email: role + "@example.invalid" };
    const { code } = await f.run(admin, "invite", { role });
    await f.run(who, "claim", { code });
    const data = await f.state(who);
    assert.equal(data.role, role);
    assert.ok(!("members" in data));
    assert.ok(!("payments" in data));
    await assert.rejects(
      f.run(who, "cash", { ref, amount: 1000, type: "topup" }),
      /JB access/,
    );
  }
  assert.ok(!JSON.stringify(await f.state(wall)).includes("Demo Parent"));
});
test("cash retry, feed import replay, manual match, payment correction, single receipt and email outage recovery", async () => {
  const f = fixture(),
    ref = await f.signup();
  await f.schedule();
  await f.run(wall, "checkin", { ref });
  const key = crypto.randomUUID(),
    cash = { ref, amount: 1000, type: "topup" };
  await Promise.all([
    f.run(admin, "cash", cash, key),
    f.run(admin, "cash", cash, key),
  ]);
  const row = {
    transactionId: "fixture-1",
    reference: "School run",
    payer: "Demo Morgan",
    amount: 2000,
  };
  await f.run(admin, "refresh", { rows: [row, row] });
  await f.run(admin, "refresh", { rows: [row] });
  let s = await f.state(admin);
  assert.equal(s.emails.length, 1);
  assert.deepEqual(s.payments[1].suggestions, [ref]);
  await f.run(admin, "review", {
    id: "bank/fixture-1",
    ref,
    type: "topup",
    reason: "Payer confirmed",
  });
  assert.equal((await f.state(person)).account.balance, 2000);
  await f.run(admin, "deliver", { outage: true });
  assert.equal((await f.state(admin)).emails[0].status, "Email unavailable");
  for (let i = 0; i < 4; i++) await f.run(admin, "deliver", {});
  s = await f.state(admin);
  assert.equal(s.emails.filter((m) => m.receipt).length, 2);
  await f.run(admin, "void", {
    id: "bank/fixture-1",
    reason: "Statement correction",
  });
  assert.equal((await f.state(person)).account.balance, 0);
  assert.equal((await f.state(admin)).audit[0].reason, "Statement correction");
});
test("priced membership starts at next class; a paid referral earns credit only once and timed announcement expires", async () => {
  const f = fixture(),
    referrer = await f.signup(admin);
  await f.run(admin, "settings", { price: 7200, referral: 500 });
  const ref = await f.signup(person, { referredBy: referrer });
  const start = base + 6 * min;
  await f.schedule(start);
  await f.run(admin, "refresh", {
    rows: [
      {
        transactionId: "so",
        reference: "MEMBER" + ref,
        payer: "",
        amount: 7200,
      },
    ],
  });
  await f.run(wall, "checkin", { ref });
  await f.run(wall, "checkin", { ref });
  let a = (await f.state(person)).account;
  assert.equal(a.balance, 0);
  assert.equal(a.periods[0].start, start);
  assert.equal(iso(a.periods[0].end), "2026-12-24T00:00:00.000Z");
  assert.equal(
    (await f.state(admin)).members.find((m) => m.ref === referrer).credit,
    500,
  );
  await f.run(admin, "post", {
    text: "Bring wraps",
    start: iso(base),
    end: iso(base + min),
  });
  assert.equal((await f.state(person)).posts.length, 1);
  f.at(base + min);
  assert.deepEqual((await f.state(person)).posts, []);
});
test("post-class assessment waits for refresh, bank outage, unmatched transfers and outstanding debt; payment before delivery suppresses reminder", async () => {
  const f = fixture(),
    ref = await f.signup();
  await f.schedule();
  await f.run(wall, "checkin", { ref });
  f.at(base + 90 * min - 1);
  await f.run(admin, "assessNow");
  assert.equal((await f.state(admin)).assessments.length, 0);
  f.at(base + 90 * min);
  await f.run(admin, "refresh", { rows: [], outage: true });
  await f.run(admin, "assessNow");
  assert.match((await f.state(admin)).assessments[0].hold, /refresh/);
  await f.run(admin, "refresh", {
    rows: [
      {
        transactionId: "pending",
        reference: "?",
        payer: "Demo Morgan",
        amount: 1000,
      },
    ],
  });
  await f.run(admin, "assessNow");
  assert.match((await f.state(admin)).assessments[0].hold, /review/);
  await f.run(admin, "void", {
    id: "bank/pending",
    reason: "Wrong statement entry",
  });
  await f.run(admin, "assessNow");
  assert.equal(
    (await f.state(admin)).emails.filter((m) => m.id.startsWith("reminder/"))
      .length,
    1,
  );
  await f.run(admin, "cash", { ref, amount: 1000, type: "topup" });
  await f.run(admin, "deliver");
  assert.equal(
    (await f.state(admin)).emails.filter(
      (m) => m.id.startsWith("reminder/") && m.receipt,
    ).length,
    0,
  );
});
test("exact original reference and transaction ID survive statement fallback and feed replay; backup restores same records", async () => {
  const dir = mkdtempSync(join(tmpdir(), "bgbc-"));
  try {
    const f = fixture(join(dir, "active.sqlite"));
    const ref = await f.signup(),
      row = {
        transactionId: "uuid-1",
        reference: " " + ref + " ",
        payer: "Fixture Payer",
        amount: 1200,
      };
    await f.run(admin, "manualBank", {
      ...row,
      reason: "Read statement during outage",
    });
    await f.run(admin, "refresh", { rows: [row] });
    const before = await f.state(admin);
    assert.equal(before.payments.length, 1);
    assert.equal(before.payments[0].raw, row.reference);
    assert.equal(before.payments[0].payer, row.payer);
    f.env.DB.raw.prepare("VACUUM INTO ?").run(join(dir, "backup.sqlite"));
    const restored = fixture(join(dir, "backup.sqlite"));
    assert.deepEqual(await restored.state(admin), before);
    assert.equal(
      restored.env.DB.raw.prepare("PRAGMA integrity_check").get()
        .integrity_check,
      "ok",
    );
    const { events } = await replay(restored.env.DB);
    assert.ok(events.length >= 3);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
test("request boundary, separate users and read-only door view", async () => {
  const f = fixture();
  await f.signup();
  const url = "https://club.example";
  const door = await handle(new Request(url + "/api/door"), f.env, {});
  assert.deepEqual(Object.keys(await door.json()), ["open"]);
  const denied = await handle(
    new Request(url + "/api/cash", {
      method: "POST",
      headers: {
        origin: "https://other.example",
        "content-type": "application/json",
      },
      body: "{}",
    }),
    f.env,
    {},
  );
  assert.equal(denied.status, 403);
  const other = await f.state({
    id: "stranger",
    email: "not-member@example.invalid",
  });
  assert.ok(!other.account);
});
test("unattended class-night job reads bank first, holds on outage, clears debt before delivery and sends one reminder only", async () => {
  const { classNight } = await import("../server/jobs.mjs");
  const f = fixture(),
    ref = await f.signup();
  await f.schedule();
  await f.run(wall, "checkin", { ref });
  let now = base + 90 * min - 1,
    reads = 0;
  const options = { clock: () => now };
  const good = async () => {
    reads++;
    return [];
  };
  await classNight(f.env, good, options);
  assert.equal(reads, 0);
  now++;
  await classNight(
    f.env,
    async () => {
      throw Error("offline");
    },
    options,
  );
  assert.match((await f.state(admin)).assessments[0].hold, /refresh/);
  await classNight(f.env, good, options);
  await classNight(f.env, good, options);
  assert.equal(
    (await f.state(admin)).emails.filter(
      (m) => m.id.startsWith("reminder/") && m.receipt,
    ).length,
    1,
  );
  await classNight(
    f.env,
    async () => [{ transactionId: "late-clear", reference: ref, amount: 1000 }],
    options,
  );
  assert.equal((await f.state(person)).account.balance, 0);
});
test("reversing the only qualifying payment retracts referral credit and requalification restores it once", async () => {
  const f = fixture(),
    referrer = await f.signup(admin),
    ref = await f.signup(person, { referredBy: referrer });
  await f.run(admin, "settings", { price: 7000, referral: 500 });
  await f.schedule();
  await f.run(wall, "checkin", { ref });
  await f.run(admin, "cash", { ref, type: "topup", amount: 1000 });
  const credit = async () =>
    (await f.state(admin)).members.find((m) => m.ref === referrer).credit;
  assert.equal(await credit(), 500);
  await f.run(admin, "void", {
    id: (await f.state(admin)).payments[0].id,
    reason: "Cash was entered in error",
  });
  assert.equal(await credit(), 0);
  await f.run(admin, "cash", { ref, type: "topup", amount: 1000 });
  assert.equal(await credit(), 500);
});
test("private export restores into a fresh file, validates hash, and refuses to replace an existing database", async () => {
  const { backup } = await import("../server/service.mjs"),
    { restore } = await import("../restore.mjs");
  const f = fixture();
  await f.run(admin, "seed");
  await assert.rejects(backup(f.env, person), /JB access/);
  const snapshot = await backup(f.env, admin),
    dir = mkdtempSync(join(tmpdir(), "bgbc-restore-")),
    path = join(dir, "restore.sqlite");
  try {
    restore(snapshot, path);
    await assert.rejects(async () => restore(snapshot, path), /exist/);
    assert.throws(
      () =>
        restore({ ...snapshot, sha256: "changed" }, join(dir, "bad.sqlite")),
      /checksum/,
    );
    assert.deepEqual(await fixture(path).state(admin), await f.state(admin));
  } finally {
    rmSync(dir, { force: true, recursive: true });
  }
});
test("return visit after top-up and next-class membership leaves the earlier class fee intact", async () => {
  const f = fixture(),
    ref = await f.signup();
  await f.schedule();
  await f.run(wall, "checkin", { ref });
  f.at(base + 61 * min);
  await f.run(admin, "cash", { ref, type: "topup", amount: 1000 });
  await f.run(admin, "refresh", {
    rows: [
      {
        transactionId: "member-first",
        reference: "MEMBER" + ref,
        payer: "",
        amount: 7000,
      },
    ],
  });
  assert.equal((await f.state(person)).account.periods[0].start, null);
  const next = base + 48 * 60 * min;
  await f.schedule(next);
  f.at(next);
  await f.run(wall, "checkin", { ref });
  const a = (await f.state(person)).account;
  assert.deepEqual(
    a.attendance.map((v) => [v.fee, v.covered, v.due]),
    [
      [1000, false, 0],
      [0, true, 0],
    ],
  );
  assert.equal(a.balance, 0);
  assert.equal(a.progress, 2);
  assert.equal(a.periods[0].start, next);
});
