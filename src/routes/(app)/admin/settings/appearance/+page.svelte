<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Moon, Sun, Monitor } from 'lucide-svelte';

	let theme = $state('system');
</script>

<svelte:head>
	<title>Appearance - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Appearance</h1>
		<p class="mt-1 text-sm text-muted-foreground">Customize the look and feel of the admin panel</p>
	</div>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="text-base">Theme Preference</CardTitle>
		</CardHeader>
		<CardContent class="space-y-3 p-3 pt-0">
			<Label class="text-xs">Select your theme</Label>
			<div class="grid gap-2.5 sm:grid-cols-3">
				<button
					class="flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-colors hover:bg-muted/50"
					class:border-primary={theme === 'light'}
					class:border-border={theme !== 'light'}
					onclick={() => theme = 'light'}
				>
					<Sun class="h-5 w-5" />
					<span class="text-sm font-medium">Light</span>
				</button>
				<button
					class="flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-colors hover:bg-muted/50"
					class:border-primary={theme === 'dark'}
					class:border-border={theme !== 'dark'}
					onclick={() => theme = 'dark'}
				>
					<Moon class="h-5 w-5" />
					<span class="text-sm font-medium">Dark</span>
				</button>
				<button
					class="flex flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-colors hover:bg-muted/50"
					class:border-primary={theme === 'system'}
					class:border-border={theme !== 'system'}
					onclick={() => theme = 'system'}
				>
					<Monitor class="h-5 w-5" />
					<span class="text-sm font-medium">System</span>
				</button>
			</div>
		</CardContent>
	</Card>
</div>
