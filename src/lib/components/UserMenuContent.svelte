<script lang="ts">
    import UserInfo from '$lib/components/UserInfo.svelte';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
    import type { User } from '$lib/types';
    import { LogOut, Settings } from 'lucide-svelte';
    import IncognitoToggle from './user/IncognitoToggle.svelte';
    import { isAdmin } from '$lib/isAdmin.svelte.js';

    interface Props {
        user: User;
    }

    let { user }: Props = $props();
</script>

<DropdownMenu.Label class="p-0 font-normal">
    <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
        <UserInfo {user} showEmail={true} showGroup={true} />
    </div>
</DropdownMenu.Label>
<DropdownMenu.Separator />
<DropdownMenu.Group>
    <DropdownMenu.Item>
        <a class="block w-full" href="/settings/profile">
            <div class="flex items-center">
                <Settings class="mr-2 size-4" />
                <span>Settings</span>
            </div>
        </a>
    </DropdownMenu.Item>
</DropdownMenu.Group>
<DropdownMenu.Separator />

{#if !$isAdmin}
<DropdownMenu.Sub>
    <IncognitoToggle type="text" />
</DropdownMenu.Sub>
<DropdownMenu.Separator />
{/if}

<DropdownMenu.Item>
    <form method="POST" action="/logout" class="w-full">
        <button type="submit" class="flex items-center w-full text-left">
            <LogOut class="mr-2 size-4" />
            <span>Log out</span>
        </button>
    </form>
</DropdownMenu.Item>
