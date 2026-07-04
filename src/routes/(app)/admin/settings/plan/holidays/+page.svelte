<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Plus, Trash2, Calendar as CalendarIcon } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let newHoliday = $state({
		name: '',
		date: ''
	});

	function formatDate(date: Date | string | null) {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

<svelte:head>
	<title>Holidays - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Holiday Calendar</h1>
		<p class="mt-1 text-sm text-muted-foreground">Manage non-working days for payout calculations</p>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Add Holiday</CardTitle>
		</CardHeader>
		<CardContent>
			<form class="space-y-4">
				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="name">Holiday Name</Label>
						<Input id="name" placeholder="New Year's Day" bind:value={newHoliday.name} required />
					</div>
					<div class="space-y-2">
						<Label for="date">Date</Label>
						<Input id="date" type="date" bind:value={newHoliday.date} required />
					</div>
				</div>
				<Button type="submit" class="gap-2">
					<Plus class="h-4 w-4" />
					Add Holiday
				</Button>
			</form>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Holidays ({data.holidays.length})</CardTitle>
		</CardHeader>
		<CardContent>
			{#if data.holidays.length > 0}
				<div class="space-y-2">
					{#each data.holidays as holiday}
						<div class="flex items-center justify-between rounded-lg border border-border/40 p-3">
							<div class="flex items-center gap-3">
								<CalendarIcon class="h-4 w-4 text-muted-foreground" />
								<div>
									<p class="font-medium text-foreground">{holiday.name}</p>
									<p class="text-sm text-muted-foreground">{formatDate(holiday.date)}</p>
								</div>
							</div>
							<Button variant="ghost" size="sm" class="text-destructive">
								<Trash2 class="h-4 w-4" />
							</Button>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-center text-sm text-muted-foreground py-8">No holidays configured</p>
			{/if}

			<div class="mt-6 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
				<p class="text-sm text-yellow-700 dark:text-yellow-300">
					<strong>TODO:</strong> Implement form actions for add/delete
				</p>
			</div>
		</CardContent>
	</Card>
</div>
