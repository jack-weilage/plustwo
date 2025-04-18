import type { LayoutServerLoad } from "./$types";

import { eq } from "drizzle-orm";
import { broadcasters } from "$lib/server/db/drizzle/schema";
import { error } from "@sveltejs/kit";

export const load: LayoutServerLoad = async ({ params, locals: { db } }) => {
	const broadcaster = await db.query.broadcasters.findFirst({
		where: eq(broadcasters.id, +params.broadcaster),
	});

	if (!broadcaster) {
		error(404, "No Broadcaster Found");
	}

	return { broadcaster };
};
