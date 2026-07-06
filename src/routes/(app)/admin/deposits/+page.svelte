<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { formatCurrency } from '$lib/utils';
	import { CheckCircle, XCircle, Copy, ExternalLink } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData, form?: ActionData } = $props();

	let rejectingId = $state<string | null>(null);
	let rejectReasons = $state<Record<string, string>>({});

	$effect(() => {
		if (form?.success) {
			toast.success(form.message || 'Action completed successfully');
			rejectingId = null;
			invalidateAll();
		} else if (form?.error) {
			toast.error(form.error || 'Action failed');
		}
	});

	function formatDate(date: Date | null) {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
	}

	function getStatusBadgeVariant(status: string) {
		if (status === 'confirmed') return 'default';
		if (status === 'pending') return 'secondary';
		if (status === 'rejected') return 'destructive';
		return 'outline';
	}

	function copyToClipboard(text: string) {
		navigator.clipboard.writeText(text);
		toast.success('Copied to clipboard');
	}
</script>

<svelte:head>
	<title>Deposits - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Deposits</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Manage deposit requests ({data.deposits.length} shown)
		</p>
	</div>

	<div class="rounded-lg border border-border/50 bg-card shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="border-b border-border/50 bg-muted/30">
					<tr>
						<th class="px-4 py-2.5 text-left text-sm font-semibold text-foreground">User</th>
						<th class="px-4 py-2.5 text-left text-sm font-semibold text-foreground">Amount</th>
						<th class="px-4 py-2.5 text-left text-sm font-semibold text-foreground">Crypto</th>
						<th class="px-4 py-2.5 text-left text-sm font-semibold text-foreground">Transaction Hash</th>
						<th class="px-4 py-2.5 text-left text-sm font-semibold text-foreground">Status</th>
						<th class="px-4 py-2.5 text-left text-sm font-semibold text-foreground">Date</th>
						<th class="px-4 py-2.5 text-right text-sm font-semibold text-foreground">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border/30">
					{#each data.deposits as deposit}
						<tr class="transition-colors hover:bg-muted/20">
							<td class="px-4 py-2.5">
								<div>
									<p class="font-medium text-foreground">
										{deposit.user?.firstName || ''} {deposit.user?.lastName || ''}
									</p>
									<p class="text-sm text-muted-foreground">{deposit.user?.email}</p>
								</div>
							</td>
							<td class="px-4 py-2.5">
								<p class="font-semibold tabular-nums text-foreground">{formatCurrency(Number(deposit.amount))}</p>
							</td>
							<td class="px-4 py-2.5">
								<p class="font-medium text-foreground">{deposit.cryptocurrency}</p>
								{#if deposit.wallet?.name}
									<p class="text-xs text-muted-foreground">{deposit.wallet.name}</p>
								{/if}
							</td>
							<td class="px-4 py-2.5">
								<div class="flex items-center gap-1.5">
									<p class="max-w-[140px] truncate text-xs font-mono text-muted-foreground" title={deposit.transactionHash}>
										{deposit.transactionHash.slice(0, 10)}...{deposit.transactionHash.slice(-6)}
									</p>
									<button
										class="text-muted-foreground hover:text-foreground"
										onclick={() => copyToClipboard(deposit.transactionHash)}
									>
										<Copy class="h-3 w-3" />
									</button>
								</div>
							</td>
							<td class="px-4 py-2.5">
								<Badge variant={getStatusBadgeVariant(deposit.status)}>{deposit.status}</Badge>
							</td>
							<td class="px-4 py-2.5">
								<p class="text-sm text-muted-foreground">{formatDate(deposit.createdAt)}</p>
								{#if deposit.confirmedAt}
									<p class="text-xs text-muted-foreground">Confirmed: {formatDate(deposit.confirmedAt)}</p>
								{/if}
								{#if deposit.rejectedReason}
									<p class="text-xs text-destructive">{deposit.rejectedReason}</p>
								{/if}
							</td>
							<td class="px-4 py-2.5 text-right">
								{#if deposit.status === 'pending'}
									{#if rejectingId === deposit.id}
										<form method="POST" action="?/reject" use:enhance class="flex items-center gap-1.5">
											<input type="hidden" name="id" value={deposit.id} />
											<Input
												name="reason"
												placeholder="Reason..."
												class="h-7 w-32 text-xs"
												value={rejectReasons[deposit.id] || ''}
												oninput={(e) => rejectReasons[deposit.id] = e.currentTarget.value}
											/>
											<Button variant="destructive" size="sm" type="submit" class="gap-1">
												<XCircle class="h-3 w-3" />
												Confirm
											</Button>
											<Button variant="ghost" size="sm" type="button" onclick={() => rejectingId = null}>Cancel</Button>
										</form>
									{:else}
										<div class="flex justify-end gap-1.5">
											<form method="POST" action="?/approve" use:enhance>
												<input type="hidden" name="id" value={deposit.id} />
												<Button variant="default" size="sm" type="submit" class="gap-1">
													<CheckCircle class="h-3 w-3" />
													Approve
												</Button>
											</form>
											<Button variant="destructive" size="sm" class="gap-1" onclick={() => rejectingId = deposit.id}>
												<XCircle class="h-3 w-3" />
												Reject
											</Button>
										</div>
									{/if}
								{:else if deposit.status === 'confirmed'}
									<Button variant="ghost" size="sm" class="gap-1">
										<ExternalLink class="h-3 w-3" />
										View
									</Button>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if data.deposits.length === 0}
			<div class="py-12 text-center">
				<p class="text-sm text-muted-foreground">No deposits found</p>
			</div>
		{/if}
	</div>
</div>
