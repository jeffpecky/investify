<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { ArrowLeft } from 'lucide-svelte';

	let formData = $state({
		name: '',
		category: '',
		minAmount: '',
		maxAmount: '',
		durationDays: '',
		percentMin: '',
		percentMax: '',
		status: 'active',
		recommended: false
	});
</script>

<svelte:head>
	<title>Create Plan - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div class="flex items-center gap-3">
		<a href="/admin/plans">
			<Button variant="ghost" size="icon" class="h-8 w-8">
				<ArrowLeft class="h-4 w-4" />
			</Button>
		</a>
		<div>
			<h1 class="text-2xl font-semibold text-foreground">Create Investment Plan</h1>
			<p class="mt-1 text-sm text-muted-foreground">Add a new investment plan to the platform</p>
		</div>
	</div>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="text-base">Plan Details</CardTitle>
		</CardHeader>
		<CardContent class="p-3 pt-0">
			<form class="space-y-3">
				<div class="grid gap-3 md:grid-cols-2">
					<div class="space-y-1.5">
						<Label for="name" class="text-xs">Plan Name</Label>
						<Input id="name" name="name" placeholder="e.g., Gold Plan" bind:value={formData.name} required class="h-9" />
					</div>
					<div class="space-y-1.5">
						<Label for="category" class="text-xs">Category</Label>
						<Input id="category" name="category" placeholder="e.g., Premium" bind:value={formData.category} required class="h-9" />
					</div>
				</div>
				<div class="grid gap-3 md:grid-cols-2">
					<div class="space-y-1.5">
						<Label for="minAmount" class="text-xs">Minimum Amount ($)</Label>
						<Input id="minAmount" name="minAmount" type="number" placeholder="1000" bind:value={formData.minAmount} required class="h-9" />
					</div>
					<div class="space-y-1.5">
						<Label for="maxAmount" class="text-xs">Maximum Amount ($)</Label>
						<Input id="maxAmount" name="maxAmount" type="number" placeholder="10000" bind:value={formData.maxAmount} required class="h-9" />
					</div>
				</div>
				<div class="grid gap-3 md:grid-cols-3">
					<div class="space-y-1.5">
						<Label for="durationDays" class="text-xs">Duration (Days)</Label>
						<Input id="durationDays" name="durationDays" type="number" placeholder="30" bind:value={formData.durationDays} required class="h-9" />
					</div>
					<div class="space-y-1.5">
						<Label for="percentMin" class="text-xs">Min ROI (%)</Label>
						<Input id="percentMin" name="percentMin" type="number" step="0.01" placeholder="5.00" bind:value={formData.percentMin} required class="h-9" />
					</div>
					<div class="space-y-1.5">
						<Label for="percentMax" class="text-xs">Max ROI (%)</Label>
						<Input id="percentMax" name="percentMax" type="number" step="0.01" placeholder="15.00" bind:value={formData.percentMax} required class="h-9" />
					</div>
				</div>
				<div class="flex items-center gap-2">
					<input type="checkbox" id="recommended" name="recommended" bind:checked={formData.recommended} class="h-3.5 w-3.5" />
					<Label for="recommended" class="text-xs">Mark as Recommended</Label>
				</div>
				<div class="flex gap-2 border-t border-border/30 pt-3">
					<Button type="submit" size="sm">Create Plan</Button>
					<a href="/admin/plans">
						<Button variant="outline" size="sm">Cancel</Button>
					</a>
				</div>
			</form>
		</CardContent>
	</Card>
</div>
