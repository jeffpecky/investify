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

	// Pre-fill referral code from URL search param if present
	const referralCodeVal = $derived(form?.data?.referralCode ?? data.ref ?? '');
</script>

<svelte:head>
	<title>Create Account</title>
</svelte:head>

<form
	method="post"
	use:enhance={() => {
		processing = true;
		return async ({ update }) => {
			await update();
			processing = false;
		};
	}}
	class="flex flex-col gap-5"
>
	<div class="grid gap-4">
		<div class="grid grid-cols-2 gap-4">
			<div class="grid gap-2">
				<Label for="firstName">First name</Label>
				<Input
					id="firstName"
					name="firstName"
					type="text"
					required
					placeholder="John"
					value={form?.data?.firstName ?? ''}
					aria-invalid={form?.errors?.firstName ? 'true' : undefined}
				/>
				<InputError message={form?.errors?.firstName ?? undefined} />
			</div>

			<div class="grid gap-2">
				<Label for="lastName">Last name</Label>
				<Input
					id="lastName"
					name="lastName"
					type="text"
					required
					placeholder="Doe"
					value={form?.data?.lastName ?? ''}
					aria-invalid={form?.errors?.lastName ? 'true' : undefined}
				/>
				<InputError message={form?.errors?.lastName ?? undefined} />
			</div>
		</div>

		<div class="grid gap-2">
			<Label for="email">Email</Label>
			<Input
				id="email"
				name="email"
				type="email"
				required
				placeholder="you@example.com"
				value={form?.data?.email ?? ''}
				aria-invalid={form?.errors?.email ? 'true' : undefined}
			/>
			<InputError message={form?.errors?.email ?? undefined} />
		</div>

		<div class="grid gap-2">
			<Label for="phone">Phone number (optional)</Label>
			<Input
				id="phone"
				name="phone"
				type="tel"
				placeholder="+1 (555) 000-0000"
				value={form?.data?.phone ?? ''}
				aria-invalid={form?.errors?.phone ? 'true' : undefined}
			/>
			<InputError message={form?.errors?.phone ?? undefined} />
		</div>

		<div class="grid gap-2">
			<Label for="password">Password</Label>
			<Input
				id="password"
				name="password"
				type="password"
				required
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
				placeholder="••••••••"
				aria-invalid={form?.errors?.passwordConfirmation ? 'true' : undefined}
			/>
			<InputError message={form?.errors?.passwordConfirmation ?? undefined} />
		</div>

		<div class="grid gap-2">
			<Label for="referralCode">Referral Code (optional)</Label>
			<Input
				id="referralCode"
				name="referralCode"
				type="text"
				placeholder="Referral code"
				value={referralCodeVal}
				aria-invalid={form?.errors?.referralCode ? 'true' : undefined}
			/>
			<InputError message={form?.errors?.referralCode ?? undefined} />
		</div>

		<Button type="submit" class="w-full mt-2" disabled={processing}>
			{#if processing}
				<Spinner />
			{/if}
			Create Account
		</Button>
	</div>

	<div class="text-center text-sm text-muted-foreground">
		Already have an account?
		<TextLink href="/login">Sign In</TextLink>
	</div>
</form>
