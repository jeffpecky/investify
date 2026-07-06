<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { formatCurrency, formatNumber } from '$lib/utils';
	import { Search, UserPlus, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let searchTerm = $state($state.snapshot(data.search));

	function handleSearch() {
		const params = new URLSearchParams(window.location.search);
		if (searchTerm) {
			params.set('search', searchTerm);
		} else {
			params.delete('search');
		}
		params.set('page', '1');
		window.location.href = `?${params.toString()}`;
	}

	function formatDate(date: Date | null) {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function getRoleBadgeVariant(role: string) {
		if (role === 'admin') return 'destructive';
		if (role === 'user') return 'secondary';
		return 'outline';
	}

	function getKycBadgeVariant(status: string) {
		if (status === 'approved') return 'default';
		if (status === 'pending') return 'secondary';
		return 'outline';
	}
</script>

<svelte:head>
	<title>Users - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-semibold text-foreground">Users</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Manage all platform users ({formatNumber(data.pagination.total)} total)
			</p>
		</div>
	</div>

	<!-- Search Bar -->
	<div class="flex gap-2">
		<div class="relative flex-1">
			<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="text"
				placeholder="Search by name or email..."
				class="pl-9"
				bind:value={searchTerm}
				onkeydown={(e) => {
					if (e.key === 'Enter') handleSearch();
				}}
			/>
		</div>
		<Button onclick={handleSearch}>Search</Button>
	</div>

	<!-- Users Table -->
	<div class="rounded-lg border border-border/50 bg-card shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="border-b border-border/50 bg-muted/30">
					<tr>
						<th class="px-4 py-2.5 text-left text-sm font-semibold text-foreground">User</th>
						<th class="px-4 py-2.5 text-left text-sm font-semibold text-foreground">Role</th>
						<th class="px-4 py-2.5 text-left text-sm font-semibold text-foreground">KYC Status</th>
						<th class="px-4 py-2.5 text-left text-sm font-semibold text-foreground">Balance</th>
						<th class="px-4 py-2.5 text-left text-sm font-semibold text-foreground">Joined</th>
						<th class="px-4 py-2.5 text-right text-sm font-semibold text-foreground">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border/30">
					{#each data.users as user}
						<tr class="transition-colors hover:bg-muted/20">
							<td class="px-4 py-2.5">
								<div>
									<p class="font-medium text-foreground">
										{user.firstName || ''} {user.lastName || ''}
									</p>
									<p class="text-sm text-muted-foreground">{user.email}</p>
								</div>
							</td>
							<td class="px-4 py-2.5">
								<Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
							</td>
							<td class="px-4 py-2.5">
								<Badge variant={getKycBadgeVariant(user.kycStatus)}>{user.kycStatus}</Badge>
							</td>
							<td class="px-4 py-2.5">
								<p class="font-medium text-foreground">{formatCurrency(Number(user.walletBalance))}</p>
								<p class="text-xs text-muted-foreground">{formatNumber(Number(user.tokenBalance))} TKN</p>
							</td>
							<td class="px-4 py-2.5 text-sm text-muted-foreground">
								{formatDate(user.createdAt)}
							</td>
							<td class="px-4 py-2.5 text-right">
								<a href="/admin/users/{user.id}">
									<Button variant="ghost" size="sm">View</Button>
								</a>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if data.users.length === 0}
			<div class="py-12 text-center">
				<p class="text-sm text-muted-foreground">No users found</p>
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
					href="?page={data.pagination.page - 1}{data.search ? `&search=${data.search}` : ''}"
					class:pointer-events-none={data.pagination.page === 1}
					class:opacity-50={data.pagination.page === 1}
				>
					<Button variant="outline" size="sm" disabled={data.pagination.page === 1}>
						<ChevronLeft class="h-4 w-4" />
						Previous
					</Button>
				</a>
				<a 
					href="?page={data.pagination.page + 1}{data.search ? `&search=${data.search}` : ''}"
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
