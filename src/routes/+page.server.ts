import type { PageServerLoad } from "./$types";

import { broadcasters, broadcasts, messages } from "$lib/server/drizzle/schema";
import { eq, sql } from "drizzle-orm";

export const load: PageServerLoad = async ({ locals: { db } }) => {
	const broadcaster_list = await db
		.select({
			name: broadcasters.displayName,
			id: broadcasters.id,
			profileImageUrl: broadcasters.profileImageUrl,

			broadcastCount: sql<number>`CAST(COUNT(DISTINCT ${broadcasts.id}) AS INT)`.as(
				"broadcast_count",
			),
			messageCount: sql<number>`CAST(COUNT(DISTINCT ${messages.id}) AS INT)`,
		})
		.from(broadcasters)
		.leftJoin(broadcasts, eq(broadcasts.broadcasterId, broadcasters.id))
		.leftJoin(messages, eq(messages.broadcastId, broadcasts.id))
		.groupBy(broadcasters.displayName, broadcasters.id)
		.orderBy(sql`broadcast_count`);

	return { broadcaster_list };
};
