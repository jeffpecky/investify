<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { formatCurrency } from '$lib/utils';
	import { Users, TrendingUp, ArrowDownToLine, Wallet, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-svelte';
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
			value: analytics.users.total,
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
			value: analytics.withdrawals.pending,
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
</script>

<svelte:head>
	<title>Analytics - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Analytics</h1>
		<p class="mt-1 text-sm text-muted-foreground">Platform metrics and insights</p>
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

	<!-- Revenue & Plan Distribution -->
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
					<p class="text-xs text-muted-foreground">Active vs Completed Investments</p>
					<div class="mt-2 flex items-center gap-3">
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
			</CardContent>
		</Card>

		<!-- Plan Distribution -->
		<Card class="border-border/50">
			<CardHeader class="pb-2">
				<CardTitle class="flex items-center gap-2 text-base">
					<TrendingUp class="h-4 w-4" />
					Plan Distribution
				</CardTitle>
			</CardHeader>
			<CardContent class="space-y-3 p-3 pt-0">
				{#if analytics.charts.planDistribution.length === 0}
					<p class="py-4 text-center text-sm text-muted-foreground">No plan data available</p>
				{:else}
					{#each analytics.charts.planDistribution as plan, i}
						{@const totalAmount = Number(plan.totalAmount)}
						{@const maxAmount = Math.max(...analytics.charts.planDistribution.map((p: any) => Number(p.totalAmount)))}
						{@const barWidth = maxAmount > 0 ? (totalAmount / maxAmount) * 100 : 0}
						<div class="space-y-1.5">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-2">
									<span class="text-sm font-medium text-foreground">{plan.planName || 'Unknown'}</span>
									<Badge variant="secondary" class="text-xs">{plan.count} investments</Badge>
								</div>
								<span class="text-sm tabular-nums text-muted-foreground">{formatCurrency(totalAmount)}</span>
							</div>
							<div class="h-1.5 overflow-hidden rounded-full bg-muted/50">
								<div class="h-full rounded-full bg-primary/60 transition-all" style="width: {barWidth}%"></div>
							</div>
						</div>
					{/each}
				{/if}
			</CardContent>
		</Card>
	</div>

	<!-- Investment Trend -->
	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="flex items-center gap-2 text-base">
				<TrendingUp class="h-4 w-4" />
				Investment Trend ({data.timeRange})
			</CardTitle>
		</CardHeader>
		<CardContent class="p-3 pt-0">
			{#if analytics.charts.investmentTrend.length === 0}
				<p class="py-4 text-center text-sm text-muted-foreground">No investment data for this period</p>
			{:else}
				<div class="overflow-x-auto">
					<table class="w-full">
						<thead>
							<tr class="border-b border-border/30">
								<th class="px-3 py-2 text-left text-xs font-medium text-muted-foreground">Date</th>
								<th class="px-3 py-2 text-right text-xs font-medium text-muted-foreground">Amount</th>
							</tr>
						</thead>
						<tbody class="divide-y divide-border/20">
							{#each analytics.charts.investmentTrend as day}
								<tr class="hover:bg-muted/20">
									<td class="px-3 py-2 text-sm text-foreground">{day.date}</td>
									<td class="px-3 py-2 text-right text-sm tabular-nums font-medium text-foreground">{formatCurrency(Number(day.amount))}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</CardContent>
	</Card>

	<!-- Withdrawals Summary -->
	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="flex items-center gap-2 text-base">
				<ArrowDownToLine class="h-4 w-4" />
				Withdrawal Activity
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
