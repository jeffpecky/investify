<script lang="ts">
	import AppearanceTabs from '$lib/components/AppearanceTabs.svelte';
	import HeadingSmall from '$lib/components/HeadingSmall.svelte';
	import SettingsLayout from '$lib/components/settings/SettingsLayout.svelte';
</script>

<svelte:head>
	<title>Appearance Settings | Ethercore</title>
</svelte:head>

<SettingsLayout>
	<div class="space-y-6">
		<HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
		<AppearanceTabs />
	</div>
</SettingsLayout>
