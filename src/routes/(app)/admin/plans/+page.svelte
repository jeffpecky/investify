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

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-semibold text-foreground">Investment Plans</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Manage all investment plans ({data.plans.length} total)
			</p>
		</div>
		<a href="/admin/plans/create">
			<Button size="sm" class="gap-1.5">
				<Plus class="h-3.5 w-3.5" />
				Create Plan
			</Button>
		</a>
	</div>

	{#if data.plans.length > 0}
		<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each data.plans as plan}
				<Card class="border-border/50">
					<CardHeader class="pb-2">
						<div class="flex items-start justify-between">
							<div class="flex-1">
								<CardTitle class="text-base">{plan.name}</CardTitle>
								<p class="mt-0.5 text-xs text-muted-foreground">{plan.category}</p>
							</div>
							{#if plan.recommended}
								<Badge variant="default" class="gap-1 text-xs">
									<Sparkles class="h-3 w-3" />
									Recommended
								</Badge>
							{/if}
						</div>
					</CardHeader>
					<CardContent class="space-y-2.5 p-3 pt-0">
						<div class="space-y-1.5">
							<div class="flex items-center justify-between">
								<span class="text-xs text-muted-foreground">Amount Range</span>
								<span class="text-sm font-medium tabular-nums">
									{formatCurrency(Number(plan.minAmount))} - {formatCurrency(Number(plan.maxAmount))}
								</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-xs text-muted-foreground">ROI Range</span>
								<span class="text-sm font-medium text-success tabular-nums">
									{plan.percentMin}% - {plan.percentMax}%
								</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-xs text-muted-foreground">Duration</span>
								<span class="text-sm font-medium">{plan.durationDays} days</span>
							</div>
							<div class="flex items-center justify-between">
								<span class="text-xs text-muted-foreground">Status</span>
								<Badge variant={getStatusBadgeVariant(plan.status)} class="text-xs">{plan.status}</Badge>
							</div>
						</div>
						<div class="flex gap-1.5 border-t border-border/30 pt-2.5">
							<a href="/admin/plans/{plan.id}/edit" class="flex-1">
								<Button variant="outline" size="sm" class="w-full gap-1">
									<Edit class="h-3.5 w-3.5" />
									Edit
								</Button>
							</a>
							<Button variant="ghost" size="icon" class="h-8 w-8 text-destructive">
								<Trash2 class="h-3.5 w-3.5" />
							</Button>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>
	{:else}
		<Card class="border-border/50">
			<CardContent class="flex flex-col items-center justify-center py-10">
				<Sparkles class="h-10 w-10 text-muted-foreground" />
				<p class="mt-3 text-sm text-muted-foreground">No plans created yet</p>
				<a href="/admin/plans/create" class="mt-3">
					<Button size="sm">Create First Plan</Button>
				</a>
			</CardContent>
		</Card>
	{/if}
</div>
