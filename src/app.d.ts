// See https://svelte.dev/docs/kit/types#app.d.ts

import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { CacheStorage, ExecutionContext } from "@cloudflare/workers-types/experimental";
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
		interface Platform {
			caches: CacheStorage;
			context: ExecutionContext;
		}
	}
}

export {};
