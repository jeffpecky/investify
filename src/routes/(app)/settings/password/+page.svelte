<script lang="ts">
	import { enhance } from '$app/forms';
	import HeadingSmall from '$lib/components/HeadingSmall.svelte';
	import InputError from '$lib/components/InputError.svelte';
	import SettingsLayout from '$lib/components/settings/SettingsLayout.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { ActionData } from './$types';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();

	let saving = $state(false);
	let message = $state('');
	let isError = $state(false);

	function focusOnError(field: string) {
		if (form?.errors?.[field]) {
			document.getElementById(field)?.focus();
		}
	}
</script>

<svelte:head>
	<title>Password Settings | Ethercore</title>
</svelte:head>

<SettingsLayout>
	<div class="space-y-6">
		<HeadingSmall title="Update Password" description="Ensure your account is using a long, random password to stay secure" />

		{#if message}
			<div class="rounded-lg p-4 {isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}">
				{message}
			</div>
		{/if}

		<form
			method="POST"
			action="?/changePassword"
			use:enhance={() => {
				saving = true;
				message = '';
				return async ({ result }) => {
					saving = false;
					if (result.type === 'success') {
						message = 'Password changed successfully';
						isError = false;
					} else {
						message = result.data?.error || 'Failed to change password';
						isError = true;
						if (form?.errors) {
							setTimeout(() => {
								focusOnError('currentPassword');
							}, 100);
						}
					}
				};
			}}
			class="space-y-6"
		>
			<div class="grid gap-2">
				<Label for="currentPassword">Current password</Label>
				<Input
					id="currentPassword"
					name="currentPassword"
					type="password"
					autocomplete="current-password"
					placeholder="Current password"
				/>
				<InputError message={form?.errors?.currentPassword ?? undefined} />
			</div>

			<div class="grid gap-2">
				<Label for="newPassword">New password</Label>
				<Input
					id="newPassword"
					name="newPassword"
					type="password"
					autocomplete="new-password"
					placeholder="New password"
				/>
				<InputError message={form?.errors?.newPassword ?? undefined} />
			</div>

			<div class="grid gap-2">
				<Label for="passwordConfirmation">Confirm password</Label>
				<Input
					id="passwordConfirmation"
					name="passwordConfirmation"
					type="password"
					autocomplete="new-password"
					placeholder="Confirm password"
				/>
				<InputError message={form?.errors?.passwordConfirmation ?? undefined} />
			</div>

			<div class="flex items-center gap-4">
				<Button type="submit" disabled={saving}>
					{#if saving}
						<span class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
					{/if}
					Save Password
				</Button>

				{#if message && !isError}
					<p class="text-sm text-green-600">Saved.</p>
				{/if}
			</div>
		</form>
	</div>
</SettingsLayout>
