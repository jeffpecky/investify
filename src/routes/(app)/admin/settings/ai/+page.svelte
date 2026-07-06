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
	<title>AI Settings - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">AI Chat Settings</h1>
		<p class="mt-1 text-sm text-muted-foreground">Configure AI assistant for user support</p>
	</div>

	<Card class="border-border/50">
		<CardHeader class="pb-2">
			<CardTitle class="text-base">AI Configuration</CardTitle>
		</CardHeader>
		<CardContent class="p-3 pt-0">
			<form method="POST" action="?/updateSettings" use:enhance class="space-y-3">
				<div class="flex items-center gap-2">
					<input type="checkbox" id="enabled" name="enabled" value="true" checked={data.settings.ai_enabled === 'true'} class="h-4 w-4" />
					<Label for="enabled" class="text-xs">Enable AI Chat Assistant</Label>
				</div>

				<div class="grid gap-3 md:grid-cols-2">
					<div class="space-y-1.5">
						<Label for="groqApiKey" class="text-xs">API Key</Label>
						<Input id="groqApiKey" name="groqApiKey" type="password" value={data.settings.groq_api_key || ''} />
						<p class="text-xs text-muted-foreground">Keep your API key secure</p>
					</div>
					<div class="space-y-1.5">
						<Label for="model" class="text-xs">Model</Label>
						<Input id="model" name="model" value={data.settings.model || 'llama3-8b-8192'} placeholder="llama3-8b-8192" />
					</div>
				</div>

				<div class="border-t border-border/30 pt-3">
					<Button type="submit" size="sm">Save AI Settings</Button>
				</div>
			</form>
		</CardContent>
	</Card>
</div>
