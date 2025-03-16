import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch }) => {
	const [broadcasts, sentiment, totals] = await Promise.all([
		fetch("/api/broadcasts/Northernlion").then(
			(r) =>
				r.json() as Promise<
					{
						id: number;
						title: string;
						start: Date;
						end?: Date;
					}[]
				>,
		),
		fetch("/api/sentiment").then(
			(r) => r.json() as Promise<{ minute: Date; plusTwoCount: number; minusTwoCount: number }[]>,
		),
		fetch("api/totals").then(
			(r) => r.json() as Promise<{ plusTwoCount: number; minusTwoCount: number }>,
		),
	]);

	return {
		broadcasts,
		sentiment,
		totals,
	};
};
