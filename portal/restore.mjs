// Restore into a new file. An existing register is never overwritten.
import { readFileSync, openSync, closeSync, unlinkSync } from "node:fs";
import { createHash } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { pathToFileURL } from "node:url";
import { apply, initial } from "./server/model.mjs";
export function restore(backup, path) {
  const { format, version, events, sha256 } = backup;
  if (
    format !== "bgbc-register-v1" ||
    !Array.isArray(events) ||
    version !== events.length
  )
    throw Error("Incomplete register backup");
  if (
    createHash("sha256").update(JSON.stringify(events)).digest("hex") !== sha256
  )
    throw Error("Register checksum mismatch");
  events.reduce(apply, initial());
  closeSync(openSync(path, "wx", 0o600));
  let db;
  try {
    db = new DatabaseSync(path);
    db.exec(
      readFileSync(
        new URL("./drizzle/0000_register.sql", import.meta.url),
        "utf8",
      ),
    );
    db.exec("BEGIN IMMEDIATE");
    const insert = db.prepare("INSERT INTO portal_events VALUES (?,?)");
    events.forEach((event, index) =>
      insert.run(index + 1, JSON.stringify(event)),
    );
    if (db.prepare("PRAGMA integrity_check").get().integrity_check !== "ok")
      throw Error("Restored database failed integrity check");
    db.exec("COMMIT");
    db.close();
  } catch (e) {
    if (db?.isOpen) db.close();
    unlinkSync(path);
    throw e;
  }
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  if (process.argv.length !== 4)
    throw Error("Usage: node restore.mjs BACKUP.json NEW.sqlite");
  const backup = JSON.parse(readFileSync(process.argv[2], "utf8"));
  restore(backup, process.argv[3]);
  console.log("Restored and verified " + backup.version + " register events.");
}
