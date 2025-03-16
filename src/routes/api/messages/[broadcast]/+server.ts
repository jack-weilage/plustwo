import { db } from "$lib/server/db";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { chatters, messages } from "$lib/server/drizzle/schema";
import { eq } from "drizzle-orm";

export const GET: RequestHandler = async ({ params }) => {
	const message_list = await db
		.select({
			message: { kind: messages.messageKind, sentAt: messages.sentAt },
			chatter: { name: chatters.displayName },
		})
		.from(messages)
		.innerJoin(chatters, eq(messages.chatterId, chatters.id))
		.where(eq(messages.broadcastId, +params.broadcast));

	return json(message_list, {
		headers: {
			"Cache-Control": "max-age=0, s-maxage=15",
		},
	});
};
