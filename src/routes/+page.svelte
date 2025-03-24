<script lang="ts">
	import { MessageCircle, Tv } from "lucide-svelte";

	let { data } = $props();
</script>

<svelte:head>
	<title>+2.live</title>
</svelte:head>

<main class="h-full min-h-screen w-screen px-2 py-4">
	<section class="mb-4 px-4">
		<h2 class="mb-2 text-xl font-semibold">Tracked Broadcasters</h2>
		<ul>
			{#each data.broadcaster_list as broadcaster}
				<li>
					<a
						href="/broadcasters/{broadcaster.id}"
						class="flex items-center justify-between gap-2 rounded-xl border border-gray-500 px-2 py-1 font-bold transition-colors hover:bg-slate-300"
					>
						<span class="flex items-center gap-2">
							<img src={broadcaster.profileImageUrl} alt="" class="size-8 rounded-full" />
							{broadcaster.name}
						</span>

						<span class="flex gap-4 py-2">
							<span class="flex items-center gap-2 text-sm">
								<Tv size="1.2em" />
								{broadcaster.broadcastCount}
							</span>
							<span class="flex items-center gap-2 text-sm">
								<MessageCircle size="1.2em" />
								{broadcaster.messageCount.toLocaleString()}
							</span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</section>
	<section class="mt-16 px-4">
		<h2 class="text-lg font-semibold">FAQ</h2>
		<details>
			<summary>What is this website?</summary>

			This is a project tracking the quality of Twitch streams, as rated by the chatters watching.
			No serious conclusions should be made from the information, but there's some pretty graphs!
		</details>
		<details>
			<summary>What is +2/-2?</summary>

			+2 is a meme that originated with the streamer Jerma985, where chatters will vote on the
			quality of jokes by sending a +2 or -2 in the chat. As considered by this website, a +2 is a
			positive vote, meaning that the chatter thought a joke was funny, relatable, or agreeable,
			while a -2 means the opposite.
		</details>
	</section>

	<!-- <section class="px-4"> -->
	<!-- 	<h2 class="text-2xl font-bold">Totals</h2> -->
	<!---->
	<!-- 	<ul class="flex place-content-around"> -->
	<!-- 		<li class="rounded-2xl border border-gray-50 px-6 py-4"> -->
	<!-- 			<h3 class="text-xl font-semibold">Messages</h3> -->
	<!-- 			{(data.totals.plusTwoCount + data.totals.minusTwoCount).toLocaleString()} messages have been -->
	<!-- 			stored. Of these: -->
	<!-- 			<ul class="list-inside list-disc"> -->
	<!-- 				<li class="text-green-400"> -->
	<!-- 					{data.totals.plusTwoCount.toLocaleString()} messages have a +2 ({( -->
	<!-- 						(data.totals.plusTwoCount / (data.totals.plusTwoCount + data.totals.minusTwoCount)) * -->
	<!-- 						100 -->
	<!-- 					).toFixed(2)}%) -->
	<!-- 				</li> -->
	<!-- 				<li class="text-rose-500"> -->
	<!-- 					{data.totals.minusTwoCount.toLocaleString()} messages have a -2 ({( -->
	<!-- 						(data.totals.minusTwoCount / (data.totals.plusTwoCount + data.totals.minusTwoCount)) * -->
	<!-- 						100 -->
	<!-- 					).toFixed(2)}%) -->
	<!-- 				</li> -->
	<!-- 			</ul> -->
	<!-- 		</li> -->
	<!-- 		<li> -->
	<!-- 			<h3 class="text-xl font-semibold">Chatters</h3> -->
	<!-- 		</li> -->
	<!-- 		<li> -->
	<!-- 			<h3 class="text-xl font-semibold">Broadcasts</h3> -->
	<!-- 		</li> -->
	<!-- 	</ul> -->
	<!-- </section> -->
</main>
