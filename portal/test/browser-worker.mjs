// The test runner supplies isolated identities here, outside the browser and deployed Worker.
import { createInterface } from "node:readline";
import { localDB } from "./local-db.mjs";
import worker from "../dist/server/index.js";
const env = { DB: localDB(), ADMIN_EMAIL: "jb@example.invalid" };
const identities = {
  staff: ["test-jb", env.ADMIN_EMAIL],
  phone: ["test-member", "member@example.invalid"],
  tablet: ["", ""],
  ben: ["test-ben", "ben@example.invalid"],
};
let now = Date.parse("2026-11-24T18:00:00Z");
Date.now = () => now;
for await (const line of createInterface({ input: process.stdin })) {
  try {
    const r = JSON.parse(line);
    if (r.time) {
      now = Date.parse(r.time);
      console.log("{}");
      continue;
    }
    const [id, email] = identities[r.device],
      headers = new Headers(r.headers);
    headers.set("oai-authenticated-user-id", id);
    headers.set("oai-authenticated-user-email", email);
    const res = await worker.fetch(
      new Request(r.url, {
        method: r.method,
        headers,
        body: r.body || undefined,
      }),
      env,
    );
    console.log(
      JSON.stringify({
        status: res.status,
        headers: Object.fromEntries(res.headers),
        body: Buffer.from(await res.arrayBuffer()).toString("base64"),
      }),
    );
  } catch (e) {
    console.log(JSON.stringify({ failure: e.message }));
  }
}
