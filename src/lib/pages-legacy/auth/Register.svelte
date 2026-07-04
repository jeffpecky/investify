<script lang="ts">
    import InputError from '@/components/InputError.svelte';
    import TextLink from '@/components/TextLink.svelte';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Spinner } from '@/components/ui/spinner';
    import AuthBase from '@/layouts/AuthLayout.svelte';
    import type { BaseFormSnippetProps } from '@/types/forms';
    import { Form } from '@inertiajs/svelte';
</script>

<svelte:head>
    <title>Create Account</title>
</svelte:head>

<AuthBase title="Get started" description="Create your account to start building your portfolio">
    <Form method="post" action={route('register')} resetOnSuccess={['password', 'password_confirmation']} class="flex flex-col gap-6">
        {#snippet children({ errors, processing }: BaseFormSnippetProps)}
            <div class="grid gap-5">
                <div class="grid grid-cols-2 gap-3">
                    <div class="grid gap-2">
                        <Label for="first_name">First name</Label>
                        <Input
                            id="first_name"
                            name="first_name"
                            type="text"
                            required
                            autofocus
                            tabindex={1}
                            autocomplete="given-name"
                            placeholder="John"
                        />
                        <InputError message={errors.first_name} />
                    </div>

                    <div class="grid gap-2">
                        <Label for="last_name">Last name</Label>
                        <Input id="last_name" name="last_name" type="text" required tabindex={2} autocomplete="family-name" placeholder="Doe" />
                        <InputError message={errors.last_name} />
                    </div>
                </div>

                <div class="grid gap-2">
                    <Label for="email">Email</Label>
                    <Input id="email" name="email" type="email" required tabindex={3} autocomplete="email" placeholder="you@example.com" />
                    <InputError message={errors.email} />
                </div>

                <div class="grid gap-2">
                    <Label for="password">Password</Label>
                    <Input id="password" name="password" type="password" required tabindex={4} autocomplete="new-password" placeholder="••••••••" />
                    <InputError message={errors.password} />
                </div>

                <div class="grid gap-2">
                    <Label for="password_confirmation">Confirm password</Label>
                    <Input
                        id="password_confirmation"
                        name="password_confirmation"
                        type="password"
                        required
                        tabindex={5}
                        autocomplete="new-password"
                        placeholder="••••••••"
                    />
                    <InputError message={errors.password_confirmation} />
                </div>

                <Button type="submit" class="w-full" tabindex={6} disabled={processing}>
                    {#if processing}
                        <Spinner />
                    {/if}
                    Create Account
                </Button>
            </div>

            <div class="text-center text-sm text-muted-foreground">
                Already have an account?
                <TextLink href={route('login')} tabindex={7}>Sign in</TextLink>
            </div>
        {/snippet}
    </Form>
</AuthBase>
