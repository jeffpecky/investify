<script lang="ts">
    import UserLayout from '@/layouts/UserLayout.svelte';
    import { type BreadcrumbItem } from '@/types';
    import { RotateCcw, DollarSign, BanknoteArrowDownIcon, BanknoteArrowUpIcon } from 'lucide-svelte';
    import * as Select from '@/components/ui/select';
    import { Button } from '@/components/ui/button';
    import InvestmentDetailsSection from '@/components/InvestmentDetailsSection.svelte';
    import { toast } from 'svelte-sonner';
    import StatCard from '@/components/StatCard.svelte';
    import { formatCurrency } from '@/utils';
    import InvestmentsPayoutTable from '@/components/InvestmentsPayoutTable.svelte';

    let { id } = $props();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Investments',
            href: '/user/my-investments',
        },
        {
            title: `${id}`,
            href: '#',
        },
    ];

    const investment = $state({
        id: '93209-42942-342423',
        user: {
            id: '33333',
            name: 'John Doe',
            group: '💎 Elite Partner',
        },
        plan: {
            id: '22222',
            name: 'Basic Plan',
            duration: 12,
            amount: 1000,
            category: 'Capital Return',
            roi: '0.30 - 0.50%',
        },
        investedCapital: 1000,
        profit: 10,
        totalExpectedProfit: 1700,
        endDate: '2022-01-01',
        amount: 1000,
        status: 'active',
        createdAt: '2022-01-01',
        updatedAt: '2022-01-01',
    });

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
    <title>Manage Investment {id}</title>
</svelte:head>

<UserLayout {breadcrumbs}>
    <div class="space-y-6 px-6 py-8">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <h1 class="text-xl font-bold">{investment.plan.name}</h1>

        </div>

        <div class="grid gap-6 grid-cols-4">
            <div class="col-span-1">
                <InvestmentDetailsSection {id} data={investment} />
            </div>
            <div class="col-span-3 space-y-6">
                <!-- Stats -->
                <div class="grid gap-4 md:grid-cols-3">
                    <StatCard title="Total Invested" number={formatCurrency(investment.investedCapital)}>
                        {#snippet icon()}
                            <BanknoteArrowDownIcon class="size-4" />
                        {/snippet}
                    </StatCard>
                    <StatCard title="Total Profit Acrued" number={formatCurrency(investment.profit)}>
                        {#snippet icon()}
                            <DollarSign class="size-4" />
                        {/snippet}
                    </StatCard>
                    <!-- since it is estimated i used ~ -->
                    <StatCard title="Total Expected Profit" number={"~" + formatCurrency(investment.totalExpectedProfit)}>
                        {#snippet icon()}
                            <BanknoteArrowUpIcon class="size-4" />
                        {/snippet}
                    </StatCard>
                </div>

                <!-- Payouts -->
                <InvestmentsPayoutTable {id} />
            </div>
        </div>
    </div>
</UserLayout>
