<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { User } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Profile Settings - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Profile Settings</h1>
		<p class="mt-1 text-sm text-muted-foreground">Your admin account information</p>
	</div>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="text-base">Admin Profile</CardTitle>
		</CardHeader>
		<CardContent class="p-3 pt-0">
			<div class="flex items-center gap-4 rounded-lg border border-border/40 p-4">
				<div class="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
					<User class="h-8 w-8 text-primary" />
				</div>
				<div class="space-y-1">
					<p class="text-lg font-semibold text-foreground">{data.user?.firstName || 'Admin'} {data.user?.lastName || ''}</p>
					<p class="text-sm text-muted-foreground">{data.user?.email || 'admin@ethercore.org'}</p>
					<Badge variant="destructive">Admin</Badge>
				</div>
			</div>
		</CardContent>
	</Card>
</div>
