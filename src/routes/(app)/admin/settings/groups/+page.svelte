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
	<title>User Groups - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">User Groups</h1>
		<p class="mt-1 text-sm text-muted-foreground">Manage user groups based on token balance</p>
	</div>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="text-base">Add New Group</CardTitle>
		</CardHeader>
		<CardContent class="p-3 pt-0">
			<form method="POST" action="?/addGroup" use:enhance class="space-y-3">
				<div class="grid gap-3 md:grid-cols-3">
					<div class="space-y-1.5">
						<Label for="name" class="text-xs">Group Name</Label>
						<Input id="name" name="name" placeholder="Gold" required />
					</div>
					<div class="space-y-1.5">
						<Label for="tokenThreshold" class="text-xs">Token Threshold</Label>
						<Input id="tokenThreshold" name="tokenThreshold" type="number" placeholder="10000" required />
					</div>
					<div class="space-y-1.5">
						<Label for="description" class="text-xs">Description</Label>
						<Input id="description" name="description" placeholder="Premium tier" />
					</div>
				</div>
				<Button type="submit" size="sm" class="gap-2">
					<Plus class="h-4 w-4" />
					Add Group
				</Button>
			</form>
		</CardContent>
	</Card>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="text-base">User Groups ({data.groups.length})</CardTitle>
		</CardHeader>
		<CardContent class="p-3 pt-0">
			{#if data.groups.length > 0}
				<div class="space-y-2">
					{#each data.groups as group}
						<div class="flex items-center justify-between rounded-lg border border-border/40 p-3">
							<div>
								<p class="font-medium text-foreground">{group.name}</p>
								<p class="text-xs text-muted-foreground">Threshold: {group.tokenThreshold} tokens</p>
								{#if group.description}
									<p class="text-xs text-muted-foreground">{group.description}</p>
								{/if}
							</div>
							<form method="POST" action="?/deleteGroup" use:enhance>
								<input type="hidden" name="groupId" value={group.id} />
								<Button variant="ghost" size="sm" type="submit" class="text-destructive hover:text-destructive">
									<Trash2 class="h-4 w-4" />
								</Button>
							</form>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-center text-sm text-muted-foreground py-8">No groups configured</p>
			{/if}
		</CardContent>
	</Card>
</div>
