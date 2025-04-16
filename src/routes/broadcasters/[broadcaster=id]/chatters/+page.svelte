<script lang="ts">
	import Chart from "$lib/echart/Chart.svelte";
	import type { EChartsOption, EChartsType } from "echarts/types/dist/shared";
	import { registerTransform, use } from "echarts/core";
	import { BarChart, LineChart, ScatterChart } from "echarts/charts";
	import { SVGRenderer } from "echarts/renderers";
	import {
		DatasetComponent,
		DataZoomComponent,
		GridComponent,
		MarkLineComponent,
		TooltipComponent,
		VisualMapContinuousComponent,
	} from "echarts/components";
	import ecStat from "echarts-stat";

	import * as Breadcrumb from "$lib/components/ui/breadcrumb";
	import Seo from "$lib/components/Seo.svelte";

	let { data } = $props();

	use([
		SVGRenderer,
		// CanvasRenderer,
		// Required for X/Y axes
		GridComponent,
		// Required to render user tooltip
		TooltipComponent,
		// Required to use a dataset
		DatasetComponent,
		// Required in order to zoom
		DataZoomComponent,
		// Required in order to color points
		VisualMapContinuousComponent,

		MarkLineComponent,

		LineChart,
		BarChart,
		ScatterChart,
	]);
	registerTransform(ecStat.transform.regression);
	registerTransform(ecStat.transform.histogram);

	let chatters = $derived(
		data.chatters.reduce(
			(acc, cur) => {
				const plusTwoCount = cur.plusTwoCount;
				// const count = Math.floor(cur.plusTwoCount / 10) * 10;
				if (!acc.plus[plusTwoCount]) {
					acc.plus[plusTwoCount] = 0;
				}

				acc.plus[plusTwoCount]++;

				const minusTwoCount = cur.minusTwoCount;

				if (!acc.minus[minusTwoCount]) {
					acc.minus[minusTwoCount] = 0;
				}

				acc.minus[minusTwoCount]++;

				return acc;
			},
			{ plus: {} as Record<number, number>, minus: {} as Record<number, number> },
		),
	);

	let chart: EChartsType = $state()!;
	const options: EChartsOption = $derived({
		dataset: [
			{
				source: Object.entries(chatters.plus).map(([x, y]) => [+x, +y]),
			},
			{
				transform: {
					type: "ecStat:regression",
					config: {
						// method: "exponential",
						// dimensions: [1, 0],
					},
				},
			},
			{ source: Object.entries(chatters.minus) },
			{
				source: data.chatters.map(({ name, plusTwoCount, minusTwoCount }) => ({
					name,
					// plusTwoCount,
					// minusTwoCount,
					plusTwoCount: plusTwoCount + (Math.random() - 0.5) / 10,
					minusTwoCount: minusTwoCount + (Math.random() - 0.5) / 10,
					// plusTwoCount: plusTwoCount + Math.random() / 100,
					// minusTwoCount: minusTwoCount + Math.random() / 100,
					percentage: (plusTwoCount / (plusTwoCount + minusTwoCount)) * 100,
				})),
			},
		],

		// TODO: make this not apply to everything
		visualMap: [
			{
				type: "continuous",
				// show: false,
				min: 0,
				// dimension: "percentage",
				max: 100,
				color: ["green", "red"],
			},
		],
		dataZoom: [
			{
				type: "slider",
				start: 0,
				end: 10,
			},
			{
				type: "inside",
				start: 0,
				end: 100,
			},
			// {
			// 	type: "slider",
			// 	xAxisIndex: 1,
			// }
		],
		grid: [
			{
				bottom: "60%",
			},
			{
				top: "60%",
			},
		],
		tooltip: {},
		xAxis: [
			{
				name: "Positive votes",
			},
			{
				startValue: 0,
				name: "Positive votes",
				// Ensure that labels are integers
				minInterval: 1,
				gridIndex: 1,
			},
		],
		yAxis: [
			{
				name: "Number of chatters",
			},
			{
				startValue: 0,
				name: "Negative votes",
				// Ensure that labels are integers
				minInterval: 1,
				gridIndex: 1,
			},
		],
		series: [
			{
				name: "Positive chatters",
				type: "bar",
				encode: {
					x: 0,
					y: 1,
				},
				// tooltip: {
				// 	trigger: "axis",
				// },
				datasetIndex: 0,
			},
			{
				name: "Regression",
				type: "line",

				showSymbol: false,
				datasetIndex: 2,
				xAxisIndex: 0,
				yAxisIndex: 0,
			},
			// {
			// 	name: "Negative chatters",
			// 	type: "bar",
			// 	encode: {
			// 		x: 0,
			// 		y: 1,
			// 	},
			// 	datasetIndex: 1,
			// },

			// TODO: add a line on the axis
			{
				type: "scatter",
				encode: {
					x: "plusTwoCount",
					y: "minusTwoCount",
				},
				xAxisIndex: 1,
				yAxisIndex: 1,

				tooltip: {
					trigger: "item",
					formatter: (params) => {
						return `
					<span style="font-weight: bold">@${params.data.name}</span><br>
					+2s: ${Math.round(params.data.plusTwoCount)}<br>
					-2s: ${Math.round(params.data.minusTwoCount)}
				`;
					},
				},
				// symbolSize: 4,
				datasetIndex: 3,
				emphasis: {
					focus: "self",
				},
			},
		],
	});

	function zoom_to_username(username: string) {
		const index = data.chatters.findIndex((chatter) => chatter.name === username);
		const chatter = data.chatters[index];

		zoom_to_chatter(index, chatter.plusTwoCount);
	}
	function zoom_to_chatter(index: number, xPosition: number) {
		chart.dispatchAction({
			type: "dataZoom",
			dataZoomIndex: 0,
			startValue: xPosition - 25,
			endValue: xPosition + 25,
		});

		setTimeout(() => {
			chart.dispatchAction({ type: "highlight", seriesIndex: 1, dataIndex: index });
			chart.dispatchAction({ type: "showTip", seriesIndex: 1, dataIndex: index });
		}, 500);
	}
</script>

<Seo
	title="+2 | {data.broadcaster.displayName} | Chatters"
	icon={data.broadcaster.profileImageUrl!}
/>

<main class="mx-auto max-w-4xl px-4 py-4">
	<section class="py-2">
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/broadcasters/{data.broadcaster.id}">
						{data.broadcaster.displayName}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Chatters</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</section>

	<button
		type="button"
		onclick={() => {
			const name = "u_watanabe";
			zoom_to_username(name);
		}}>Click to zoom to random chatter</button
	>
	<p class="opacity-70">This (currently) only tracks chatters who have used either "+2" or "-2".</p>

	<div class="h-screen rounded border p-4">
		<Chart {options} bind:chart />
	</div>

	<!-- <ul> -->
	<!-- 	{#each data.chatters as { name, plusTwoCount, minusTwoCount }} -->
	<!-- 		<li> -->
	<!-- 			@{name}: {plusTwoCount}x +2, {minusTwoCount}x -2 ({( -->
	<!-- 				(plusTwoCount / (plusTwoCount + minusTwoCount)) * -->
	<!-- 				100 -->
	<!-- 			).toFixed(2)}%) -->
	<!-- 		</li> -->
	<!-- 	{/each} -->
	<!-- </ul> -->
</main>
