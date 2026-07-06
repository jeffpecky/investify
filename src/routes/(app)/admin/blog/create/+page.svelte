<script lang="ts">
	import TipTapEditor from '$lib/components/admin/TipTapEditor.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { ArrowLeft } from 'lucide-svelte';

	let title = $state('');
	let slug = $state('');
	let excerpt = $state('');
	let coverImage = $state('');
	let content = $state('');
	let status = $state<'draft' | 'published'>('draft');

	function generateSlug() {
		slug = title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
	}

	function handleContentUpdate(html: string) {
		content = html;
	}
</script>

<svelte:head>
	<title>Create Blog Post - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div class="flex items-center gap-3">
		<a href="/admin/blog">
			<Button variant="ghost" size="icon" class="h-8 w-8">
				<ArrowLeft class="h-4 w-4" />
			</Button>
		</a>
		<div>
			<h1 class="text-2xl font-semibold text-foreground">Create Blog Post</h1>
			<p class="mt-1 text-sm text-muted-foreground">Write and publish a new blog post</p>
		</div>
	</div>

	<form method="POST">
		<Card class="border-border/50">
			<CardHeader class="pb-2">
				<CardTitle class="text-base">Post Details</CardTitle>
			</CardHeader>
			<CardContent class="space-y-3 p-3 pt-0">
				<div class="grid gap-3 md:grid-cols-2">
					<div class="space-y-1.5">
						<Label for="title" class="text-xs">Title</Label>
						<Input id="title" name="title" bind:value={title} onblur={generateSlug} required />
					</div>
					<div class="space-y-1.5">
						<Label for="slug" class="text-xs">Slug</Label>
						<Input id="slug" name="slug" bind:value={slug} required />
					</div>
				</div>
				<div class="space-y-1.5">
					<Label for="excerpt" class="text-xs">Excerpt</Label>
					<Textarea id="excerpt" name="excerpt" bind:value={excerpt} rows={2} />
				</div>
				<div class="space-y-1.5">
					<Label for="coverImage" class="text-xs">Cover Image URL</Label>
					<Input id="coverImage" name="coverImage" type="url" bind:value={coverImage} />
				</div>
				<div class="space-y-1.5">
					<Label class="text-xs">Content</Label>
					<TipTapEditor {content} onUpdate={handleContentUpdate} />
					<input type="hidden" name="content" value={content} />
				</div>
				<div class="space-y-1.5">
					<Label for="status" class="text-xs">Status</Label>
					<select
						id="status"
						name="status"
						bind:value={status}
						class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					>
						<option value="draft">Draft</option>
						<option value="published">Published</option>
					</select>
				</div>
				<div class="flex gap-2 border-t border-border/30 pt-3">
					<Button type="submit" size="sm">Create Post</Button>
					<Button variant="outline" size="sm" type="button" onclick={() => window.history.back()}>Cancel</Button>
				</div>
			</CardContent>
		</Card>
	</form>
</div>
