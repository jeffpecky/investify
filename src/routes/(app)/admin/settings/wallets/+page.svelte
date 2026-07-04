<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Plus, Trash2 } from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let newWallet = $state({
		cryptocurrency: '',
		name: '',
		address: ''
	});
</script>

<svelte:head>
	<title>Wallet Settings - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Platform Wallets</h1>
		<p class="mt-1 text-sm text-muted-foreground">Manage crypto wallets for receiving payments</p>
	</div>

	<!-- Add New Wallet -->
	<Card>
		<CardHeader>
			<CardTitle>Add New Wallet</CardTitle>
		</CardHeader>
		<CardContent>
			<form class="space-y-4">
				<div class="grid gap-4 md:grid-cols-3">
					<div class="space-y-2">
						<Label for="cryptocurrency">Cryptocurrency</Label>
						<Input id="cryptocurrency" placeholder="BTC" bind:value={newWallet.cryptocurrency} required />
					</div>
					<div class="space-y-2">
						<Label for="name">Wallet Name</Label>
						<Input id="name" placeholder="Bitcoin Main Wallet" bind:value={newWallet.name} required />
					</div>
					<div class="space-y-2">
						<Label for="address">Wallet Address</Label>
						<Input id="address" placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" bind:value={newWallet.address} required />
					</div>
				</div>
				<Button type="submit" class="gap-2">
					<Plus class="h-4 w-4" />
					Add Wallet
				</Button>
			</form>
		</CardContent>
	</Card>

	<!-- Existing Wallets -->
	<Card>
		<CardHeader>
			<CardTitle>Platform Wallets ({data.wallets.length})</CardTitle>
		</CardHeader>
		<CardContent>
			{#if data.wallets.length > 0}
				<div class="space-y-3">
					{#each data.wallets as wallet}
						<div class="flex items-center justify-between rounded-lg border border-border/40 p-4">
							<div class="flex-1">
								<div class="flex items-center gap-3">
									<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
										<span class="text-sm font-bold text-primary">{wallet.cryptocurrency}</span>
									</div>
									<div>
										<p class="font-medium text-foreground">{wallet.name}</p>
										<p class="text-sm text-muted-foreground">{wallet.cryptocurrency}</p>
									</div>
								</div>
								<p class="mt-2 truncate text-xs font-mono text-muted-foreground">{wallet.address}</p>
							</div>
							<Button variant="ghost" size="sm" class="text-destructive">
								<Trash2 class="h-4 w-4" />
							</Button>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-center text-sm text-muted-foreground py-8">No platform wallets configured</p>
			{/if}

			<div class="mt-6 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
				<p class="text-sm text-yellow-700 dark:text-yellow-300">
					<strong>TODO:</strong> Implement form actions for add/delete
				</p>
			</div>
		</CardContent>
	</Card>
</div>
