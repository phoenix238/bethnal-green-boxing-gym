import { readFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { build } from "esbuild";
const root = fileURLToPath(new URL(".", import.meta.url)),
  target = process.argv[2] || join(root, "dist");
mkdirSync(join(target, "server"), { recursive: true });
const assets = {};
for (const [path, file, type] of [
  ["/", "index.html", "text/html; charset=utf-8"],
  ["/kiosk", "kiosk.html", "text/html; charset=utf-8"],
  ["/app.js", "app.js", "application/javascript"],
  ["/portal.css", "portal.css", "text/css"],
  ["/logo.jpg", "logo.jpg", "image/jpeg"],
  ["/class-night.pdf", "class-night.pdf", "application/pdf"],
]) {
  const content = readFileSync(join(root, "assets", file));
  assets[path] = {
    body: ["image/jpeg", "application/pdf"].includes(type)
      ? content.toString("base64")
      : content.toString(),
    type,
  };
}
const entry =
  'import {handle} from "./server/handler.mjs";import {rehearseNight} from "./server/jobs.mjs"; const assets=' +
  JSON.stringify(assets) +
  ';for(const path of ["/logo.jpg","/class-night.pdf"]) assets[path].body=Uint8Array.from(atob(assets[path].body),c=>c.charCodeAt(0));export default {fetch:(request,env)=>handle(request,env,assets),scheduled:(_event,env,ctx)=>ctx.waitUntil(rehearseNight(env))};';
await build({
  stdin: { contents: entry, resolveDir: root, sourcefile: "entry.js" },
  format: "esm",
  platform: "browser",
  bundle: true,
  outfile: join(target, "server/index.js"),
});
