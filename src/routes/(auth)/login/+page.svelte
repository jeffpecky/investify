<script lang="ts">
	import { enhance } from '$app/forms';
	import InputError from '$lib/components/InputError.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
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
	<title>Sign In</title>
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
	class="flex flex-col gap-4"
>
	<div class="grid gap-3.5">
		<div class="grid gap-1.5">
			<Label for="email" class="text-xs">Email</Label>
			<Input
				id="email"
				name="email"
				type="email"
				required
				autofocus
				tabindex={1}
				autocomplete="email"
				placeholder="you@example.com"
				class="h-9"
				value={form?.data?.email ?? ''}
				aria-invalid={form?.errors?.email ? 'true' : undefined}
			/>
			<InputError message={form?.errors?.email ?? undefined} />
		</div>

		<div class="grid gap-1.5">
			<div class="flex items-center justify-between">
				<Label for="password" class="text-xs">Password</Label>
				<TextLink href="/password/request" class="text-[11px]" tabindex={5}>Forgot password?</TextLink>
			</div>
			<Input
				id="password"
				name="password"
				type="password"
				required
				tabindex={2}
				autocomplete="current-password"
				placeholder="••••••••"
				class="h-9"
				aria-invalid={form?.errors?.password ? 'true' : undefined}
			/>
			<InputError message={form?.errors?.password ?? undefined} />
		</div>

		<div class="flex items-center gap-2.5">
			<Checkbox id="remember" name="remember" tabindex={3} />
			<Label for="remember" class="text-xs text-muted-foreground cursor-pointer"
				>Keep me signed in</Label
			>
		</div>

		<Button type="submit" class="w-full h-9 mt-1" tabindex={4} disabled={processing}>
			{#if processing}
				<Spinner />
			{/if}
			Sign In
		</Button>
	</div>

	<div class="text-center text-xs text-muted-foreground">
		New here?
		<TextLink href="/register" class="text-xs" tabindex={5}>Create an account</TextLink>
	</div>
</form>
