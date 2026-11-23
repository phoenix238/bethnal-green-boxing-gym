// Managed local preview only. This server never ships in the Worker bundle.
import http from "node:http";
import { mkdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { localDB } from "./local-db.mjs";
import worker from "../dist/server/index.js";
const folder = dirname(fileURLToPath(import.meta.url));
mkdirSync(join(folder, "../.local"), { recursive: true });
const env = {
  DB: localDB(join(folder, "../.local/rehearsal.sqlite")),
  ADMIN_EMAIL: "jb@example.invalid",
};
const users = {
  staff: ["rehearsal-jb", env.ADMIN_EMAIL],
  phone: ["rehearsal-member", "member@example.invalid"],
  tablet: ["", ""],
};
const server = http.createServer(async (req, res) => {
  try {
    const host = req.headers.host,
      origin = "http://" + host;
    const url = new URL(req.url, origin);
    if (
      url.pathname === "/test-device" &&
      Object.hasOwn(users, url.searchParams.get("as"))
    ) {
      res.writeHead(303, {
        "set-cookie":
          "device=" +
          url.searchParams.get("as") +
          "; HttpOnly; SameSite=Strict; Path=/",
        location: "/",
      });
      return res.end();
    }
    const device =
      req.headers.cookie?.match(
        /(?:^|; )device=(staff|phone|tablet)(?:;|$)/,
      )?.[1] || "staff";
    const [id, email] = users[device],
      headers = new Headers(req.headers);
    headers.set("oai-authenticated-user-id", id);
    headers.set("oai-authenticated-user-email", email);
    if (
      req.method === "POST" &&
      headers.get("origin") &&
      new URL(headers.get("origin")).host === host
    )
      headers.set("origin", origin);
    const chunks = [];
    for await (const c of req) chunks.push(c);
    const request = new Request(url, {
      method: req.method,
      headers,
      body: chunks.length ? Buffer.concat(chunks) : undefined,
    });
    const reply = await worker.fetch(request, env);
    res.writeHead(reply.status, Object.fromEntries(reply.headers));
    res.end(Buffer.from(await reply.arrayBuffer()));
  } catch {
    res.writeHead(500);
    res.end("Local rehearsal error");
  }
});
const option = (name) =>
  process.argv.includes(name)
    ? process.argv[process.argv.indexOf(name) + 1]
    : undefined;
server.listen(
  Number(option("--port") || process.env.PORT || 4177),
  option("--host") || "127.0.0.1",
  () => console.log("Rehearsal preview ready"),
);
