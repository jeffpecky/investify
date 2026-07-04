<script lang="ts">
    import { Link } from '@inertiajs/svelte';
    import { SYSTEM } from '@/lib/store';
    import { useAppearance } from '@/hooks/useAppearance.svelte';

    const currentYear = $derived(new Date().getFullYear());
    const { appearance, updateAppearance } = useAppearance();

    let isDark = $state(appearance === 'dark');

    function toggleDarkMode() {
        updateAppearance(isDark ? 'light' : 'dark');
        isDark = !isDark;
    }
</script>

<footer class="bg-foreground text-background">
    <div class="mx-auto max-w-7xl px-6 pb-10 pt-16 lg:px-8">
        <!-- Two-column layout -->
        <div class="grid grid-cols-1 gap-12 md:grid-cols-2">
            <!-- Left: Brand + Contact -->
            <div>
                <Link href="/" class="text-base font-semibold tracking-tight text-background">
                    {$SYSTEM.siteName}
                </Link>
                <p class="mt-6 max-w-xs text-sm leading-relaxed text-background/50">
                    A regulated investment manager investing in public and private markets across the capital structure.
                </p>
                <div class="mt-8 space-y-2 text-sm text-background/60">
                    <p><span class="mr-3 font-medium text-background/30">N</span>{$SYSTEM.phone ?? '+1 (555) 000-0000'}</p>
                    <p><span class="mr-3 font-medium text-background/30">E</span>{$SYSTEM.email ?? 'hello@company.com'}</p>
                    <p><span class="mr-3 font-medium text-background/30">A</span>{$SYSTEM.address ?? '88 Brook Street, London, W1K 5AY'}</p>
                </div>
            </div>

            <!-- Right: Navigation -->
            <div class="grid grid-cols-3 gap-8">
                <div>
                    <p class="text-xs uppercase tracking-[0.15em] text-background/30">Verticals</p>
                    <ul class="mt-4 space-y-3 text-sm">
                        <li><Link class="text-background/60 transition-colors hover:text-background" href="/wealth-management">Wealth Management</Link></li>
                        <li><Link class="text-background/60 transition-colors hover:text-background" href="/mutual-funds">Mutual Funds</Link></li>
                        <li><Link class="text-background/60 transition-colors hover:text-background" href="/exchange-traded-funds">ETFs</Link></li>
                        <li><Link class="text-background/60 transition-colors hover:text-background" href="/securities">Securities</Link></li>
                        <li><Link class="text-background/60 transition-colors hover:text-background" href="/private-wealth">Private Wealth</Link></li>
                    </ul>
                </div>
                <div>
                    <p class="text-xs uppercase tracking-[0.15em] text-background/30">Portfolio</p>
                    <ul class="mt-4 space-y-3 text-sm">
                        <li><Link class="text-background/60 transition-colors hover:text-background" href="/private-equity">Private Equity</Link></li>
                        <li><Link class="text-background/60 transition-colors hover:text-background" href="/infrastructure-real-estate">Real Estate</Link></li>
                        <li><Link class="text-background/60 transition-colors hover:text-background" href="/renewable-energy">Renewable Energy</Link></li>
                        <li><Link class="text-background/60 transition-colors hover:text-background" href="/pharmaceuticals">Pharmaceuticals</Link></li>
                    </ul>
                </div>
                <div>
                    <p class="text-xs uppercase tracking-[0.15em] text-background/30">Company</p>
                    <ul class="mt-4 space-y-3 text-sm">
                        <li><Link class="text-background/60 transition-colors hover:text-background" href="/about">About Us</Link></li>
                        <li><Link class="text-background/60 transition-colors hover:text-background" href="/news-and-insights">Insights</Link></li>
                        <li><Link class="text-background/60 transition-colors hover:text-background" href="/wealth-club">Wealth Club</Link></li>
                        <li><Link class="text-background/60 transition-colors hover:text-background" href="/contact-us">Contact</Link></li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Bottom bar -->
        <div class="mt-16 flex flex-col items-start justify-between gap-4 border-t border-background/10 pt-8 text-xs text-background/40 md:flex-row md:items-center">
            <p>© {currentYear} {$SYSTEM.company}. All rights reserved.</p>

            <div class="flex flex-wrap items-center gap-6">
                <Link class="transition-colors hover:text-background/70" href="/privacy-policy">Privacy</Link>
                <Link class="transition-colors hover:text-background/70" href="/terms-of-use">Terms</Link>
                <Link class="transition-colors hover:text-background/70" href="/regulatory-disclosures">Regulatory Disclosures</Link>
                <button
                    onclick={toggleDarkMode}
                    class="flex items-center gap-1.5 transition-colors hover:text-background/70 cursor-pointer"
                    aria-label="Toggle dark mode"
                >
                    {#if isDark}
                        <span class="material-icons text-sm">light_mode</span>
                        <span>Light</span>
                    {:else}
                        <span class="material-icons text-sm">dark_mode</span>
                        <span>Dark</span>
                    {/if}
                </button>
            </div>
        </div>

        <p class="mt-6 text-[10px] leading-relaxed text-background/25">
            Investing involves risk, including possible loss of principal. The information provided here is for general informational purposes only and should not be considered an individualized recommendation or personalized investment advice.
        </p>
    </div>
</footer>
