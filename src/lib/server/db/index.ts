import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./drizzle/schema";
import { env } from "$env/dynamic/private";
import { building, dev } from "$app/environment";
import { authenticate } from "./auth_socket";

if (dev && !env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

if (!dev) {
	const required: (keyof typeof env)[] = [
		"DATABASE_DB",
		"DATABASE_USER",
		"DATABASE_PASSWORD",
		"DATABASE_HOST",
		"CF_CLIENT_ID",
		"CF_CLIENT_SECRET",
	];
	for (const env_var of required) {
		if (!env[env_var]) {
			throw new Error(`Environment variable ${env_var} is not set`);
		}
	}
}

export async function connect() {
	// Connect directly to the database during development, but use secure tunnel in production.
	const client = dev
		? postgres(env.DATABASE_URL)
		: // @ts-expect-error: postgres-js doesn't document that you can use a function to return a
			// custom socket. A custom socket is used to authenticate via Cloudflare Access.
			postgres({
				database: env.DATABASE_DB,
				user: env.DATABASE_USER,
				password: env.DATABASE_PASSWORD,

				// Don't attempt to connect while building, as the Cloudflare Workers build environment
				// doesn't have access to websockets.
				socket: building
					? undefined
					: await authenticate(env.DATABASE_HOST, env.CF_CLIENT_ID, env.CF_CLIENT_SECRET).then(
							(sock) => () => sock,
						),
			});

	const db = drizzle(client, {
		schema,
	});

	return db;
}
