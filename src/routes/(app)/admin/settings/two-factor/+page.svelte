<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Shield, Smartphone } from 'lucide-svelte';

	let twoFactorEnabled = $state(false);
</script>

<svelte:head>
	<title>Two-Factor Authentication - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Two-Factor Authentication</h1>
		<p class="mt-1 text-sm text-muted-foreground">Add an extra layer of security to your account</p>
	</div>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<div class="flex items-center gap-3">
				<div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
					<Shield class="h-4 w-4 text-primary" />
				</div>
				<div>
					<CardTitle class="text-base">2FA Status</CardTitle>
					<p class="text-xs text-muted-foreground">
						{twoFactorEnabled ? 'Enabled' : 'Disabled'}
					</p>
				</div>
			</div>
		</CardHeader>
		<CardContent class="space-y-3 p-3 pt-0">
			{#if !twoFactorEnabled}
				<div class="rounded-lg border border-border/50 bg-muted/30 p-3">
					<div class="flex gap-3">
						<Smartphone class="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
						<div class="flex-1">
							<p class="text-sm font-medium text-foreground">Authenticator App</p>
							<p class="text-xs text-muted-foreground">Use an app like Google Authenticator or Authy</p>
						</div>
					</div>
				</div>
				<Button size="sm">Enable Two-Factor Authentication</Button>
			{:else}
				<p class="text-xs text-muted-foreground">Two-factor authentication is currently enabled for your account.</p>
				<Button variant="destructive" size="sm">Disable 2FA</Button>
			{/if}
		</CardContent>
	</Card>
</div>
