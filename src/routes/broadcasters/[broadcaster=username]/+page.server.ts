import type { PageServerLoad } from "./$types";

import { asc, count, desc, eq, sql } from "drizzle-orm";
import { broadcasters, broadcasts, chatters, messages } from "$lib/server/db/drizzle/schema";

export const load: PageServerLoad = async ({ parent, locals: { db } }) => {
	const { broadcaster } = await parent();

	const broadcastList = await db
		.select({
			id: broadcasts.id,
			title: broadcasts.title,
			startedAt: broadcasts.startedAt,
			endedAt: broadcasts.endedAt,

			score: sql<number>`
				COALESCE(CAST(
					${count(sql`CASE WHEN ${messages.messageKind} = 'plus_two' THEN 1 END`)} -
					${count(sql`CASE WHEN ${messages.messageKind} = 'minus_two' THEN 1 END`)}
				AS INT), 0)`,
		})
		.from(broadcasts)
		.where(eq(broadcasts.broadcasterId, broadcaster.id))
		.innerJoin(messages, eq(messages.broadcastId, broadcasts.id))
		.groupBy(broadcasts.id)
		.orderBy(desc(broadcasts.startedAt))
		.limit(10);

	const countScore = db
		.select({
			displayName: chatters.displayName,
			score: sql<number>`
				COALESCE(CAST(
					${count(sql`CASE WHEN ${messages.messageKind} = 'plus_two' THEN 1 END`)} -
					${count(sql`CASE WHEN ${messages.messageKind} = 'minus_two' THEN 1 END`)}
				AS INT), 0)`.as("score"),
		})
		.from(messages)
		.innerJoin(chatters, eq(chatters.id, messages.chatterId))
		.innerJoin(broadcasts, eq(messages.broadcastId, broadcasts.id))
		.innerJoin(broadcasters, eq(broadcasts.broadcasterId, broadcasters.id))
		.where(eq(broadcasters.id, broadcaster.id))
		.groupBy(chatters.id, chatters.displayName);

	// TODO: combine into one query
	const bestChatters = await countScore.orderBy(desc(sql`score`)).limit(5);
	const worstChatters = await countScore.orderBy(asc(sql`score`)).limit(5);

	return { broadcastList, broadcaster, bestChatters, worstChatters };
};
