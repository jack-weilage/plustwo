import type { RequestHandler } from "./$types";

import { connect } from "$lib/server/db";
import { broadcasters, broadcasts } from "$lib/server/drizzle/schema";
import { eq } from "drizzle-orm";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ params }) => {
	const db = await connect();

	const broadcast_list = await db
		.select({
			id: broadcasts.id,
			title: broadcasts.title,
			start: broadcasts.startedAt,
			end: broadcasts.endedAt,
		})
		.from(broadcasts)
		.innerJoin(broadcasters, eq(broadcasts.broadcasterId, broadcasters.id))
		.where(eq(broadcasters.displayName, params.broadcaster));

	return json(broadcast_list, {
		headers: {
			"Cache-Control": "max-age=0, s-maxage=60",
		},
	});
};
