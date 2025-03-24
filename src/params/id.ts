import type { ParamMatcher } from "@sveltejs/kit";

export const match = ((param: string): param is `${number}` => {
	return !Number.isNaN(+param);
}) satisfies ParamMatcher;
