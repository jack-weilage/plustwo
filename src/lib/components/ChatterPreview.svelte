<script lang="ts">
	let {
		chatter,
	}: {
		chatter: {
			displayName: string;
			plusTwoCount: number;
			minusTwoCount: number;
		};
	} = $props();
</script>

<a
	href="/chatters/{chatter.displayName}"
	class="flex justify-between rounded-xl px-4 py-2 text-sm shadow"
>
	<span class="">{chatter.displayName}</span>
	<div class="grid grid-cols-[repeat(3,6ch)] gap-2">
		<span class="text-end text-red-600">-{chatter.minusTwoCount.toLocaleString()}</span>
		<span class="text-end text-green-600">+{chatter.plusTwoCount.toLocaleString()}</span>
		<span class="text-muted-foreground text-end">
			{(chatter.plusTwoCount - chatter.minusTwoCount).toLocaleString()}
		</span>
	</div>
</a>
