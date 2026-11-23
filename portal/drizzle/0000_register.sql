CREATE TABLE `portal_events` (
	`seq` integer PRIMARY KEY NOT NULL,
	`payload` text NOT NULL,
	CONSTRAINT "valid_event" CHECK(json_valid("portal_events"."payload"))
);
