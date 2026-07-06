<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let formData = $state($state.snapshot({
		siteName: data.settings.site_name || '',
		siteDescription: data.settings.site_description || '',
		contactEmail: data.settings.contact_email || '',
		contactPhone: data.settings.contact_phone || '',
		address: data.settings.address || ''
	}));
</script>

<svelte:head>
	<title>Website Settings - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Website Settings</h1>
		<p class="mt-1 text-sm text-muted-foreground">Configure site information and branding</p>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>General Information</CardTitle>
		</CardHeader>
		<CardContent>
			<form class="space-y-4">
				<div class="space-y-2">
					<Label for="siteName">Site Name</Label>
					<Input id="siteName" bind:value={formData.siteName} placeholder="Ethercore" />
				</div>
				<div class="space-y-2">
					<Label for="siteDescription">Site Description</Label>
					<Input id="siteDescription" bind:value={formData.siteDescription} placeholder="Your investment platform" />
				</div>
				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="contactEmail">Contact Email</Label>
						<Input id="contactEmail" type="email" bind:value={formData.contactEmail} placeholder="contact@ethercore.org" />
					</div>
					<div class="space-y-2">
						<Label for="contactPhone">Contact Phone</Label>
						<Input id="contactPhone" bind:value={formData.contactPhone} placeholder="+1 234 567 8900" />
					</div>
				</div>
				<div class="space-y-2">
					<Label for="address">Address</Label>
					<Input id="address" bind:value={formData.address} placeholder="123 Main St, City, Country" />
				</div>
				<div class="border-t pt-4">
					<Button type="submit">Save Changes</Button>
				</div>
			</form>

			<div class="mt-6 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-4">
				<p class="text-sm text-yellow-700 dark:text-yellow-300">
					<strong>TODO:</strong> Implement form action handler
				</p>
			</div>
		</CardContent>
	</Card>
</div>
