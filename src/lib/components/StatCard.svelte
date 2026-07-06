<script lang="ts">
    import type { Snippet } from 'svelte';
    import * as Card from '$lib/components/ui/card';

    /**
     * StatCard component for displaying key metrics with an icon snippet and optional trend.
     *
     * @param title - The label for the statistic (e.g., "Total Revenue")
     * @param number - The numeric value to display (e.g., "$45,231.89")
     * @param icon - A Svelte snippet to render the icon
     * @param description - Optional text to display below the number
     * @param trend - Optional trend information
     * @slot link - Optional slot to render the link
     */
    interface Props {
        title: string;
        number: string | number;
        icon: Snippet;
        description?: string;
        trend?: {
            value: number;
            label: string;
            isPositive: boolean;
        };
        link?: Snippet;
    }

    let { title, number, icon, description, trend, link }: Props = $props();
</script>

<Card.Root class="group overflow-hidden transition-all hover:shadow-md hover:border-primary/20">
    <Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
        <Card.Title class="text-sm font-medium text-muted-foreground">{title}</Card.Title>
        <div class="rounded-lg bg-primary/10 p-2.5 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">
            {@render icon()}
        </div>
    </Card.Header>
    <Card.Content>
        <div class="text-2xl font-bold tracking-tight tabular-nums">{number}</div>

        {#if trend || description}
            <div class="mt-1.5 flex items-center gap-1.5 text-xs">
                {#if trend}
                    <div
                        class="flex items-center font-semibold {trend.isPositive
                            ? 'text-success'
                            : 'text-destructive'}"
                    >
                        <span class="mr-0.5">{trend.isPositive ? '↑' : '↓'}</span>
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </div>
                    <span class="text-muted-foreground font-normal">{trend.label}</span>
                {:else if description}
                    <span class="text-muted-foreground">{description}</span>
                {/if}
            </div>
        {/if}

        {#if link}
            {@render link()}
        {/if}
    </Card.Content>
</Card.Root>
