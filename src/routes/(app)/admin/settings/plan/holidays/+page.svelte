<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData, form?: ActionData } = $props();

	$effect(() => {
		if (form?.success) {
			toast.success(form.message || 'Action completed');
		} else if (form?.error) {
			toast.error(form.error || 'Action failed');
		}
	});

	function formatDate(date: Date | string | null) {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>Holidays - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Holiday Calendar</h1>
		<p class="mt-1 text-sm text-muted-foreground">Manage non-working days for payout calculations</p>
	</div>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="text-base">Add Holiday</CardTitle>
		</CardHeader>
		<CardContent class="p-3 pt-0">
			<form method="POST" action="?/addHoliday" use:enhance class="space-y-3">
				<div class="grid gap-3 md:grid-cols-2">
					<div class="space-y-1.5">
						<Label for="name" class="text-xs">Holiday Name</Label>
						<Input id="name" name="name" placeholder="New Year's Day" required />
					</div>
					<div class="space-y-1.5">
						<Label for="date" class="text-xs">Date</Label>
						<Input id="date" name="date" type="date" required />
					</div>
				</div>
				<Button type="submit" size="sm" class="gap-2">
					<Plus class="h-4 w-4" />
					Add Holiday
				</Button>
			</form>
		</CardContent>
	</Card>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="text-base">Holidays ({data.holidays.length})</CardTitle>
		</CardHeader>
		<CardContent class="p-3 pt-0">
			{#if data.holidays.length > 0}
				<div class="space-y-2">
					{#each data.holidays as holiday}
						<div class="flex items-center justify-between rounded-lg border border-border/40 p-2.5">
							<div class="flex items-center gap-3">
								<CalendarIcon class="h-4 w-4 text-muted-foreground" />
								<div>
									<p class="text-sm font-medium text-foreground">{holiday.name}</p>
									<p class="text-xs text-muted-foreground">{formatDate(holiday.date)}</p>
								</div>
							</div>
							<form method="POST" action="?/deleteHoliday" use:enhance>
								<input type="hidden" name="holidayId" value={holiday.id} />
								<Button variant="ghost" size="sm" type="submit" class="text-destructive hover:text-destructive">
									<Trash2 class="h-4 w-4" />
								</Button>
							</form>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-center text-sm text-muted-foreground py-8">No holidays configured</p>
			{/if}
		</CardContent>
	</Card>
</div>
