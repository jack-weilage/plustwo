import type { PageServerLoad } from "./$types";

import { asc, count, desc, eq, sql } from "drizzle-orm";
import { broadcasters, broadcasts, chatters, messages } from "$lib/server/drizzle/schema";

export const load: PageServerLoad = async ({ parent, setHeaders, params, locals: { db } }) => {
	const { broadcaster } = await parent();
	setHeaders({
		"Cache-Control": "max-age=60, public",
	});

	const broadcastList = await db
		.select({
			id: broadcasts.id,
			title: broadcasts.title,
			total: sql<number>`
				COALESCE(CAST(
					SUM(CASE WHEN ${messages.messageKind} = 'plus_two' THEN 2 END) -
					SUM(CASE WHEN ${messages.messageKind} = 'minus_two' THEN 2 END)
				AS INT), 0)
			`,
		})
		.from(broadcasts)
		.where(eq(broadcasts.broadcasterId, +params.broadcaster))
		.leftJoin(messages, eq(messages.broadcastId, broadcasts.id))
		.groupBy(broadcasts.id)
		.orderBy(desc(broadcasts.startedAt));

	const countScore = db
		.select({
			displayName: chatters.displayName,
			score:
				sql<number>`COALESCE(CAST(${count(sql`CASE WHEN ${messages.messageKind} = 'plus_two' THEN 1 END`)} - ${count(sql`CASE WHEN ${messages.messageKind} = 'minus_two' THEN 1 END`)} AS INT), 0)`.as(
					"score",
				),
		})
		.from(messages)
		.leftJoin(chatters, eq(chatters.id, messages.chatterId))
		.leftJoin(broadcasts, eq(messages.broadcastId, broadcasts.id))
		.leftJoin(broadcasters, eq(broadcasts.broadcasterId, broadcasters.id))
		.where(eq(broadcasters.id, broadcaster.id))
		.groupBy(chatters.id, chatters.displayName);

	// TODO: combine into one query
	const bestChatters = await countScore.orderBy(desc(sql`score`)).limit(5);
	const worstChatters = await countScore.orderBy(asc(sql`score`)).limit(5);

	return { broadcastList, broadcaster, bestChatters, worstChatters };
};
