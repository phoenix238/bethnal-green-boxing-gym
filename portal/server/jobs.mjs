// Only internal callers get a staff context. The public HTTP router never accepts a role.
import { account, HOUR } from "./model.mjs";
import { replay, command } from "./service.mjs";

export async function classNight(
  env,
  reader,
  { clock = Date.now, mailOutage = false } = {},
) {
  const { state } = await replay(env.DB);
  const now = clock();
  const due = Object.values(state.members).some((m) =>
    account(state, m.ref).attendance.some(
      (v) => v.due > 0 && state.classes[v.classId].end + HOUR / 2 <= now,
    ),
  );
  const identity = { id: "class-night-job", email: env.ADMIN_EMAIL };
  const run = (action, data) =>
    command(env, identity, action, data, crypto.randomUUID(), clock);
  if (due) {
    let rows = [],
      outage = false;
    try {
      rows = await reader();
    } catch {
      outage = true;
    }
    await run("refresh", { rows, outage });
    await run("assessNow", {});
  }
  // At most 25 deliveries per invocation; later invocations continue the outbox.
  for (let i = 0; i < 25; i++) {
    const res = await run("deliver", { outage: mailOutage });
    if (!res.changed || mailOutage) break;
  }
  return { assessed: due };
}
export async function rehearseNight(env) {
  // This Site only processes fictional transfers. A simulated outage persists until JB clears it.
  const { state } = await replay(env.DB);
  return classNight(env, async () => {
    if (state.feed?.ok === false) throw Error("Rehearsal bank offline");
    return [];
  });
}
