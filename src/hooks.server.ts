import type { Handle } from "@sveltejs/kit";

import { dev } from "$app/environment";
import { connect } from "$lib/server/db";

const dev_connect = dev ? await connect() : null!;

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.db = dev ? dev_connect : await connect();

	return await resolve(event);
};
