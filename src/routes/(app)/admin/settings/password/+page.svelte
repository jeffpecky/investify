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

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Change Password</h1>
		<p class="mt-1 text-sm text-muted-foreground">Update your admin account password</p>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Password Update</CardTitle>
		</CardHeader>
		<CardContent>
			<form class="space-y-4">
				<div class="space-y-2">
					<Label for="currentPassword">Current Password</Label>
					<Input id="currentPassword" type="password" bind:value={formData.currentPassword} required />
				</div>
				<div class="space-y-2">
					<Label for="newPassword">New Password</Label>
					<Input id="newPassword" type="password" bind:value={formData.newPassword} required />
				</div>
				<div class="space-y-2">
					<Label for="confirmPassword">Confirm New Password</Label>
					<Input id="confirmPassword" type="password" bind:value={formData.confirmPassword} required />
				</div>
				<div class="border-t pt-4">
					<Button type="submit">Update Password</Button>
				</div>
			</form>

			<div class="mt-6 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
				<p class="text-sm text-yellow-700 dark:text-yellow-300">
					<strong>TODO:</strong> Implement password change form action
				</p>
			</div>
		</CardContent>
	</Card>
</div>
