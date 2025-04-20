import type { PageServerLoad } from "./$types";

import { broadcasts, messages } from "$lib/server/db/drizzle/schema";
import { and, count, desc, eq, ilike, sql } from "drizzle-orm";
import { escapeComparison } from "$lib/utils";

const ITEMS_PER_PAGE = 10;

export const load: PageServerLoad = async ({ parent, url, locals: { db } }) => {
	const { broadcaster } = await parent();

	const search = url.searchParams.get("search") ?? "";
	const searchQuery = search
		? sql`${ilike(broadcasts.title, `%${escapeComparison(search)}%`)} ESCAPE '$'`
		: sql`TRUE`;

	const broadcastCount = await db
		.select({ count: count(broadcasts.id) })
		.from(broadcasts)
		.where(and(eq(broadcasts.broadcasterId, broadcaster.id), searchQuery))
		.then(([{ count }]) => count);

	const pageCount = Math.max(Math.ceil(broadcastCount / ITEMS_PER_PAGE), 1);
	const page = Math.min(Math.max(Math.floor(+(url.searchParams.get("page") ?? 1)), 1), pageCount);
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
		.where(and(eq(broadcasts.broadcasterId, broadcaster.id), searchQuery))
		.innerJoin(messages, eq(messages.broadcastId, broadcasts.id))
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
		search,
	};
};
