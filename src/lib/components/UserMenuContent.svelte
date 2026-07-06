<script lang="ts">
    import UserInfo from '$lib/components/UserInfo.svelte';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
    import type { User } from '$lib/types';
    import { LogOut, Settings, Globe, Wallet, Cog, Shield } from 'lucide-svelte';
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

{#if $isAdmin}
    <DropdownMenu.Sub>
        <DropdownMenu.SubTrigger>
            <Settings class="mr-2 size-4" />
            <span>Settings</span>
        </DropdownMenu.SubTrigger>
        <DropdownMenu.SubContent>
            <DropdownMenu.Item>
                <a class="flex items-center w-full" href="/admin/settings/website">
                    <Globe class="mr-2 size-4" />
                    <span>Website</span>
                </a>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
                <a class="flex items-center w-full" href="/admin/settings/platform">
                    <Cog class="mr-2 size-4" />
                    <span>Platform</span>
                </a>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
                <a class="flex items-center w-full" href="/admin/settings/wallets">
                    <Wallet class="mr-2 size-4" />
                    <span>Wallets</span>
                </a>
            </DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>
                <a class="flex items-center w-full" href="/admin/settings/profile">
                    <Shield class="mr-2 size-4" />
                    <span>My Profile</span>
                </a>
            </DropdownMenu.Item>
        </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
{:else}
    <DropdownMenu.Group>
        <DropdownMenu.Item>
            <a class="flex items-center w-full" href="/settings/profile">
                <Settings class="mr-2 size-4" />
                <span>Settings</span>
            </a>
        </DropdownMenu.Item>
    </DropdownMenu.Group>
{/if}
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
