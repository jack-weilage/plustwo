import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../drizzle/schema";
import { env } from "$env/dynamic/private";
import { building, dev } from "$app/environment";
import { authenticate } from "./auth_socket";

if (dev && !env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
if (
	!dev &&
	(!env.DATABASE_DB ||
		!env.DATABASE_USER ||
		!env.DATABASE_PASSWORD ||
		!env.DATABASE_HOST ||
		!env.CF_CLIENT_ID ||
		!env.CF_CLIENT_SECRET)
) {
	throw new Error(
		"DATABASE_DB, DATABASE_USER, DATABASE_PASSWORD, DATABASE_HOST, CF_CLIENT_ID, or CF_CLIENT_SECRET is not set",
	);
}

const client = dev
	? postgres(env.DATABASE_URL)
	: postgres({
			database: env.DATABASE_DB,
			user: env.DATABASE_USER,
			password: env.DATABASE_PASSWORD,
			client: building
				? null
				: authenticate(env.DATABASE_HOST, env.CF_CLIENT_ID, env.CF_CLIENT_SECRET),
		});

export const db = drizzle(client, {
	schema,
});
