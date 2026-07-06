<script lang="ts">
    import { Wallet, TrendingUp, Users, RefreshCw, PieChart, ArrowRightLeft, Clock } from 'lucide-svelte';
    import Chart from '$lib/components/user/Chart.svelte';
    import { formatCurrency, formatNumber } from '$lib/utils';
    import { Button } from '$lib/components/ui/button';
    import * as Card from '$lib/components/ui/card';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    // Generate sparkline SVG points from historical data
    function generateSparklineFromData(data: number[]) {
        if (!data || data.length === 0) {
            return '';
        }
        
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1;
        
        // Create 8 points across the data (add endpoint for smooth chart)
        const points = [];
        for (let i = 0; i < 8; i++) {
            const dataIndex = Math.min(Math.floor((i / 7) * (data.length - 1)), data.length - 1);
            const value = data[dataIndex];
            const x = i * 8;
            const y = 32 - ((value - min) / range * 28 + 2);
            points.push(`${x},${y}`);
        }
        return points.join(' ');
    }

    // Get sparkline color based on trend (positive = success, negative = danger)
    function getSparklineClass(data: number[]) {
        if (!data || data.length < 2) return 'text-muted-foreground';
        return data[data.length - 1] >= data[0] ? 'text-success' : 'text-danger';
    }

    // Calculate time ago
    function timeAgo(date: Date | string | null) {
        if (!date) return 'N/A';
        const now = new Date();
        const past = new Date(date);
        const diffMs = now.getTime() - past.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    }

    // Portfolio colors - vibrant, distinctive palette
    const portfolioColors = [
        { bg: 'bg-cyan-500', stroke: 'rgb(6, 182, 212)' },
        { bg: 'bg-orange-500', stroke: 'rgb(249, 115, 22)' },
        { bg: 'bg-purple-500', stroke: 'rgb(168, 85, 247)' },
        { bg: 'bg-blue-500', stroke: 'rgb(59, 130, 246)' },
        { bg: 'bg-pink-500', stroke: 'rgb(236, 72, 153)' },
        { bg: 'bg-emerald-500', stroke: 'rgb(16, 185, 129)' }
    ];

    // Calculate donut chart segments
    function calculateDonutSegments() {
        if (!data.portfolioDistribution || data.portfolioDistribution.length === 0) {
            return [];
        }
        
        let offset = 0;
        return data.portfolioDistribution.map((item, index) => {
            const percentage = parseFloat(item.percentage);
            const segment = {
                ...item,
                dashArray: `${percentage} ${100 - percentage}`,
                dashOffset: -offset,
                color: portfolioColors[index % portfolioColors.length]
            };
            offset += percentage;
            return segment;
        });
    }

    const donutSegments = $derived(calculateDonutSegments());
</script>

<svelte:head>
    <title>Dashboard</title>
</svelte:head>

