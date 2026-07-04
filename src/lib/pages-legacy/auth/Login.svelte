<script lang="ts">
    import InputError from '@/components/InputError.svelte';
    import TextLink from '@/components/TextLink.svelte';
    import { Button } from '@/components/ui/button';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Spinner } from '@/components/ui/spinner';
    import AuthBase from '@/layouts/AuthLayout.svelte';
    import type { BaseFormSnippetProps } from '@/types/forms';
    import { Form } from '@inertiajs/svelte';

    interface Props {
        status?: string;
        canResetPassword: boolean;
        canRegister: boolean;
    }

    let { status, canResetPassword, canRegister }: Props = $props();
</script>

<svelte:head>
    <title>Sign In</title>
</svelte:head>

<AuthBase title="Welcome back" description="Sign in to access your portfolio and manage your investments">
    {#if status}
        <div class="mb-4 rounded-lg bg-success/10 px-4 py-3 text-center text-sm font-medium text-success">
            {status}
        </div>
    {/if}

    <Form method="post" action={route('login')} resetOnSuccess={['password']} class="flex flex-col gap-6">
        {#snippet children({ errors, processing }: BaseFormSnippetProps)}
            <div class="grid gap-5">
                <div class="grid gap-2">
                    <Label for="email">Email</Label>
                    <Input id="email" name="email" type="email" required autofocus tabindex={1} autocomplete="email" placeholder="you@example.com" />
                    <InputError message={errors.email} />
                </div>

                <div class="grid gap-2">
                    <div class="flex items-center justify-between">
                        <Label for="password">Password</Label>
                        {#if canResetPassword}
                            <TextLink href={route('password.request')} class="text-xs" tabindex={5}>Forgot password?</TextLink>
                        {/if}
                    </div>
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        required
                        tabindex={2}
                        autocomplete="current-password"
                        placeholder="••••••••"
                    />
                    <InputError message={errors.password} />
                </div>

                <div class="flex items-center gap-3">
                    <Checkbox id="remember" name="remember" tabindex={3} />
                    <Label for="remember" class="text-sm text-muted-foreground cursor-pointer">Keep me signed in</Label>
                </div>

                <Button type="submit" class="w-full" tabindex={4} disabled={processing}>
                    {#if processing}
                        <Spinner />
                    {/if}
                    Sign In
                </Button>
            </div>

            {#if canRegister}
                <div class="text-center text-sm text-muted-foreground">
                    New here?
                    <TextLink href={route('register')} tabindex={5}>Create an account</TextLink>
                </div>
            {/if}
        {/snippet}
    </Form>
</AuthBase>
