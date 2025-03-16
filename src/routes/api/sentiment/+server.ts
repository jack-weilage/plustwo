import { messages } from "$lib/server/drizzle/schema";
import { count, sql } from "drizzle-orm";
import type { RequestHandler } from "./$types";
import { db } from "$lib/server/db";
import { json } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {
	const sentimentList = await db
		.select({
			minute: sql<Date>`DATE_TRUNC('minute', ${messages.sentAt})`,
			plusTwoCount: count(sql<number>`CASE WHEN ${messages.messageKind} = 'plus_two' THEN 1 END`),
			minusTwoCount: count(sql<number>`CASE WHEN ${messages.messageKind} = 'minus_two' THEN 1 END`),
		})
		.from(messages)
		.groupBy(sql<Date>`DATE_TRUNC('minute', ${messages.sentAt})`)
		.orderBy(sql<Date>`DATE_TRUNC('minute', ${messages.sentAt})`);

	return json(sentimentList, {
		headers: {
			"Cache-Control": "max-age=0, s-maxage=15",
		},
	});
};
