<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Shield, Smartphone } from 'lucide-svelte';

	let twoFactorEnabled = $state(false);
</script>

<svelte:head>
	<title>Two-Factor Authentication - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Two-Factor Authentication</h1>
		<p class="mt-1 text-sm text-muted-foreground">Add an extra layer of security to your account</p>
	</div>

	<Card>
		<CardHeader>
			<div class="flex items-center gap-3">
				<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
					<Shield class="h-5 w-5 text-primary" />
				</div>
				<div>
					<CardTitle>2FA Status</CardTitle>
					<p class="text-sm text-muted-foreground">
						{twoFactorEnabled ? 'Enabled' : 'Disabled'}
					</p>
				</div>
			</div>
		</CardHeader>
		<CardContent>
			{#if !twoFactorEnabled}
				<div class="space-y-4">
					<div class="rounded-lg border border-border/50 bg-muted/30 p-4">
						<div class="flex gap-3">
							<Smartphone class="h-5 w-5 text-muted-foreground" />
							<div class="flex-1">
								<p class="font-medium text-foreground">Authenticator App</p>
								<p class="text-sm text-muted-foreground">Use an app like Google Authenticator or Authy</p>
							</div>
						</div>
					</div>
					<Button>Enable Two-Factor Authentication</Button>
				</div>
			{:else}
				<div class="space-y-4">
					<p class="text-sm text-muted-foreground">Two-factor authentication is currently enabled for your account.</p>
					<Button variant="destructive">Disable 2FA</Button>
				</div>
			{/if}

			<div class="mt-6 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
				<p class="text-sm text-yellow-700 dark:text-yellow-300">
					<strong>TODO:</strong> Implement 2FA setup/disable workflow
				</p>
			</div>
		</CardContent>
	</Card>
</div>
