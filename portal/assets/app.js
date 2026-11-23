const app = document.querySelector("#app");
const kiosk = location.pathname === "/kiosk";
const esc = (v) =>
  String(v ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const date = (v) =>
  v
    ? new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/London",
        dateStyle: "medium",
        timeStyle: "short",
      }).format(v)
    : "Awaiting the next class";
const gbp = (v) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
    v / 100,
  );
const input = (n, label, type = "text", extra = "required") =>
  "<label>" +
  label +
  '<input name="' +
  n +
  '" type="' +
  type +
  '" ' +
  extra +
  "></label>";
const opt = (n, label) =>
  '<label><input type="checkbox" name="' + n + '"> ' + label + "</label>";
const select = (n, label, items) =>
  "<label>" +
  label +
  '<select required name="' +
  n +
  '">' +
  items
    .map(([k, v]) => '<option value="' + esc(k) + '">' + esc(v) + "</option>")
    .join("") +
  "</select></label>";
const form = (cmd, fields, button) =>
  '<form data-cmd="' +
  cmd +
  '">' +
  fields +
  "<button>" +
  button +
  '</button><output role="alert"></output></form>';
const section = (heading, content) =>
  "<details><summary>" + heading + "</summary>" + content + "</details>";
const table = (labels, rows) =>
  rows.length
    ? '<div class="table-wrap"><table><thead><tr>' +
      labels.map((v) => "<th>" + esc(v) + "</th>").join("") +
      "</tr></thead><tbody>" +
      rows
        .map(
          (row) =>
            "<tr>" +
            row.map((v) => "<td>" + esc(v) + "</td>").join("") +
            "</tr>",
        )
        .join("") +
      "</tbody></table></div>"
    : "<p>No entries yet.</p>";
const badge = '<p id="message" role="status" aria-live="polite"></p>';
const reason = input("reason", "Reason");
const pounds = (name, label, defaultValue = "") =>
  input(
    name,
    label,
    "number",
    'required min="0" step="0.01" value="' + esc(defaultValue) + '"',
  );
