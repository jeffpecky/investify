<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Plus, Trash2 } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let newCategory = $state('');
</script>

<svelte:head>
	<title>Plan Categories - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Plan Categories</h1>
		<p class="mt-1 text-sm text-muted-foreground">Manage investment plan categories</p>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Add Category</CardTitle>
		</CardHeader>
		<CardContent>
			<form class="flex gap-2">
				<Input placeholder="e.g., Premium, Starter" bind:value={newCategory} required class="flex-1" />
				<Button type="submit" class="gap-2">
					<Plus class="h-4 w-4" />
					Add
				</Button>
			</form>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Categories ({data.categories.length})</CardTitle>
		</CardHeader>
		<CardContent>
			{#if data.categories.length > 0}
				<div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
					{#each data.categories as category}
						<div class="flex items-center justify-between rounded-lg border border-border/40 p-3">
							<span class="font-medium text-foreground">{category.name}</span>
							<Button variant="ghost" size="sm" class="text-destructive">
								<Trash2 class="h-4 w-4" />
							</Button>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-center text-sm text-muted-foreground py-8">No categories configured</p>
			{/if}
		</CardContent>
	</Card>
</div>
