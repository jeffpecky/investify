<script lang="ts">
	import { enhance } from '$app/forms';
	import InputError from '$lib/components/InputError.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Spinner } from '$lib/components/ui/spinner';
	import TextLink from '$lib/components/TextLink.svelte';
	import type { ActionData } from './$types';

	interface Props {
		form: ActionData;
	}

	let { form }: Props = $props();

	let processing = $state(false);
</script>

<svelte:head>
	<title>Forgot Password</title>
</svelte:head>

{#if form?.success}
	<div
		class="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800 dark:border-green-900/30 dark:bg-green-950/20 dark:text-green-400"
	>
		<p class="font-medium">Password reset email sent</p>
		<p class="mt-1">Please check your inbox for instructions to reset your password.</p>
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
				<Label for="email">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					required
					autofocus
					tabindex={1}
					autocomplete="email"
					placeholder="you@example.com"
					value={form?.data?.email ?? ''}
					aria-invalid={form?.errors?.email ? 'true' : undefined}
				/>
				<InputError message={form?.errors?.email ?? undefined} />
			</div>

			<Button type="submit" class="w-full" tabindex={2} disabled={processing}>
				{#if processing}
					<Spinner />
				{/if}
				Send Reset Link
			</Button>
		</div>

		<div class="text-center text-sm text-muted-foreground">
			Remember your password?
			<TextLink href="/login" tabindex={3}>Sign In</TextLink>
		</div>
	</form>
{/if}
