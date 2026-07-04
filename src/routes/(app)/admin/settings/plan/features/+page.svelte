<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Plus, Trash2 } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let newFeature = $state({
		name: '',
		description: ''
	});
</script>

<svelte:head>
	<title>Plan Features - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Plan Features</h1>
		<p class="mt-1 text-sm text-muted-foreground">Manage features that can be assigned to plans</p>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Add Feature</CardTitle>
		</CardHeader>
		<CardContent>
			<form class="space-y-4">
				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="name">Feature Name</Label>
						<Input id="name" placeholder="24/7 Support" bind:value={newFeature.name} required />
					</div>
					<div class="space-y-2">
						<Label for="description">Description</Label>
						<Input id="description" placeholder="Round-the-clock customer support" bind:value={newFeature.description} />
					</div>
				</div>
				<Button type="submit" class="gap-2">
					<Plus class="h-4 w-4" />
					Add Feature
				</Button>
			</form>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Features ({data.features.length})</CardTitle>
		</CardHeader>
		<CardContent>
			{#if data.features.length > 0}
				<div class="space-y-2">
					{#each data.features as feature}
						<div class="flex items-center justify-between rounded-lg border border-border/40 p-3">
							<div>
								<p class="font-medium text-foreground">{feature.name}</p>
								{#if feature.description}
									<p class="text-sm text-muted-foreground">{feature.description}</p>
								{/if}
							</div>
							<Button variant="ghost" size="sm" class="text-destructive">
								<Trash2 class="h-4 w-4" />
							</Button>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-center text-sm text-muted-foreground py-8">No features configured</p>
			{/if}
		</CardContent>
	</Card>
</div>
