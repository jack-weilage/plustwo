<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { onMount } from "svelte";
	import { init, type EChartsType } from "echarts/core";
	import type { EChartsOption } from "echarts/types/dist/shared";

	let {
		theme = "light",
		init: init_options = {},
		options,
		chart = $bindable(),
		...restProps
	}: {
		theme?: "light" | "dark";
		init?: object;
		options: EChartsOption;
		chart: EChartsType;
	} & HTMLAttributes<HTMLDivElement> = $props();

	let ref: HTMLDivElement;

	$effect(() => {
		chart?.setOption(options);
	});

	onMount(() => {
		chart = init(ref, theme, init_options);

		const resize_observer = new ResizeObserver(() => {
			chart.resize();
		});
		resize_observer.observe(ref);

		return () => {
			resize_observer.disconnect();
			chart.dispose();
		};
	});
</script>

<div bind:this={ref} class="h-full w-full {restProps.class}" {...restProps}></div>
