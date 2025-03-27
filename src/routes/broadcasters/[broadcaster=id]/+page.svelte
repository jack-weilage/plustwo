<script lang="ts">
	import * as Breadcrumb from "$lib/components/ui/breadcrumb";

	let { data } = $props();
</script>

{#snippet chatterCard(name: string, score: number)}
	<li
		class="flex justify-between rounded-xl border-2 {score > 0
			? 'border-green-500'
			: 'border-orange-600'} px-4 py-2"
	>
		<span>@{name}</span>
		<span>{score >= 0 ? "+" : ""}{score.toLocaleString()}</span>
	</li>
{/snippet}

<svelte:head>
	<title>+2 | {data.broadcaster.displayName}</title>
	<link rel="icon" href={data.broadcaster.profileImageUrl} />
</svelte:head>

<main class="mx-auto max-w-4xl px-2 py-4">
	<section class="py-2">
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
	</section>
	<section class="py-2">
		<h2>Broadcasts</h2>
		<ol class="grid grid-cols-2 gap-2">
			{#each data.broadcastList as broadcast}
				<li>
					<a
						href="/broadcasters/{data.broadcaster.id}/broadcasts/{broadcast.id}"
						class="flex justify-between gap-4 rounded-xl border-2 {broadcast.total > 0
							? 'border-green-500'
							: 'border-orange-600'} px-4 py-2 transition-colors hover:bg-slate-300 dark:hover:bg-slate-800"
					>
						<span>{broadcast.title}</span>
						<span>{broadcast.total >= 0 ? "+" : "-"}{broadcast.total.toLocaleString()}</span>
					</a>
				</li>
			{/each}
		</ol>
	</section>
	<section class="py-2">
		<h2>Chatters</h2>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<h3>Most Positive</h3>
				<ol class="flex flex-col gap-2">
					{#each data.bestChatters as chatter}
						{@render chatterCard(chatter.displayName, chatter.score)}
					{/each}
				</ol>
			</div>
			<div>
				<h3>Most Negative</h3>
				<ol class="flex flex-col gap-2">
					{#each data.worstChatters as chatter}
						{@render chatterCard(chatter.displayName, chatter.score)}
					{/each}
				</ol>
			</div>
		</div>
	</section>
</main>
