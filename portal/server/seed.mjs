import { WAIVER, HOUR } from "./model.mjs";
export function seedEvents(now, actor) {
  const event = (kind, data) => ({ kind, data, at: now, actor });
  const person = (ref, name, minor = false) =>
    event("signup", {
      ref,
      name,
      dob: minor ? "2012-04-01" : "1996-03-12",
      email: ref.toLowerCase() + "@example.invalid",
      minor,
      guardian: minor
        ? { name: "Fictional Guardian", contact: "guardian@example.invalid" }
        : null,
      owner: null,
      waiver: { signer: name, version: WAIVER, at: now, actor },
      media: false,
      referredBy: "",
    });
  const start = now + 5 * 60000;
  return [
    person("AM42", "Alex Morgan"),
    person("JL18", "Jamie Lane", true),
    event("class", {
      id: "rehearsal-class",
      start,
      end: start + HOUR,
      late: 20,
      fee: 1000,
    }),
    event("price", { price: 7000, referral: 500 }),
  ];
}
