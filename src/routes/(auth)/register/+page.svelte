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
	class="flex flex-col gap-3.5"
>
	<div class="grid gap-3">
		<div class="grid grid-cols-2 gap-3">
			<div class="grid gap-1.5">
				<Label for="firstName" class="text-xs">First name</Label>
				<Input
					id="firstName"
					name="firstName"
					type="text"
					required
					placeholder="John"
					class="h-9"
					value={form?.data?.firstName ?? ''}
					aria-invalid={form?.errors?.firstName ? 'true' : undefined}
				/>
				<InputError message={form?.errors?.firstName ?? undefined} />
			</div>

			<div class="grid gap-1.5">
				<Label for="lastName" class="text-xs">Last name</Label>
				<Input
					id="lastName"
					name="lastName"
					type="text"
					required
					placeholder="Doe"
					class="h-9"
					value={form?.data?.lastName ?? ''}
					aria-invalid={form?.errors?.lastName ? 'true' : undefined}
				/>
				<InputError message={form?.errors?.lastName ?? undefined} />
			</div>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
			<div class="grid gap-1.5">
				<Label for="email" class="text-xs">Email</Label>
				<Input
					id="email"
					name="email"
					type="email"
					required
					placeholder="you@example.com"
					class="h-9"
					value={form?.data?.email ?? ''}
					aria-invalid={form?.errors?.email ? 'true' : undefined}
				/>
				<InputError message={form?.errors?.email ?? undefined} />
			</div>

			<div class="grid gap-1.5">
				<Label for="phone" class="text-xs">Phone (optional)</Label>
				<Input
					id="phone"
					name="phone"
					type="tel"
					placeholder="+1 (555) 000-0000"
					class="h-9"
					value={form?.data?.phone ?? ''}
					aria-invalid={form?.errors?.phone ? 'true' : undefined}
				/>
				<InputError message={form?.errors?.phone ?? undefined} />
			</div>
		</div>

		<div class="grid gap-1.5">
			<Label for="password" class="text-xs">Password</Label>
			<Input
				id="password"
				name="password"
				type="password"
				required
				placeholder="••••••••"
				class="h-9"
				aria-invalid={form?.errors?.password ? 'true' : undefined}
			/>
			<InputError message={form?.errors?.password ?? undefined} />
		</div>

		<div class="grid gap-1.5">
			<Label for="passwordConfirmation" class="text-xs">Confirm Password</Label>
			<Input
				id="passwordConfirmation"
				name="passwordConfirmation"
				type="password"
				required
				placeholder="••••••••"
				class="h-9"
				aria-invalid={form?.errors?.passwordConfirmation ? 'true' : undefined}
			/>
			<InputError message={form?.errors?.passwordConfirmation ?? undefined} />
		</div>

		<div class="grid gap-1.5">
			<Label for="referralCode" class="text-xs">Referral Code (optional)</Label>
			<Input
				id="referralCode"
				name="referralCode"
				type="text"
				placeholder="Referral code"
				class="h-9"
				value={referralCodeVal}
				aria-invalid={form?.errors?.referralCode ? 'true' : undefined}
			/>
			<InputError message={form?.errors?.referralCode ?? undefined} />
		</div>

		<Button type="submit" class="w-full mt-1 h-9" disabled={processing}>
			{#if processing}
				<Spinner />
			{/if}
			Create Account
		</Button>
	</div>

	<div class="text-center text-xs text-muted-foreground">
		Already have an account?
		<TextLink href="/login" class="text-xs">Sign In</TextLink>
	</div>
</form>
