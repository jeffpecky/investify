<script lang="ts">
	import { page } from '$app/stores';
	import Heading from '$lib/components/Heading.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		size?: string;
	}

	let { children, size = 'max-w-xl' }: Props = $props();

	const sidebarNavItems = [
		{
			menuGroup: 'Personal',
			items: [
				{ title: 'Profile', href: '/settings/profile' },
				{ title: 'Password', href: '/settings/password' },
				{ title: 'Two-Factor', href: '/settings/two-factor' },
				{ title: 'Appearance', href: '/settings/appearance' },
			],
		},
	];

	let currentPath = $derived($page.url.pathname);
</script>

<div class="px-4 py-6">
	<Heading title="Settings" description="Manage your profile and account settings" />

	<div class="flex flex-col lg:flex-row lg:space-x-12">
		<aside class="w-full max-w-xl lg:w-48">
			<nav class="flex flex-col space-x-0 space-y-1">
				{#each sidebarNavItems as item (item.menuGroup)}
					<p class="mb-1 text-xs font-medium text-muted-foreground px-2">{item.menuGroup}</p>
					{#each item.items as subItem (subItem.href)}
						<a href={subItem.href}>
							<Button
								variant="ghost"
								class={cn('w-full justify-start', {
									'bg-muted': currentPath === subItem.href,
								})}
							>
								{subItem.title}
							</Button>
						</a>
					{/each}
				{/each}
			</nav>
		</aside>

		<Separator class="my-6 lg:hidden" />

		<div class="flex-1 md:max-w-2xl">
			<section class="{size} space-y-12">
				{@render children?.()}
			</section>
		</div>
	</div>
</div>
