<script lang="ts">
	import ChevronRight from "@lucide/svelte/icons/chevron-right";

	import * as Breadcrumb from "$lib/components/ui/breadcrumb";

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
	<li class="flex justify-between rounded-xl border-2 px-4 py-2 text-sm">
		<span>{name}</span>
		<span class={score > 0 ? "text-green-600" : "text-orange-600"}
			>{score >= 0 ? "+" : ""}{score.toLocaleString()}</span
		>
	</li>
{/snippet}

<svelte:head>
	<title>+2 | {data.broadcaster.displayName}</title>
	<link rel="icon" href={data.broadcaster.profileImageUrl} />
</svelte:head>

<main class="mx-auto max-w-4xl px-4 py-4">
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
		<ol class="grid grid-cols-1 gap-2 sm:grid-cols-2">
			{#each data.broadcastList as broadcast}
				<li>
					<a
						href="/broadcasters/{data.broadcaster.id}/broadcasts/{broadcast.id}"
						class="broadcast hover:bg-foreground hover:text-background flex flex-col gap-2 rounded-xl border-2 px-4 py-2 text-sm transition-colors {broadcast.endedAt ||
							'border-destructive'}"
					>
						<span class="truncate font-bold">{broadcast.title}</span>
						<div class="flex flex-nowrap items-center justify-between gap-2">
							<span>{broadcast.total >= 0 ? "+" : "-"}{broadcast.total.toLocaleString()}</span>
							{#if broadcast.endedAt}
								<span class="timestamp text-muted-foreground">
									{humanTimestamp(+broadcast.endedAt - +broadcast.startedAt)}
								</span>
							{:else}
								<span class="text-destructive">Live</span>
							{/if}
						</div>
					</a>
				</li>
			{/each}
		</ol>

		<!-- <a -->
		<!-- 	href="/broadcasters/{data.broadcaster.id}/chatters" -->
		<!-- 	class="text-background bg-foreground hover:bg-background hover:text-foreground mt-4 flex flex-nowrap items-center gap-1 rounded-xl px-4 py-2" -->
		<!-- > -->
		<!-- 	View all -->
		<!-- 	<ChevronRight size="1.2em" /> -->
		<!-- </a> -->
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
