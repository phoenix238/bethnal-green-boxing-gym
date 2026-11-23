import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
export function localDB(path = ":memory:") {
  const raw = new DatabaseSync(path);
  if (
    !raw
      .prepare("SELECT name FROM sqlite_master WHERE name='portal_events'")
      .get()
  )
    raw.exec(
      readFileSync(
        new URL("../drizzle/0000_register.sql", import.meta.url),
        "utf8",
      ),
    );
  return {
    raw,
    prepare(query) {
      const stmt = raw.prepare(query);
      return {
        all: async () => ({ results: stmt.all() }),
        bind: (...args) => ({ run: async () => ({ meta: stmt.run(...args) }) }),
      };
    },
  };
}
