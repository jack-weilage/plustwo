import { supabase } from "$lib/supabase";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async () => {
	const data_chunks = [];
	let i = 0;
	let length = 0;
	do {
		const { data, error } = await supabase.rpc("plustwo_series").range(i, i + 1_000);
		i += 1_000;

		if (error) {
			throw new Error(error.message);
		}

		length = data.length;
		data_chunks.push(data);
	} while (length != 0);

	const totals = {
		total: 0,
		plus_two: 0,
		minus_two: 0,
	};

	return json(
		data_chunks.flat().map(({ ts, plus_two_count, minus_two_count, difference }) => {
			totals.total += plus_two_count - minus_two_count;

			totals.plus_two += plus_two_count;
			totals.minus_two += minus_two_count;

			return [+new Date(ts), totals.total, plus_two_count, minus_two_count, difference];
		}) as [number, number, number, number, number][],
		{
			headers: {
				"Cache-Control": "maxage=10, public, stale-while-revalidate",
			},
		},
	);
};
