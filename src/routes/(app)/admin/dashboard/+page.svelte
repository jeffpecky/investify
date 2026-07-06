<script lang="ts">
	import StatCard from '$lib/components/StatCard.svelte';
	import { Users, TrendingUp, DollarSign, AlertCircle, CheckCircle, Sparkles } from 'lucide-svelte';
	import { formatCurrency, formatNumber } from '$lib/utils';
	import { Badge } from '$lib/components/ui/badge';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date | null) {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>Admin Dashboard</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<!-- Welcome Banner -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
			<p class="mt-1 text-sm text-muted-foreground">Platform overview and recent activity</p>
		</div>
	</div>

	<!-- Stat Cards — 2x3 grid -->
	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<StatCard title="Total Users" number={formatNumber(data.stats.totalUsers)}>
			{#snippet icon()}
				<Users class="h-4 w-4" />
			{/snippet}
		</StatCard>
		<StatCard title="Total Investments" number={formatCurrency(data.stats.totalInvestments)}>
			{#snippet icon()}
				<DollarSign class="h-4 w-4" />
			{/snippet}
		</StatCard>
		<StatCard title="Active Investments" number={formatNumber(data.stats.activeInvestments)}>
			{#snippet icon()}
				<CheckCircle class="h-4 w-4" />
			{/snippet}
		</StatCard>
		<StatCard title="Pending Investments" number={formatNumber(data.stats.pendingInvestments)}>
			{#snippet icon()}
				<AlertCircle class="h-4 w-4" />
			{/snippet}
		</StatCard>
		<StatCard title="Pending Withdrawals" number={formatNumber(data.stats.pendingWithdrawals)}>
			{#snippet icon()}
				<AlertCircle class="h-4 w-4" />
			{/snippet}
		</StatCard>
		<StatCard title="Total Plans" number={formatNumber(data.stats.totalPlans)}>
			{#snippet icon()}
				<Sparkles class="h-4 w-4" />
			{/snippet}
		</StatCard>
	</div>

	<!-- Recent Activity Section -->
	<div class="grid gap-4 lg:grid-cols-2">
		<!-- Recent Users -->
		<Card>
			<CardHeader>
				<CardTitle>Recent Users</CardTitle>
			</CardHeader>
			<CardContent>
				{#if data.recentUsers.length > 0}
					<div class="space-y-3">
						{#each data.recentUsers as user}
							<a 
								href="/admin/users/{user.id}" 
								class="flex items-center justify-between rounded-lg border border-border/40 p-3 transition-all hover:border-primary/30 hover:bg-accent/50"
							>
								<div>
									<p class="font-medium text-foreground">
										{user.firstName || ''} {user.lastName || ''}
									</p>
									<p class="text-sm text-muted-foreground">{user.email}</p>
								</div>
								<div class="text-right">
									<Badge variant="secondary">{user.role}</Badge>
									<p class="mt-1 text-xs text-muted-foreground">
										{formatDate(user.createdAt)}
									</p>
								</div>
							</a>
						{/each}
					</div>
				{:else}
					<p class="text-sm text-muted-foreground">No users yet</p>
				{/if}
			</CardContent>
		</Card>

		<!-- Recent Investments -->
		<Card>
			<CardHeader>
				<CardTitle>Recent Investments</CardTitle>
			</CardHeader>
			<CardContent>
				{#if data.recentInvestments.length > 0}
					<div class="space-y-3">
						{#each data.recentInvestments as investment}
							<a 
								href="/admin/investments/{investment.id}" 
								class="flex items-center justify-between rounded-lg border border-border/40 p-3 transition-all hover:border-primary/30 hover:bg-accent/50"
							>
								<div>
									<p class="font-medium text-foreground">
										{investment.user?.firstName || ''} {investment.user?.lastName || ''}
									</p>
									<p class="text-sm text-muted-foreground">{investment.plan?.name || 'Unknown Plan'}</p>
								</div>
								<div class="text-right">
									<p class="font-semibold text-foreground">{formatCurrency(Number(investment.amount))}</p>
									<Badge variant={investment.status === 'active' ? 'default' : 'secondary'} class="mt-1">
										{investment.status}
									</Badge>
								</div>
							</a>
						{/each}
					</div>
				{:else}
					<p class="text-sm text-muted-foreground">No investments yet</p>
				{/if}
			</CardContent>
		</Card>
	</div>
</div>
