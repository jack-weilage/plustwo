import { pgTable, foreignKey, uuid, bigint, timestamp, varchar, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const messageKind = pgEnum("message_kind", ["plus_two", "minus_two"]);

export const messages = pgTable(
	"messages",
	{
		id: uuid().primaryKey().notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		broadcastId: bigint("broadcast_id", { mode: "number" }).notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		chatterId: bigint("chatter_id", { mode: "number" }).notNull(),
		sentAt: timestamp("sent_at", { mode: "date" }).notNull(),
		messageKind: messageKind("message_kind").notNull(),
	},
	(table) => [
		foreignKey({
			columns: [table.broadcastId],
			foreignColumns: [broadcasts.id],
			name: "fk-broadcast-id",
		}),
		foreignKey({
			columns: [table.chatterId],
			foreignColumns: [chatters.id],
			name: "fk-chatter-id",
		}),
	],
);

export const chatters = pgTable("chatters", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	displayName: varchar("display_name").notNull(),
});

export const seaqlMigrations = pgTable("seaql_migrations", {
	version: varchar().primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	appliedAt: bigint("applied_at", { mode: "number" }).notNull(),
});

export const broadcasters = pgTable("broadcasters", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	id: bigint({ mode: "number" }).primaryKey().notNull(),
	displayName: varchar("display_name").notNull(),
	profileImageUrl: varchar("profile_image_url"),
});

export const broadcasts = pgTable(
	"broadcasts",
	{
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		id: bigint({ mode: "number" }).primaryKey().notNull(),
		// You can use { mode: "bigint" } if numbers are exceeding js number limitations
		broadcasterId: bigint("broadcaster_id", { mode: "number" }).notNull(),
		title: varchar().notNull(),
		startedAt: timestamp("started_at", { mode: "date" }).notNull(),
		endedAt: timestamp("ended_at", { mode: "date" }),
	},
	(table) => [
		foreignKey({
			columns: [table.broadcasterId],
			foreignColumns: [broadcasters.id],
			name: "fk-broadcaster-id",
		}),
	],
);
