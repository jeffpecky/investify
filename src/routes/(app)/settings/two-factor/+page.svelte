<script lang="ts">
	import { enhance } from '$app/forms';
	import HeadingSmall from '$lib/components/HeadingSmall.svelte';
	import SettingsLayout from '$lib/components/settings/SettingsLayout.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import LoadingSpinner from '$lib/components/ui/LoadingSpinner.svelte';
	import ConfirmationDialog from '$lib/components/ui/ConfirmationDialog.svelte';
	import { ShieldBan, ShieldCheck } from 'lucide-svelte';

	let { data } = $props();
	let loading = $state(false);
	let enabling = $state(false);
	let showConfirmDisable = $state(false);
	let qrCodeData = $state<string | null>(null);
	let backupCodes = $state<string[]>([]);
	let message = $state('');
	let isError = $state(false);

	async function handleEnable() {
		enabling = true;
		message = '';
		try {
			const response = await fetch('/api/2fa/enable', { method: 'POST' });
			const result = await response.json();
			if (result.success) {
				qrCodeData = result.qrCode;
				backupCodes = result.backupCodes;
			} else {
				message = result.error || 'Failed to enable 2FA';
				isError = true;
			}
		} catch {
			message = 'Failed to enable 2FA';
			isError = true;
		} finally {
			enabling = false;
		}
	}

	function handleDisable() {
		showConfirmDisable = true;
	}
</script>

<svelte:head>
	<title>Two-Factor Authentication | Ethercore</title>
</svelte:head>

<SettingsLayout>
	<div class="space-y-6">
		<HeadingSmall title="Two-Factor Authentication" description="Manage your two-factor authentication settings" />

		{#if message}
			<div class="rounded-lg p-4 {isError ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}">
				{message}
			</div>
		{/if}

		{#if data.twoFactorEnabled}
			<div class="flex flex-col items-start justify-start space-y-4">
				<Badge variant="default">Enabled</Badge>

				<p class="text-muted-foreground">
					With two-factor authentication enabled, you will be prompted for a secure, random pin during login, which you can retrieve
					from the TOTP-supported application on your phone.
				</p>

				<div class="relative inline">
					<Button variant="destructive" onclick={handleDisable} disabled={loading}>
						{#if loading}
							<LoadingSpinner size="sm" />
						{:else}
							<ShieldBan class="size-4" />
						{/if}
						Disable 2FA
					</Button>
				</div>
			</div>
		{:else if qrCodeData}
			<div class="rounded-xl border bg-card p-6 space-y-4">
				<h3 class="font-semibold">Scan QR Code</h3>
				<p class="text-sm text-muted-foreground">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>

				<div class="flex justify-center">
					<img src={qrCodeData} alt="2FA QR Code" class="rounded-lg border" />
				</div>

				{#if backupCodes.length > 0}
					<div>
						<h4 class="mb-2 text-sm font-medium">Backup Codes</h4>
						<p class="mb-2 text-xs text-muted-foreground">Save these codes in a secure place. Each can be used once if you lose access to your authenticator.</p>
						<div class="grid grid-cols-2 gap-2 md:grid-cols-4">
							{#each backupCodes as code}
								<code class="rounded bg-muted px-2 py-1 text-center text-sm">{code}</code>
							{/each}
						</div>
					</div>
				{/if}

				<form
					method="POST"
					action="?/confirmTwoFactor"
					use:enhance={() => {
						loading = true;
						return async ({ result }) => {
							loading = false;
							if (result.type === 'success') {
								message = '2FA enabled successfully';
								isError = false;
								qrCodeData = null;
								backupCodes = [];
							} else {
								message = result.data?.error || 'Failed to confirm 2FA';
								isError = true;
							}
						};
					}}
					class="space-y-4"
				>
					<div>
						<label for="code" class="mb-1 block text-sm font-medium">Enter verification code</label>
						<input
							type="text"
							id="code"
							name="code"
							placeholder="000000"
							maxlength="6"
							required
							class="w-full rounded-lg border bg-background px-4 py-2.5 text-center text-lg tracking-[0.5em]"
						/>
					</div>

					<div class="flex justify-end">
						<button
							type="submit"
							disabled={loading}
							class="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50"
						>
							{#if loading}
								<LoadingSpinner size="sm" />
							{/if}
							Confirm & Enable
						</button>
					</div>
				</form>
			</div>
		{:else}
			<div class="flex flex-col items-start justify-start space-y-4">
				<Badge variant="destructive">Disabled</Badge>

				<p class="text-muted-foreground">
					When you enable two-factor authentication, you will be prompted for a secure pin during login. This pin can be retrieved from
					a TOTP-supported application on your phone.
				</p>

				<Button onclick={handleEnable} disabled={enabling}>
					{#if enabling}
						<LoadingSpinner size="sm" />
					{:else}
						<ShieldCheck class="size-4" />
					{/if}
					Enable 2FA
				</Button>
			</div>
		{/if}
	</div>
</SettingsLayout>

{#if showConfirmDisable}
	<ConfirmationDialog
		title="Disable Two-Factor Authentication?"
		message="Your account will be less secure. You can re-enable 2FA at any time."
		confirmLabel="Disable"
		variant="danger"
		onConfirm={async () => {
			loading = true;
			try {
				const response = await fetch('/api/2fa/disable', { method: 'POST' });
				const result = await response.json();
				if (result.success) {
					message = '2FA disabled';
					isError = false;
				} else {
					message = result.error || 'Failed to disable 2FA';
					isError = true;
				}
			} catch {
				message = 'Failed to disable 2FA';
				isError = true;
			} finally {
				loading = false;
				showConfirmDisable = false;
			}
		}}
		onCancel={() => { showConfirmDisable = false; }}
	/>
{/if}
