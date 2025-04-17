<script lang="ts">
	import { page } from "$app/state";
	import { browser, dev } from "$app/environment";
	import Seo from "$lib/components/Seo.svelte";

	const online = browser ? navigator.onLine : true;
</script>

<Seo title="Error {page.status}" />

<main class="mx-auto h-full min-h-screen max-w-4xl px-4 py-4">
	{#if !online}
		<h1 class="text-2xl font-bold">You're offline!</h1>
		<p>Reload the page once you're back online.</p>
	{:else if page.status === 404}
		<h1 class="text-2xl font-bold">Page not found!</h1>
		<p>
			Looks like you've navigated to a page that doesn't exist! If you were sent here by a link on
			this website, please report it on <a
				class="font-bold hover:underline"
				href="https://github.com/jack-weilage/plustwo/issues">GitHub</a
			>!
		</p>
	{:else}
		<h1 class="text-2xl font-bold">Whoops!</h1>
		<p>Looks like something went wrong when rendering this page. Try reloading.</p>
		<p>
			If the error persists, please report it on <a
				class="font-bold hover:underline"
				href="https://github.com/jack-weilage/plustwo/issues">GitHub</a
			>!
		</p>
		{#if dev}
			<pre class="bg-muted mt-8 rounded-2xl p-4"><code>{JSON.stringify(page.error, null, 2)}</code
				></pre>
		{/if}
	{/if}
</main>
