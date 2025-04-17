<script lang="ts">
	import ChevronRight from "@lucide/svelte/icons/chevron-right";

	import * as Breadcrumb from "$lib/components/ui/breadcrumb";
	import Seo from "$lib/components/Seo.svelte";
	import BroadcastPreview from "$lib/components/BroadcastPreview.svelte";

	let { data } = $props();

	function humanTimestamp(duration: number): string {
		duration /= 1000;

		const units = [];
		for (const seconds of [60 * 60, 60, 1]) {
			const count = Math.floor(duration / seconds);
			duration -= count * seconds;

			// Add a section if there is some amount of that unit or a unit has already been added before it.
			if (count > 0 || units.length > 0) {
				if (count < 10 && units.length > 0) {
					units.push(`0${count}`);
				} else {
					units.push(count.toString());
				}
			}
		}

		return units.join(":");
	}
</script>

{#snippet chatterCard(name: string, score: number)}
	<li class="flex justify-between rounded-xl px-4 py-2 text-sm shadow">
		<span>{name}</span>
		<span class={score > 0 ? "text-green-600" : "text-orange-600"}>
			{score >= 0 ? "+" : ""}{score.toLocaleString()}
		</span>
	</li>
{/snippet}

<Seo title="+2 | {data.broadcaster.displayName}" icon={data.broadcaster.profileImageUrl!} />

<main class="mx-auto min-h-screen max-w-4xl px-4 py-4">
	<section class="flex justify-between py-2">
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>{data.broadcaster.displayName}</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<h2 class="font-bold">Broadcasts</h2>
	</section>
	<section class="py-2">
		<ul class="grid grid-cols-1 gap-2 sm:grid-cols-2">
			{#each data.broadcastList as broadcast}
				<li>
					<BroadcastPreview {broadcast} broadcaster={data.broadcaster} />
				</li>
			{/each}
		</ul>

		<a
			href="/broadcasters/{data.broadcaster.id}/broadcasts"
			class="text-background bg-foreground hover:bg-background hover:text-foreground mt-4 flex flex-nowrap items-center gap-1 rounded-xl px-4 py-2"
		>
			View all
			<ChevronRight size="1.2em" />
		</a>
	</section>
	<section class="mt-4 py-2">
		<h2 class="text-end font-bold">Chatters</h2>

		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
			<div class="flex flex-col gap-2">
				<h3 class="font-bold">Most Positive</h3>
				<ol class="flex flex-col gap-2">
					{#each data.bestChatters as chatter}
						{@render chatterCard(chatter.displayName, chatter.score)}
					{/each}
				</ol>
			</div>
			<div class="flex flex-col gap-2">
				<h3 class="font-bold">Most Negative</h3>
				<ol class="flex flex-col gap-2">
					{#each data.worstChatters as chatter}
						{@render chatterCard(chatter.displayName, chatter.score)}
					{/each}
				</ol>
			</div>
		</div>

		<a
			href="/broadcasters/{data.broadcaster.id}/chatters"
			class="text-background bg-foreground hover:bg-background hover:text-foreground mt-4 flex flex-nowrap items-center gap-1 rounded-xl px-4 py-2"
		>
			View all
			<ChevronRight size="1.2em" />
		</a>
	</section>
</main>

<style>
	.broadcast:hover .timestamp {
		color: var(--muted-foreground);
	}
</style>
