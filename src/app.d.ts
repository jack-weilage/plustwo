// See https://svelte.dev/docs/kit/types#app.d.ts

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "$lib/server/drizzle/schema";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			db: PostgresJsDatabase<typeof schema>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
