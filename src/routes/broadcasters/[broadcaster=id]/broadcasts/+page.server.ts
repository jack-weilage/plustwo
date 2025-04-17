import { broadcasts, messages } from "$lib/server/drizzle/schema";
import { count, desc, eq, sql } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

const ITEMS_PER_PAGE = 10;

export const load: PageServerLoad = async ({ parent, params, url, locals: { db } }) => {
	const { broadcaster } = await parent();

	const broadcastCount = await db
		.select({ count: count(broadcasts.id) })
		.from(broadcasts)
		.where(eq(broadcasts.broadcasterId, +params.broadcaster))
		.then((res) => res[0]?.count ?? 0);

	const pageCount = Math.ceil(broadcastCount / ITEMS_PER_PAGE);
	const page = Math.min(Math.max(+(url.searchParams.get("page") ?? 1), 1), pageCount);
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
		.where(eq(broadcasts.broadcasterId, +params.broadcaster))
		.leftJoin(messages, eq(messages.broadcastId, broadcasts.id))
		.groupBy(broadcasts.id)
		.orderBy(desc(broadcasts.startedAt))
		.limit(ITEMS_PER_PAGE)
		.offset((page - 1) * ITEMS_PER_PAGE);

	return {
		broadcaster,
		broadcastList,
		pagination: {
			itemCount: broadcastCount,
			page,
			perPage: ITEMS_PER_PAGE,
		},
	};
};
