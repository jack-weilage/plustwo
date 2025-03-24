import { connect } from "$lib/server/db";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.db = await connect();

	return await resolve(event);
};
