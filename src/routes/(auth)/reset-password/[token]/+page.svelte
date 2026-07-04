<script lang="ts">
	import { enhance } from '$app/forms';
	import InputError from '$lib/components/InputError.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Spinner } from '$lib/components/ui/spinner';
	import TextLink from '$lib/components/TextLink.svelte';
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let processing = $state(false);
</script>

<svelte:head>
	<title>Reset Password</title>
</svelte:head>

{#if data.invalidToken}
	<div
		class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400"
	>
		<p class="font-medium">Invalid or Expired Link</p>
		<p class="mt-1">This password reset link is invalid or has expired.</p>
	</div>
	<div class="mt-6 text-center text-sm">
		<TextLink href="/forgot-password">Request a new reset link</TextLink>
	</div>
{:else}
	{#if form?.success}
		<div
			class="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900/30 dark:bg-green-950/20 dark:text-green-400"
		>
			<p class="font-medium">Password updated</p>
			<p class="mt-1">Your password has been successfully reset.</p>
		</div>
		<div class="mt-6 text-center text-sm">
			<TextLink href="/login">Return to Sign In</TextLink>
		</div>
	{:else}
		<form
			method="post"
			use:enhance={() => {
				processing = true;
				return async ({ update }) => {
					await update();
					processing = false;
				};
			}}
			class="flex flex-col gap-6"
		>
			<div class="grid gap-5">
				<div class="grid gap-2">
					<Label for="password">New Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						required
						autofocus
						tabindex={1}
						placeholder="••••••••"
						aria-invalid={form?.errors?.password ? 'true' : undefined}
					/>
					<InputError message={form?.errors?.password ?? undefined} />
				</div>

				<div class="grid gap-2">
					<Label for="passwordConfirmation">Confirm Password</Label>
					<Input
						id="passwordConfirmation"
						name="passwordConfirmation"
						type="password"
						required
						tabindex={2}
						placeholder="••••••••"
						aria-invalid={form?.errors?.passwordConfirmation ? 'true' : undefined}
					/>
					<InputError message={form?.errors?.passwordConfirmation ?? undefined} />
				</div>

				<Button type="submit" class="w-full" tabindex={3} disabled={processing}>
					{#if processing}
						<Spinner />
					{/if}
					Reset Password
				</Button>
			</div>

			<div class="text-center text-sm text-muted-foreground">
				Remember your password?
				<TextLink href="/login" tabindex={4}>Sign In</TextLink>
			</div>
		</form>
	{/if}
{/if}
