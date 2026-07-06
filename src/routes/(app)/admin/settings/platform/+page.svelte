<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData, form?: ActionData } = $props();

	$effect(() => {
		if (form?.success) {
			toast.success(form.message || 'Settings updated');
		} else if (form?.error) {
			toast.error(form.error || 'Update failed');
		}
	});
</script>

<svelte:head>
	<title>Platform Settings - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Platform Settings</h1>
		<p class="mt-1 text-sm text-muted-foreground">Configure platform behavior and limits</p>
	</div>

	<form method="POST" action="?/updateSettings" use:enhance>
		<Card class="border-border/50">
			<CardHeader class="pb-2">
				<CardTitle class="text-base">Token Configuration</CardTitle>
			</CardHeader>
			<CardContent class="space-y-3 p-3 pt-0">
				<div class="space-y-1.5">
					<Label for="tokenMultiplier" class="text-xs">Token Multiplier</Label>
					<Input id="tokenMultiplier" name="tokenMultiplier" type="number" step="0.01" value={data.settings.token_multiplier || '1.0'} />
					<p class="text-xs text-muted-foreground">How many tokens users earn per dollar invested</p>
				</div>
				<div class="space-y-1.5">
					<Label for="referralBonus" class="text-xs">Referral Bonus ($)</Label>
					<Input id="referralBonus" name="referralBonus" type="number" value={data.settings.referral_bonus || '100'} />
				</div>
			</CardContent>
		</Card>

		<Card class="mt-4 border-border/50">
			<CardHeader class="pb-2">
				<CardTitle class="text-base">Withdrawal Limits</CardTitle>
			</CardHeader>
			<CardContent class="space-y-3 p-3 pt-0">
				<div class="grid gap-3 md:grid-cols-2">
					<div class="space-y-1.5">
						<Label for="minWithdrawal" class="text-xs">Minimum Withdrawal ($)</Label>
						<Input id="minWithdrawal" name="minWithdrawal" type="number" value={data.settings.min_withdrawal || '10'} />
					</div>
					<div class="space-y-1.5">
						<Label for="maxWithdrawal" class="text-xs">Maximum Withdrawal ($)</Label>
						<Input id="maxWithdrawal" name="maxWithdrawal" type="number" value={data.settings.max_withdrawal || '100000'} />
					</div>
				</div>
				<div class="border-t border-border/30 pt-3">
					<Button type="submit" size="sm">Save Changes</Button>
				</div>
			</CardContent>
		</Card>
	</form>
</div>
