<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { ArrowLeft } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData, form?: ActionData } = $props();

	// Show toast on form response
	$effect(() => {
		if (form?.success) {
			toast.success(form.message || 'Action completed successfully');
		} else if (form?.error) {
			toast.error(form.error || 'Action failed');
		}
	});

	let formData = $state({
		name: data.plan.name,
		category: data.plan.category,
		minAmount: data.plan.minAmount,
		maxAmount: data.plan.maxAmount,
		durationDays: data.plan.durationDays,
		percentMin: data.plan.percentMin,
		percentMax: data.plan.percentMax,
		status: data.plan.status,
		recommended: data.plan.recommended
	});
</script>

<svelte:head>
	<title>Edit {data.plan.name} - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a href="/admin/plans">
			<Button variant="ghost" size="icon">
				<ArrowLeft class="h-4 w-4" />
			</Button>
		</a>
		<div>
			<h1 class="text-2xl font-semibold text-foreground">Edit Plan: {data.plan.name}</h1>
			<p class="mt-1 text-sm text-muted-foreground">Update plan details and configuration</p>
		</div>
	</div>

	<!-- Form -->
	<Card>
		<CardHeader>
			<CardTitle>Plan Details</CardTitle>
		</CardHeader>
		<CardContent>
			<form class="space-y-6">
				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="name">Plan Name</Label>
						<Input id="name" bind:value={formData.name} required />
					</div>
					<div class="space-y-2">
						<Label for="category">Category</Label>
						<Input id="category" bind:value={formData.category} required />
					</div>
				</div>

				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="minAmount">Minimum Amount ($)</Label>
						<Input id="minAmount" type="number" bind:value={formData.minAmount} required />
					</div>
					<div class="space-y-2">
						<Label for="maxAmount">Maximum Amount ($)</Label>
						<Input id="maxAmount" type="number" bind:value={formData.maxAmount} required />
					</div>
				</div>

				<div class="grid gap-4 md:grid-cols-3">
					<div class="space-y-2">
						<Label for="durationDays">Duration (Days)</Label>
						<Input id="durationDays" type="number" bind:value={formData.durationDays} required />
					</div>
					<div class="space-y-2">
						<Label for="percentMin">Min ROI (%)</Label>
						<Input id="percentMin" type="number" step="0.01" bind:value={formData.percentMin} required />
					</div>
					<div class="space-y-2">
						<Label for="percentMax">Max ROI (%)</Label>
						<Input id="percentMax" type="number" step="0.01" bind:value={formData.percentMax} required />
					</div>
				</div>

				<div class="space-y-2">
					<Label for="status">Status</Label>
					<select id="status" bind:value={formData.status} class="w-full rounded-md border border-input bg-background px-3 py-2">
						<option value="active">Active</option>
						<option value="inactive">Inactive</option>
					</select>
				</div>

				<div class="flex items-center gap-2">
					<input type="checkbox" id="recommended" bind:checked={formData.recommended} class="h-4 w-4" />
					<Label for="recommended">Mark as Recommended</Label>
				</div>

				<div class="flex gap-2 border-t pt-4">
					<Button type="submit">Update Plan</Button>
					<a href="/admin/plans">
						<Button variant="outline">Cancel</Button>
					</a>
					<Button variant="destructive" class="ml-auto">Delete Plan</Button>
				</div>
			</form>

			<div class="mt-6 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
				<p class="text-sm text-yellow-700 dark:text-yellow-300">
					<strong>TODO:</strong> Form action handler needed
				</p>
			</div>
		</CardContent>
	</Card>
</div>
