import type { PageServerLoad } from "./$types";

import { broadcasters, broadcasts, messages } from "$lib/server/drizzle/schema";
import { countDistinct, desc, eq, sql } from "drizzle-orm";

export const load: PageServerLoad = async ({ setHeaders, locals: { db } }) => {
	setHeaders({
		"Cache-Control": "max-age=10, public",
	});

	const broadcaster_list = await db
		.select({
			name: broadcasters.displayName,
			id: broadcasters.id,
			profileImageUrl: broadcasters.profileImageUrl,

			broadcastCount: countDistinct(broadcasts.id).as("broadcast_count"),
			messageCount: countDistinct(messages.id).as("message_count"),
		})
		.from(broadcasters)
		.leftJoin(broadcasts, eq(broadcasts.broadcasterId, broadcasters.id))
		.leftJoin(messages, eq(messages.broadcastId, broadcasts.id))
		.groupBy(broadcasters.displayName, broadcasters.id)
		.orderBy(desc(sql`message_count`));

	return { broadcaster_list };
};
