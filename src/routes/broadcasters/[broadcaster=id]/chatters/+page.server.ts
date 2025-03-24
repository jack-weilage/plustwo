import { broadcasts, chatters, messages } from "$lib/server/drizzle/schema";
import { count, eq, sql } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params, parent, locals: { db } }) => {
	const { broadcaster } = await parent();

	const users = await db
		.select({
			name: chatters.displayName,
			// Name the returned column so the orderBy can reference it
			plusTwoCount: count(sql`CASE WHEN ${messages.messageKind} = 'plus_two' THEN 1 END`).as(
				"plus_two_count",
			),
			minusTwoCount: count(sql`CASE WHEN ${messages.messageKind} = 'minus_two' THEN 1 END`).as(
				"minus_two_count",
			),
		})
		.from(chatters)
		.leftJoin(messages, eq(chatters.id, messages.chatterId))
		// Filter by broadcaster
		.leftJoin(broadcasts, eq(messages.broadcastId, broadcasts.id))
		.where(eq(broadcasts.broadcasterId, +params.broadcaster))
		.groupBy(chatters.id);

	return { broadcaster, chatters: users };
};
