<script lang="ts">
	import MessageCircle from "@lucide/svelte/icons/message-circle";
	import Tv from "@lucide/svelte/icons/tv";
	import Radio from "@lucide/svelte/icons/radio";

	import * as Accordion from "$lib/components/ui/accordion";
	import Seo from "$lib/components/Seo.svelte";

	let { data } = $props();

	let stats = $derived(
		data.broadcasterList.reduce(
			(acc, cur) => {
				acc.messageCount += cur.messageCount;
				acc.broadcastCount += cur.broadcastCount;

				return acc;
			},
			{ messageCount: 0, broadcastCount: 0 },
		),
	);
</script>

<Seo
	title="+2.live"
	description="+2.live is a website that tracks the quality of Twitch streams and the jokes made within them, as rated by the chatters watching."
/>

<main class="mx-auto h-full min-h-screen max-w-4xl px-4 py-4">
	<section class="py-2">
		<h2 class="mb-2 text-xl font-semibold">Tracked Broadcasters</h2>
		<ul class="flex flex-col gap-2">
			{#each data.broadcasterList as broadcaster (broadcaster.id)}
				<li>
					<a
						href="/broadcasters/{broadcaster.displayName}"
						class="hover:bg-foreground hover:text-background flex items-center justify-between gap-2 rounded-xl px-2 py-1 font-bold shadow transition-colors"
					>
						<span class="flex items-center gap-2">
							<img src={broadcaster.profileImageUrl} alt="" class="size-8 rounded-full" />
							{broadcaster.displayName}
						</span>

						<span class="flex gap-4 py-2">
							{#if broadcaster.isLive}
								<Radio size="1.2em" color="red" />
							{/if}
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
	<section class="mt-8 py-2">
		<h2 class="sr-only">Stats</h2>
		<ul class="grid auto-rows-[1fr_auto_auto] grid-cols-2 gap-8">
			<li
				class="row-[span_3] grid aspect-4/3 grid-rows-subgrid gap-2 rounded-xl p-4 shadow transition-shadow hover:shadow-xl"
			>
				<div class="flex place-self-center">
					<span class="text-center text-6xl">{data.broadcasterList.length.toLocaleString()}</span>
				</div>

				<h3 class="font-bold">Tracked broadcasters</h3>

				<p class="text-muted-foreground text-sm">
					Broadcasters are manually curated, chosen if their chat uses +2 or -2
				</p>
			</li>
			<li
				class="row-[span_3] grid aspect-4/3 grid-rows-subgrid gap-2 rounded-xl p-4 shadow transition-shadow hover:shadow-xl"
			>
				<div class="flex place-self-center">
					<span class="text-center text-6xl">{stats.broadcastCount.toLocaleString()}</span>
				</div>

				<h3 class="font-bold">Indexed broadcasts</h3>

				<p class="text-muted-foreground text-sm">
					Each broadcast is a stream that has been indexed, either live or from Twitch's archive.
					Unfortunately, Twitch's archives only date back ~60 days, so streams that started before
					the broadcaster was tracked will not appear here.
				</p>
			</li>
			<li
				class="row-[span_3] grid aspect-4/3 grid-rows-subgrid gap-2 rounded-xl p-4 shadow transition-shadow hover:shadow-xl"
			>
				<div class="flex place-self-center">
					<span class="text-center text-6xl">{data.chatterCount.toLocaleString()}</span>
				</div>

				<h3 class="font-bold">Indexed chatters</h3>

				<p class="text-muted-foreground text-sm">
					Chatters are the people who have sent +2 or -2 messages in the chat. This is not an
					accurate count of the total number of chatters, as only specific messages are indexed.
				</p>
			</li>
			<li
				class="row-[span_3] grid aspect-4/3 grid-rows-subgrid gap-2 rounded-xl p-4 shadow transition-shadow hover:shadow-xl"
			>
				<div class="flex place-self-center">
					<span class="text-center text-6xl">{stats.messageCount.toLocaleString()}</span>
				</div>

				<h3 class="font-bold">Indexed messages</h3>

				<p class="text-muted-foreground text-sm">
					The total number of messages sent in the chat that have been indexed. This is not an
					accurate count of the total number of messages sent, as only messages containing +2 or -2
					are indexed.
				</p>
			</li>
		</ul>
	</section>
	<section class="mt-32 py-2">
		<h2 class="text-lg font-semibold">FAQ</h2>
		<Accordion.Root type="multiple">
			<Accordion.Item value="1">
				<Accordion.Trigger>What is this website?</Accordion.Trigger>
				<Accordion.Content>
					This is a website tracking the quality of Twitch streams and the jokes made within them,
					as rated by the chatters watching. No serious conclusions can be made from the
					information, but there's some pretty graphs!
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="2">
				<Accordion.Trigger>What is +2/-2?</Accordion.Trigger>
				<Accordion.Content>
					+2 is a meme that originated with the streamer <a
						target="_blank"
						href="https://twitch.tv/jerma985"
						class="font-bold hover:underline">Jerma985</a
					>, where chatters will vote on the quality of jokes by sending a +2 or -2 in the chat (<a
						target="_blank"
						href="https://jerma-lore.fandom.com/wiki/%2B2_and_-2"
						class="font-bold hover:underline">source</a
					>). As considered by this website, a +2 is a positive vote, meaning that the chatter
					thought a joke was funny, relatable, or agreeable, while a -2 means the opposite.
				</Accordion.Content>
			</Accordion.Item>
			<Accordion.Item value="3">
				<Accordion.Trigger
					>Where does the data come from and why is it incomplete?</Accordion.Trigger
				>
				<Accordion.Content>
					<p class="mb-2">
						Twitch's API allows bots to watch streams live, processing each message as it's sent. A
						custom Rust-based program listens to a specific list of Twitch accounts, recording
						information about streams and the messages sent in them. This data is forwarded to a
						central database, from which this website draws data.
					</p>
					<p>
						For streams started before the watcher was running, a separate program has processed
						Twitch's archive of past streams. Unfortunately, this archive only dates back 60 days
						for Twitch Partners, and 7 days for most other broadcasters (<a
							target="_blank"
							href="https://help.twitch.tv/s/article/video-on-demand?language=en_US#limit"
							class="font-bold hover:underline">source</a
						>). This means that data for broadcasters essentially begins at the start of 2025.
					</p>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</section>
</main>
