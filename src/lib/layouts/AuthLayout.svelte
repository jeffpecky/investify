<script lang="ts">
    // import AuthLayout from '@/layouts/auth/AuthSimpleLayout.svelte';
    // import AuthLayout from '@/layouts/auth/AuthSplitLayout.svelte';
    import AuthLayout from '@/layouts/auth/AuthCardLayout.svelte';
    import type { Snippet } from 'svelte';

    interface Props {
        title: string;
        description: string;
        children?: Snippet;
    }

    let { title, description, children }: Props = $props();
</script>

<AuthLayout {title} {description}>
    {@render children?.()}
</AuthLayout>
