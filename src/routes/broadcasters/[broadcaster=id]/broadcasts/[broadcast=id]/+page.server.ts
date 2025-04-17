import type { PageServerLoad } from "./$types";

import { count, eq, sql } from "drizzle-orm";
import { messages } from "$lib/server/drizzle/schema";

const truncateToMinute = sql<Date>`DATE_TRUNC('minute', ${messages.sentAt})`;

export const load: PageServerLoad = async ({ parent, locals: { db } }) => {
	const { broadcaster, broadcast } = await parent();

	const sentimentList = await db
		.select({
			timestamp: truncateToMinute,
			plusTwoCount: count(sql`CASE WHEN ${messages.messageKind} = 'plus_two' THEN 1 END`),
			minusTwoCount: count(sql`CASE WHEN ${messages.messageKind} = 'minus_two' THEN 1 END`),
		})
		.from(messages)
		.where(eq(messages.broadcastId, broadcast.id))
		.groupBy(truncateToMinute)
		.orderBy(truncateToMinute);

	return { broadcaster, broadcast, sentimentList };
};
