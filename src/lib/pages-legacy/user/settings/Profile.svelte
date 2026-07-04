<script lang="ts">
    import HeadingSmall from '@/components/HeadingSmall.svelte';
    import InputError from '@/components/InputError.svelte';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import * as Avatar from '@/components/ui/avatar';
    import ComboBox from '@/components/ComboBox.svelte';
    import UserLayout from '@/layouts/UserLayout.svelte';
    import SettingsLayout from '@/layouts/settings/UserLayout.svelte';
    import { type BreadcrumbItem, type User } from '@/types';
    import { useForm, Link, page } from '@inertiajs/svelte';
    import { fade } from 'svelte/transition';
    import countries from '@/data/countries.json';
    import { Pencil } from 'lucide-svelte';

    interface Props {
        mustVerifyEmail: boolean;
        status?: string;
    }

    let { mustVerifyEmail, status }: Props = $props();

    const breadcrumbItems: BreadcrumbItem[] = [
        {
            title: 'Profile settings',
            href: 'user/settings/profile',
        },
    ];

    const user = $page.props.auth.user as User;

    let avatarPreview = $state(user.profile_photo_url);
    let avatarInput: HTMLInputElement;

    const form = useForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        company_name: user.company_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        state: user.state || '',
        zip_code: user.zip_code || '',
        country: user.country || '',
        avatar: null as File | null,
    });

    function handleAvatarChange(e: Event) {
        const target = e.target as HTMLInputElement;
        if (target.files && target.files[0]) {
            const file = target.files[0];
            $form.avatar = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                avatarPreview = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    function submit() {
        $form.patch(route('user.profile.update'), {
            preserveScroll: true,
            forceFormData: true,
        });
    }
</script>

<svelte:head>
    <title>Profile Settings</title>
</svelte:head>

<UserLayout breadcrumbs={breadcrumbItems}>
    <SettingsLayout>
        <div class="flex flex-col space-y-6">
            <HeadingSmall title="Profile Information" description="Update your name and email address" />

            <form
                onsubmit={(e) => {
                    e.preventDefault();
                    submit();
                }}
                class="space-y-6"
            >
                <!-- Avatar Section -->
                <div class="flex items-center gap-6">
                    <div class="relative group">
                        <Avatar.Root class="h-20 w-20 cursor-pointer" onclick={() => avatarInput.click()}>
                            <Avatar.Image src={avatarPreview} alt={user.name} />
                            <Avatar.Fallback>{user.first_name?.[0]}{user.last_name?.[0]}</Avatar.Fallback>
                        </Avatar.Root>
                        <div
                            class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                            onclick={() => avatarInput.click()}
                            role="button"
                            tabindex="0"
                            onkeydown={(e) => {
                                if (e.key === 'Enter') avatarInput.click();
                            }}
                        >
                            <Pencil size={16} />
                        </div>
                        <input bind:this={avatarInput} type="file" accept="image/*" class="hidden" onchange={handleAvatarChange} />
                    </div>
                    <div class="flex flex-col gap-1">
                        <h3 class="font-medium">Profile Picture</h3>
                        <p class="text-sm text-muted-foreground">Click on the avatar to upload a new one.</p>
                        <InputError message={$form.errors.avatar} />
                    </div>
                </div>

                {#if user.role === 'company'}
                    <div class="grid gap-2">
                        <Label for="company_name">Company Name</Label>
                        <Input id="company_name" bind:value={$form.company_name} required autocomplete="organization" placeholder="Company Name" />
                        <InputError message={$form.errors.company_name} />
                    </div>
                {:else}
                    <div class="grid gap-4 md:grid-cols-2">
                        <div class="grid gap-2">
                            <Label for="first_name">First Name</Label>
                            <Input id="first_name" bind:value={$form.first_name} required autocomplete="given-name" placeholder="First name" />
                            <InputError message={$form.errors.first_name} />
                        </div>

                        <div class="grid gap-2">
                            <Label for="last_name">Last Name</Label>
                            <Input id="last_name" bind:value={$form.last_name} required autocomplete="family-name" placeholder="Last name" />
                            <InputError message={$form.errors.last_name} />
                        </div>
                    </div>
                {/if}

                <div class="grid gap-2">
                    <Label for="email">Email address</Label>
                    <Input id="email" bind:value={$form.email} required autocomplete="username" placeholder="Email address" />
                    <InputError message={$form.errors.email} />
                </div>

                <div class="grid gap-2">
                    <Label for="phone">Phone Number</Label>
                    <Input id="phone" bind:value={$form.phone} autocomplete="tel" placeholder="Phone number" />
                    <InputError message={$form.errors.phone} />
                </div>

                <div class="grid gap-2">
                    <Label for="address">Address</Label>
                    <Input id="address" bind:value={$form.address} autocomplete="street-address" placeholder="Address" />
                    <InputError message={$form.errors.address} />
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                    <div class="grid gap-2">
                        <Label for="city">City</Label>
                        <Input id="city" bind:value={$form.city} autocomplete="address-level2" placeholder="City" />
                        <InputError message={$form.errors.city} />
                    </div>

                    <div class="grid gap-2">
                        <Label for="state">State</Label>
                        <Input id="state" bind:value={$form.state} autocomplete="address-level1" placeholder="State" />
                        <InputError message={$form.errors.state} />
                    </div>
                </div>

                <div class="grid gap-4 md:grid-cols-2">
                    <div class="grid gap-2">
                        <Label for="zip_code">Zip/Post Code</Label>
                        <Input id="zip_code" bind:value={$form.zip_code} autocomplete="postal-code" placeholder="Zip code" />
                        <InputError message={$form.errors.zip_code} />
                    </div>

                    <div class="grid gap-2">
                        <Label for="country">Country</Label>
                        <ComboBox options={countries} bind:value={$form.country} placeholder="Select country..." />
                        <InputError message={$form.errors.country} />
                    </div>
                </div>

                {#if mustVerifyEmail && !user.email_verified_at}
                    <div>
                        <p class="-mt-4 text-sm text-muted-foreground">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                class="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                            >
                                Click here to resend the verification email.
                            </Link>
                        </p>

                        {#if status === 'verification-link-sent'}
                            <div class="mt-2 text-sm font-medium text-green-600">A new verification link has been sent to your email address.</div>
                        {/if}
                    </div>
                {/if}

                <div class="flex items-center gap-4">
                    <Button type="submit" disabled={$form.processing}>Save</Button>

                    {#if $form.recentlySuccessful}
                        <p class="text-sm text-neutral-600" transition:fade={{ duration: 150 }}>Saved.</p>
                    {/if}
                </div>
            </form>
        </div>
    </SettingsLayout>
</UserLayout>
