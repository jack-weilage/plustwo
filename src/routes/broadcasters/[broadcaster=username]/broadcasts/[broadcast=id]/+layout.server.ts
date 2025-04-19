import type { LayoutServerLoad } from "./$types";

import { eq } from "drizzle-orm";
import { broadcasts } from "$lib/server/db/drizzle/schema";
import { error } from "@sveltejs/kit";
import { cfCache } from "$lib/utils";

export const load: LayoutServerLoad = async ({ parent, url, platform, params, locals: { db } }) => {
	if (!platform) {
		error(500, "Platform not available");
	}

	const { broadcaster } = await parent();

	const broadcast = await cfCache(`broadcast-${params.broadcast}-v1`, url, platform, () =>
		db
			.select()
			.from(broadcasts)
			.where(eq(broadcasts.id, +params.broadcast))
			.limit(1)
			.then(([broadcast]) => broadcast),
	);

	if (!broadcast) {
		error(404, "No Broadcast Found");
	}

	return { broadcaster, broadcast };
};
