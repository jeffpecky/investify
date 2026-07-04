<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Plus, Trash2, Edit } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let newGroup = $state({
		name: '',
		tokenThreshold: '',
		description: ''
	});
</script>

<svelte:head>
	<title>User Groups - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">User Groups</h1>
		<p class="mt-1 text-sm text-muted-foreground">Manage user groups based on token balance</p>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Add New Group</CardTitle>
		</CardHeader>
		<CardContent>
			<form class="space-y-4">
				<div class="grid gap-4 md:grid-cols-3">
					<div class="space-y-2">
						<Label for="name">Group Name</Label>
						<Input id="name" placeholder="Gold" bind:value={newGroup.name} required />
					</div>
					<div class="space-y-2">
						<Label for="tokenThreshold">Token Threshold</Label>
						<Input id="tokenThreshold" type="number" placeholder="10000" bind:value={newGroup.tokenThreshold} required />
					</div>
					<div class="space-y-2">
						<Label for="description">Description</Label>
						<Input id="description" placeholder="Premium tier" bind:value={newGroup.description} />
					</div>
				</div>
				<Button type="submit" class="gap-2">
					<Plus class="h-4 w-4" />
					Add Group
				</Button>
			</form>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>User Groups ({data.groups.length})</CardTitle>
		</CardHeader>
		<CardContent>
			{#if data.groups.length > 0}
				<div class="space-y-3">
					{#each data.groups as group}
						<div class="flex items-center justify-between rounded-lg border border-border/40 p-4">
							<div>
								<p class="font-medium text-foreground">{group.name}</p>
								<p class="text-sm text-muted-foreground">Threshold: {group.tokenThreshold} tokens</p>
								{#if group.description}
									<p class="text-xs text-muted-foreground">{group.description}</p>
								{/if}
							</div>
							<div class="flex gap-2">
								<Button variant="ghost" size="sm">
									<Edit class="h-4 w-4" />
								</Button>
								<Button variant="ghost" size="sm" class="text-destructive">
									<Trash2 class="h-4 w-4" />
								</Button>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-center text-sm text-muted-foreground py-8">No groups configured</p>
			{/if}

			<div class="mt-6 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
				<p class="text-sm text-yellow-700 dark:text-yellow-300">
					<strong>TODO:</strong> Implement CRUD actions
				</p>
			</div>
		</CardContent>
	</Card>
</div>
