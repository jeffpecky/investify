<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { CheckCircle, XCircle, FileText } from 'lucide-svelte';
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
		if (status === 'approved') return 'default';
		if (status === 'pending') return 'secondary';
		if (status === 'rejected') return 'destructive';
		return 'outline';
	}
</script>

<svelte:head>
	<title>KYC Verification - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<!-- Header -->
	<div>
		<h1 class="text-2xl font-semibold text-foreground">KYC Verification</h1>
		<p class="mt-1 text-sm text-muted-foreground">
			Review and approve user identity documents ({data.kycDocuments.length} shown)
		</p>
	</div>

	<!-- KYC Documents Table -->
	<div class="rounded-lg border border-border/50 bg-card shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="border-b border-border/50 bg-muted/30">
					<tr>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">User</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Document Type</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">User KYC Status</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Document Status</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Submitted</th>
						<th class="px-4 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border/30">
					{#each data.kycDocuments as doc}
						<tr class="transition-colors hover:bg-muted/20">
							<td class="px-4 py-3">
								<div>
									<p class="font-medium text-foreground">
										{doc.user?.firstName || ''} {doc.user?.lastName || ''}
									</p>
									<p class="text-sm text-muted-foreground">{doc.user?.email}</p>
								</div>
							</td>
							<td class="px-4 py-3">
								<div class="flex items-center gap-2">
									<FileText class="h-4 w-4 text-muted-foreground" />
									<span class="font-medium text-foreground">{doc.documentType}</span>
								</div>
							</td>
							<td class="px-4 py-3">
								<Badge variant={getStatusBadgeVariant(doc.user?.kycStatus || 'pending')}>
									{doc.user?.kycStatus || 'pending'}
								</Badge>
							</td>
							<td class="px-4 py-3">
								<Badge variant={getStatusBadgeVariant(doc.status)}>{doc.status}</Badge>
							</td>
							<td class="px-4 py-3 text-sm text-muted-foreground">
								{formatDate(doc.createdAt)}
							</td>
							<td class="px-4 py-3 text-right">
								{#if doc.status === 'pending'}
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

		{#if data.kycDocuments.length === 0}
			<div class="py-12 text-center">
				<p class="text-sm text-muted-foreground">No KYC documents found</p>
			</div>
		{/if}
	</div>

	<div class="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
		<p class="text-sm text-yellow-700 dark:text-yellow-300">
			<strong>TODO:</strong> Implement document viewer and approve/reject actions
		</p>
	</div>
</div>
