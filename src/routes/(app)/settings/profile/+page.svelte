<script lang="ts">
	import { enhance } from '$app/forms';
	import HeadingSmall from '$lib/components/HeadingSmall.svelte';
	import InputError from '$lib/components/InputError.svelte';
	import SettingsLayout from '$lib/components/settings/SettingsLayout.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Avatar from '$lib/components/ui/avatar';
	import ComboBox from '$lib/components/ComboBox.svelte';
	import countries from '$lib/data/countries.json';
	import { Pencil } from 'lucide-svelte';
	import type { ActionData, PageData } from './$types';

	interface Props {
		data: PageData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let profile = $state($state.snapshot(data.profile || {}));
	let saving = $state(false);
	let message = $state('');
	let isError = $state(false);
	let avatarPreview = $state($state.snapshot(data.user?.profilePhotoUrl || ''));
	let avatarInput: HTMLInputElement;
	let countryValue = $state(profile.country || '');

	function handleAvatarChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			const file = target.files[0];
			const reader = new FileReader();
			reader.onload = (ev) => {
				avatarPreview = ev.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}
</script>

<svelte:head>
	<title>Profile Settings | Ethercore</title>
</svelte:head>

<SettingsLayout>
	<div class="flex flex-col space-y-6">
		<HeadingSmall title="Profile Information" description="Update your name and email address" />

		{#if message}
			<div class="rounded-lg p-4 {isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}">
				{message}
			</div>
		{/if}

		<form
			method="POST"
			action="?/updateProfile"
			enctype="multipart/form-data"
			use:enhance={() => {
				saving = true;
				message = '';
				return async ({ result, update }) => {
					saving = false;
					if (result.type === 'success') {
						message = 'Profile updated successfully';
						isError = false;
					} else {
						message = result.data?.error || 'Failed to update profile';
						isError = true;
					}
					await update();
				};
			}}
			class="space-y-6"
		>
			<!-- Avatar Section -->
			<div class="flex items-center gap-6">
				<div class="relative group">
					<Avatar.Root class="h-20 w-20 cursor-pointer" onclick={() => avatarInput.click()}>
						<Avatar.Image src={avatarPreview} alt={data.user?.name || 'User'} />
						<Avatar.Fallback>{data.user?.firstName?.[0]}{data.user?.lastName?.[0]}</Avatar.Fallback>
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
					<input bind:this={avatarInput} type="file" name="avatar" accept="image/*" class="hidden" onchange={handleAvatarChange} />
				</div>
				<div class="flex flex-col gap-1">
					<h3 class="font-medium">Profile Picture</h3>
					<p class="text-sm text-muted-foreground">Click on the avatar to upload a new one.</p>
					<InputError message={form?.errors?.avatar ?? undefined} />
				</div>
			</div>

			<div class="grid gap-4 md:grid-cols-2">
				<div class="grid gap-2">
					<Label for="firstName">First Name *</Label>
					<Input
						id="firstName"
						name="firstName"
						type="text"
						required
						autocomplete="given-name"
						placeholder="First name"
						value={profile.firstName ?? ''}
					/>
					<InputError message={form?.errors?.firstName ?? undefined} />
				</div>

				<div class="grid gap-2">
					<Label for="lastName">Last Name *</Label>
					<Input
						id="lastName"
						name="lastName"
						type="text"
						required
						autocomplete="family-name"
						placeholder="Last name"
						value={profile.lastName ?? ''}
					/>
					<InputError message={form?.errors?.lastName ?? undefined} />
				</div>
			</div>

			<div class="grid gap-2">
				<Label for="email">Email address</Label>
				<Input
					id="email"
					type="email"
					value={profile.email ?? ''}
					disabled
					class="bg-muted text-muted-foreground"
					autocomplete="username"
				/>
				<p class="text-xs text-muted-foreground">Email cannot be changed</p>
			</div>

			<div class="grid gap-2">
				<Label for="phone">Phone Number</Label>
				<Input
					id="phone"
					name="phone"
					type="tel"
					autocomplete="tel"
					placeholder="Phone number"
					value={profile.phone ?? ''}
				/>
				<InputError message={form?.errors?.phone ?? undefined} />
			</div>

			<div class="grid gap-2">
				<Label for="companyName">Company Name</Label>
				<Input
					id="companyName"
					name="companyName"
					type="text"
					autocomplete="organization"
					placeholder="Company Name"
					value={profile.companyName ?? ''}
				/>
				<InputError message={form?.errors?.companyName ?? undefined} />
			</div>

			<div class="grid gap-2">
				<Label for="address">Address</Label>
				<Input
					id="address"
					name="address"
					type="text"
					autocomplete="street-address"
					placeholder="Address"
					value={profile.address ?? ''}
				/>
				<InputError message={form?.errors?.address ?? undefined} />
			</div>

			<div class="grid gap-4 md:grid-cols-2">
				<div class="grid gap-2">
					<Label for="city">City</Label>
					<Input
						id="city"
						name="city"
						type="text"
						autocomplete="address-level2"
						placeholder="City"
						value={profile.city ?? ''}
					/>
					<InputError message={form?.errors?.city ?? undefined} />
				</div>

				<div class="grid gap-2">
					<Label for="state">State</Label>
					<Input
						id="state"
						name="state"
						type="text"
						autocomplete="address-level1"
						placeholder="State"
						value={profile.state ?? ''}
					/>
					<InputError message={form?.errors?.state ?? undefined} />
				</div>
			</div>

			<div class="grid gap-4 md:grid-cols-2">
				<div class="grid gap-2">
					<Label for="zipCode">Zip/Post Code</Label>
					<Input
						id="zipCode"
						name="zipCode"
						type="text"
						autocomplete="postal-code"
						placeholder="Zip code"
						value={profile.zipCode ?? ''}
					/>
					<InputError message={form?.errors?.zipCode ?? undefined} />
				</div>

				<div class="grid gap-2">
					<Label for="country">Country</Label>
					<ComboBox options={countries} bind:value={countryValue} placeholder="Select country..." />
					<input type="hidden" name="country" value={countryValue} />
					<InputError message={form?.errors?.country ?? undefined} />
				</div>
			</div>

			<div class="flex items-center gap-4">
				<Button type="submit" disabled={saving}>
					{#if saving}
						<span class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
					{/if}
					Save Changes
				</Button>

				{#if message && !isError}
					<p class="text-sm text-green-600">Saved.</p>
				{/if}
			</div>
		</form>
	</div>
</SettingsLayout>
