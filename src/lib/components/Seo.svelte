<script lang="ts">
	let {
		title,
		description = "",
		icon = "/favicon.png",
	}: { title: string; description?: string; icon?: string } = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="icon" href={icon} />

	<!-- OpenGraph tags -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />

	<!-- Twitter tags -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>
