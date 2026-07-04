<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Plus, Edit, Trash2, Eye } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date | null) {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function getStatusBadgeVariant(status: string) {
		if (status === 'published') return 'default';
		if (status === 'draft') return 'secondary';
		return 'outline';
	}
</script>

<svelte:head>
	<title>Blog - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-semibold text-foreground">Blog Posts</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Manage blog content ({data.posts.length} posts)
			</p>
		</div>
		<a href="/admin/blog/create">
			<Button class="gap-2">
				<Plus class="h-4 w-4" />
				Create Post
			</Button>
		</a>
	</div>

	<!-- Blog Posts Table -->
	<div class="rounded-lg border border-border/50 bg-card shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="border-b border-border/50 bg-muted/30">
					<tr>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Title</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Author</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Published</th>
						<th class="px-4 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border/30">
					{#each data.posts as post}
						<tr class="transition-colors hover:bg-muted/20">
							<td class="px-4 py-3">
								<div class="max-w-md">
									<p class="font-medium text-foreground line-clamp-1">{post.title}</p>
									{#if post.excerpt}
										<p class="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
									{/if}
								</div>
							</td>
							<td class="px-4 py-3">
								<div>
									<p class="font-medium text-foreground">
										{post.author?.firstName || ''} {post.author?.lastName || ''}
									</p>
								</div>
							</td>
							<td class="px-4 py-3">
								<Badge variant={getStatusBadgeVariant(post.status)}>{post.status}</Badge>
							</td>
							<td class="px-4 py-3 text-sm text-muted-foreground">
								{formatDate(post.publishedAt)}
							</td>
							<td class="px-4 py-3 text-right">
								<div class="flex justify-end gap-2">
									<a href="/blog/{post.slug}" target="_blank">
										<Button variant="ghost" size="sm">
											<Eye class="h-4 w-4" />
										</Button>
									</a>
									<a href="/admin/blog/{post.id}/edit">
										<Button variant="ghost" size="sm">
											<Edit class="h-4 w-4" />
										</Button>
									</a>
									<Button variant="ghost" size="sm" class="text-destructive">
										<Trash2 class="h-4 w-4" />
									</Button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if data.posts.length === 0}
			<div class="py-12 text-center">
				<p class="text-sm text-muted-foreground">No blog posts yet</p>
			</div>
		{/if}
	</div>

	<div class="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
		<p class="text-sm text-yellow-700 dark:text-yellow-300">
			<strong>TODO:</strong> Implement create/edit post pages with TipTap editor
		</p>
	</div>
</div>
