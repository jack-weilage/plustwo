import type { Response as CfResponse } from "@cloudflare/workers-types/experimental";

export function debounce(func: (...args: any[]) => void, wait: number) {
	let timeout: NodeJS.Timeout;

	return (...args: any[]) => {
		const finish = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(finish, wait);
	};
}

export function escapeComparison(str: string) {
	return str.replaceAll("$", "$$").replaceAll("%", "$%").replaceAll("_", "$_");
}

export async function cfCache<T>(
	key: string,
	url: URL,
	platform: App.Platform,
	fn: () => Promise<T>,
	headers: HeadersInit = {},
): Promise<T> {
	const cache = platform.caches.default;

	let response: T;

	const cacheKey = `${url.origin}/${key}`;
	const cacheResponse = await cache.match(cacheKey);

	if (cacheResponse) {
		response = await cacheResponse.json();
	} else {
		const responseData = await fn();

		response = responseData;

		platform.context.waitUntil(
			cache.put(
				cacheKey,
				new Response(JSON.stringify(responseData), {
					headers: {
						...{
							"Content-Type": "application/json",
							"Cache-Control": "max-age=60, public",
						},
						...headers,
					},
				}) as unknown as CfResponse,
			),
		);
	}

	return response;
}
