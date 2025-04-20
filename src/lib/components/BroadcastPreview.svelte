<script lang="ts">
	let {
		broadcaster,
		broadcast,
	}: {
		broadcaster: {
			displayName: string;
		};
		broadcast: {
			id: number;
			title: string;
			startedAt: Date;
			endedAt: Date | null;
			score: number;
		};
	} = $props();

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

<a
	href="/broadcasters/{broadcaster.displayName}/broadcasts/{broadcast.id}"
	class="hover:bg-foreground hover:text-background flex flex-col gap-2 rounded-xl border-2 px-4 py-2 text-sm shadow transition-colors {broadcast.endedAt
		? 'border-transparent'
		: 'border-destructive '}"
>
	<div class="flex flex-nowrap items-center justify-between gap-2">
		<span class="truncate font-bold">{broadcast.title}</span>
		{#if broadcast.endedAt}
			<span class="text-muted-foreground font-light">
				{humanTimestamp(+broadcast.endedAt - +broadcast.startedAt)}
			</span>
		{:else}
			<span class="text-destructive">Live</span>
		{/if}
	</div>
	<div class="flex flex-nowrap items-center justify-between gap-2">
		<span>{broadcast.score >= 0 ? "+" : ""}{broadcast.score.toLocaleString()}</span>

		<span class="text-muted-foreground font-light">
			{broadcast.startedAt.toLocaleTimeString()}
			{broadcast.startedAt.toLocaleDateString()}
		</span>
	</div>
</a>
