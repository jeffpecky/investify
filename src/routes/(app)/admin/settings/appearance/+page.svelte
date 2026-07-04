<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Label } from '$lib/components/ui/label';
	import { Moon, Sun, Monitor } from 'lucide-svelte';

	let theme = $state('system');
</script>

<svelte:head>
	<title>Appearance - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Appearance</h1>
		<p class="mt-1 text-sm text-muted-foreground">Customize the look and feel of the admin panel</p>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Theme Preference</CardTitle>
		</CardHeader>
		<CardContent>
			<div class="space-y-4">
				<Label>Select your theme</Label>
				<div class="grid gap-3 sm:grid-cols-3">
					<button
						class="flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors hover:bg-muted/50"
						class:border-primary={theme === 'light'}
						class:border-border={theme !== 'light'}
						onclick={() => theme = 'light'}
					>
						<Sun class="h-6 w-6" />
						<span class="font-medium">Light</span>
					</button>
					<button
						class="flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors hover:bg-muted/50"
						class:border-primary={theme === 'dark'}
						class:border-border={theme !== 'dark'}
						onclick={() => theme = 'dark'}
					>
						<Moon class="h-6 w-6" />
						<span class="font-medium">Dark</span>
					</button>
					<button
						class="flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors hover:bg-muted/50"
						class:border-primary={theme === 'system'}
						class:border-border={theme !== 'system'}
						onclick={() => theme = 'system'}
					>
						<Monitor class="h-6 w-6" />
						<span class="font-medium">System</span>
					</button>
				</div>
			</div>

			<div class="mt-6 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
				<p class="text-sm text-yellow-700 dark:text-yellow-300">
					<strong>TODO:</strong> Implement theme switching logic (client-side)
				</p>
			</div>
		</CardContent>
	</Card>
</div>
