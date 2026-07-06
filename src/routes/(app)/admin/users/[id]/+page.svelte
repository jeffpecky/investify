<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { formatCurrency, formatNumber } from '$lib/utils';
	import { Mail, Phone, MapPin, Calendar, TrendingUp, Wallet, ArrowDownToLine, Shield, ArrowLeft, Pencil, Check, X } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData, form?: ActionData } = $props();

	let editingWallet = $state(false);
	let editingToken = $state(false);
	let walletValue = $state(data.viewedUser.walletBalance?.toString() || '0');
	let tokenValue = $state(data.viewedUser.tokenBalance?.toString() || '0');

	$effect(() => {
		walletValue = data.viewedUser.walletBalance?.toString() || '0';
		tokenValue = data.viewedUser.tokenBalance?.toString() || '0';
	});

	$effect(() => {
		if (form?.success) {
			toast.success(form.message || 'Action completed successfully');
			editingWallet = false;
			editingToken = false;
			invalidateAll();
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
	<title>{data.viewedUser.email} - Users - Admin</title>
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
					{data.viewedUser.firstName || ''} {data.viewedUser.lastName || ''}
				</h1>
				<p class="mt-0.5 text-sm text-muted-foreground">{data.viewedUser.email}</p>
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
				{#if editingWallet}
					<form method="POST" action="?/updateBalances" use:enhance class="space-y-2">
						<input type="hidden" name="tokenBalance" value={data.viewedUser.tokenBalance?.toString() || '0'} />
						<Label class="text-xs">Wallet Balance ($)</Label>
						<div class="flex gap-1.5">
							<Input
								name="walletBalance"
								type="number"
								step="0.01"
								bind:value={walletValue}
								class="h-7 text-sm tabular-nums"
							/>
							<Button variant="default" size="icon" class="h-7 w-7 shrink-0" type="submit">
								<Check class="h-3 w-3" />
							</Button>
							<Button variant="ghost" size="icon" class="h-7 w-7 shrink-0" type="button" onclick={() => { editingWallet = false; walletValue = data.viewedUser.walletBalance?.toString() || '0'; }}>
								<X class="h-3 w-3" />
							</Button>
						</div>
					</form>
				{:else}
					<div class="flex items-start justify-between">
						<div>
							<p class="text-xs text-muted-foreground">Wallet Balance</p>
							<p class="text-xl font-bold tabular-nums">{formatCurrency(Number(data.viewedUser.walletBalance))}</p>
						</div>
						<button class="text-muted-foreground hover:text-foreground mt-0.5" onclick={() => editingWallet = true}>
							<Pencil class="h-3.5 w-3.5" />
						</button>
					</div>
				{/if}
			</CardContent>
		</Card>
		<Card class="border-border/50">
			<CardContent class="p-3">
				{#if editingToken}
					<form method="POST" action="?/updateBalances" use:enhance class="space-y-2">
						<input type="hidden" name="walletBalance" value={data.viewedUser.walletBalance?.toString() || '0'} />
						<Label class="text-xs">Token Balance</Label>
						<div class="flex gap-1.5">
							<Input
								name="tokenBalance"
								type="number"
								step="0.01"
								bind:value={tokenValue}
								class="h-7 text-sm tabular-nums"
							/>
							<Button variant="default" size="icon" class="h-7 w-7 shrink-0" type="submit">
								<Check class="h-3 w-3" />
							</Button>
							<Button variant="ghost" size="icon" class="h-7 w-7 shrink-0" type="button" onclick={() => { editingToken = false; tokenValue = data.viewedUser.tokenBalance?.toString() || '0'; }}>
								<X class="h-3 w-3" />
							</Button>
						</div>
					</form>
				{:else}
					<div class="flex items-start justify-between">
						<div>
							<p class="text-xs text-muted-foreground">Token Balance</p>
							<p class="text-xl font-bold tabular-nums">{formatNumber(Number(data.viewedUser.tokenBalance))} TKN</p>
						</div>
						<button class="text-muted-foreground hover:text-foreground mt-0.5" onclick={() => editingToken = true}>
							<Pencil class="h-3.5 w-3.5" />
						</button>
					</div>
				{/if}
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
						<span class="text-sm font-medium">{data.viewedUser.email}</span>
					</div>
					{#if data.viewedUser.phone}
						<div class="flex items-center gap-2">
							<Phone class="h-3.5 w-3.5 text-muted-foreground" />
							<span class="text-xs text-muted-foreground">Phone:</span>
							<span class="text-sm font-medium">{data.viewedUser.phone}</span>
						</div>
					{/if}
					<div class="flex items-center gap-2">
						<Calendar class="h-3.5 w-3.5 text-muted-foreground" />
						<span class="text-xs text-muted-foreground">Joined:</span>
						<span class="text-sm font-medium">{formatDate(data.viewedUser.createdAt)}</span>
					</div>
				</div>
				<div class="space-y-2">
					<div class="flex items-center gap-2">
						<span class="text-xs text-muted-foreground">Role:</span>
						<Badge class="text-xs">{data.viewedUser.role}</Badge>
					</div>
					<div class="flex items-center gap-2">
						<span class="text-xs text-muted-foreground">KYC Status:</span>
						<Badge variant={getStatusBadgeVariant(data.viewedUser.kycStatus)} class="text-xs">{data.viewedUser.kycStatus}</Badge>
					</div>
					{#if data.viewedUser.group}
						<div class="flex items-center gap-2">
							<span class="text-xs text-muted-foreground">Group:</span>
							<Badge variant="outline" class="text-xs">{data.viewedUser.group}</Badge>
						</div>
					{/if}
				</div>
			</div>
			{#if data.viewedUser.address}
				<div class="flex items-start gap-2 border-t border-border/30 pt-2.5">
					<MapPin class="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
					<div>
						<span class="text-xs text-muted-foreground">Address:</span>
						<p class="text-sm font-medium">
							{data.viewedUser.address}
							{#if data.viewedUser.city}, {data.viewedUser.city}{/if}
							{#if data.viewedUser.state}, {data.viewedUser.state}{/if}
							{#if data.viewedUser.zipCode} {data.viewedUser.zipCode}{/if}
							{#if data.viewedUser.country}, {data.viewedUser.country}{/if}
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
