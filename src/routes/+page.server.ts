import type { PageServerLoad } from "./$types";

import { broadcasters, broadcasts, messages } from "$lib/server/db/drizzle/schema";
import { and, countDistinct, desc, eq, exists, isNull, sql } from "drizzle-orm";

export const load: PageServerLoad = async ({ locals: { db } }) => {
	const broadcasterList = await db
		.select({
			name: broadcasters.displayName,
			id: broadcasters.id,
			profileImageUrl: broadcasters.profileImageUrl,

			broadcastCount: countDistinct(broadcasts.id).as("broadcast_count"),
			messageCount: countDistinct(messages.id).as("message_count"),

			isLive: exists(
				db
					.select()
					.from(broadcasts)
					.where(and(eq(broadcasts.broadcasterId, broadcasters.id), isNull(broadcasts.endedAt))),
			),
		})
		.from(broadcasters)
		.innerJoin(broadcasts, eq(broadcasts.broadcasterId, broadcasters.id))
		.innerJoin(messages, eq(messages.broadcastId, broadcasts.id))
		.groupBy(broadcasters.displayName, broadcasters.id)
		.orderBy(desc(sql`message_count`));

	return { broadcasterList };
};
