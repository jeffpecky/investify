<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { formatCurrency, formatNumber } from '$lib/utils';
	import { Mail, Phone, MapPin, Calendar, TrendingUp, Wallet, ArrowDownToLine, Shield, ArrowLeft } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData, form?: ActionData } = $props();

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

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
		<div class="flex items-center gap-3">
			<a href="/admin/users">
				<Button variant="ghost" size="icon" class="h-8 w-8">
					<ArrowLeft class="h-4 w-4" />
				</Button>
			</a>
			<div>
				<h1 class="text-2xl font-semibold text-foreground">
					{data.user.firstName || ''} {data.user.lastName || ''}
				</h1>
				<p class="mt-0.5 text-sm text-muted-foreground">{data.user.email}</p>
			</div>
		</div>
		<div class="flex gap-1.5">
			<Button variant="outline" size="sm">Edit User</Button>
			<Button variant="destructive" size="sm">Suspend</Button>
		</div>
	</div>

	<div class="grid gap-3 md:grid-cols-3">
		<Card class="border-border/50">
			<CardContent class="p-3">
				<p class="text-xs text-muted-foreground">Wallet Balance</p>
				<p class="text-xl font-bold tabular-nums">{formatCurrency(Number(data.user.walletBalance))}</p>
			</CardContent>
		</Card>
		<Card class="border-border/50">
			<CardContent class="p-3">
				<p class="text-xs text-muted-foreground">Token Balance</p>
				<p class="text-xl font-bold tabular-nums">{formatNumber(Number(data.user.tokenBalance))} TKN</p>
			</CardContent>
		</Card>
		<Card class="border-border/50">
			<CardContent class="p-3">
				<p class="text-xs text-muted-foreground">Total Investments</p>
				<p class="text-xl font-bold tabular-nums">{data.investments.length}</p>
			</CardContent>
		</Card>
	</div>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="text-base">User Information</CardTitle>
		</CardHeader>
		<CardContent class="space-y-2.5 p-3 pt-0">
			<div class="grid gap-3 md:grid-cols-2">
				<div class="space-y-2">
					<div class="flex items-center gap-2">
						<Mail class="h-3.5 w-3.5 text-muted-foreground" />
						<span class="text-xs text-muted-foreground">Email:</span>
						<span class="text-sm font-medium">{data.user.email}</span>
					</div>
					{#if data.user.phone}
						<div class="flex items-center gap-2">
							<Phone class="h-3.5 w-3.5 text-muted-foreground" />
							<span class="text-xs text-muted-foreground">Phone:</span>
							<span class="text-sm font-medium">{data.user.phone}</span>
						</div>
					{/if}
					<div class="flex items-center gap-2">
						<Calendar class="h-3.5 w-3.5 text-muted-foreground" />
						<span class="text-xs text-muted-foreground">Joined:</span>
						<span class="text-sm font-medium">{formatDate(data.user.createdAt)}</span>
					</div>
				</div>
				<div class="space-y-2">
					<div class="flex items-center gap-2">
						<span class="text-xs text-muted-foreground">Role:</span>
						<Badge class="text-xs">{data.user.role}</Badge>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-xs text-muted-foreground">KYC Status:</span>
						<Badge variant={getStatusBadgeVariant(data.user.kycStatus)} class="text-xs">{data.user.kycStatus}</Badge>
					</div>
					{#if data.user.group}
						<div class="flex items-center gap-2">
							<span class="text-xs text-muted-foreground">Group:</span>
							<Badge variant="outline" class="text-xs">{data.user.group}</Badge>
						</div>
					{/if}
				</div>
			</div>
			{#if data.user.address}
				<div class="flex items-start gap-2 border-t border-border/30 pt-2.5">
					<MapPin class="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
					<div>
						<span class="text-xs text-muted-foreground">Address:</span>
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

	<div class="grid gap-4 lg:grid-cols-2">
		<Card class="border-border/50">
			<CardHeader class="pb-2">
				<div class="flex items-center justify-between">
					<CardTitle class="text-base">Investments</CardTitle>
					<TrendingUp class="h-4 w-4 text-muted-foreground" />
				</div>
			</CardHeader>
			<CardContent class="p-3 pt-0">
				{#if data.investments.length > 0}
					<div class="space-y-2">
						{#each data.investments as investment}
							<a
								href="/admin/investments/{investment.id}"
								class="flex items-center justify-between rounded-lg border border-border/40 p-2.5 transition-all hover:border-primary/30 hover:bg-accent/50"
							>
								<div>
									<p class="text-sm font-medium text-foreground">{investment.plan?.name || 'Unknown Plan'}</p>
									<p class="text-xs text-muted-foreground">{formatDate(investment.createdAt)}</p>
								</div>
								<div class="text-right">
									<p class="text-sm font-semibold tabular-nums text-foreground">{formatCurrency(Number(investment.amount))}</p>
									<Badge variant={getStatusBadgeVariant(investment.status)} class="mt-0.5 text-xs">
										{investment.status}
									</Badge>
								</div>
							</a>
						{/each}
					</div>
				{:else}
					<p class="py-4 text-center text-xs text-muted-foreground">No investments yet</p>
				{/if}
			</CardContent>
		</Card>

		<Card class="border-border/50">
			<CardHeader class="pb-2">
				<div class="flex items-center justify-between">
					<CardTitle class="text-base">Wallets</CardTitle>
					<Wallet class="h-4 w-4 text-muted-foreground" />
				</div>
			</CardHeader>
			<CardContent class="p-3 pt-0">
				{#if data.wallets.length > 0}
					<div class="space-y-2">
						{#each data.wallets as wallet}
							<div class="rounded-lg border border-border/40 p-2.5">
								<div class="flex items-center justify-between">
									<div>
										<p class="text-sm font-medium text-foreground">{wallet.name}</p>
										<p class="text-xs text-muted-foreground">{wallet.cryptocurrency}</p>
									</div>
									<Badge variant="outline" class="text-xs">{wallet.cryptocurrency}</Badge>
								</div>
								<p class="mt-1 truncate text-xs font-mono text-muted-foreground">{wallet.address}</p>
							</div>
						{/each}
					</div>
				{:else}
					<p class="py-4 text-center text-xs text-muted-foreground">No wallets configured</p>
				{/if}
			</CardContent>
		</Card>
	</div>

	<div class="grid gap-4 lg:grid-cols-2">
		<Card class="border-border/50">
			<CardHeader class="pb-2">
				<div class="flex items-center justify-between">
					<CardTitle class="text-base">Recent Withdrawals</CardTitle>
					<ArrowDownToLine class="h-4 w-4 text-muted-foreground" />
				</div>
			</CardHeader>
			<CardContent class="p-3 pt-0">
				{#if data.withdrawals.length > 0}
					<div class="space-y-2">
						{#each data.withdrawals as withdrawal}
							<div class="flex items-center justify-between rounded-lg border border-border/40 p-2.5">
								<div>
									<p class="text-sm font-medium tabular-nums">{formatCurrency(Number(withdrawal.amount))}</p>
									<p class="text-xs text-muted-foreground">{withdrawal.cryptoSymbol}</p>
								</div>
								<div class="text-right">
									<Badge variant={getStatusBadgeVariant(withdrawal.status)} class="text-xs">
										{withdrawal.status}
									</Badge>
									<p class="mt-0.5 text-xs text-muted-foreground">{formatDate(withdrawal.createdAt)}</p>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<p class="py-4 text-center text-xs text-muted-foreground">No withdrawals yet</p>
				{/if}
			</CardContent>
		</Card>

		<Card class="border-border/50">
			<CardHeader class="pb-2">
				<div class="flex items-center justify-between">
					<CardTitle class="text-base">KYC Documents</CardTitle>
					<Shield class="h-4 w-4 text-muted-foreground" />
				</div>
			</CardHeader>
			<CardContent class="p-3 pt-0">
				{#if data.kycDocuments.length > 0}
					<div class="space-y-2">
						{#each data.kycDocuments as doc}
							<div class="flex items-center justify-between rounded-lg border border-border/40 p-2.5">
								<div>
									<p class="text-sm font-medium text-foreground">{doc.documentType}</p>
									<p class="text-xs text-muted-foreground">{formatDate(doc.createdAt)}</p>
								</div>
								<Badge variant={getStatusBadgeVariant(doc.status)} class="text-xs">
									{doc.status}
								</Badge>
							</div>
						{/each}
					</div>
				{:else}
					<p class="py-4 text-center text-xs text-muted-foreground">No KYC documents submitted</p>
				{/if}
			</CardContent>
		</Card>
	</div>
</div>
