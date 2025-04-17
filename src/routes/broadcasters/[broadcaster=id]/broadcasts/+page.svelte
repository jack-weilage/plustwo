<script lang="ts">
	import ChevronLeft from "@lucide/svelte/icons/chevron-left";
	import ChevronRight from "@lucide/svelte/icons/chevron-right";
	import * as Breadcrumb from "$lib/components/ui/breadcrumb";
	import * as Pagination from "$lib/components/ui/pagination/index.js";
	import BroadcastPreview from "$lib/components/BroadcastPreview.svelte";
	import Seo from "$lib/components/Seo.svelte";

	import { page as pageStore } from "$app/state";
	import { goto } from "$app/navigation";

	let { data } = $props();
</script>

<Seo title="+2 | {data.broadcaster.displayName} | Broadcasts (Page {data.pagination.page})" />

<main class="mx-auto max-w-4xl px-4 py-4">
	<section class="flex justify-between py-2">
		<Breadcrumb.Root>
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/broadcasters/{data.broadcaster.id}">
						{data.broadcaster.displayName}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Broadcasts</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<h2 class="font-bold">Broadcasts</h2>
	</section>
	<section class="py-2">
		<ul class="grid grid-cols-1 gap-2 sm:grid-cols-2">
			{#each data.broadcastList as broadcast}
				<li>
					<BroadcastPreview {broadcast} broadcaster={data.broadcaster} />
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
				goto(pageStore.url, { invalidateAll: true });
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
