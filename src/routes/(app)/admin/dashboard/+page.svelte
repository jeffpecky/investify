<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Admin Dashboard - Investify</title>
</svelte:head>

<div class="p-8">
	<h1 class="text-3xl font-bold">Admin Dashboard</h1>
	<p class="mt-2 text-muted-foreground">Welcome, {data.user?.firstName || 'Admin'}!</p>
	<p class="mt-1 text-muted-foreground">Plan 1 Complete - Ready for Plan 2</p>

	<form method="POST" action="/logout" class="mt-8">
		<Button type="submit" variant="destructive">Logout</Button>
	</form>
</div>
