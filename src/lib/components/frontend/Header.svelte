<script lang="ts">
    import { SYSTEM } from '$lib/store.svelte';
    import type { User } from '$lib/types';
    import { ArrowRight, ChevronDown, Menu, X } from 'lucide-svelte';

    let { user }: { user?: User } = $props();

    let isMenuOpen = $state(false);
    let activeDropdown = $state<string | null>(null);

    function toggleDropdown(name: string) {
        activeDropdown = activeDropdown === name ? null : name;
    }

    function closeMenu() {
        isMenuOpen = false;
        activeDropdown = null;
    }

    const solutions = [
        { title: 'Wealth Management', href: '/wealth-management', desc: 'Holistic financial planning', icon: 'trending_up' },
        { title: 'Mutual Funds', href: '/mutual-funds', desc: 'Diversified fund portfolios', icon: 'account_balance' },
        { title: 'ETFs', href: '/exchange-traded-funds', desc: 'Exchange-traded strategies', icon: 'swap_horiz' },
        { title: 'Securities', href: '/securities', desc: 'Equity & bond markets', icon: 'bar_chart' },
    ];

    const markets = [
        { title: 'Private Equity', href: '/private-equity', desc: 'Growth-stage investments', icon: 'rocket_launch' },
        { title: 'Real Estate', href: '/infrastructure-real-estate', desc: 'Commercial & residential', icon: 'apartment' },
        { title: 'Pharmaceuticals', href: '/pharmaceuticals', desc: 'Healthcare innovation', icon: 'biotech' },
        { title: 'Renewable Energy', href: '/renewable-energy', desc: 'Sustainable infrastructure', icon: 'bolt' },
    ];
</script>

