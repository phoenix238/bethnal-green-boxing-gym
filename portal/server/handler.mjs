import { backup, command, door, identityFrom, view } from "./service.mjs";
import { rehearseNight } from "./jobs.mjs";
import QR from "qrcode/lib/core/qrcode.js";
import svg from "qrcode/lib/renderer/svg-tag.js";
const headers = {
  "cache-control": "no-store",
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
};
export async function handle(request, env, assets) {
  const url = new URL(request.url),
    path = url.pathname;
  try {
    if (path.startsWith("/ops/") && request.method === "POST") {
      if (
        !env.REHEARSAL_OPS_KEY ||
        request.headers.get("authorization") !==
          "Bearer " + env.REHEARSAL_OPS_KEY
      )
        return new Response("Access denied", { status: 403, headers });
      if (path === "/ops/seed")
        return Response.json(
          await command(
            env,
            { id: "rehearsal-setup", email: env.ADMIN_EMAIL },
            "seed",
            {},
            crypto.randomUUID(),
          ),
          { headers },
        );
      if (path === "/ops/class-night")
        return Response.json(await rehearseNight(env), { headers });
      return new Response("Page not found", { status: 404, headers });
    }
    if (path === "/wall.svg" && request.method === "GET") {
      const code = QR.create(url.origin + "/", { errorCorrectionLevel: "M" });
      return new Response(svg.render(code, { width: 400, margin: 4 }), {
        headers: { ...headers, "content-type": "image/svg+xml" },
      });
    }
    if (path === "/api/backup" && request.method === "GET")
      return Response.json(await backup(env, identityFrom(request)), {
        headers: {
          ...headers,
          "content-disposition":
            'attachment; filename="bgbc-rehearsal-backup.json"',
        },
      });
    if (path === "/api/door" && request.method === "GET")
      return Response.json(await door(env), { headers });
    if (path === "/api/state" && request.method === "GET")
      return Response.json(await view(env, identityFrom(request)), { headers });
    if (path.startsWith("/api/") && request.method === "POST") {
      if (
        request.headers.get("origin") !== url.origin ||
        !request.headers.get("content-type")?.startsWith("application/json")
      )
        return new Response("Invalid request", { status: 403, headers });
      const input = await request.text();
      if (input.length > 16000)
        return new Response("Form too large", { status: 413, headers });
      const { data, key } = JSON.parse(input);
      const result = await command(
        env,
        identityFrom(request),
        path.slice(5),
        data,
        key,
      );
      return Response.json(result, { headers });
    }
    const asset = assets[path];
    if (!asset || request.method !== "GET")
      return new Response("Page not found", { status: 404, headers });
    return new Response(asset.body, {
      headers: {
        ...headers,
        "content-type": asset.type,
        "content-security-policy":
          "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; form-action 'self'; base-uri 'none'",
      },
    });
  } catch (error) {
    return Response.json(
      {
        error: error.status
          ? error.message
          : "The portal could not save or load this request. Try again.",
      },
      { status: error.status ?? 503, headers },
    );
  }
}
