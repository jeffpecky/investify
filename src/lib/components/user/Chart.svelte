<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import {
        Chart,
        LineController,
        LineElement,
        PointElement,
        LinearScale,
        CategoryScale,
        Filler,
        Tooltip,
    } from 'chart.js';

    Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip);
    import * as Card from '$lib/components/ui/card';

    let chartCanvas: HTMLCanvasElement;
    let chart: Chart;

    type TimeFrame = 'daily' | 'monthly' | 'yearly';
    let currentTimeFrame: TimeFrame = $state('monthly');

    const mockData = {
        daily: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            data: [1200, 1900, 3000, 5000, 2400, 3500, 4200],
        },
        monthly: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            data: [45000, 52000, 48000, 61000, 55000, 67000, 71000, 75000, 82000, 88000, 94000, 102000],
        },
        yearly: {
            labels: ['2021', '2022', '2023', '2024', '2025'],
            data: [250000, 420000, 680000, 950000, 1200000],
        },
    };

    function initChart() {
        if (chart) {
            chart.destroy();
        }

        const ctx = chartCanvas.getContext('2d');
        if (!ctx) return;

        // Extract design system colors from CSS custom properties
        const styles = getComputedStyle(document.documentElement);
        const primaryColor = styles.getPropertyValue('--color-chart-1').trim() || styles.getPropertyValue('--color-primary').trim();
        const mutedForeground = styles.getPropertyValue('--color-muted-foreground').trim();
        const border = styles.getPropertyValue('--color-border').trim();
        const cardBg = styles.getPropertyValue('--color-card').trim();
        const foreground = styles.getPropertyValue('--color-foreground').trim();

        // Convert hsl to rgb for chart.js compatibility
        const primaryRgb = hslToRgb(primaryColor);
        const mutedRgb = hslToRgb(mutedForeground);
        const bgRgb = hslToRgb(cardBg);
        const fgRgb = hslToRgb(foreground);

        const data = mockData[currentTimeFrame];

        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Investments',
                        data: data.data,
                        fill: true,
                        backgroundColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.08)`,
                        borderColor: `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`,
                        borderWidth: 2.5,
                        tension: 0.4,
                        pointBackgroundColor: `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`,
                        pointBorderColor: `rgb(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b})`,
                        pointHoverRadius: 6,
                        pointHoverBackgroundColor: `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`,
                        pointHoverBorderColor: `rgb(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b})`,
                        pointHoverBorderWidth: 2,
                        pointRadius: 4,
                        pointHitRadius: 10,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, 0.95)`,
                        titleColor: `rgb(${fgRgb.r}, ${fgRgb.g}, ${fgRgb.b})`,
                        bodyColor: `rgb(${fgRgb.r}, ${fgRgb.g}, ${fgRgb.b})`,
                        borderColor: `rgba(${mutedRgb.r}, ${mutedRgb.g}, ${mutedRgb.b}, 0.2)`,
                        borderWidth: 1,
                        padding: 12,
                        displayColors: false,
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                    }).format(context.parsed.y);
                                }
                                return label;
                            },
                        },
                    },
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            color: `rgba(${mutedRgb.r}, ${mutedRgb.g}, ${mutedRgb.b}, 0.7)`,
                            font: {
                                size: 11,
                                family: 'Geist, system-ui, sans-serif',
                            },
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: `rgba(${mutedRgb.r}, ${mutedRgb.g}, ${mutedRgb.b}, 0.08)`,
                        },
                        ticks: {
                            color: `rgba(${mutedRgb.r}, ${mutedRgb.g}, ${mutedRgb.b}, 0.7)`,
                            font: {
                                size: 11,
                                family: 'Geist, system-ui, sans-serif',
                            },
                            callback: function (value) {
                                if (Number(value) >= 1000) {
                                    return '$' + Number(value) / 1000 + 'k';
                                }
                                return '$' + value;
                            },
                        },
                    },
                },
            },
        });
    }

    // Helper function to convert hsl to rgb
    function hslToRgb(hslString: string): { r: number; g: number; b: number } {
        // Parse hsl/oklch string - design system uses oklch
        // For simplicity, we'll use a temp element to get computed RGB
        const temp = document.createElement('div');
        temp.style.color = hslString.startsWith('hsl') || hslString.startsWith('oklch') ? hslString : `hsl(${hslString})`;
        document.body.appendChild(temp);
        const rgb = getComputedStyle(temp).color;
        document.body.removeChild(temp);
        
        // Parse rgb string like "rgb(59, 130, 246)"
        const match = rgb.match(/\d+/g);
        if (match) {
            return {
                r: parseInt(match[0]),
                g: parseInt(match[1]),
                b: parseInt(match[2]),
            };
        }
        return { r: 99, g: 102, h: 241 }; // fallback to indigo-500
    }

    $effect(() => {
        if (currentTimeFrame && chartCanvas) {
            initChart();
        }
    });

    onMount(() => {
        initChart();
    });

    onDestroy(() => {
        if (chart) {
            chart.destroy();
        }
    });

    function setTimeFrame(tf: TimeFrame) {
        currentTimeFrame = tf;
    }
</script>

<Card.Root class="flex h-full w-full flex-col overflow-hidden py-2">
    <Card.Header class="flex flex-row items-center justify-between space-y-0 py-7">
        <div class="space-y-1">
            <Card.Title class="text-lg font-semibold leading-none tracking-tight">Investment Growth</Card.Title>
            <Card.Description class="text-sm text-muted-foreground">Portfolio performance over time</Card.Description>
        </div>
        <div class="flex items-center gap-1 rounded-lg bg-muted p-1">
            <button
                class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors {currentTimeFrame === 'daily'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'}"
                onclick={() => setTimeFrame('daily')}
            >
                Daily
            </button>
            <button
                class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors {currentTimeFrame === 'monthly'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'}"
                onclick={() => setTimeFrame('monthly')}
            >
                Monthly
            </button>
            <button
                class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors {currentTimeFrame === 'yearly'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-background/50 hover:text-foreground'}"
                onclick={() => setTimeFrame('yearly')}
            >
                Yearly
            </button>
        </div>
    </Card.Header>

    <Card.Content class="relative h-[300px] sm:h-[350px] w-full grow pb-3">
        <canvas bind:this={chartCanvas}></canvas>
    </Card.Content>
</Card.Root>