<!-- Editorial Minimal Navigation -->
<nav class="sticky top-0 z-50 w-full border-b border-border bg-background">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
            <!-- Logo -->
            <a href="/" class="inline-flex items-center gap-3" onclick={closeMenu}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 140" class="h-11 w-auto text-primary">
                    <g fill="currentColor">
                        <path d="M 36,28 L 46,28 L 46,108 L 36,108 A 6,6 0 0 1 30,102 L 30,34 A 6,6 0 0 1 36,28 Z"/>
                        <path d="M 46,60 L 72,60 A 6,6 0 0 1 78,66 L 78,70 A 6,6 0 0 1 72,76 L 46,76 Z"/>
                        <path d="M 46,92 L 84,92 A 6,6 0 0 1 90,98 L 90,102 A 6,6 0 0 1 84,108 L 46,108 Z"/>
                        <path d="M 46,28 L 76.43,18.11 L 74.58,12.41 L 99.83,18.92 L 83.23,39.03 L 81.38,33.33 L 50.94,43.22 L 46,44 Z"/>
                    </g>
                    <circle cx="45" cy="84" r="8" fill="#C9A24A"/>
                </svg>
                <span class="text-lg font-bold tracking-tight text-foreground">{$SYSTEM.siteName}</span>
            </a>

            <!-- Desktop Navigation — centered -->
            <div class="hidden items-center gap-8 lg:flex">
                <!-- Solutions Dropdown -->
                <div class="group relative">
                    <button class="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
                        Solutions
                        <ChevronDown class="h-4 w-4 transition-transform group-hover:rotate-180" />
                    </button>
                    <div class="mega-menu absolute left-1/2 top-full mt-px w-[480px] -translate-x-1/2 border border-border bg-background shadow-lg">
                        <div class="grid grid-cols-2 gap-0 divide-x divide-border">
                            {#each solutions as item}
                                <a href={item.href} class="block px-5 py-4 transition-colors hover:bg-muted">
                                    <p class="text-sm font-medium text-foreground">{item.title}</p>
                                    <p class="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                                </a>
                            {/each}
                        </div>
                        <div class="border-t border-border px-5 py-3">
                            <a href="/private-wealth" class="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
                                Private Wealth Services
                                <ArrowRight size={12} class="flex-shrink-0" />
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Markets Dropdown -->
                <div class="group relative">
                    <button class="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
                        Portfolio
                        <ChevronDown class="h-4 w-4 transition-transform group-hover:rotate-180" />
                    </button>
                    <div class="mega-menu absolute left-1/2 top-full mt-px w-[480px] -translate-x-1/2 border border-border bg-background shadow-lg">
                        <div class="grid grid-cols-2 gap-0 divide-x divide-border">
                            {#each markets as item}
                                <a href={item.href} class="block px-5 py-4 transition-colors hover:bg-muted">
                                    <p class="text-sm font-medium text-foreground">{item.title}</p>
                                    <p class="mt-0.5 text-xs text-muted-foreground">{item.desc}</p>
                                </a>
                            {/each}
                        </div>
                    </div>
                </div>

                <a class="text-sm text-muted-foreground transition-colors hover:text-foreground" href="/wealth-club">
                    Wealth Club
                </a>
                <a class="text-sm text-muted-foreground transition-colors hover:text-foreground" href="/news-and-insights">
                    Insights
                </a>
                <a class="text-sm text-muted-foreground transition-colors hover:text-foreground" href="/about">
                    About
                </a>
            </div>

            <!-- Right: CTA -->
            <div class="hidden items-center gap-6 lg:flex">
                {#if user && (user.role === 'user' || user.role === 'company')}
                    <a class="text-sm text-muted-foreground transition-colors hover:text-foreground" href="/dashboard">
                        Dashboard
                    </a>
                {:else}
                    <a class="text-sm text-muted-foreground transition-colors hover:text-foreground" href="/login">
                        Private Area
                    </a>
                {/if}
                <a href="/contact-us" class="inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline underline-offset-4 decoration-muted-foreground transition-colors hover:decoration-foreground">
                    Contact us
                    <ArrowRight size={16} class="flex-shrink-0" />
                </a>
            </div>

            <!-- Mobile menu toggle -->
            <button
                class="flex h-9 w-9 items-center justify-center text-foreground lg:hidden"
                onclick={() => (isMenuOpen = !isMenuOpen)}
                aria-label="Toggle menu"
            >
                {#if isMenuOpen}
                    <X class="h-5 w-5" />
                {:else}
                    <Menu class="h-5 w-5" />
                {/if}
            </button>
        </div>
    </div>

    <!-- Mobile Menu -->
    {#if isMenuOpen}
        <div class="border-t border-border bg-background lg:hidden">
            <div class="mx-auto max-w-7xl divide-y divide-border/50 px-6 py-2">
                <!-- Solutions Group -->
                <button
                    class="flex w-full items-center justify-between py-4 text-sm font-medium text-foreground"
                    onclick={() => toggleDropdown('solutions')}
                >
                    Solutions
                    <ChevronDown class="h-4 w-4 text-muted-foreground transition-transform {activeDropdown === 'solutions' ? 'rotate-180' : ''}" />
                </button>
                {#if activeDropdown === 'solutions'}
                    <div class="pb-3 pl-4">
                        {#each solutions as item}
                            <a href={item.href} class="block py-2.5 text-sm text-muted-foreground hover:text-foreground" onclick={closeMenu}>
                                {item.title}
                            </a>
                        {/each}
                    </div>
                {/if}

                <!-- Markets Group -->
                <button
                    class="flex w-full items-center justify-between py-4 text-sm font-medium text-foreground"
                    onclick={() => toggleDropdown('markets')}
                >
                    Portfolio
                    <ChevronDown class="h-4 w-4 text-muted-foreground transition-transform {activeDropdown === 'markets' ? 'rotate-180' : ''}" />
                </button>
                {#if activeDropdown === 'markets'}
                    <div class="pb-3 pl-4">
                        {#each markets as item}
                            <a href={item.href} class="block py-2.5 text-sm text-muted-foreground hover:text-foreground" onclick={closeMenu}>
                                {item.title}
                            </a>
                        {/each}
                    </div>
                {/if}

                <a href="/wealth-club" class="block py-4 text-sm font-medium text-foreground" onclick={closeMenu}>Wealth Club</a>
                <a href="/news-and-insights" class="block py-4 text-sm font-medium text-foreground" onclick={closeMenu}>Insights</a>
                <a href="/about" class="block py-4 text-sm font-medium text-foreground" onclick={closeMenu}>About</a>

                <div class="flex flex-col gap-3 py-4">
                    {#if user && (user.role === 'user' || user.role === 'company')}
                        <a href="/dashboard" class="text-sm text-muted-foreground hover:text-foreground" onclick={closeMenu}>Dashboard</a>
                    {:else}
                        <a href="/login" class="text-sm text-muted-foreground hover:text-foreground" onclick={closeMenu}>Private Area</a>
                    {/if}
                    <a href="/contact-us" class="inline-flex items-center gap-1.5 text-sm font-medium text-foreground" onclick={closeMenu}>Contact us <ArrowRight size={16} class="flex-shrink-0" /></a>
                </div>
            </div>
        </div>
    {/if}
</nav>
