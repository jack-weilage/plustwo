<script lang="ts">
	import "../app.css";

	import Heart from "lucide-svelte/icons/heart";
	import Sun from "lucide-svelte/icons/sun";
	import Moon from "lucide-svelte/icons/moon";

	import { ModeWatcher, toggleMode } from "mode-watcher";

	let { children } = $props();
</script>

<header class="mb-2 flex items-center justify-between px-8 py-4">
	<div>
		<a href="/">+2.live</a>
	</div>
	<div>
		<button type="button" onclick={toggleMode} class="grid place-items-center p-2">
			<Sun
				class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
			/>
			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</button>
	</div>
</header>

<ModeWatcher />
{@render children()}

<footer class="border-t border-t-gray-700 px-3 py-4">
	<p class="mb-2 text-sm">
		Built with <Heart size="1em" strokeWidth={3} class="mx-0.5 mb-0.5 inline-block" /> by
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
	<p class="text-sm">
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
