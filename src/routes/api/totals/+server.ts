import type { RequestHandler } from "./$types";

import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { messages } from "$lib/server/drizzle/schema";
import { count, sql } from "drizzle-orm";

export const GET: RequestHandler = async () => {
	const totals = await db
		.select({
			plusTwoCount: count(sql<number>`CASE WHEN ${messages.messageKind} = 'plus_two' THEN 1 END`),
			minusTwoCount: count(sql<number>`CASE WHEN ${messages.messageKind} = 'minus_two' THEN 1 END`),
		})
		.from(messages);

	return json(totals[0], {
		headers: {
			"Cache-Control": "max-age=0, s-maxage=3600",
		},
	});
};
