import type { PageServerLoad } from "./$types";

import { desc, eq, sql } from "drizzle-orm";
import { broadcasts, messages } from "$lib/server/drizzle/schema";

export const load: PageServerLoad = async ({ params, parent, locals: { db } }) => {
	const { broadcaster } = await parent();

	const broadcast_list = await db
		.select({
			id: broadcasts.id,
			title: broadcasts.title,
			total: sql<number>`
				CAST(
					SUM(CASE WHEN ${messages.messageKind} = 'plus_two' THEN 2 END) -
					SUM(CASE WHEN ${messages.messageKind} = 'minus_two' THEN 2 END)
				AS INT)
			`,
		})
		.from(broadcasts)
		.where(eq(broadcasts.broadcasterId, +params.broadcaster))
		.leftJoin(messages, eq(messages.broadcastId, broadcasts.id))
		.groupBy(broadcasts.id)
		.orderBy(desc(broadcasts.startedAt));

	return { broadcast_list, broadcaster };
};
