<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { formatCurrency } from '$lib/utils';
	import { Users, TrendingUp, ArrowDownToLine, Wallet, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-svelte';
	import AnalyticsChart from '$lib/components/admin/AnalyticsChart.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const analytics = data.analytics;

	function getStatusBadgeVariant(status: string) {
		if (status === 'active') return 'default';
		if (status === 'pending') return 'secondary';
		if (status === 'completed') return 'outline';
		return 'outline';
	}

	const statCards = [
		{
			title: 'Total Users',
			value: analytics.users.total.toLocaleString(),
			subtitle: `${analytics.users.new} new (${analytics.users.growthRate}%)`,
			icon: Users,
			color: 'text-blue-500',
			bg: 'bg-blue-500/10'
		},
		{
			title: 'Total Investments',
			value: formatCurrency(analytics.investments.totalAmount),
			subtitle: `${analytics.investments.active} active, ${analytics.investments.completed} completed`,
			icon: TrendingUp,
			color: 'text-emerald-500',
			bg: 'bg-emerald-500/10'
		},
		{
			title: 'Pending Withdrawals',
			value: analytics.withdrawals.pending.toString(),
			subtitle: `${formatCurrency(analytics.withdrawals.totalAmount)} total withdrawn`,
			icon: ArrowDownToLine,
			color: 'text-amber-500',
			bg: 'bg-amber-500/10'
		},
		{
			title: 'Total Payouts',
			value: formatCurrency(analytics.payouts.totalPaid),
			subtitle: `${analytics.payouts.count} payouts processed`,
			icon: Wallet,
			color: 'text-purple-500',
			bg: 'bg-purple-500/10'
		}
	];

	// Prepare chart data from server
	const investmentTrendLabels = analytics.charts.investmentTrend.map((d: any) => {
		const date = new Date(d.date);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	});
	const investmentTrendData = analytics.charts.investmentTrend.map((d: any) => Number(d.amount));

	const planLabels = analytics.charts.planDistribution.map((p: any) => p.planName || 'Unknown');
	const planCounts = analytics.charts.planDistribution.map((p: any) => p.count);
	const planAmounts = analytics.charts.planDistribution.map((p: any) => Number(p.totalAmount));
</script>

<svelte:head>
	<title>Analytics - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-semibold text-foreground">Analytics</h1>
			<p class="mt-1 text-sm text-muted-foreground">Platform metrics and insights</p>
		</div>
		<div class="flex items-center gap-2">
			{#each ['7d', '30d', '90d', '1y'] as range}
				<a href="?range={range}">
					<Button
						variant={data.timeRange === range ? 'default' : 'outline'}
						size="sm"
					>
						{range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : range === '90d' ? '90 Days' : '1 Year'}
					</Button>
				</a>
			{/each}
		</div>
	</div>

	<!-- Stat Cards -->
	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
		{#each statCards as card}
			<Card class="border-border/50">
				<CardContent class="p-3">
					<div class="flex items-center justify-between">
						<div class="space-y-1">
							<p class="text-sm font-medium text-muted-foreground">{card.title}</p>
							<p class="text-2xl font-bold tabular-nums text-foreground">{card.value}</p>
							<p class="text-xs text-muted-foreground">{card.subtitle}</p>
						</div>
						<div class="flex h-10 w-10 items-center justify-center rounded-full {card.bg}">
							<card.icon class="h-5 w-5 {card.color}" />
						</div>
					</div>
				</CardContent>
			</Card>
		{/each}
	</div>

	<!-- Charts Row -->
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
		<!-- Investment Trend Line Chart -->
		<Card class="border-border/50 lg:col-span-2">
			<CardHeader class="pb-2">
				<CardTitle class="flex items-center gap-2 text-base">
					<TrendingUp class="h-4 w-4" />
					Investment Trend
				</CardTitle>
			</CardHeader>
			<CardContent class="p-3 pt-0">
				{#if investmentTrendData.length > 0}
					<AnalyticsChart
						type="line"
						labels={investmentTrendLabels}
						datasets={[{
							label: 'Investments',
							data: investmentTrendData,
							fill: true,
							tension: 0.4,
						}]}
						height={280}
						currency={true}
					/>
				{:else}
					<div class="flex h-[280px] items-center justify-center">
						<p class="text-sm text-muted-foreground">No investment data for this period</p>
					</div>
				{/if}
			</CardContent>
		</Card>

		<!-- Plan Distribution Doughnut -->
		<Card class="border-border/50">
			<CardHeader class="pb-2">
				<CardTitle class="flex items-center gap-2 text-base">
					<BarChart3 class="h-4 w-4" />
					Plan Distribution
				</CardTitle>
			</CardHeader>
			<CardContent class="p-3 pt-0">
				{#if planLabels.length > 0}
					<AnalyticsChart
						type="doughnut"
						labels={planLabels}
						datasets={[{
							label: 'Investments',
							data: planCounts,
						}]}
						height={280}
					/>
				{:else}
					<div class="flex h-[280px] items-center justify-center">
						<p class="text-sm text-muted-foreground">No plan data available</p>
					</div>
				{/if}
			</CardContent>
		</Card>
	</div>

	<!-- Second Row -->
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<!-- Plan Revenue Bar Chart -->
		<Card class="border-border/50">
			<CardHeader class="pb-2">
				<CardTitle class="flex items-center gap-2 text-base">
					<BarChart3 class="h-4 w-4" />
					Revenue by Plan
				</CardTitle>
			</CardHeader>
			<CardContent class="p-3 pt-0">
				{#if planAmounts.length > 0}
					<AnalyticsChart
						type="bar"
						labels={planLabels}
						datasets={[{
							label: 'Revenue',
							data: planAmounts,
						}]}
						height={250}
						currency={true}
					/>
				{:else}
					<div class="flex h-[250px] items-center justify-center">
						<p class="text-sm text-muted-foreground">No revenue data available</p>
					</div>
				{/if}
			</CardContent>
		</Card>

		<!-- Revenue Summary -->
		<Card class="border-border/50">
			<CardHeader class="pb-2">
				<CardTitle class="flex items-center gap-2 text-base">
					<BarChart3 class="h-4 w-4" />
					Revenue Summary
				</CardTitle>
			</CardHeader>
			<CardContent class="space-y-3 p-3 pt-0">
				<div class="flex items-center justify-between rounded-lg bg-muted/30 p-3">
					<div>
						<p class="text-sm text-muted-foreground">Total Investment Volume</p>
						<p class="text-xl font-bold tabular-nums text-foreground">{formatCurrency(analytics.revenue.total)}</p>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-3">
					<div class="rounded-lg border border-border/50 p-3">
						<p class="text-xs text-muted-foreground">Total Profit Accrued</p>
						<p class="text-lg font-bold tabular-nums text-foreground">{formatCurrency(analytics.revenue.profit)}</p>
					</div>
					<div class="rounded-lg border border-border/50 p-3">
						<p class="text-xs text-muted-foreground">Profit Margin</p>
						<p class="text-lg font-bold tabular-nums text-foreground">{analytics.revenue.margin}%</p>
					</div>
				</div>
				<div class="rounded-lg border border-border/50 p-3">
					<p class="text-xs text-muted-foreground mb-2">Active vs Completed</p>
					<div class="flex items-center gap-4">
						<div class="flex items-center gap-1.5">
							<div class="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
							<span class="text-sm">{analytics.investments.active} Active</span>
						</div>
						<div class="flex items-center gap-1.5">
							<div class="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
							<span class="text-sm">{analytics.investments.completed} Completed</span>
						</div>
					</div>
				</div>
				<div class="rounded-lg border border-border/50 p-3">
					<p class="text-xs text-muted-foreground mb-2">User Growth</p>
					<div class="flex items-center gap-2">
						<span class="text-lg font-bold tabular-nums text-foreground">{analytics.users.total}</span>
						<span class="text-sm text-muted-foreground">total users</span>
						<Badge variant="secondary" class="text-xs">{analytics.users.growthRate}%</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	</div>

	<!-- Withdrawals Activity -->
	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="flex items-center gap-2 text-base">
				<ArrowDownToLine class="h-4 w-4" />
				Withdrawal Activity ({data.timeRange})
			</CardTitle>
		</CardHeader>
		<CardContent class="p-3 pt-0">
			<div class="grid grid-cols-3 gap-3">
				<div class="rounded-lg border border-border/50 p-3 text-center">
					<p class="text-xs text-muted-foreground">Total Withdrawn</p>
					<p class="text-lg font-bold tabular-nums text-foreground">{formatCurrency(analytics.withdrawals.totalAmount)}</p>
				</div>
				<div class="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-center">
					<p class="text-xs text-muted-foreground">Pending</p>
					<p class="text-lg font-bold tabular-nums text-amber-600 dark:text-amber-400">{analytics.withdrawals.pending}</p>
				</div>
				<div class="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
					<p class="text-xs text-muted-foreground">Completed</p>
					<p class="text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400">{analytics.withdrawals.completed}</p>
				</div>
			</div>
		</CardContent>
	</Card>
</div>
