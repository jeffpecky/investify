<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';

	let formData = $state({
		currentPassword: '',
		newPassword: '',
		confirmPassword: ''
	});
</script>

<svelte:head>
	<title>Change Password - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Change Password</h1>
		<p class="mt-1 text-sm text-muted-foreground">Update your admin account password</p>
	</div>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="text-base">Password Update</CardTitle>
		</CardHeader>
		<CardContent class="space-y-3 p-3 pt-0">
			<div class="space-y-1.5">
				<Label for="currentPassword" class="text-xs">Current Password</Label>
				<Input id="currentPassword" name="currentPassword" type="password" bind:value={formData.currentPassword} required class="h-9" />
			</div>
			<div class="space-y-1.5">
				<Label for="newPassword" class="text-xs">New Password</Label>
				<Input id="newPassword" name="newPassword" type="password" bind:value={formData.newPassword} required class="h-9" />
			</div>
			<div class="space-y-1.5">
				<Label for="confirmPassword" class="text-xs">Confirm New Password</Label>
				<Input id="confirmPassword" name="confirmPassword" type="password" bind:value={formData.confirmPassword} required class="h-9" />
			</div>
			<div class="border-t border-border/30 pt-3">
				<Button type="submit" size="sm">Update Password</Button>
			</div>
		</CardContent>
	</Card>
</div>
