<script lang="ts">
	import MessageCircle from "@lucide/svelte/icons/message-circle";
	import Tv from "@lucide/svelte/icons/tv";
	import Radio from "@lucide/svelte/icons/radio";

	import * as Accordion from "$lib/components/ui/accordion";
	import Seo from "$lib/components/Seo.svelte";

	let { data } = $props();
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
