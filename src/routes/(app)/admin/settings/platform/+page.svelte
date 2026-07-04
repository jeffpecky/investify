<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let formData = $state({
		tokenMultiplier: data.settings.token_multiplier || '1.0',
		minWithdrawal: data.settings.min_withdrawal || '10',
		maxWithdrawal: data.settings.max_withdrawal || '100000',
		referralBonus: data.settings.referral_bonus || '100'
	});
</script>

<svelte:head>
	<title>Platform Settings - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Platform Settings</h1>
		<p class="mt-1 text-sm text-muted-foreground">Configure platform behavior and limits</p>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Token Configuration</CardTitle>
		</CardHeader>
		<CardContent>
			<form class="space-y-4">
				<div class="space-y-2">
					<Label for="tokenMultiplier">Token Multiplier</Label>
					<Input id="tokenMultiplier" type="number" step="0.01" bind:value={formData.tokenMultiplier} />
					<p class="text-xs text-muted-foreground">How many tokens users earn per dollar invested</p>
				</div>
				<div class="space-y-2">
					<Label for="referralBonus">Referral Bonus ($)</Label>
					<Input id="referralBonus" type="number" bind:value={formData.referralBonus} />
				</div>
				<div class="border-t pt-4">
					<Button type="submit">Save Changes</Button>
				</div>
			</form>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Withdrawal Limits</CardTitle>
		</CardHeader>
		<CardContent>
			<form class="space-y-4">
				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="minWithdrawal">Minimum Withdrawal ($)</Label>
						<Input id="minWithdrawal" type="number" bind:value={formData.minWithdrawal} />
					</div>
					<div class="space-y-2">
						<Label for="maxWithdrawal">Maximum Withdrawal ($)</Label>
						<Input id="maxWithdrawal" type="number" bind:value={formData.maxWithdrawal} />
					</div>
				</div>
				<div class="border-t pt-4">
					<Button type="submit">Save Changes</Button>
				</div>
			</form>

			<div class="mt-6 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
				<p class="text-sm text-yellow-700 dark:text-yellow-300">
					<strong>TODO:</strong> Implement form action handler
				</p>
			</div>
		</CardContent>
	</Card>
</div>
