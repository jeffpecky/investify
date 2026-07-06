<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
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
	<title>Payout Options - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Payout Options</h1>
		<p class="mt-1 text-sm text-muted-foreground">Manage available payout frequencies</p>
	</div>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="text-base">Add Payout Option</CardTitle>
		</CardHeader>
		<CardContent class="p-3 pt-0">
			<form method="POST" action="?/addOption" use:enhance class="flex gap-2">
				<Input name="name" placeholder="e.g., daily, weekly, monthly" required class="flex-1" />
				<Button type="submit" size="sm" class="gap-2">
					<Plus class="h-4 w-4" />
					Add
				</Button>
			</form>
		</CardContent>
	</Card>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="text-base">Payout Options ({data.options.length})</CardTitle>
		</CardHeader>
		<CardContent class="p-3 pt-0">
			{#if data.options.length > 0}
				<div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
					{#each data.options as option}
						<div class="flex items-center justify-between rounded-lg border border-border/40 p-2.5">
							<span class="text-sm font-medium text-foreground capitalize">{option.name}</span>
							<form method="POST" action="?/deleteOption" use:enhance>
								<input type="hidden" name="optionId" value={option.id} />
								<Button variant="ghost" size="sm" type="submit" class="text-destructive hover:text-destructive">
									<Trash2 class="h-4 w-4" />
								</Button>
							</form>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-center text-sm text-muted-foreground py-8">No payout options configured</p>
			{/if}
		</CardContent>
	</Card>
</div>
