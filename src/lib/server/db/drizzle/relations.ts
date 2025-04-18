import { relations } from "drizzle-orm/relations";
import { broadcasts, messages, chatters, broadcasters } from "./schema";

export const messagesRelations = relations(messages, ({ one }) => ({
	broadcast: one(broadcasts, {
		fields: [messages.broadcastId],
		references: [broadcasts.id],
	}),
	chatter: one(chatters, {
		fields: [messages.chatterId],
		references: [chatters.id],
	}),
}));

export const broadcastsRelations = relations(broadcasts, ({ one, many }) => ({
	messages: many(messages),
	broadcaster: one(broadcasters, {
		fields: [broadcasts.broadcasterId],
		references: [broadcasters.id],
	}),
}));

export const chattersRelations = relations(chatters, ({ many }) => ({
	messages: many(messages),
}));

export const broadcastersRelations = relations(broadcasters, ({ many }) => ({
	broadcasts: many(broadcasts),
}));
