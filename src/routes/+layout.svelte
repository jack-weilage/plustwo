<script lang="ts">
	import "../app.css";
	import { Heart } from "lucide-svelte";

	let { children } = $props();
</script>

<header class="px-3 py-4 mb-2"></header>

{@render children()}

<footer class="border-t border-t-gray-700 px-3 py-4">
	<p class="mb-2">
		Built with <Heart size="1em" strokeWidth={3} class="inline-block mx-0.5 mb-0.5" /> by
		<a
			href="https://weilage.dev?utm_source=plustwo"
			target="_blank"
			class="font-semibold hover:underline">Jack Weilage</a
		>. Powered by
		<a href="https://kit.svelte.dev" target="_blank" class="font-semibold hover:underline"
			>SvelteKit</a
		>
		and
		<a
			href="https://echarts.apache.org/en/index.html"
			target="_blank"
			class="font-semibold hover:underline">Apache ECharts</a
		>, hosted by
		<a href="https://cloudflare.com" target="_blank" class="font-semibold hover:underline"
			>Cloudflare</a
		>.
	</p>
	<p>
		Notice something broken/wrong? Let me know by <a
			href="https://github.com/jack-weilage/plustwo/issues"
			target="_blank"
			class="font-semibold hover:underline">filing an issue</a
		>
		or
		<a
			href="mailto:jack@weilage.dev?subject=I found an issue on plustwo.live!"
			target="_blank"
			class="font-semibold hover:underline">reaching out directly</a
		>!
	</p>
</footer>
