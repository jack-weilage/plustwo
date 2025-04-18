import type { LayoutServerLoad } from "./$types";

import { eq } from "drizzle-orm";
import { broadcasts } from "$lib/server/db/drizzle/schema";
import { error } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ parent, params, locals: { db } }) => {
	const { broadcaster } = await parent();

	const broadcast = await db.query.broadcasts.findFirst({
		where: eq(broadcasts.id, +params.broadcast),
	});

	if (!broadcast) {
		error(404, "No Broadcast Found");
	}

	return { broadcaster, broadcast };
};
