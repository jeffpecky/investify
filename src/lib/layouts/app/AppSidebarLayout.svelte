<script lang="ts">
    import AppContent from '@/components/AppContent.svelte';
    import AppShell from '@/components/AppShell.svelte';
    import AppSidebarHeader from '@/components/AppSidebarHeader.svelte';
    import type { BreadcrumbItemType, Notification } from '@/types';
    import type { Snippet } from 'svelte';

    interface Props {
        breadcrumbs?: BreadcrumbItemType[];
        children?: Snippet;
        sidebar?: Snippet;
        notifications?: Notification[];
        notificationAction?: (notification: Notification) => void;
    }

    let { breadcrumbs = [], children, sidebar, notifications = [], notificationAction }: Props = $props();
</script>

<AppShell variant="sidebar">
    {@render sidebar?.()}
    <AppContent variant="sidebar" class="overflow-x-hidden">
        <!-- You can pass a boolean to the takeover prop to control the visibility of the takeover header -->
        <AppSidebarHeader {breadcrumbs} {notifications} {notificationAction} />
        {@render children?.()}
    </AppContent>
</AppShell>
