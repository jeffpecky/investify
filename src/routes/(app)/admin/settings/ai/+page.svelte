<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let formData = $state($state.snapshot({
		aiProvider: data.settings.ai_provider || 'openai',
		apiKey: '••••••••••••••••',
		model: data.settings.ai_model || 'gpt-4',
		temperature: data.settings.ai_temperature || '0.7',
		maxTokens: data.settings.ai_max_tokens || '2000',
		enabled: data.settings.ai_enabled === 'true'
	}));
</script>

<svelte:head>
	<title>AI Settings - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
	<div>
		<h1 class="text-2xl font-semibold text-foreground">AI Chat Settings</h1>
		<p class="mt-1 text-sm text-muted-foreground">Configure AI assistant for user support</p>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>AI Configuration</CardTitle>
		</CardHeader>
		<CardContent>
			<form class="space-y-4">
				<div class="flex items-center gap-2">
					<input type="checkbox" id="enabled" bind:checked={formData.enabled} class="h-4 w-4" />
					<Label for="enabled">Enable AI Chat Assistant</Label>
				</div>

				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="aiProvider">AI Provider</Label>
						<select id="aiProvider" bind:value={formData.aiProvider} class="w-full rounded-md border border-input bg-background px-3 py-2">
							<option value="openai">OpenAI</option>
							<option value="anthropic">Anthropic</option>
							<option value="google">Google AI</option>
						</select>
					</div>
					<div class="space-y-2">
						<Label for="model">Model</Label>
						<Input id="model" bind:value={formData.model} placeholder="gpt-4" />
					</div>
				</div>

				<div class="space-y-2">
					<Label for="apiKey">API Key</Label>
					<Input id="apiKey" type="password" bind:value={formData.apiKey} />
					<p class="text-xs text-muted-foreground">Keep your API key secure</p>
				</div>

				<div class="grid gap-4 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="temperature">Temperature (0-1)</Label>
						<Input id="temperature" type="number" step="0.1" min="0" max="1" bind:value={formData.temperature} />
					</div>
					<div class="space-y-2">
						<Label for="maxTokens">Max Tokens</Label>
						<Input id="maxTokens" type="number" bind:value={formData.maxTokens} />
					</div>
				</div>

				<div class="border-t pt-4">
					<Button type="submit">Save AI Settings</Button>
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
