<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Plus, Trash2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData, form?: ActionData } = $props();

	$effect(() => {
		if (form?.success) {
			toast.success(form.message || 'Action completed');
		} else if (form?.error) {
			toast.error(form.error || 'Action failed');
		}
	});
</script>

<svelte:head>
	<title>Plan Features - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Plan Features</h1>
		<p class="mt-1 text-sm text-muted-foreground">Manage features that can be assigned to plans</p>
	</div>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="text-base">Add Feature</CardTitle>
		</CardHeader>
		<CardContent class="p-3 pt-0">
			<form method="POST" action="?/addFeature" use:enhance class="space-y-3">
				<div class="grid gap-3 md:grid-cols-2">
					<div class="space-y-1.5">
						<Label for="name" class="text-xs">Feature Name</Label>
						<Input id="name" name="name" placeholder="24/7 Support" required />
					</div>
					<div class="space-y-1.5">
						<Label for="description" class="text-xs">Description</Label>
						<Input id="description" name="description" placeholder="Round-the-clock customer support" />
					</div>
				</div>
				<Button type="submit" size="sm" class="gap-2">
					<Plus class="h-4 w-4" />
					Add Feature
				</Button>
			</form>
		</CardContent>
	</Card>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="text-base">Features ({data.features.length})</CardTitle>
		</CardHeader>
		<CardContent class="p-3 pt-0">
			{#if data.features.length > 0}
				<div class="space-y-2">
					{#each data.features as feature}
						<div class="flex items-center justify-between rounded-lg border border-border/40 p-2.5">
							<div>
								<p class="text-sm font-medium text-foreground">{feature.name}</p>
								{#if feature.description}
									<p class="text-xs text-muted-foreground">{feature.description}</p>
								{/if}
							</div>
							<form method="POST" action="?/deleteFeature" use:enhance>
								<input type="hidden" name="featureId" value={feature.id} />
								<Button variant="ghost" size="sm" type="submit" class="text-destructive hover:text-destructive">
									<Trash2 class="h-4 w-4" />
								</Button>
							</form>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-center text-sm text-muted-foreground py-8">No features configured</p>
			{/if}
		</CardContent>
	</Card>
</div>
