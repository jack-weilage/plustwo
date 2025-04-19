import type { LayoutServerLoad } from "./$types";

import { eq } from "drizzle-orm";
import { broadcasters } from "$lib/server/db/drizzle/schema";
import { error } from "@sveltejs/kit";
import { cfCache } from "$lib/utils";

export const load: LayoutServerLoad = async ({ url, platform, params, locals: { db } }) => {
	if (!platform) {
		error(500, "Platform not available");
	}

	const broadcaster = await cfCache(`broadcaster-${params.broadcaster}-v1`, url, platform, () =>
		db
			.select()
			.from(broadcasters)
			.where(eq(broadcasters.displayName, params.broadcaster))
			.limit(1)
			.then(([broadcaster]) => broadcaster),
	);

	if (!broadcaster) {
		error(404, "No Broadcaster Found");
	}

	return { broadcaster };
};
