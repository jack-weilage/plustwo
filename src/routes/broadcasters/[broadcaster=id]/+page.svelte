<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>+2 | {data.broadcaster.displayName}</title>
	<link rel="icon" href={data.broadcaster.profileImageUrl} />
</svelte:head>

<main>
	<section class="px-4 py-2">
		<h1 class="text-2xl font-bold">{data.broadcaster.displayName}</h1>
	</section>
	<section class="px-4 py-2">
		<h2>Broadcasts</h2>
		<ol class="grid grid-cols-2 gap-2">
			{#each data.broadcast_list as broadcast}
				<li>
					<a
						href="/broadcasters/{data.broadcaster.id}/broadcasts/{broadcast.id}"
						class="flex justify-between gap-4 rounded-xl border-2 {broadcast.total > 0
							? 'border-green-500'
							: 'border-b-orange-600'} px-4 py-2 transition-colors hover:bg-slate-300"
					>
						<span>{broadcast.title}</span>
						<span>{broadcast.total >= 0 ? "+" : "-"}{broadcast.total.toLocaleString()}</span>
					</a>
				</li>
			{/each}
		</ol>
	</section>
	<section class="px-4 py-2">
		<h2>Chatters</h2>

		<h3>Most Positive</h3>
		<ol></ol>
		<h3>Most Negative</h3>
		<ol></ol>
	</section>
</main>
