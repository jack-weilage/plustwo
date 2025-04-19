<script lang="ts">
	import * as Breadcrumb from "$lib/components/ui/breadcrumb";
	import * as Pagination from "$lib/components/ui/pagination";
	import Seo from "$lib/components/Seo.svelte";
	import { Input } from "$lib/components/ui/input";
	import ChatterPreview from "$lib/components/ChatterPreview.svelte";

	import ChevronLeft from "@lucide/svelte/icons/chevron-left";
	import ChevronRight from "@lucide/svelte/icons/chevron-right";

	import { page as pageStore } from "$app/state";
	import { debounce } from "$lib/utils";
	import { goto } from "$app/navigation";

	let { data } = $props();

	const debouncedSearch = debounce(() => {
		goto(pageStore.url, {
			invalidateAll: true,
			keepFocus: true,
			replaceState: true,
			noScroll: true,
		});
	}, 300);
</script>

<Seo
	title="+2 | {data.broadcaster.displayName} | Chatters"
	icon={data.broadcaster.profileImageUrl!}
/>

<main class="mx-auto max-w-4xl px-4 py-4">
	<section class="py-2">
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/broadcasters/{data.broadcaster.displayName}">
						{data.broadcaster.displayName}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Chatters</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>
	</section>
	<section class="py-2">
		<form class="flex flex-col gap-2" role="search">
			<Input
				type="text"
				placeholder="Search Chatters"
				value={data.search}
				oninput={(e) => {
					const search = e.currentTarget.value;
					pageStore.url.searchParams.set("search", search);
					pageStore.url.searchParams.set("page", "1");

					debouncedSearch();
				}}
			/>
			<p class="text-muted-foreground text-sm">
				{data.pagination.itemCount.toLocaleString()} result{data.pagination.itemCount === 1
					? ""
					: "s"}
			</p>
		</form>
	</section>
	<section class="py-2">
		<ul class="grid grid-cols-[auto_repeat(3,max-content)] gap-x-2">
			{#each data.chatters as chatter}
				<li class="contents">
					<ChatterPreview {chatter} />
				</li>
			{:else}
				<li class="col-span-full text-sm">
					<span class="text-muted-foreground">No chatters found</span>
				</li>
			{/each}
		</ul>
	</section>
	<section class="py-2">
		<Pagination.Root
			count={data.pagination.itemCount}
			perPage={data.pagination.perPage}
			siblingCount={3}
			page={data.pagination.page}
			onPageChange={(page) => {
				pageStore.url.searchParams.set("page", page.toString());

				// Update the URL, then re-run the load function.
				goto(pageStore.url, { invalidateAll: true, noScroll: true });
			}}
		>
			{#snippet children({ pages, currentPage })}
				<Pagination.Content>
					<Pagination.Item>
						<Pagination.PrevButton>
							<ChevronLeft class="size-4" />
							<span class="hidden sm:block">Previous</span>
						</Pagination.PrevButton>
					</Pagination.Item>
					{#each pages as page (page.key)}
						{#if page.type === "ellipsis"}
							<Pagination.Item>
								<Pagination.Ellipsis />
							</Pagination.Item>
						{:else}
							<Pagination.Item>
								<Pagination.Link {page} isActive={currentPage === page.value}>
									{page.value}
								</Pagination.Link>
							</Pagination.Item>
						{/if}
					{/each}
					<Pagination.Item>
						<Pagination.NextButton>
							<span class="hidden sm:block">Next</span>
							<ChevronRight class="size-4" />
						</Pagination.NextButton>
					</Pagination.Item>
				</Pagination.Content>
			{/snippet}
		</Pagination.Root>
	</section>
</main>
