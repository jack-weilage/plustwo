<script lang="ts">
	import MainChart from "$lib/components/MainChart.svelte";

	let { data } = $props();
	let candlestick_series = $state([]);

	$effect(() => {
		let total = 0;
		candlestick_series = data.sentiment.map(({ minute, plusTwoCount, minusTwoCount }) => {
			const current_total = total;
			const difference = plusTwoCount - minusTwoCount;

			total += difference;
			return {
				// Add a Z to the end of the string to ensure that the date is parsed as UTC
				timestamp: new Date(minute + "Z"),

				open: current_total,
				close: total,
				lowest: current_total - minusTwoCount,
				highest: current_total + plusTwoCount,
			};
		});
	});
</script>

<svelte:head>
	<title>+2.live</title>
</svelte:head>

<main class="w-screen min-h-screen h-full py-4 px-2">
	<section class="flex place-content-center px-4 mb-12">
		<MainChart broadcasts={data.broadcasts} candlestick={candlestick_series} />
	</section>

	<section class="px-4 mb-6">
		<p>A website tracking the good and bad jokes of streamer Northernlion, as rated by his chat.</p>

		<h2 class="font-bold">How does this work?</h2>
		<p>
			A program reads all chat messages sent, looking for any that start or end with "+2" or "-2".
			These messages are automatically stored in a database, alongside the chatter who sent them and
			which broadcast they were sent in.
		</p>
	</section>

	<section class="px-4">
		<h2 class="font-bold text-2xl">Totals</h2>

		<ul class="flex place-content-around">
			<li class="py-4 px-6 rounded-2xl border border-gray-50">
				<h3 class="font-semibold text-xl">Messages</h3>
				{(data.totals.plusTwoCount + data.totals.minusTwoCount).toLocaleString()} messages have been
				stored. Of these:
				<ul class="list-disc list-inside">
					<li class="text-green-400">
						{data.totals.plusTwoCount.toLocaleString()} messages have a +2 ({(
							(data.totals.plusTwoCount / (data.totals.plusTwoCount + data.totals.minusTwoCount)) *
							100
						).toFixed(2)}%)
					</li>
					<li class="text-rose-500">
						{data.totals.minusTwoCount.toLocaleString()} messages have a -2 ({(
							(data.totals.minusTwoCount / (data.totals.plusTwoCount + data.totals.minusTwoCount)) *
							100
						).toFixed(2)}%)
					</li>
				</ul>
			</li>
			<li>
				<h3 class="font-semibold text-xl">Chatters</h3>
			</li>
			<li>
				<h3 class="font-semibold text-xl">Broadcasts</h3>
			</li>
			<!-- <li> -->
			<!-- 	<h3>Average Chatter</h3> -->
			<!-- 	<p>The average chatter is 87% positive/negative, sending N +2's and N -2's</p> -->
			<!-- </li> -->
			<!-- <li> -->
			<!-- 	<h3>Average Broadcast</h3> -->
			<!-- 	<p> -->
			<!-- 		The average broadcast sees NUMBER chatters sending PERCENT% positive sentiment over TIME. -->
			<!-- 	</p> -->
			<!-- </li> -->
		</ul>
	</section>
</main>
