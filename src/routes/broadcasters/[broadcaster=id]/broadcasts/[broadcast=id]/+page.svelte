<script lang="ts">
	import Chart from "$lib/echart/Chart.svelte";
	import { BarChart, CandlestickChart } from "echarts/charts";
	import {
		DatasetComponent,
		DataZoomComponent,
		GridComponent,
		TooltipComponent,
		VisualMapComponent,
	} from "echarts/components";
	import { use, type EChartsType } from "echarts/core";
	import { SVGRenderer } from "echarts/renderers";

	import * as Breadcrumb from "$lib/components/ui/breadcrumb";

	let { data } = $props();

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
				difference,
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
		VisualMapComponent,
	]);
</script>

<svelte:head>
	<title>+2 | {data.broadcast.title}</title>
	<link rel="icon" href={data.broadcaster.profileImageUrl} />
</svelte:head>

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
					<Breadcrumb.Page>{data.broadcast.title}</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</section>
	<section class="h-[80dvh] py-2">
		<Chart
			bind:chart
			options={{
				dataset: [{ source: candlestickSeries }],
				grid: [
					{
						bottom: "30%",
					},
					{
						top: "80%",
					},
				],
				xAxis: [
					{
						type: "time",
					},
					{
						type: "time",
						gridIndex: 1,

						axisLabel: { show: false },
						axisLine: { onZero: false },
						axisTick: { show: false },
						splitLine: { show: false },
					},
				],
				yAxis: [
					{
						name: "Total Sentiment",
						scale: true,
					},
					{
						name: "Message Volume",
						gridIndex: 1,

						axisLabel: { show: false },
						axisLine: { show: false },
						axisTick: { show: false },
						splitLine: { show: false },
					},
				],

				dataZoom: [
					{
						type: "slider",
						start: 0,
						end: 100,
						xAxisIndex: [0, 1],
					},
					{
						type: "inside",
						start: 0,
						end: 100,
						xAxisIndex: [0, 1],
					},
				],
				axisPointer: {
					link: [{ xAxisIndex: "all" }],
				},
				tooltip: { trigger: "axis" },
				visualMap: [
					{
						show: false,
						seriesIndex: 1,
						dimension: "difference",
						pieces: [
							{ lt: 0, color: "red" },
							{ gte: 0, color: "green" },
						],
					},
				],

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
						xAxisIndex: 0,
						yAxisIndex: 0,
					},
					{
						name: "Volume",
						type: "bar",
						encode: {
							x: "timestamp",
							y: "volume",
						},
						xAxisIndex: 1,
						yAxisIndex: 1,
					},
				],
			}}
		/>
	</section>
</main>
