<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Analytics - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Analytics</h1>
		<p class="mt-1 text-sm text-muted-foreground">Platform metrics and insights</p>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Analytics Dashboard</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-8 text-center">
				<p class="text-sm text-yellow-700 dark:text-yellow-300">
					<strong>TODO:</strong> Implement analytics charts and metrics
					<br />• Revenue charts
					<br />• User growth
					<br />• Investment trends
					<br />• Geographic distribution
				</p>
			</div>
		</CardContent>
	</Card>
</div>
