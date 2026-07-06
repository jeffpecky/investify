<script lang="ts">
	import { enhance } from '$app/forms';
	import HeadingSmall from '$lib/components/HeadingSmall.svelte';
	import InputError from '$lib/components/InputError.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Avatar from '$lib/components/ui/avatar';
	import ComboBox from '$lib/components/ComboBox.svelte';
	import countries from '$lib/data/countries.json';
	import { Pencil } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let profile = $state($state.snapshot(data.profile || {}));
	let saving = $state(false);
	let message = $state('');
	let isError = $state(false);
	let avatarPreview = $state($state.snapshot(data.profile?.avatarPath || ''));
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

	$effect(() => {
		if (form?.success) {
			toast.success(form.message || 'Profile updated successfully');
		} else if (form?.error) {
			toast.error(form.error || 'Failed to update profile');
		}
	});
</script>

<svelte:head>
	<title>Profile Settings - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Profile Settings</h1>
		<p class="mt-1 text-sm text-muted-foreground">Update your admin account information</p>
	</div>

	<div class="flex flex-col space-y-6">
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
						<Avatar.Image src={avatarPreview} alt={data.user?.name || 'Admin'} />
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
				</div>

				<div class="grid gap-2">
					<Label for="country">Country</Label>
					<ComboBox options={countries} bind:value={countryValue} placeholder="Select country..." />
					<input type="hidden" name="country" value={countryValue} />
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
</div>