const refField = input(
  "ref",
  "Member reference",
  "text",
  'required autocapitalize="characters" autocomplete="off" maxlength="12" placeholder="AM42"',
);
const payType = select("type", "What it covers", [
  ["topup", "Class or balance top-up"],
  ["membership", "Monthly membership"],
]);
let state = {};
function signup(s) {
  return form(
    "signup",
    input("name", "Member’s full name") +
      input("dob", "Date of birth", "date") +
      input("email", "Email for confirmations (optional)", "email", "") +
      "<fieldset><legend>Under 18</legend>" +
      input("guardian", "Guardian’s name", "text", "") +
      input("contact", "Guardian’s phone or email", "text", "") +
      "</fieldset>" +
      "<fieldset><legend>Waiver · " +
      esc(s.waiver) +
      "</legend><p>" +
      esc(s.waiverText) +
      "</p>" +
      input("signer", "Name of person accepting") +
      '<label><input type="checkbox" name="accepted" required> I have read and accept this rehearsal waiver.</label></fieldset>' +
      opt("media", "I separately agree to photography and video (optional).") +
      input(
        "referredBy",
        "Referring member’s reference (optional)",
        "text",
        "",
      ),
    "Create member",
  );
}
function checkin() {
  return (
    "<h1>Class check-in</h1><p>" +
    (state.open
      ? "Check-in is open. Enter your member reference."
      : "Check-in opens one hour before class. See JB if you arrive outside the window.") +
    "</p>" +
    form("checkin", refField, "Check in")
  );
}
function member(a) {
  return (
    "<h1>My club record</h1><p><strong>" +
    esc(a.name) +
    " · " +
    esc(a.ref) +
    '</strong></p><div class="grid"><section class="card"><h2>Balance</h2><p>' +
    gbp(a.balance) +
    "</p><p>Top-up reference <b>" +
    esc(a.ref) +
    "</b><br>Standing order <b>MEMBER" +
    esc(a.ref) +
    '</b></p></section><section class="card"><h2>Membership</h2>' +
    (a.periods.length
      ? a.periods
          .map(
            (p) =>
              "<p>Starts " +
              date(p.start) +
              "<br>Renews " +
              date(p.end) +
              "</p>",
          )
          .join("")
      : "<p>No matched membership payment.</p>") +
    "</section></div>" +
    "<h2>My progress</h2><p>" +
    a.progress +
    " training visits · " +
    gbp(a.credit) +
    " referral credit</p><p>Guardian approval · " +
    esc(a.consent) +
    "<br>Cleared to train · " +
    (a.cleared ? "Yes" : "Pending") +
    "</p>" +
    table(
      ["Class", "Class fee", "Still due"],
      a.attendance.map((v) => [date(v.start), gbp(v.fee), gbp(v.due)]),
    ) +
    "<h2>Payments</h2>" +
    table(
      ["Matched", "Purpose", "Received"],
      a.payments.map((p) => [date(p.at), p.type, gbp(p.amount)]),
    ) +
    state.posts.map((p) => '<p class="notice">' + esc(p.text) + "</p>").join("")
  );
}
function staff(s) {
  const memberSelect = select(
    "ref",
    "Member",
    s.members.map((m) => [m.ref, m.ref + " · " + m.name]),
  );
  const cls = select(
    "classId",
    "Class",
    s.classes
      .toSorted((a, b) => b.start - a.start)
      .map((c) => [c.id, date(c.start)]),
  );
  const paymentSelect = select(
    "id",
    "Payment",
    s.payments
      .filter((p) => !p.void)
      .map((p) => [
        p.id,
        gbp(p.amount) +
          " · " +
          (p.ref || p.raw || "No reference") +
          " · " +
          p.id,
      ]),
  );
  const bankFields =
    input("transactionId", "Original transaction ID") +
    input("reference", "Original reference", "text", "") +
    input("payer", "Payer name (if available)", "text", "") +
    pounds("amount", "Amount (£)");
  return (
    '<h1>Coach desk</h1><p><a href="/kiosk" target="_blank">Shared tablet check-in</a> · <a href="/wall.svg" target="_blank">Wall QR for this rehearsal</a> · <a href="/api/backup" download>Download private backup</a> · <a href="/class-night.pdf" target="_blank">Class-night guide (PDF)</a></p>' +
    (!s.members.length && !s.classes.length
      ? form(
          "seed",
          "<p>Load two fictional members and a £10 class starting in five minutes. Use AM42 for the first walk-in.</p>",
          "Load rehearsal class",
        )
      : "") +
    section(
      "Class times and register",
      form(
        "class",
        input("start", "Class starts (your local time)", "datetime-local") +
          input("end", "Class ends", "datetime-local") +
          input(
            "late",
            "Minutes allowed after start",
            "number",
            'required min="0" value="15"',
          ) +
          pounds("fee", "Class fee (£)", "10"),
        "Add class",
      ) +
        table(
          ["Start (London)", "End", "Late window"],
          s.classes.map((c) => [date(c.start), date(c.end), c.late + " min"]),
        ) +
        table(
          ["Class register (London)", "Member", "Attendance", "Amount due"],
          s.members.flatMap((m) =>
            m.attendance.map((v) => [
              date(v.start),
              m.ref + " · " + m.name,
              v.billable ? "Trained" : "Arrived · no training recorded",
              gbp(v.due),
            ]),
          ),
        ) +
        form(
          "attendance",
          memberSelect +
            cls +
            opt("present", "Present at class") +
            opt("billable", "Trained and chargeable") +
            reason,
          "Save attendance correction",
        ),
    ) +
    section("Staff-assisted signup", signup(s)) +
    section(
      "Members and consent",
      table(
        [
          "Member",
          "Reference",
          "Guardian approval",
          "Cleared",
          "Balance",
          "Training visits",
          "Membership renewal",
        ],
        s.members.map((m) => [
          m.name,
          m.ref,
          m.consent,
          m.cleared ? "Yes" : "Pending",
          gbp(m.balance),
          m.progress,
          m.periods.length ? date(m.periods.at(-1).end) : "No membership",
        ]),
      ) +
        s.members
          .map(
            (m) =>
              "<p><b>" +
              esc(m.ref) +
              "</b> · Waiver " +
              esc(m.waiver.version) +
              " accepted by " +
              esc(m.waiver.signer) +
              " on " +
              date(m.waiver.at) +
              ". Media permission " +
              (m.media ? "given" : "withheld") +
              "." +
              (m.guardian
                ? " Guardian " +
                  esc(m.guardian.name) +
                  " · " +
                  esc(m.guardian.contact)
                : "") +
              (m.verbal
                ? "<br>Call recorded by " +
                  esc(m.verbal.staff) +
                  " · " +
                  esc(m.verbal.guardian) +
                  " (" +
                  esc(m.verbal.relationship) +
                  ") · " +
                  date(m.verbal.at) +
                  " · " +
                  esc(m.verbal.terms)
                : "") +
              "</p>",
          )
          .join("") +
        form(
          "consent",
          memberSelect +
            input("guardian", "Guardian spoken to") +
            input("relationship", "Relationship") +
            input("when", "Time of call", "datetime-local") +
            input("terms", "Exactly what they agreed to"),
          "Record verbal consent",
        ) +
        form(
          "clear",
          memberSelect + opt("cleared", "Clear to train") + reason,
          "Save clearance",
        ) +
        form(
          "invite",
          select("role", "Account type", [
            ["member", "Link a no-phone member"],
            ["coach", "Ben’s coach account"],
            ["kiosk", "Check-in tablet account"],
          ]) +
            input(
              "ref",
              "Member reference (only for member access)",
              "text",
              "",
            ),
          "Create one-hour invitation",
        ),
    ) +
    section(
      "Cash and transfers",
      form(
        "cash",
        memberSelect + pounds("amount", "Cash received (£)") + payType,
        "Record cash",
      ) +
        form(
          "manualBank",
          bankFields + reason,
          "Record a bank statement entry",
        ) +
        table(
          [
            "Original ID",
            "Received",
            "Raw reference",
            "Payer",
            "Member",
            "Status / suggested member",
          ],
          s.payments.map((p) => [
            p.id,
            gbp(p.amount),
            p.raw,
            p.payer,
            p.ref,
            p.void
              ? "Voided"
              : p.ref
                ? p.type
                : "Review · " + p.suggestions.join(", "),
          ]),
        ) +
        form(
          "review",
          paymentSelect + memberSelect + payType + reason,
          "Confirm or correct match",
        ) +
        form("void", paymentSelect + reason, "Void entry"),
    ) +
    section(
      "After class · bank and email rehearsal",
      "<p>Bank feed · " +
        (s.feed
          ? (s.feed.ok ? "Available" : "Unavailable") + " at " + date(s.feed.at)
          : "Awaiting refresh") +
        "</p>" +
        form(
          "refresh",
          opt("outage", "Simulate bank outage"),
          "Refresh rehearsal feed and assess reminders",
        ) +
        form(
          "fixtureBank",
          bankFields,
          "Import fictional transfer and assess reminders",
        ) +
        table(
          ["Member", "Due", "Reminder"],
          s.assessments.map((a) => [a.ref, gbp(a.due), a.hold || "Eligible"]),
        ) +
        form(
          "deliver",
          opt("outage", "Simulate email outage"),
          "Process next rehearsal email",
        ) +
        table(
          ["Reference", "Job", "Contents", "Status"],
          s.emails.map((m) => [
            m.ref,
            m.id,
            m.summary.amount
              ? gbp(m.summary.amount) +
                " " +
                m.summary.covered +
                " · balance " +
                gbp(m.summary.balance) +
                (m.summary.renewal
                  ? " · renews " + date(m.summary.renewal)
                  : "")
              : "Class due " + gbp(m.summary.due),
            m.status,
          ]),
        ),
    ) +
    section(
      "Membership, referrals and announcements",
      form(
        "settings",
        pounds("price", "Monthly membership (£)", s.price / 100) +
          pounds("referral", "Referral credit (£)", s.referral / 100),
        "Save rates",
      ) +
        form(
          "post",
          input("text", "Announcement") +
            input("start", "Show from", "datetime-local") +
            input("end", "Show until", "datetime-local"),
          "Schedule announcement",
        ),
    ) +
    section(
      "Audit history",
      table(
        ["Time", "Who recorded it", "Action", "Reference", "Reason"],
        s.audit.map((e) => [date(e.at), e.actor, e.kind, e.ref, e.reason]),
      ),
    )
  );
}
async function load(message = "") {
  const resp = await fetch(kiosk ? "/api/door" : "/api/state");
  if (!resp.ok)
    throw Error("The register could not load. Please try again or see JB.");
  state = await resp.json();
  const route = location.hash.slice(1);
  let body;
  if (kiosk || state.role === "kiosk") body = checkin();
  else if (route === "signup" && state.role !== "member")
    body = "<h1>Join the club</h1>" + (state.signed ? signup(state) : signin());
  else if (route === "signin" || route === "desk") {
    if (state.role === "admin") body = staff(state);
    else if (state.role === "member") body = member(state.account);
    else if (state.role === "coach")
      body =
        "<h1>Coach schedule</h1>" +
        table(
          ["From", "Until"],
          state.classes.map((c) => [date(c.start), date(c.end)]),
        );
    else
      body =
        "<h1>Member sign-in</h1>" +
        (state.signed
          ? '<p><a href="#signup">Create a member account</a></p>' +
            form(
              "claim",
              input("code", "One-hour invitation code"),
              "Link account",
            )
          : signin());
  } else
    body =
      checkin() +
      '<p>First visit? <a href="#signup">Join the club</a>. <a href="#signin">' +
      (state.role === "admin" ? "Open coach desk" : "View my account") +
      "</a>.</p>";
  const opened = new Set(
    [...app.querySelectorAll("details[open] > summary")].map(
      (el) => el.textContent,
    ),
  );
  if (
    !kiosk &&
    state.role !== "kiosk" &&
    state.signed &&
    ["desk", "signin"].includes(route)
  ) {
    body +=
      '<div class="actions"><button type="button" id="refresh-view">Refresh record</button><a target="_top" href="/signout-with-chatgpt">Sign out</a></div>';
  }
  app.innerHTML = badge + body;
  app.querySelector("#refresh-view")?.addEventListener("click", () =>
    load("Record refreshed.").catch((e) => {
      app.querySelector("#message").textContent = e.message;
    }),
  );
  for (const el of app.querySelectorAll("details"))
    if (opened.has(el.querySelector("summary").textContent)) el.open = true;
  app.querySelector("#message").textContent = message;
}
function signin() {
  return '<a class="button" target="_top" href="/signin-with-chatgpt?return_to=/%23signin">Sign in to continue</a>';
}
async function send(action, data, key) {
  const resp = await fetch("/api/" + action, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ data, key }),
  });
  const result = await resp.json();
  if (!resp.ok) throw Error(result.error || "Entry could not be saved.");
  return result;
}
app.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const f = ev.target,
    cmd = f.dataset.cmd,
    data = Object.fromEntries(new FormData(f));
  for (const name of ["price", "fee", "amount", "referral"])
    if (name in data) data[name] = Math.round(Number(data[name]) * 100);
  if ("late" in data) data.late = Number(data.late);
  for (const name of ["when", "start", "end"])
    if (data[name]) data[name] = new Date(data[name]).toISOString();
  for (const el of f.querySelectorAll('input[type="checkbox"]'))
    data[el.name] = el.checked;
  if (cmd === "signup") data.version = state.waiver;
  if (!f.dataset.key) f.dataset.key = crypto.randomUUID();
  f.querySelector("button").disabled = true;
  try {
    const bank = cmd === "refresh" || cmd === "fixtureBank";
    const result = await send(
      bank ? "refresh" : cmd,
      bank
        ? { rows: cmd === "fixtureBank" ? [data] : [], outage: !!data.outage }
        : data,
      f.dataset.key,
    );
    if (bank) await send("assessNow", {}, f.dataset.key);
    const message =
      cmd === "checkin"
        ? "Request received. See JB if you need help."
        : result.ref
          ? "Member created. Your reference is " + result.ref + "."
          : result.code
            ? "One-hour invitation · " + result.code
            : "Saved.";
    await load(message);
  } catch (e) {
    f.querySelector("output").textContent = e.message;
    f.querySelector("button").disabled = false;
  }
});
app.addEventListener("input", (ev) => {
  if (ev.target.form) delete ev.target.form.dataset.key;
});
const show = () =>
  load().catch((e) => {
    app.innerHTML =
      '<h1>Portal unavailable</h1><p role="alert">' +
      esc(e.message) +
      '</p><a href="/">Try again</a>';
  });
window.addEventListener("hashchange", show);
window.addEventListener("focus", () => {
  if (!app.querySelector("form :focus") && !app.querySelector("details[open]"))
    show();
});
show();
