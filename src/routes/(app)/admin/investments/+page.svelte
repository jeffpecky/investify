<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { formatCurrency, formatNumber } from '$lib/utils';
	import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchTerm = $state(data.search);
	let statusFilter = $state(data.status);

	function handleSearch() {
		const params = new URLSearchParams();
		if (searchTerm) params.set('search', searchTerm);
		if (statusFilter) params.set('status', statusFilter);
		params.set('page', '1');
		window.location.href = `?${params.toString()}`;
	}

	function formatDate(date: Date | null) {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function getStatusBadgeVariant(status: string) {
		if (status === 'active') return 'default';
		if (status === 'pending') return 'secondary';
		if (status === 'completed') return 'outline';
		if (status === 'cancelled' || status === 'rejected') return 'destructive';
		return 'outline';
	}
</script>

<svelte:head>
	<title>Investments - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-semibold text-foreground">Investments</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Manage all platform investments ({formatNumber(data.pagination.total)} total)
			</p>
		</div>
	</div>

	<!-- Search and Filters -->
	<div class="flex flex-col gap-2 sm:flex-row">
		<div class="relative flex-1">
			<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="text"
				placeholder="Search by user name or email..."
				class="pl-9"
				bind:value={searchTerm}
				onkeydown={(e) => {
					if (e.key === 'Enter') handleSearch();
				}}
			/>
		</div>
		<select 
			class="rounded-md border border-input bg-background px-3 py-2 text-sm"
			bind:value={statusFilter}
			onchange={handleSearch}
		>
			<option value="">All Status</option>
			<option value="pending">Pending</option>
			<option value="active">Active</option>
			<option value="completed">Completed</option>
			<option value="cancelled">Cancelled</option>
			<option value="rejected">Rejected</option>
		</select>
		<Button onclick={handleSearch}>Search</Button>
	</div>

	<!-- Investments Table -->
	<div class="rounded-lg border border-border/50 bg-card shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="border-b border-border/50 bg-muted/30">
					<tr>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">User</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Plan</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Profit</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Date</th>
						<th class="px-4 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border/30">
					{#each data.investments as investment}
						<tr class="transition-colors hover:bg-muted/20">
							<td class="px-4 py-3">
								<div>
									<p class="font-medium text-foreground">
										{investment.user?.firstName || ''} {investment.user?.lastName || ''}
									</p>
									<p class="text-sm text-muted-foreground">{investment.user?.email}</p>
								</div>
							</td>
							<td class="px-4 py-3">
								<p class="font-medium text-foreground">{investment.plan?.name || 'Unknown'}</p>
								<p class="text-xs text-muted-foreground">{investment.plan?.category || ''}</p>
							</td>
							<td class="px-4 py-3">
								<p class="font-semibold text-foreground">{formatCurrency(Number(investment.amount))}</p>
								<p class="text-xs text-muted-foreground">{investment.paymentMethod}</p>
							</td>
							<td class="px-4 py-3">
								<Badge variant={getStatusBadgeVariant(investment.status)}>{investment.status}</Badge>
							</td>
							<td class="px-4 py-3">
								<p class="font-medium text-foreground">{formatCurrency(Number(investment.profitAccrued))}</p>
								<p class="text-xs text-muted-foreground">of {formatCurrency(Number(investment.totalExpectedProfit))}</p>
							</td>
							<td class="px-4 py-3 text-sm text-muted-foreground">
								{formatDate(investment.createdAt)}
							</td>
							<td class="px-4 py-3 text-right">
								<a href="/admin/investments/{investment.id}">
									<Button variant="ghost" size="sm">View</Button>
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if data.investments.length === 0}
			<div class="py-12 text-center">
				<p class="text-sm text-muted-foreground">No investments found</p>
			</div>
		{/if}
	</div>

	<!-- Pagination -->
	{#if data.pagination.totalPages > 1}
		<div class="flex items-center justify-between">
			<p class="text-sm text-muted-foreground">
				Page {data.pagination.page} of {data.pagination.totalPages}
			</p>
			<div class="flex gap-2">
				<a 
					href="?page={data.pagination.page - 1}{data.search ? `&search=${data.search}` : ''}{data.status ? `&status=${data.status}` : ''}"
					class:pointer-events-none={data.pagination.page === 1}
					class:opacity-50={data.pagination.page === 1}
				>
					<Button variant="outline" size="sm" disabled={data.pagination.page === 1}>
						<ChevronLeft class="h-4 w-4" />
						Previous
					</Button>
				</a>
				<a 
					href="?page={data.pagination.page + 1}{data.search ? `&search=${data.search}` : ''}{data.status ? `&status=${data.status}` : ''}"
					class:pointer-events-none={data.pagination.page === data.pagination.totalPages}
					class:opacity-50={data.pagination.page === data.pagination.totalPages}
				>
					<Button variant="outline" size="sm" disabled={data.pagination.page === data.pagination.totalPages}>
						Next
						<ChevronRight class="h-4 w-4" />
					</Button>
				</a>
			</div>
		</div>
	{/if}
</div>
