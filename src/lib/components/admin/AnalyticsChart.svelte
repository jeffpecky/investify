<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Chart from 'chart.js/auto';

    interface Props {
        type: 'line' | 'bar' | 'doughnut' | 'pie';
        labels: string[];
        datasets: {
            label: string;
            data: number[];
            backgroundColor?: string | string[];
            borderColor?: string | string[];
            borderWidth?: number;
            fill?: boolean;
            tension?: number;
        }[];
        height?: number;
        currency?: boolean;
    }

    let { type, labels, datasets, height = 300, currency = false }: Props = $props();

    let chartCanvas: HTMLCanvasElement;
    let chart: Chart;

    function getChartColors() {
        const styles = getComputedStyle(document.documentElement);
        const mutedForeground = styles.getPropertyValue('--color-muted-foreground').trim();
        const border = styles.getPropertyValue('--color-border').trim();
        const cardBg = styles.getPropertyValue('--color-card').trim();
        const foreground = styles.getPropertyValue('--color-foreground').trim();

        const palette = [
            'rgba(6, 182, 212, 1)',    // cyan
            'rgba(249, 115, 22, 1)',   // orange
            'rgba(168, 85, 247, 1)',   // purple
            'rgba(59, 130, 246, 1)',   // blue
            'rgba(16, 185, 129, 1)',   // emerald
            'rgba(244, 63, 94, 1)',    // rose
            'rgba(234, 179, 8, 1)',    // yellow
            'rgba(99, 102, 241, 1)',   // indigo
        ];

        const paletteBg = palette.map(c => c.replace(', 1)', ', 0.15)'));

        return { mutedForeground, border, cardBg, foreground, palette, paletteBg };
    }

    function hslToRgb(hslString: string): { r: number; g: number; b: number } {
        const temp = document.createElement('div');
        temp.style.color = hslString.startsWith('hsl') || hslString.startsWith('oklch') ? hslString : `hsl(${hslString})`;
        document.body.appendChild(temp);
        const rgb = getComputedStyle(temp).color;
        document.body.removeChild(temp);
        const match = rgb.match(/\d+/g);
        if (match) {
            return { r: parseInt(match[0]), g: parseInt(match[1]), b: parseInt(match[2]) };
        }
        return { r: 99, g: 102, b: 241 };
    }

    function initChart() {
        if (chart) chart.destroy();
        const ctx = chartCanvas?.getContext('2d');
        if (!ctx) return;

        const colors = getChartColors();
        const fgRgb = hslToRgb(colors.foreground);
        const mutedRgb = hslToRgb(colors.mutedForeground);
        const bgRgb = hslToRgb(colors.cardBg);

        const styledDatasets = datasets.map((ds, i) => {
            const color = colors.palette[i % colors.palette.length];
            const colorBg = colors.paletteBg[i % colors.paletteBg.length];

            if (type === 'doughnut' || type === 'pie') {
                return {
                    ...ds,
                    backgroundColor: colors.palette.slice(0, ds.data.length),
                    borderColor: bgRgb ? `rgb(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b})` : '#fff',
                    borderWidth: 2,
                    hoverOffset: 6,
                };
            }

            return {
                ...ds,
                backgroundColor: ds.fill ? colorBg : color,
                borderColor: color,
                borderWidth: ds.borderWidth ?? 2.5,
                tension: ds.tension ?? 0.4,
                pointBackgroundColor: color,
                pointBorderColor: `rgb(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b})`,
                pointHoverRadius: 5,
                pointRadius: 3,
                pointHitRadius: 10,
                fill: ds.fill ?? false,
            };
        });

        chart = new Chart(ctx, {
            type,
            data: { labels, datasets: styledDatasets },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: type === 'doughnut' || type === 'pie' || datasets.length > 1 },
                    tooltip: {
                        mode: type === 'doughnut' || type === 'pie' ? 'index' : 'index',
                        intersect: false,
                        backgroundColor: `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, 0.95)`,
                        titleColor: `rgb(${fgRgb.r}, ${fgRgb.g}, ${fgRgb.b})`,
                        bodyColor: `rgb(${fgRgb.r}, ${fgRgb.g}, ${fgRgb.b})`,
                        borderColor: `rgba(${mutedRgb.r}, ${mutedRgb.g}, ${mutedRgb.b}, 0.2)`,
                        borderWidth: 1,
                        padding: 10,
                        callbacks: {
                            label: function (context: any) {
                                let label = context.dataset.label || context.label || '';
                                if (label) label += ': ';
                                const val = context.parsed?.y ?? context.parsed ?? context.raw;
                                if (val !== null && val !== undefined) {
                                    if (currency) {
                                        label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
                                    } else {
                                        label += new Intl.NumberFormat('en-US').format(val);
                                    }
                                }
                                return label;
                            },
                        },
                    },
                },
                scales: type === 'doughnut' || type === 'pie' ? {} : {
                    x: {
                        grid: { display: false },
                        ticks: {
                            color: `rgba(${mutedRgb.r}, ${mutedRgb.g}, ${mutedRgb.b}, 0.7)`,
                            font: { size: 11, family: 'Geist, system-ui, sans-serif' },
                            maxRotation: 45,
                        },
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: `rgba(${mutedRgb.r}, ${mutedRgb.g}, ${mutedRgb.b}, 0.08)` },
                        ticks: {
                            color: `rgba(${mutedRgb.r}, ${mutedRgb.g}, ${mutedRgb.b}, 0.7)`,
                            font: { size: 11, family: 'Geist, system-ui, sans-serif' },
                            callback: function (value: any) {
                                if (currency) {
                                    if (Number(value) >= 1000000) return '$' + (Number(value) / 1000000).toFixed(1) + 'M';
                                    if (Number(value) >= 1000) return '$' + (Number(value) / 1000).toFixed(0) + 'k';
                                    return '$' + value;
                                }
                                return Number(value).toLocaleString();
                            },
                        },
                    },
                },
            },
        });
    }

    onMount(() => initChart());
    onDestroy(() => { if (chart) chart.destroy(); });

    $effect(() => {
        if (chartCanvas && labels.length > 0) initChart();
    });
</script>

<div style="height: {height}px">
    <canvas bind:this={chartCanvas}></canvas>
</div>
