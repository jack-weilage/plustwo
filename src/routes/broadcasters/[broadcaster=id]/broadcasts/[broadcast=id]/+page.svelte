<script lang="ts">
	import Chart from "$lib/echart/Chart.svelte";
	import { BarChart, CandlestickChart } from "echarts/charts";
	import {
		DatasetComponent,
		DataZoomComponent,
		GridComponent,
		TooltipComponent,
	} from "echarts/components";
	import { use, type EChartsType } from "echarts/core";
	import { SVGRenderer } from "echarts/renderers";

	let { data } = $props();

	$inspect(data);

	let candlestickSeries = $state([]);
	$effect(() => {
		let total = 0;
		candlestickSeries = data.sentimentList.map(({ timestamp, plusTwoCount, minusTwoCount }) => {
			const currentTotal = total;
			const difference = plusTwoCount - minusTwoCount;

			total += difference;

			return {
				// Add a Z to ensure the time is interpreted as UTC
				timestamp: new Date(timestamp + "Z"),

				open: currentTotal,
				close: total,
				lowest: currentTotal - minusTwoCount,
				highest: currentTotal + plusTwoCount,

				volume: plusTwoCount + minusTwoCount,
			};
		});
	});

	let chart: EChartsType = $state()!;
	use([
		SVGRenderer,
		CandlestickChart,
		BarChart,
		DatasetComponent,
		GridComponent,
		DataZoomComponent,
		TooltipComponent,
	]);
</script>

<svelte:head>
	<title>+2 | {data.broadcast.title}</title>
	<link rel="icon" href={data.broadcaster.profileImageUrl} />
</svelte:head>

<main class="px-4">
	<section>
		<h1>{data.broadcast.title}</h1>
	</section>
	<div class="h-[80dvh]">
		<Chart
			bind:chart
			options={{
				dataset: [{ source: candlestickSeries }],
				xAxis: { type: "time" },
				yAxis: [
					{
						name: "Total Sentiment",
						scale: true,
					},
					{
						name: "Message Volume",
						max: 1000,
					},
				],

				dataZoom: [
					{
						type: "slider",
						start: 0,
						end: 100,
					},
					{
						type: "inside",
						start: 0,
						end: 100,
					},
				],
				tooltip: { trigger: "axis" },

				series: [
					{
						name: "Sentiment",
						type: "candlestick",
						encode: {
							x: "timestamp",
							y: ["open", "close", "lowest", "highest"],
						},
						itemStyle: {
							color: "green",
							color0: "red",
							borderColor: "green",
							borderColor0: "red",
						},
					},
					{
						name: "Volume",
						type: "bar",
						encode: {
							x: "timestamp",
							y: "volume",
						},
						yAxisIndex: 1,
					},
				],
			}}
		/>
	</div>
</main>
