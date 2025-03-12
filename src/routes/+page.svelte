<script lang="ts">
	// import { ChatClient } from "@twurple/chat";

	import { use } from "echarts/core";
	import { BarChart, LineChart } from "echarts/charts";
	import { onMount } from "svelte";
	import { MediaQuery } from "svelte/reactivity";
	import {
		GridComponent,
		LegendComponent,
		TooltipComponent,
		DatasetComponent,
		DataZoomComponent,
		VisualMapComponent,
	} from "echarts/components";
	import { CanvasRenderer } from "echarts/renderers";

	import Chart from "$lib/echart/Chart.svelte";

	import type { EChartsOption } from "echarts/types/dist/shared";
	import type { EChartsType } from "echarts/core";

	let total_series = $state([]);

	onMount(async () => {
		chart.showLoading();

		total_series = await fetch("/api/records/any_id").then((res) => res.json());

		chart.hideLoading();
	});

	// type MessageKind = "plus-two" | "minus-two";
	// 	const messages: {
	// 		timestamp: Date;
	// 		user: string;
	// 		id: string;
	// 		kind: MessageKind;
	// 	}[] = $state([]);
	// const CHANNELS = ["Northernlion"];

	// onMount(() => {
	// 	console.log(data);
	// 	const chat = new ChatClient({ channels: CHANNELS });
	//
	// 	// chat.connect();
	// 	chat.onConnect(() => console.log("connected"));
	//
	// 	chat.onJoin((ev) => console.log("joined", ev));
	// 	chat.onJoinFailure(() => console.log("join failed"));
	//
	// 	chat.onMessage((_channel, _user, _text, msg) => {
	// 		console.log(`@${msg.userInfo.userName}: ${msg.text}`);
	//
	// 		if (msg.text === "+2") {
	// 			messages.push({
	// 				timestamp: msg.date,
	// 				user: msg.userInfo.userName,
	// 				id: msg.id,
	// 				kind: "plus-two",
	// 			});
	// 		} else if (msg.text == "-2") {
	// 			messages.push({
	// 				timestamp: msg.date,
	// 				user: msg.userInfo.userName,
	// 				id: msg.id,
	// 				kind: "minus-two",
	// 			});
	// 		}
	// 	});
	//
	// 	return () => {
	// 		for (const channel of CHANNELS) {
	// 			chat.part(channel);
	// 		}
	//
	// 		chat.quit();
	// 	};
	// });

	use([
		LineChart,
		BarChart,

		VisualMapComponent,
		GridComponent,
		LegendComponent,
		TooltipComponent,

		DatasetComponent,
		DataZoomComponent,

		CanvasRenderer,
	]);
	let chart: EChartsType = $state()!;
	let options: EChartsOption = $derived({
		dataset: {
			dimensions: ["timestamp", "total", "plus_two", "minus_two", "difference"],
			source: total_series,
		},
		visualMap: {
			show: false,
			seriesIndex: 1,
			dimension: 4,
			pieces: [
				{
					gte: 0,
					color: "green",
				},
				{
					lt: 0,
					color: "red",
				},
			],
		},

		tooltip: {
			trigger: "axis",
		},
		xAxis: [
			{
				type: "time",
			},
			{
				type: "time",
				gridIndex: 1,
				axisLine: { onZero: false },
				axisTick: { show: false },
				splitLine: { show: false },
				axisLabel: { show: false },
			},
		],
		yAxis: [
			{
				name: "Total",
				type: "value",
			},
			{
				name: "Sentiment",
				gridIndex: 1,
				axisLine: { show: false },
				axisTick: { show: false },

				// splitLine: { show: false },
			},
		],
		grid: [
			{
				left: "10%",
				right: "8%",
				height: "50%",
			},
			{
				left: "10%",
				right: "8%",
				top: "63%",
				height: "16%",
			},
		],
		legend: {
			// Don't allow components of the graph to be toggled
			selectedMode: false,
		},
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
		series: [
			{
				type: "line",
				name: "Total Value",
				showSymbol: false,
				encode: { x: "timestamp", y: "total" },
			},
			{
				type: "bar",
				name: "Sentiment",
				encode: { x: "timestamp", y: "difference" },
				xAxisIndex: 1,
				yAxisIndex: 1,
			},
		],
	});

	const theme = $derived(new MediaQuery("(prefers-color-scheme: dark)").current ? "dark" : "light");
</script>

<svelte:head>
	<title>+2.live</title>
</svelte:head>

<main class="w-screen min-h-screen h-full dark:bg-slate-900 py-4">
	<Chart bind:chart class="h-[80dvh] w-full max-w-6xl mx-auto" {theme} {options} />
</main>
