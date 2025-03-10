<script lang="ts">
	import { ChatClient } from "@twurple/chat";

	const messages: {
		timestamp: Date;
		user: string;
		id: string;
		is_plus: boolean;
	}[] = $state([]);

	$effect(() => {
		const chat = new ChatClient({ channels: ["northernlion"] });
		chat.connect();

		chat.onConnect(() => console.log("connected"));
		chat.onMessage((channel, user, text, msg) => {
			console.log(`@${user}: ${text}`);

			if (text === "+2") {
				messages.push({
					timestamp: msg.date,
					user,
					id: msg.id,
					is_plus: true
				});
			} else if (text == "-2") {
				messages.push({
					timestamp: msg.date,
					user,
					id: msg.id,
					is_plus: false
				});
			}
		});

		return () => {
			chat.part("northernlion");
			chat.quit();
		};
	});
</script>

<ul>
	{#each messages as { timestamp, user, is_plus }}
		<li>@{user} ({timestamp.toLocaleTimeString()}): {is_plus}</li>
	{/each}
</ul>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
