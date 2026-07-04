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

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="flex items-center gap-4">
		<a href="/admin/plans">
			<Button variant="ghost" size="icon">
				<ArrowLeft class="h-4 w-4" />
			</Button>
		</a>
		<div>
			<h1 class="text-2xl font-semibold text-foreground">Create Investment Plan</h1>
			<p class="mt-1 text-sm text-muted-foreground">Add a new investment plan to the platform</p>
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
						<Input id="name" placeholder="e.g., Gold Plan" bind:value={formData.name} required />
					</div>
					<div class="space-y-2">
						<Label for="category">Category</Label>
						<Input id="category" placeholder="e.g., Premium" bind:value={formData.category} required />
					</div>
				</div>

				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="minAmount">Minimum Amount ($)</Label>
						<Input id="minAmount" type="number" placeholder="1000" bind:value={formData.minAmount} required />
					</div>
					<div class="space-y-2">
						<Label for="maxAmount">Maximum Amount ($)</Label>
						<Input id="maxAmount" type="number" placeholder="10000" bind:value={formData.maxAmount} required />
					</div>
				</div>

				<div class="grid gap-4 md:grid-cols-3">
					<div class="space-y-2">
						<Label for="durationDays">Duration (Days)</Label>
						<Input id="durationDays" type="number" placeholder="30" bind:value={formData.durationDays} required />
					</div>
					<div class="space-y-2">
						<Label for="percentMin">Min ROI (%)</Label>
						<Input id="percentMin" type="number" step="0.01" placeholder="5.00" bind:value={formData.percentMin} required />
					</div>
					<div class="space-y-2">
						<Label for="percentMax">Max ROI (%)</Label>
						<Input id="percentMax" type="number" step="0.01" placeholder="15.00" bind:value={formData.percentMax} required />
					</div>
				</div>

				<div class="flex items-center gap-2">
					<input type="checkbox" id="recommended" bind:checked={formData.recommended} class="h-4 w-4" />
					<Label for="recommended">Mark as Recommended</Label>
				</div>

				<div class="flex gap-2 border-t pt-4">
					<Button type="submit">Create Plan</Button>
					<a href="/admin/plans">
						<Button variant="outline">Cancel</Button>
					</a>
				</div>
			</form>

			<div class="mt-6 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
				<p class="text-sm text-yellow-700 dark:text-yellow-300">
					<strong>TODO:</strong> This form needs:
					<br />• Form action handler in +page.server.ts
					<br />• Payout options (daily, weekly, monthly)
					<br />• Features selection
					<br />• Referral levels configuration
				</p>
			</div>
		</CardContent>
	</Card>
</div>
