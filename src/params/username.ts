import type { ParamMatcher } from "@sveltejs/kit";

export const match = ((param: string): param is string => {
	// Usernames must be between 4 and 25 characters, with those characters being alphanumeric + underscore.
	return param.length >= 4 && param.length <= 25 && /^[A-Za-z0-9][A-Za-z0-9_]*$/.test(param);
}) satisfies ParamMatcher;
