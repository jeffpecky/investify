<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { formatCurrency, formatNumber } from '$lib/utils';
	import { User, TrendingUp, Calendar, DollarSign, ArrowUpRight } from 'lucide-svelte';
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

	function formatDate(date: Date | string | null) {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function getStatusBadgeVariant(status: string) {
		if (status === 'active' || status === 'approved') return 'default';
		if (status === 'pending') return 'secondary';
		if (status === 'completed') return 'outline';
		if (status === 'rejected' || status === 'cancelled') return 'destructive';
		return 'outline';
	}
</script>

<svelte:head>
	<title>Investment #{data.investment.id.slice(0, 8)} - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div>
			<h1 class="text-2xl font-semibold text-foreground">
				Investment #{data.investment.id.slice(0, 8)}
			</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Created on {formatDate(data.investment.createdAt)}
			</p>
		</div>
		<div class="flex gap-2">
			{#if data.investment.status === 'pending'}
				<Button variant="default">Approve</Button>
				<Button variant="destructive">Reject</Button>
			{:else if data.investment.status === 'active'}
				<Button variant="outline">Complete</Button>
				<Button variant="destructive">Cancel</Button>
			{/if}
		</div>
	</div>

	<!-- Investment Overview -->
	<div class="grid gap-4 md:grid-cols-4">
		<Card>
			<CardHeader>
				<CardTitle class="text-sm font-medium">Amount</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-2xl font-bold">{formatCurrency(Number(data.investment.amount))}</p>
			</CardContent>
		</Card>
		<Card>
			<CardHeader>
				<CardTitle class="text-sm font-medium">Status</CardTitle>
			</CardHeader>
			<CardContent>
				<Badge variant={getStatusBadgeVariant(data.investment.status)} class="text-base">
					{data.investment.status}
				</Badge>
			</CardContent>
		</Card>
		<Card>
			<CardHeader>
				<CardTitle class="text-sm font-medium">Profit Accrued</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-2xl font-bold">{formatCurrency(Number(data.investment.profitAccrued))}</p>
			</CardContent>
		</Card>
		<Card>
			<CardHeader>
				<CardTitle class="text-sm font-medium">Expected Profit</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-2xl font-bold">{formatCurrency(Number(data.investment.totalExpectedProfit))}</p>
			</CardContent>
		</Card>
	</div>

	<!-- Investment Details -->
	<div class="grid gap-4 lg:grid-cols-2">
		<Card>
			<CardHeader>
				<CardTitle>Investment Details</CardTitle>
			</CardHeader>
			<CardContent class="space-y-3">
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Plan</span>
					<span class="font-medium">{data.investment.plan?.name || 'Unknown'}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Category</span>
					<Badge variant="outline">{data.investment.plan?.category || 'N/A'}</Badge>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Payment Method</span>
					<span class="font-medium">{data.investment.paymentMethod}</span>
				</div>
				{#if data.investment.cryptoSymbol}
					<div class="flex items-center justify-between">
						<span class="text-sm text-muted-foreground">Crypto</span>
						<span class="font-medium">{data.investment.cryptoSymbol} {data.investment.cryptoAmount || ''}</span>
					</div>
				{/if}
				{#if data.investment.transactionHash}
					<div class="flex items-start justify-between">
						<span class="text-sm text-muted-foreground">Tx Hash</span>
						<span class="truncate text-xs font-mono">{data.investment.transactionHash.slice(0, 16)}...</span>
					</div>
				{/if}
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Payout Option</span>
					<span class="font-medium">{data.investment.payoutOption}</span>
				</div>
			</CardContent>
		</Card>

		<Card>
			<CardHeader>
				<CardTitle>Timeline</CardTitle>
			</CardHeader>
			<CardContent class="space-y-3">
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Duration</span>
					<span class="font-medium">{data.investment.plan?.durationDays || 0} days</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Start Date</span>
					<span class="font-medium">{formatDate(data.investment.startDate)}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">End Date</span>
					<span class="font-medium">{formatDate(data.investment.endDate)}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Next Payout</span>
					<span class="font-medium">{formatDate(data.investment.nextPayoutDate)}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Created</span>
					<span class="font-medium">{formatDate(data.investment.createdAt)}</span>
				</div>
			</CardContent>
		</Card>
	</div>

	<!-- User Information -->
	<Card>
		<CardHeader>
			<div class="flex items-center justify-between">
				<CardTitle>Investor Information</CardTitle>
				<User class="h-4 w-4 text-muted-foreground" />
			</div>
		</CardHeader>
		<CardContent>
			<div class="flex items-center justify-between">
				<div>
					<p class="font-medium text-foreground">
						{data.investment.user?.firstName || ''} {data.investment.user?.lastName || ''}
					</p>
					<p class="text-sm text-muted-foreground">{data.investment.user?.email}</p>
				</div>
				<a href="/admin/users/{data.investment.user?.id}">
					<Button variant="ghost" size="sm" class="gap-1">
						View Profile
						<ArrowUpRight class="h-4 w-4" />
					</Button>
				</a>
			</div>
		</CardContent>
	</Card>

	<!-- Plan Details -->
	<Card>
		<CardHeader>
			<CardTitle>Plan Details</CardTitle>
		</CardHeader>
		<CardContent class="space-y-3">
			<div class="grid gap-3 md:grid-cols-2">
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Min Amount</span>
					<span class="font-medium">{formatCurrency(Number(data.investment.plan?.minAmount || 0))}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Max Amount</span>
					<span class="font-medium">{formatCurrency(Number(data.investment.plan?.maxAmount || 0))}</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">ROI Range</span>
					<span class="font-medium">{data.investment.plan?.percentMin}% - {data.investment.plan?.percentMax}%</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm text-muted-foreground">Duration</span>
					<span class="font-medium">{data.investment.plan?.durationDays || 0} days</span>
				</div>
			</div>
		</CardContent>
	</Card>

	<!-- Payouts -->
	<Card>
		<CardHeader>
			<div class="flex items-center justify-between">
				<CardTitle>Payout History</CardTitle>
				<DollarSign class="h-4 w-4 text-muted-foreground" />
			</div>
		</CardHeader>
		<CardContent>
			{#if data.payouts.length > 0}
				<div class="space-y-3">
					{#each data.payouts as payout}
						<div class="flex items-center justify-between rounded-lg border border-border/40 p-3">
							<div>
								<p class="font-medium text-foreground">{formatCurrency(Number(payout.payoutAmount))}</p>
								<p class="text-sm text-muted-foreground">{formatDate(payout.date)}</p>
							</div>
							<div class="text-right">
								<p class="text-sm font-medium text-success">+{payout.roiPercent}%</p>
								<Badge variant={getStatusBadgeVariant(payout.status)} class="mt-1">
									{payout.status}
								</Badge>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-muted-foreground">No payouts yet</p>
			{/if}
		</CardContent>
	</Card>
</div>
