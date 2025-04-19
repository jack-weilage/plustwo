import type { LayoutServerLoad } from "./$types";

import { eq } from "drizzle-orm";
import { broadcasters } from "$lib/server/db/drizzle/schema";
import { error } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ params, locals: { db } }) => {
	const broadcaster = await db
		.select()
		.from(broadcasters)
		.where(eq(broadcasters.id, +params.broadcaster))
		.limit(1)
		.then(([broadcaster]) => broadcaster);

	if (!broadcaster) {
		error(404, "No Broadcaster Found");
	}

	return { broadcaster };
};
