<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Plus, Edit, Trash2, BarChart } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	function formatDate(date: Date | null) {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	function getStatusBadgeVariant(status: string) {
		if (status === 'active') return 'default';
		if (status === 'closed') return 'secondary';
		return 'outline';
	}
</script>

<svelte:head>
	<title>Surveys - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<h1 class="text-2xl font-semibold text-foreground">Surveys</h1>
			<p class="mt-1 text-sm text-muted-foreground">
				Manage user surveys and feedback ({data.surveys.length} surveys)
			</p>
		</div>
		<Button class="gap-2">
			<Plus class="h-4 w-4" />
			Create Survey
		</Button>
	</div>

	<!-- Surveys Table -->
	<div class="rounded-lg border border-border/50 bg-card shadow-sm">
		<div class="overflow-x-auto">
			<table class="w-full">
				<thead class="border-b border-border/50 bg-muted/30">
					<tr>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Name</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Type</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Status</th>
						<th class="px-4 py-3 text-left text-sm font-semibold text-foreground">Created</th>
						<th class="px-4 py-3 text-right text-sm font-semibold text-foreground">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border/30">
					{#each data.surveys as survey}
						<tr class="transition-colors hover:bg-muted/20">
							<td class="px-4 py-3">
								<div>
									<p class="font-medium text-foreground">{survey.name}</p>
									{#if survey.description}
										<p class="text-sm text-muted-foreground line-clamp-1">{survey.description}</p>
									{/if}
								</div>
							</td>
							<td class="px-4 py-3">
								<Badge variant="outline">{survey.type}</Badge>
							</td>
							<td class="px-4 py-3">
								<Badge variant={getStatusBadgeVariant(survey.status)}>{survey.status}</Badge>
							</td>
							<td class="px-4 py-3 text-sm text-muted-foreground">
								{formatDate(survey.createdAt)}
							</td>
							<td class="px-4 py-3 text-right">
								<div class="flex justify-end gap-2">
									<a href="/admin/surveys/{survey.id}">
										<Button variant="ghost" size="sm">
											<BarChart class="h-4 w-4" />
										</Button>
									</a>
									<Button variant="ghost" size="sm">
										<Edit class="h-4 w-4" />
									</Button>
									<Button variant="ghost" size="sm" class="text-destructive">
										<Trash2 class="h-4 w-4" />
									</Button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if data.surveys.length === 0}
			<div class="py-12 text-center">
				<p class="text-sm text-muted-foreground">No surveys created yet</p>
			</div>
		{/if}
	</div>


</div>
