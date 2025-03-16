import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema";
import { env } from "$env/dynamic/private";
import { dev } from "$app/environment";
import { authenticate } from "./auth_socket";

if (!env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const client = dev
	? postgres(env.DATABASE_URL)
	: postgres({
			database: env.DATABASE_DB,
			user: env.DATABASE_USER,
			password: env.DATABASE_PASSWORD,
			client: authenticate(env.DATABASE_HOST, env.CF_CLIENT_ID, env.CF_CLIENT_SECRET),
		});

export const db = drizzle(client, {
	schema,
});
