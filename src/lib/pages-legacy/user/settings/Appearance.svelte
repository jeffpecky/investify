<script lang="ts">
    import AppearanceTabs from '@/components/AppearanceTabs.svelte';
    import HeadingSmall from '@/components/HeadingSmall.svelte';
    import { type BreadcrumbItem } from '@/types';

    import UserLayout from '@/layouts/UserLayout.svelte';
    import SettingsLayout from '@/layouts/settings/UserLayout.svelte';

    const breadcrumbItems: BreadcrumbItem[] = [
        {
            title: 'Appearance settings',
            href: 'user/settings/appearance',
        },
    ];
</script>

<svelte:head>
    <title>Appearance Settings</title>
</svelte:head>

<UserLayout breadcrumbs={breadcrumbItems}>
    <SettingsLayout>
        <div class="space-y-6">
            <HeadingSmall title="Appearance settings" description="Update your account's appearance settings" />
            <AppearanceTabs />
        </div>
    </SettingsLayout>
</UserLayout>
