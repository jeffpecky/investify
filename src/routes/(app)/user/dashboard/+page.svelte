<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Dashboard - Investify</title>
</svelte:head>

<div class="p-8">
	<h1 class="text-3xl font-bold">Welcome back, {data.user?.firstName || 'User'}!</h1>
	<p class="mt-2 text-muted-foreground">Email: {data.user?.email}</p>

	<div class="mt-8">
		<p class="text-sm text-muted-foreground">
			Plan 1 Complete: Auth scaffolding, database, and authentication flows are ready.
		</p>
	</div>

	<form method="POST" action="/logout" class="mt-8">
		<Button type="submit" variant="destructive">Logout</Button>
	</form>
</div>
