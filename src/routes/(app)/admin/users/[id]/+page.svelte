<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { formatCurrency, formatNumber } from '$lib/utils';
	import { Mail, Phone, MapPin, Calendar, TrendingUp, Wallet, ArrowDownToLine, Shield } from 'lucide-svelte';
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

	function formatDate(date: Date | null) {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function getStatusBadgeVariant(status: string) {
		if (status === 'active' || status === 'approved') return 'default';
		if (status === 'pending') return 'secondary';
		if (status === 'rejected' || status === 'cancelled') return 'destructive';
		return 'outline';
	}
</script>

<svelte:head>
	<title>{data.user.email} - Users - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
		<div>
			<h1 class="text-2xl font-semibold text-foreground">
				{data.user.firstName || ''} {data.user.lastName || ''}
			</h1>
			<p class="mt-1 text-sm text-muted-foreground">{data.user.email}</p>
		</div>
		<div class="flex gap-2">
			<Button variant="outline">Edit User</Button>
			<Button variant="destructive">Suspend</Button>
		</div>
	</div>

	<!-- User Overview -->
	<div class="grid gap-4 md:grid-cols-3">
		<Card>
			<CardHeader>
				<CardTitle class="text-sm font-medium">Wallet Balance</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-2xl font-bold">{formatCurrency(Number(data.user.walletBalance))}</p>
			</CardContent>
		</Card>
		<Card>
			<CardHeader>
				<CardTitle class="text-sm font-medium">Token Balance</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-2xl font-bold">{formatNumber(Number(data.user.tokenBalance))} TKN</p>
			</CardContent>
		</Card>
		<Card>
			<CardHeader>
				<CardTitle class="text-sm font-medium">Total Investments</CardTitle>
			</CardHeader>
			<CardContent>
				<p class="text-2xl font-bold">{data.investments.length}</p>
			</CardContent>
		</Card>
	</div>

	<!-- User Details -->
	<Card>
		<CardHeader>
			<CardTitle>User Information</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			<div class="grid gap-4 md:grid-cols-2">
				<div class="space-y-3">
					<div class="flex items-center gap-2">
						<Mail class="h-4 w-4 text-muted-foreground" />
						<span class="text-sm text-muted-foreground">Email:</span>
						<span class="text-sm font-medium">{data.user.email}</span>
					</div>
					{#if data.user.phone}
						<div class="flex items-center gap-2">
							<Phone class="h-4 w-4 text-muted-foreground" />
							<span class="text-sm text-muted-foreground">Phone:</span>
							<span class="text-sm font-medium">{data.user.phone}</span>
						</div>
					{/if}
					<div class="flex items-center gap-2">
						<Calendar class="h-4 w-4 text-muted-foreground" />
						<span class="text-sm text-muted-foreground">Joined:</span>
						<span class="text-sm font-medium">{formatDate(data.user.createdAt)}</span>
					</div>
				</div>
				<div class="space-y-3">
					<div class="flex items-center gap-2">
						<span class="text-sm text-muted-foreground">Role:</span>
						<Badge>{data.user.role}</Badge>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-sm text-muted-foreground">KYC Status:</span>
						<Badge variant={getStatusBadgeVariant(data.user.kycStatus)}>{data.user.kycStatus}</Badge>
					</div>
					{#if data.user.group}
						<div class="flex items-center gap-2">
							<span class="text-sm text-muted-foreground">Group:</span>
							<Badge variant="outline">{data.user.group}</Badge>
						</div>
					{/if}
				</div>
			</div>
			{#if data.user.address}
				<div class="flex items-start gap-2 border-t pt-3">
					<MapPin class="h-4 w-4 text-muted-foreground" />
					<div>
						<span class="text-sm text-muted-foreground">Address:</span>
						<p class="text-sm font-medium">
							{data.user.address}
							{#if data.user.city}, {data.user.city}{/if}
							{#if data.user.state}, {data.user.state}{/if}
							{#if data.user.zipCode} {data.user.zipCode}{/if}
							{#if data.user.country}, {data.user.country}{/if}
						</p>
					</div>
				</div>
			{/if}
		</CardContent>
	</Card>

	<!-- Investments -->
	<Card>
		<CardHeader>
			<div class="flex items-center justify-between">
				<CardTitle>Investments</CardTitle>
				<TrendingUp class="h-4 w-4 text-muted-foreground" />
			</div>
		</CardHeader>
		<CardContent>
			{#if data.investments.length > 0}
				<div class="space-y-3">
					{#each data.investments as investment}
						<a 
							href="/admin/investments/{investment.id}"
							class="flex items-center justify-between rounded-lg border border-border/40 p-3 transition-all hover:border-primary/30 hover:bg-accent/50"
						>
							<div>
								<p class="font-medium text-foreground">{investment.plan?.name || 'Unknown Plan'}</p>
								<p class="text-sm text-muted-foreground">{formatDate(investment.createdAt)}</p>
							</div>
							<div class="text-right">
								<p class="font-semibold text-foreground">{formatCurrency(Number(investment.amount))}</p>
								<Badge variant={getStatusBadgeVariant(investment.status)} class="mt-1">
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

	<!-- Wallets -->
	<Card>
		<CardHeader>
			<div class="flex items-center justify-between">
				<CardTitle>Wallets</CardTitle>
				<Wallet class="h-4 w-4 text-muted-foreground" />
			</div>
		</CardHeader>
		<CardContent>
			{#if data.wallets.length > 0}
				<div class="space-y-3">
					{#each data.wallets as wallet}
						<div class="rounded-lg border border-border/40 p-3">
							<div class="flex items-center justify-between">
								<div>
									<p class="font-medium text-foreground">{wallet.name}</p>
									<p class="text-sm text-muted-foreground">{wallet.cryptocurrency}</p>
								</div>
								<Badge variant="outline">{wallet.cryptocurrency}</Badge>
							</div>
							<p class="mt-2 truncate text-xs text-muted-foreground">{wallet.address}</p>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-muted-foreground">No wallets configured</p>
			{/if}
		</CardContent>
	</Card>

	<!-- Recent Withdrawals -->
	<Card>
		<CardHeader>
			<div class="flex items-center justify-between">
				<CardTitle>Recent Withdrawals</CardTitle>
				<ArrowDownToLine class="h-4 w-4 text-muted-foreground" />
			</div>
		</CardHeader>
		<CardContent>
			{#if data.withdrawals.length > 0}
				<div class="space-y-3">
					{#each data.withdrawals as withdrawal}
						<div class="flex items-center justify-between rounded-lg border border-border/40 p-3">
							<div>
								<p class="font-medium text-foreground">{formatCurrency(Number(withdrawal.amount))}</p>
								<p class="text-sm text-muted-foreground">{withdrawal.cryptoSymbol}</p>
							</div>
							<div class="text-right">
								<Badge variant={getStatusBadgeVariant(withdrawal.status)}>
									{withdrawal.status}
								</Badge>
								<p class="mt-1 text-xs text-muted-foreground">{formatDate(withdrawal.createdAt)}</p>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-muted-foreground">No withdrawals yet</p>
			{/if}
		</CardContent>
	</Card>

	<!-- KYC Documents -->
	<Card>
		<CardHeader>
			<div class="flex items-center justify-between">
				<CardTitle>KYC Documents</CardTitle>
				<Shield class="h-4 w-4 text-muted-foreground" />
			</div>
		</CardHeader>
		<CardContent>
			{#if data.kycDocuments.length > 0}
				<div class="space-y-3">
					{#each data.kycDocuments as doc}
						<div class="flex items-center justify-between rounded-lg border border-border/40 p-3">
							<div>
								<p class="font-medium text-foreground">{doc.documentType}</p>
								<p class="text-sm text-muted-foreground">{formatDate(doc.createdAt)}</p>
							</div>
							<Badge variant={getStatusBadgeVariant(doc.status)}>
								{doc.status}
							</Badge>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-muted-foreground">No KYC documents submitted</p>
			{/if}
		</CardContent>
	</Card>
</div>
