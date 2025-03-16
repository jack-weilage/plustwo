<script lang="ts">
	import Chart from "$lib/echart/Chart.svelte";
	import { BarChart, CandlestickChart, LineChart } from "echarts/charts";
	import {
		DatasetComponent,
		DataZoomComponent,
		GridComponent,
		LegendComponent,
		MarkAreaComponent,
		ToolboxComponent,
		TooltipComponent,
		VisualMapComponent,
	} from "echarts/components";
	import { use, type EChartsType } from "echarts/core";
	import { CanvasRenderer } from "echarts/renderers";
	import type { EChartsOption } from "echarts/types/dist/shared";
	import { MediaQuery } from "svelte/reactivity";

	use([
		LineChart,
		BarChart,
		CandlestickChart,

		ToolboxComponent,
		VisualMapComponent,
		GridComponent,
		LegendComponent,
		TooltipComponent,
		MarkAreaComponent,

		DatasetComponent,
		DataZoomComponent,

		CanvasRenderer,
	]);

	let {
		broadcasts,
		candlestick,
	}: {
		broadcasts: {
			id: number;
			title: string;
			start: Date;
			end?: Date;
		}[];
		candlestick: {
			timestamp: Date;
			open: number;
			close: number;
			lowest: number;
			highest: number;
		}[];
	} = $props();
	$effect(() => {
		if (candlestick.length === 0) {
			chart?.showLoading();
		} else {
			chart?.hideLoading();
		}
	});

	let chart: EChartsType = $state()!;
	const options: EChartsOption = $derived({
		textStyle: {
			fontFamily: "var(--default-font-family)",
			color: "#000",
		},
		dataset: [{ source: broadcasts }, { source: candlestick }],
		tooltip: {
			trigger: "axis",
			axisPointer: {
				type: "line",
			},
		},
		toolbox: {
			feature: {
				dataZoom: {
					yAxisIndex: false,
				},
			},
		},
		dataZoom: [
			{
				type: "slider",
				start: 95,
				end: 100,
			},
			{
				type: "inside",
				start: 90,
				end: 100,
			},
		],
		xAxis: { type: "time" },
		yAxis: { type: "value", name: "Total count", scale: true },
		backgroundColor: "transparent",

		series: [
			{
				type: "candlestick",
				encode: {
					x: "timestamp",
					y: ["open", "close", "lowest", "highest"],
				},
				datasetIndex: 1,
				itemStyle: {
					color: "#00ff00",
					color0: "#ff0000",
					borderColor: "#00ff00",
					borderColor0: "#ff0000",
				},
				markArea: {
					data: broadcasts.map(({ title, start, end }) => [
						{
							name: title,
							xAxis: start,
							itemStyle: { color: "rgba(0, 255, 0, 0.1)" },
							label: {
								show: true,
								color: "black",
								rotate: 30,
							},
						},
						{
							xAxis: end ?? new Date(),
						},
					]),
				},
			},
			// {
			// 	type: "bar",
			// 	encode: {
			// 		x: "timestamp",
			// 		y: "plus_two",
			// 	},
			// 	datasetIndex: 0,
			// 	yAxisIndex: 1,
			// },
			// {
			// 	type: "line",
			// 	name: "Total historical value",
			// 	showSymbol: false,
			// 	datasetIndex: 0,
			// 	encode: { x: "timestamp", y: "total" },
			// },
			// {
			// 	type: "bar",
			// 	name: "+2's",
			// 	datasetIndex: 0,
			// 	encode: { x: "timestamp", y: "plus_two" },
			// 	yAxisIndex: 1,
			// },
			// {
			// 	type: "bar",
			// 	name: "-2's",
			// 	datasetIndex: 0,
			// 	encode: { x: "timestamp", y: "minus_two" },
			// 	yAxisIndex: 1,
			// },
		],
	});
	// const options: EChartsOption = $derived({
	// 	dataset: {
	// 		// dimensions: ["timestamp", "total", "plus_two", "minus_two", "difference"],
	// 		source,
	// 	},
	// 	// visualMap: {
	// 	// 	show: false,
	// 	// 	seriesIndex: 1,
	// 	// 	dimension: 4,
	// 	// 	pieces: [
	// 	// 		{
	// 	// 			gte: 0,
	// 	// 			color: "green",
	// 	// 		},
	// 	// 		{
	// 	// 			lt: 0,
	// 	// 			color: "red",
	// 	// 		},
	// 	// 	],
	// 	// },
	//
	// 	tooltip: {
	// 		trigger: "axis",
	// 	},
	// 	xAxis: [
	// 		{
	// 			type: "time",
	// 		},
	// 		{
	// 			type: "time",
	// 			gridIndex: 1,
	// 			axisLine: { onZero: false },
	// 			axisTick: { show: false },
	// 			splitLine: { show: false },
	// 			axisLabel: { show: false },
	// 		},
	// 	],
	// 	yAxis: [
	// 		{
	// 			name: "Total",
	// 			type: "value",
	// 		},
	// 		{
	// 			name: "Sentiment",
	// 			gridIndex: 1,
	// 			axisLine: { show: false },
	// 			axisTick: { show: false },
	// 		},
	// 	],
	// 	grid: [
	// 		{
	// 			left: "10%",
	// 			right: "8%",
	// 			height: "50%",
	// 		},
	// 		{
	// 			left: "10%",
	// 			right: "8%",
	// 			top: "75%",
	// 			// height: "16%",
	// 		},
	// 	],
	// 	legend: {
	// 		// Don't allow components of the graph to be toggled
	// 		selectedMode: false,
	// 	},
	// 	dataZoom: [
	// 		{
	// 			type: "slider",
	// 			start: 0,
	// 			end: 100,
	// 			xAxisIndex: [0, 1],
	// 		},
	// 		{
	// 			type: "inside",
	// 			start: 0,
	// 			end: 100,
	// 			xAxisIndex: [0, 1],
	// 		},
	// 	],
	// 	series: [
	// 		{
	// 			type: "line",
	// 			name: "Total Value",
	// 			showSymbol: false,
	// 			encode: { x: "timestamp", y: "total" },
	// 		},
	// 		// {
	// 		// 	type: "bar",
	// 		// 	name: "Sentiment",
	// 		// 	encode: { x: "timestamp", y: "difference" },
	// 		// 	xAxisIndex: 1,
	// 		// 	yAxisIndex: 1,
	// 		// },
	// 		{
	// 			type: "bar",
	// 			name: "+2's",
	// 			encode: { x: "timestamp", y: "plus_two" },
	// 			xAxisIndex: 1,
	// 			yAxisIndex: 1,
	// 			color: "green",
	// 		},
	// 		{
	// 			type: "bar",
	// 			name: "-2's",
	// 			encode: { x: "timestamp", y: "minus_two" },
	// 			xAxisIndex: 1,
	// 			yAxisIndex: 1,
	// 			color: "red",
	// 		},
	// 	],
	// });

	const theme = $derived(new MediaQuery("(prefers-color-scheme: dark)").current ? "dark" : "light");
</script>

<Chart bind:chart class="h-[50dvh] w-full max-w-6xl " {theme} {options} />
