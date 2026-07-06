<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { formatCurrency } from '$lib/utils';
	import { CheckCircle, XCircle, Clock } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData, form?: ActionData } = $props();

	let rejectingId = $state<string | null>(null);
	let transactionHashInputs = $state<Record<string, string>>({});

	$effect(() => {
		if (form?.success) {
			toast.success(form.message || 'Action completed successfully');
			rejectingId = null;
		} else if (form?.error) {
			toast.error(form.error || 'Action failed');
		}
	});

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

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Withdrawals</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Manage withdrawal requests ({data.withdrawals.length} shown)
		</p>
	</div>

	<div class="rounded-lg border border-border/50 bg-card shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="border-b border-border/50 bg-muted/30">
					<tr>
						<th class="px-4 py-2.5 text-left text-sm font-semibold text-foreground">User</th>
						<th class="px-4 py-2.5 text-left text-sm font-semibold text-foreground">Amount</th>
						<th class="px-4 py-2.5 text-left text-sm font-semibold text-foreground">Wallet</th>
						<th class="px-4 py-2.5 text-left text-sm font-semibold text-foreground">Status</th>
						<th class="px-4 py-2.5 text-left text-sm font-semibold text-foreground">Date</th>
						<th class="px-4 py-2.5 text-right text-sm font-semibold text-foreground">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border/30">
					{#each data.withdrawals as withdrawal}
						<tr class="transition-colors hover:bg-muted/20">
							<td class="px-4 py-2.5">
								<div>
									<p class="font-medium text-foreground">
										{withdrawal.user?.firstName || ''} {withdrawal.user?.lastName || ''}
									</p>
									<p class="text-sm text-muted-foreground">{withdrawal.user?.email}</p>
								</div>
							</td>
							<td class="px-4 py-2.5">
								<p class="font-semibold tabular-nums text-foreground">{formatCurrency(Number(withdrawal.amount))}</p>
								<p class="text-xs text-muted-foreground">{withdrawal.cryptoAmount} {withdrawal.cryptoSymbol}</p>
							</td>
							<td class="px-4 py-2.5">
								<p class="font-medium text-foreground">{withdrawal.wallet?.name || 'Unknown'}</p>
								<p class="truncate text-xs text-muted-foreground max-w-[150px] font-mono">{withdrawal.wallet?.address}</p>
							</td>
							<td class="px-4 py-2.5">
								<Badge variant={getStatusBadgeVariant(withdrawal.status)}>{withdrawal.status}</Badge>
							</td>
							<td class="px-4 py-2.5">
								<p class="text-sm text-muted-foreground">{formatDate(withdrawal.createdAt)}</p>
								{#if withdrawal.processedAt}
									<p class="text-xs text-muted-foreground">Processed: {formatDate(withdrawal.processedAt)}</p>
								{/if}
							</td>
							<td class="px-4 py-2.5 text-right">
								{#if withdrawal.status === 'pending'}
									{#if rejectingId === withdrawal.id}
										<form method="POST" action="?/reject" use:enhance class="flex items-center gap-1.5">
											<input type="hidden" name="id" value={withdrawal.id} />
											<Button variant="destructive" size="sm" type="submit" class="gap-1">
												<XCircle class="h-3 w-3" />
												Confirm
											</Button>
											<Button variant="ghost" size="sm" type="button" onclick={() => rejectingId = null}>Cancel</Button>
										</form>
									{:else}
										<div class="flex justify-end gap-1.5">
											<form method="POST" action="?/approve" use:enhance>
												<input type="hidden" name="id" value={withdrawal.id} />
												<input type="hidden" name="transactionHash" value={transactionHashInputs[withdrawal.id] || ''} />
												<Button variant="default" size="sm" type="submit" class="gap-1">
													<CheckCircle class="h-3 w-3" />
													Approve
												</Button>
											</form>
											<Button variant="destructive" size="sm" class="gap-1" onclick={() => rejectingId = withdrawal.id}>
												<XCircle class="h-3 w-3" />
												Reject
											</Button>
										</div>
									{/if}
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
</div>
