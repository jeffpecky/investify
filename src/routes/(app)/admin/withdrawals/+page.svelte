<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { formatCurrency } from '$lib/utils';
	import { CheckCircle, XCircle, Clock } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date | null) {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
	}

	function getStatusBadgeVariant(status: string) {
		if (status === 'completed') return 'default';
		if (status === 'pending') return 'secondary';
		if (status === 'rejected') return 'destructive';
		return 'outline';
	}
</script>

<svelte:head>
	<title>Withdrawals - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Withdrawals</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Manage withdrawal requests ({data.withdrawals.length} shown)
		</p>
	</div>

	<!-- Withdrawals Table -->
	<div class="rounded-lg border border-border/50 bg-card shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="border-b border-border/50 bg-muted/30">
					<tr>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">User</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Wallet</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Date</th>
						<th class="px-4 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border/30">
					{#each data.withdrawals as withdrawal}
						<tr class="transition-colors hover:bg-muted/20">
							<td class="px-4 py-3">
								<div>
									<p class="font-medium text-foreground">
										{withdrawal.user?.firstName || ''} {withdrawal.user?.lastName || ''}
									</p>
									<p class="text-sm text-muted-foreground">{withdrawal.user?.email}</p>
								</div>
							</td>
							<td class="px-4 py-3">
								<p class="font-semibold text-foreground">{formatCurrency(Number(withdrawal.amount))}</p>
								<p class="text-xs text-muted-foreground">{withdrawal.cryptoAmount} {withdrawal.cryptoSymbol}</p>
							</td>
							<td class="px-4 py-3">
								<p class="font-medium text-foreground">{withdrawal.wallet?.name || 'Unknown'}</p>
								<p class="truncate text-xs text-muted-foreground max-w-[150px]">{withdrawal.wallet?.address}</p>
							</td>
							<td class="px-4 py-3">
								<Badge variant={getStatusBadgeVariant(withdrawal.status)}>{withdrawal.status}</Badge>
							</td>
							<td class="px-4 py-3">
								<p class="text-sm text-muted-foreground">{formatDate(withdrawal.createdAt)}</p>
								{#if withdrawal.processedAt}
									<p class="text-xs text-muted-foreground">Processed: {formatDate(withdrawal.processedAt)}</p>
								{/if}
							</td>
							<td class="px-4 py-3 text-right">
								{#if withdrawal.status === 'pending'}
									<div class="flex justify-end gap-2">
										<Button variant="default" size="sm" class="gap-1">
											<CheckCircle class="h-3 w-3" />
											Approve
										</Button>
										<Button variant="destructive" size="sm" class="gap-1">
											<XCircle class="h-3 w-3" />
											Reject
										</Button>
									</div>
								{:else}
									<Button variant="ghost" size="sm">View</Button>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if data.withdrawals.length === 0}
			<div class="py-12 text-center">
				<p class="text-sm text-muted-foreground">No withdrawals found</p>
			</div>
		{/if}
	</div>

	<div class="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
		<p class="text-sm text-yellow-700 dark:text-yellow-300">
			<strong>TODO:</strong> Implement approve/reject form actions
		</p>
	</div>
</div>
