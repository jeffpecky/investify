<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { formatCurrency } from '$lib/utils';
	import { Plus, Sparkles, Edit, Trash2 } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function getStatusBadgeVariant(status: string) {
		if (status === 'active') return 'default';
		if (status === 'inactive') return 'secondary';
		return 'outline';
	}
</script>

<svelte:head>
	<title>Plans - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-semibold text-foreground">Investment Plans</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Manage all investment plans ({data.plans.length} total)
			</p>
		</div>
		<a href="/admin/plans/create">
			<Button class="gap-2">
				<Plus class="h-4 w-4" />
				Create Plan
			</Button>
		</a>
	</div>

	<!-- Plans Grid -->
	{#if data.plans.length > 0}
		<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.plans as plan}
				<Card>
					<CardHeader>
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<CardTitle class="text-lg">{plan.name}</CardTitle>
								<p class="mt-1 text-sm text-muted-foreground">{plan.category}</p>
							</div>
							{#if plan.recommended}
								<Badge variant="default" class="gap-1">
									<Sparkles class="h-3 w-3" />
									Recommended
								</Badge>
							{/if}
						</div>
					</CardHeader>
					<CardContent class="space-y-4">
						<div class="space-y-2">
							<div class="flex items-center justify-between">
								<span class="text-sm text-muted-foreground">Amount Range</span>
								<span class="font-medium">
									{formatCurrency(Number(plan.minAmount))} - {formatCurrency(Number(plan.maxAmount))}
								</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-sm text-muted-foreground">ROI Range</span>
								<span class="font-medium text-success">
									{plan.percentMin}% - {plan.percentMax}%
								</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-sm text-muted-foreground">Duration</span>
								<span class="font-medium">{plan.durationDays} days</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-sm text-muted-foreground">Status</span>
								<Badge variant={getStatusBadgeVariant(plan.status)}>{plan.status}</Badge>
							</div>
						</div>

						<div class="flex gap-2 border-t pt-4">
							<a href="/admin/plans/{plan.id}/edit" class="flex-1">
								<Button variant="outline" size="sm" class="w-full gap-1">
									<Edit class="h-4 w-4" />
									Edit
								</Button>
							</a>
							<Button variant="ghost" size="sm" class="gap-1 text-destructive">
								<Trash2 class="h-4 w-4" />
							</Button>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	{:else}
		<Card>
			<CardContent class="flex flex-col items-center justify-center py-12">
				<Sparkles class="h-12 w-12 text-muted-foreground" />
				<p class="mt-4 text-sm text-muted-foreground">No plans created yet</p>
				<a href="/admin/plans/create" class="mt-4">
					<Button>Create First Plan</Button>
				</a>
			</CardContent>
		</Card>
	{/if}
</div>
