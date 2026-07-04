<script lang="ts">
    import UserLayout from '@/layouts/UserLayout.svelte';
    import { type BreadcrumbItem } from '@/types';
    import { RotateCcw, DollarSign, BanknoteArrowDownIcon, BanknoteArrowUpIcon, CreditCard } from 'lucide-svelte';
    import * as Select from '@/components/ui/select';
    import { Button } from '@/components/ui/button';
    import CalculatorDetailsSection from '@/components/user/CalculatorDetailsSection.svelte';
    import { toast } from 'svelte-sonner';
    import StatCard from '@/components/StatCard.svelte';
    import { formatCurrency } from '@/utils';
    import CalculatorPayoutTable from '@/components/user/CalculatorPayoutTable.svelte';
    import BuyPlanModal from '@/components/user/BuyPlanModal.svelte';

    let { id } = $props();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Calculator',
            href: '/user/calculator',
        },
        {
            title: `${id}`,
            href: '#',
        },
    ];

    const calculatedInvestment = $state({
        id: '93209-42942-342423',
        plan: {
            id: '22222',
            name: 'Green Harvest Legacy Agribusiness Fund',
            duration: 12,
            amount: 1000,
            category: 'Capital Return',
            roi: '0.30 - 0.50%',
            payout: ['Daily', 'Weekly', 'Monthly'],
        },
        investedCapital: 1000,
        profit: 10,
        totalExpectedProfit: 1700,
        endDate: '2022-01-01',
        amount: 1000,
        tokens: 120,
        crypto: {
            name: 'Bitcoin',
            symbol: 'BTC',
            icon: 'bitcoin',
        },
        payoutOption: 'Daily',
        status: 'active',
        createdAt: '2022-01-01',
        updatedAt: '2022-01-01',
    });

    const payouts = $state([
        {
            daily: [
                {
                    date: '2024-01-01',
                    capitalGrowth: 500,
                    payout: 50,
                    roi: 2.5,
                },
                {
                    date: '2024-01-02',
                    capitalGrowth: 500,
                    payout: 50,
                    roi: 2.5,
                    roi: 2.5,
                },
                {
                    date: '2024-01-03',
                    capitalGrowth: 500,
                    payout: 50,
                    roi: 2.5,
                },
                {
                    date: '2024-01-04',
                    capitalGrowth: 500,
                    payout: 50,
                    roi: 2.5,
                },
                {
                    date: '2024-01-05',
                    capitalGrowth: 500,
                    payout: 50,
                    roi: 2.5,
                },
            ],
            monthly: [
                {
                    date: '2024-01-01',
                    capitalGrowth: 500,
                    payout: 53,
                    roi: 7.5,
                },
                {
                    date: '2024-02-01',
                    capitalGrowth: 500,
                    payout: 58,
                    roi: 7.5,
                },
                {
                    date: '2024-03-01',
                    capitalGrowth: 500,
                    payout: 59,
                    roi: 7.5,
                },
                {
                    date: '2024-04-01',
                    capitalGrowth: 500,
                    payout: 90,
                    roi: 7.5,
                },
                {
                    date: '2024-05-01',
                    capitalGrowth: 500,
                    payout: 50,
                    roi: 7.5,
                },
            ],
            yearly: [
                {
                    date: '2024-01-01',
                    capitalGrowth: 500,
                    payout: 50,
                    roi: 22.5,
                },
                {
                    date: '2025-01-02',
                    capitalGrowth: 500,
                    payout: 50,
                    roi: 22.5,
                },
                {
                    date: '2026-01-03',
                    capitalGrowth: 500,
                    payout: 50,
                    roi: 22.5,
                },
            ],
        },
    ]);

    let loading = $state(false);
    let status = $state('active');
    let statusOptions = $state([
        { value: 'active', label: 'Active' },
        { value: 'pending', label: 'Pending' },
        { value: 'rejected', label: 'Rejected' },
    ]);

    function updateStatus(e: Event) {
        e.preventDefault();
        loading = true;
        toast.loading('Updating status...');
        setTimeout(() => {
            toast.success('Status updated successfully');
            loading = false;
        }, 1000);
    }
</script>

<svelte:head>
    <title>Calculator</title>
</svelte:head>

<UserLayout {breadcrumbs}>
    <div class="space-y-6 px-6 py-8">
        <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
                <h1 class="text-2xl font-bold tracking-tight text-foreground">Calculator</h1>
                <p class="text-muted-foreground mt-1 text-sm">
                    Calculated ROI for <span class="font-bold text-primary">{calculatedInvestment.plan.name}</span>
                </p>
            </div>
            <div class="flex items-center gap-3">
                <BuyPlanModal data={calculatedInvestment} />
            </div>
        </div>

        <div class="grid gap-6 lg:grid-cols-4">
                    <div class="lg:col-span-3 space-y-6">
                <!-- Stats -->
                <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard title="Total Invested" number={formatCurrency(calculatedInvestment.investedCapital)}>
                        {#snippet icon()}
                            <BanknoteArrowDownIcon class="size-4" />
                        {/snippet}
                    </StatCard>
                    <StatCard title="Total Profit Acrued" number={formatCurrency(calculatedInvestment.profit)}>
                        {#snippet icon()}
                            <DollarSign class="size-4" />
                        {/snippet}
                    </StatCard>
                    <!-- since it is estimated i used ~ -->
                    <StatCard title="Total Expected Profit" number={'~' + formatCurrency(calculatedInvestment.totalExpectedProfit)}>
                        {#snippet icon()}
                            <BanknoteArrowUpIcon class="size-4" />
                        {/snippet}
                    </StatCard>
                </div>

                <!-- Payouts -->
                <CalculatorPayoutTable {id} {payouts} />
            </div>
            <div class="lg:col-span-1">
                <CalculatorDetailsSection {id} data={calculatedInvestment} />
            </div>

        </div>
    </div>
</UserLayout>
