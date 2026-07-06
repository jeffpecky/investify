<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Plus, Trash2 } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData, form?: ActionData } = $props();

	$effect(() => {
		if (form?.success) {
			toast.success(form.message || 'Action completed');
		} else if (form?.error) {
			toast.error(form.error || 'Action failed');
		}
	});
</script>

<svelte:head>
	<title>Wallet Settings - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Platform Wallets</h1>
		<p class="mt-1 text-sm text-muted-foreground">Manage crypto wallets for receiving payments</p>
	</div>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="text-base">Add New Wallet</CardTitle>
		</CardHeader>
		<CardContent class="p-3 pt-0">
			<form method="POST" action="?/addWallet" use:enhance class="space-y-3">
				<div class="grid gap-3 md:grid-cols-3">
					<div class="space-y-1.5">
						<Label for="cryptocurrency" class="text-xs">Cryptocurrency</Label>
						<Input id="cryptocurrency" name="cryptocurrency" placeholder="BTC" required />
					</div>
					<div class="space-y-1.5">
						<Label for="name" class="text-xs">Wallet Name</Label>
						<Input id="name" name="name" placeholder="Bitcoin Main Wallet" required />
					</div>
					<div class="space-y-1.5">
						<Label for="address" class="text-xs">Wallet Address</Label>
						<Input id="address" name="address" placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" required />
					</div>
				</div>
				<Button type="submit" size="sm" class="gap-2">
					<Plus class="h-4 w-4" />
					Add Wallet
				</Button>
			</form>
		</CardContent>
	</Card>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="text-base">Platform Wallets ({data.wallets.length})</CardTitle>
		</CardHeader>
		<CardContent class="p-3 pt-0">
			{#if data.wallets.length > 0}
				<div class="space-y-2">
					{#each data.wallets as wallet}
						<div class="flex items-center justify-between rounded-lg border border-border/40 p-3">
							<div class="flex items-center gap-3">
								<div class="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
									<span class="text-xs font-bold text-primary">{wallet.cryptocurrency}</span>
								</div>
								<div>
									<p class="font-medium text-foreground">{wallet.name}</p>
									<p class="truncate text-xs font-mono text-muted-foreground max-w-[300px]">{wallet.address}</p>
								</div>
							</div>
							<form method="POST" action="?/deleteWallet" use:enhance>
								<input type="hidden" name="walletId" value={wallet.id} />
								<Button variant="ghost" size="sm" type="submit" class="text-destructive hover:text-destructive">
									<Trash2 class="h-4 w-4" />
								</Button>
							</form>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-center text-sm text-muted-foreground py-8">No platform wallets configured</p>
			{/if}
		</CardContent>
	</Card>
</div>
