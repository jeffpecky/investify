<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData, form?: ActionData } = $props();

	$effect(() => {
		if (form?.success) {
			toast.success(form.message || 'Settings updated');
		} else if (form?.error) {
			toast.error(form.error || 'Update failed');
		}
	});
</script>

<svelte:head>
	<title>Website Settings - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">Website Settings</h1>
		<p class="mt-1 text-sm text-muted-foreground">Configure site information and branding</p>
	</div>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="text-base">General Information</CardTitle>
		</CardHeader>
		<CardContent class="p-3 pt-0">
			<form method="POST" action="?/updateSettings" use:enhance class="space-y-3">
				<div class="space-y-1.5">
					<Label for="siteName" class="text-xs">Site Name</Label>
					<Input id="siteName" name="siteName" value={data.settings.site_name || ''} placeholder="Ethercore" />
				</div>
				<div class="space-y-1.5">
					<Label for="siteDescription" class="text-xs">Site Description</Label>
					<Input id="siteDescription" name="siteDescription" value={data.settings.site_description || ''} placeholder="Your investment platform" />
				</div>
				<div class="grid gap-3 md:grid-cols-2">
					<div class="space-y-1.5">
						<Label for="contactEmail" class="text-xs">Contact Email</Label>
						<Input id="contactEmail" name="contactEmail" type="email" value={data.settings.site_email || ''} placeholder="contact@ethercore.org" />
					</div>
					<div class="space-y-1.5">
						<Label for="contactPhone" class="text-xs">Contact Phone</Label>
						<Input id="contactPhone" name="contactPhone" value={data.settings.site_phone || ''} placeholder="+1 234 567 8900" />
					</div>
				</div>
				<div class="space-y-1.5">
					<Label for="address" class="text-xs">Address</Label>
					<Input id="address" name="address" value={data.settings.site_address || ''} placeholder="123 Main St, City, Country" />
				</div>
				<div class="border-t border-border/30 pt-3">
					<Button type="submit" size="sm">Save Changes</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>