<div class="mx-auto w-full space-y-3 px-4 py-4 sm:px-6 lg:px-8">
    <!-- Top Row: 4 Stat Cards with Sparklines -->
    <div class="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <!-- Total Invested -->
        <Card.Root class="p-3">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                    <div class="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                        <TrendingUp class="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span class="text-xs font-medium text-muted-foreground">Total Invested</span>
                </div>
            </div>
            <div class="space-y-1">
                <div class="text-2xl font-bold tracking-tight tabular-nums">
                    {formatCurrency(data.stats.totalInvested)}
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5 text-xs">
                        <span class="text-muted-foreground tabular-nums">{formatCurrency(data.historical?.changes?.invested?.delta || 0)}</span>
                        <span class="font-semibold tabular-nums {(data.historical?.changes?.invested?.percent || 0) >= 0 ? 'text-success' : 'text-danger'}">
                            {(data.historical?.changes?.invested?.percent || 0) >= 0 ? '+' : ''}{(data.historical?.changes?.invested?.percent || 0).toFixed(1)}%
                        </span>
                    </div>
                    <svg class="h-6 w-14" viewBox="0 0 64 32" preserveAspectRatio="none">
                        <polyline
                            points={generateSparklineFromData(data.historical?.sparklineData?.invested || [])}
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            class={getSparklineClass(data.historical?.sparklineData?.invested || [])}
                        />
                    </svg>
                </div>
            </div>
        </Card.Root>

        <!-- Available Balance -->
        <Card.Root class="p-3">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                    <div class="flex h-7 w-7 items-center justify-center rounded-full bg-info/10">
                        <Wallet class="h-3.5 w-3.5 text-info" />
                    </div>
                    <span class="text-xs font-medium text-muted-foreground">Available Balance</span>
                </div>
            </div>
            <div class="space-y-1">
                <div class="text-2xl font-bold tracking-tight tabular-nums">
                    {formatCurrency(data.stats.walletBalance)}
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5 text-xs">
                        <span class="text-muted-foreground tabular-nums">{formatCurrency(data.historical?.changes?.balance?.delta || 0)}</span>
                        <span class="font-semibold tabular-nums {(data.historical?.changes?.balance?.percent || 0) >= 0 ? 'text-success' : 'text-danger'}">
                            {(data.historical?.changes?.balance?.percent || 0) >= 0 ? '+' : ''}{(data.historical?.changes?.balance?.percent || 0).toFixed(1)}%
                        </span>
                    </div>
                    <svg class="h-6 w-14" viewBox="0 0 64 32" preserveAspectRatio="none">
                        <polyline
                            points={generateSparklineFromData(data.historical?.sparklineData?.balance || [])}
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            class={getSparklineClass(data.historical?.sparklineData?.balance || [])}
                        />
                    </svg>
                </div>
            </div>
        </Card.Root>

        <!-- Total Earnings -->
        <Card.Root class="p-3">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                    <div class="flex h-7 w-7 items-center justify-center rounded-full bg-success/10">
                        <RefreshCw class="h-3.5 w-3.5 text-success" />
                    </div>
                    <span class="text-xs font-medium text-muted-foreground">Total Earnings</span>
                </div>
            </div>
            <div class="space-y-1">
                <div class="text-2xl font-bold tracking-tight tabular-nums">
                    {formatCurrency(data.stats.totalProfit)}
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5 text-xs">
                        <span class="text-muted-foreground tabular-nums">{formatCurrency(data.historical?.changes?.profit?.delta || 0)}</span>
                        <span class="font-semibold tabular-nums {(data.historical?.changes?.profit?.percent || 0) >= 0 ? 'text-success' : 'text-danger'}">
                            {(data.historical?.changes?.profit?.percent || 0) >= 0 ? '+' : ''}{(data.historical?.changes?.profit?.percent || 0).toFixed(1)}%
                        </span>
                    </div>
                    <svg class="h-6 w-14" viewBox="0 0 64 32" preserveAspectRatio="none">
                        <polyline
                            points={generateSparklineFromData(data.historical?.sparklineData?.profit || [])}
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            class={getSparklineClass(data.historical?.sparklineData?.profit || [])}
                        />
                    </svg>
                </div>
            </div>
        </Card.Root>

        <!-- Referral Earnings -->
        <Card.Root class="p-3">
            <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                    <div class="flex h-7 w-7 items-center justify-center rounded-full bg-warning/10">
                        <Users class="h-3.5 w-3.5 text-warning" />
                    </div>
                    <span class="text-xs font-medium text-muted-foreground">Referral Earnings</span>
                </div>
            </div>
            <div class="space-y-1">
                <div class="text-2xl font-bold tracking-tight tabular-nums">
                    {formatCurrency(data.stats.referralEarnings)}
                </div>
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-1.5 text-xs">
                        <span class="text-muted-foreground tabular-nums">{formatCurrency(data.historical?.changes?.referral?.delta || 0)}</span>
                        <span class="font-semibold tabular-nums {(data.historical?.changes?.referral?.percent || 0) >= 0 ? 'text-success' : 'text-danger'}">
                            {(data.historical?.changes?.referral?.percent || 0) >= 0 ? '+' : ''}{(data.historical?.changes?.referral?.percent || 0).toFixed(1)}%
                        </span>
                    </div>
                    <svg class="h-6 w-14" viewBox="0 0 64 32" preserveAspectRatio="none">
                        <polyline
                            points={generateSparklineFromData(data.historical?.sparklineData?.referral || [])}
                            fill="none"
                            stroke="currentColor"
                            stroke-width="1.5"
                            class={getSparklineClass(data.historical?.sparklineData?.referral || [])}
                        />
                    </svg>
                </div>
            </div>
        </Card.Root>
    </div>

    <!-- Middle Row: Chart + Active Plans Table -->
    <div class="grid gap-3 grid-cols-1 lg:grid-cols-3">
        <!-- Chart (2/3 width) -->
        <div class="lg:col-span-2">
            <Chart />
        </div>

        <!-- Active Plans Table (1/3 width) -->
        <Card.Root class="p-3">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-foreground">Active Plans</h3>
                <a href="/plans" class="text-xs text-primary hover:underline">View All</a>
            </div>
            <div class="space-y-0">
                {#if data.activePlans && data.activePlans.length > 0}
                    {#each data.activePlans as plan}
                        <div class="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0">
                            <div>
                                <div class="text-sm font-medium text-foreground">{plan.name}</div>
                                <div class="text-xs text-muted-foreground">{plan.category}</div>
                            </div>
                            <div class="text-right">
                                <div class="text-sm font-semibold tabular-nums text-success">
                                    {plan.percentMin === plan.percentMax ? `${plan.percentMin}%` : `${plan.percentMin}-${plan.percentMax}%`}
                                </div>
                            </div>
                        </div>
                    {/each}
                {:else}
                    <div class="py-8 text-center text-sm text-muted-foreground">
                        No active plans available
                    </div>
                {/if}
            </div>
        </Card.Root>
    </div>

    <!-- Bottom Row: Portfolio + Quick Action + Recent Activity -->
    <div class="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <!-- Portfolio Allocation -->
        <Card.Root class="p-3">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-foreground">Portfolio</h3>
                <span class="text-xs text-muted-foreground">
                    Assets ({data.portfolioDistribution?.length || 0})
                </span>
            </div>
            
            {#if data.portfolioDistribution && data.portfolioDistribution.length > 0}
                <div class="flex items-center justify-center py-4">
                    <!-- Donut Chart -->
                    <div class="relative h-28 w-28">
                        <svg class="transform -rotate-90" viewBox="0 0 36 36">
                            {#each donutSegments as segment}
                                <circle
                                    cx="18"
                                    cy="18"
                                    r="16"
                                    fill="none"
                                    stroke={segment.color.stroke}
                                    stroke-width="4"
                                    stroke-dasharray={segment.dashArray}
                                    stroke-dashoffset={segment.dashOffset}
                                />
                            {/each}
                        </svg>
                    </div>
                </div>
                <div class="space-y-2 mt-3">
                    {#each data.portfolioDistribution.slice(0, 6) as item, index}
                        <div class="flex items-center justify-between text-xs">
                            <div class="flex items-center gap-2">
                                <div class="h-2 w-2 rounded-full {portfolioColors[index % portfolioColors.length].bg}"></div>
                                <span class="text-muted-foreground truncate max-w-[120px]">{item.planName}</span>
                            </div>
                            <span class="font-medium tabular-nums text-foreground">{item.percentage}%</span>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="py-10 text-center">
                    <PieChart class="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                    <p class="text-sm text-muted-foreground">No portfolio data</p>
                </div>
            {/if}
        </Card.Root>

        <!-- Quick Action -->
        <Card.Root class="p-3">
            <div class="mb-3">
                <h3 class="text-sm font-semibold text-foreground mb-1">Quick Action</h3>
                <p class="text-xs text-muted-foreground">Invest in new opportunities</p>
            </div>
            <div class="space-y-2.5">
                <div class="rounded-lg bg-muted/30 p-2.5">
                    <div class="flex items-center justify-between mb-1.5">
                        <span class="text-xs text-muted-foreground">From</span>
                        <div class="flex items-center gap-1">
                            <Wallet class="h-3 w-3 text-primary" />
                            <span class="text-xs font-medium">Balance</span>
                        </div>
                    </div>
                    <div class="text-lg font-bold tabular-nums">{formatCurrency(data.stats.walletBalance)}</div>
                </div>
                <div class="flex justify-center">
                    <div class="rounded-full bg-primary/10 p-1.5">
                        <ArrowRightLeft class="h-3.5 w-3.5 text-primary" />
                    </div>
                </div>
                <div class="rounded-lg bg-muted/30 p-2.5">
                    <div class="flex items-center justify-between mb-1.5">
                        <span class="text-xs text-muted-foreground">To</span>
                        <div class="flex items-center gap-1">
                            <PieChart class="h-3 w-3 text-success" />
                            <span class="text-xs font-medium">Investment</span>
                        </div>
                    </div>
                    <div class="text-lg font-bold text-muted-foreground">Select Plan</div>
                </div>
                <a href="/plans" class="block w-full">
                    <Button class="w-full">Browse Plans</Button>
                </a>
            </div>
        </Card.Root>

        <!-- Recent Activity -->
        <Card.Root class="p-3">
            <div class="flex items-center justify-between mb-3">
                <h3 class="text-sm font-semibold text-foreground">Recent Activity</h3>
                <a href="/investments" class="text-xs text-primary hover:underline">View All</a>
            </div>
            <div class="space-y-0">
                {#if data.recentActivity && data.recentActivity.length > 0}
                    {#each data.recentActivity as activity}
                        <div class="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                            <div class="flex items-center gap-2">
                                <div class="rounded-full px-2 py-0.5 text-xs font-medium
                                    {activity.status === 'active' || activity.status === 'completed' || activity.status === 'approved' ? 'bg-success/10 text-success' : 
                                     activity.status === 'pending' ? 'bg-warning/10 text-warning' : 'bg-destructive/10 text-destructive'}">
                                    {activity.status === 'active' || activity.status === 'completed' || activity.status === 'approved' ? '✓' : '○'}
                                </div>
                                <div>
                                    <div class="text-xs font-medium text-foreground capitalize">{activity.type}</div>
                                    <div class="text-xs text-muted-foreground truncate max-w-[100px]">{activity.planName}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-xs font-semibold text-foreground tabular-nums">
                                    {formatCurrency(parseFloat(activity.amount))}
                                </div>
                                <div class="text-xs text-muted-foreground">{timeAgo(activity.createdAt)}</div>
                            </div>
                        </div>
                    {/each}
                {:else}
                    <div class="py-6 text-center">
                        <Clock class="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
                        <p class="text-sm text-muted-foreground">No recent activity</p>
                    </div>
                {/if}
            </div>
        </Card.Root>
    </div>
</div>
