import type { PageServerLoad } from "./$types";

import { broadcasts, chatters, messages } from "$lib/server/db/drizzle/schema";
import { and, count, countDistinct, desc, eq, ilike, sql } from "drizzle-orm";
import { escapeComparison } from "$lib/utils";

const ITEMS_PER_PAGE = 50;

export const load: PageServerLoad = async ({ setHeaders, parent, url, locals: { db } }) => {
	setHeaders({
		"Cache-Control": "max-age=60, public",
	});

	const { broadcaster } = await parent();

	const search = url.searchParams.get("search") ?? "";
	const searchQuery = search
		? sql`${ilike(chatters.displayName, `%${escapeComparison(search)}%`)} ESCAPE '$'`
		: sql`TRUE`;

	const userCount = await db
		.select({ count: countDistinct(chatters.id) })
		.from(chatters)
		.innerJoin(messages, eq(chatters.id, messages.chatterId))
		.innerJoin(broadcasts, eq(messages.broadcastId, broadcasts.id))
		.where(and(eq(broadcasts.broadcasterId, broadcaster.id), searchQuery))
		.then(([{ count }]) => count);

	const pageCount = Math.max(Math.ceil(userCount / ITEMS_PER_PAGE), 1);
	const page = Math.min(Math.max(Math.floor(+(url.searchParams.get("page") ?? 1)), 1), pageCount);

	const users = await db
		.select({
			displayName: chatters.displayName,
			// Name the returned column so the orderBy can reference it
			plusTwoCount: count(sql`CASE WHEN ${messages.messageKind} = 'plus_two' THEN 1 END`).as(
				"plus_two_count",
			),
			minusTwoCount: count(sql`CASE WHEN ${messages.messageKind} = 'minus_two' THEN 1 END`).as(
				"minus_two_count",
			),
		})
		.from(chatters)
		.innerJoin(messages, eq(chatters.id, messages.chatterId))
		// Filter by broadcaster and search query
		.innerJoin(broadcasts, eq(messages.broadcastId, broadcasts.id))
		.where(and(eq(broadcasts.broadcasterId, broadcaster.id), searchQuery))
		.groupBy(chatters.id)
		.orderBy(desc(sql`plus_two_count`))
		// Paginate the result
		.limit(ITEMS_PER_PAGE)
		.offset((page - 1) * ITEMS_PER_PAGE);

	return {
		broadcaster,
		chatters: users,
		search,
		pagination: {
			itemCount: userCount,
			page,
			perPage: ITEMS_PER_PAGE,
		},
	};
};
