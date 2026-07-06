<script lang="ts">
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
    import * as InputGroup from '$lib/components/ui/input-group/index.js';
    import { Search, ListFilter, File, FileCheck, FileQuestionMark, FileX, ArrowDownToLine } from 'lucide-svelte';
    import { Button, buttonVariants } from '$lib/components/ui/button';
    import * as Table from '$lib/components/ui/table/index.js';
    import * as Card from '$lib/components/ui/card';
    import * as Pagination from '$lib/components/ui/pagination/index.js';
    import { formatDateExt, formatCurrency, cn } from '$lib/utils';
    import Status from '$lib/components/Status.svelte';
    import CreateWithdrawalModal from '$lib/components/user/CreateWithdrawalModal.svelte';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    let searchQuery = $state('');

    let total = $derived(data.withdrawals.length);
    let paid = $derived(data.withdrawals.filter((d) => d.status === 'paid').length);
    let pending = $derived(data.withdrawals.filter((d) => d.status === 'pending').length);
    let rejected = $derived(data.withdrawals.filter((d) => d.status === 'rejected').length);

    let filteredWithdrawals = $derived(
        data.withdrawals.filter((withdrawal) => {
            const lowerQuery = searchQuery.toLowerCase();
            return (
                withdrawal.status.toLowerCase().includes(lowerQuery) ||
                withdrawal.id.toLowerCase().includes(lowerQuery) ||
                withdrawal.crypto.toLowerCase().includes(lowerQuery)
            );
        }),
    );

    function cancelWithdrawal(id: string) {
        if (!confirm('Are you sure you want to cancel this withdrawal?')) {
            return;
        }
        console.log(id);
    }
</script>

<svelte:head>
    <title>Withdrawals | Ethercore</title>
</svelte:head>

<div class="mx-auto w-full max-w-[1280px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="space-y-1">
        <h2 class="text-3xl font-bold tracking-tight text-primary">Withdrawals</h2>
        <p class="text-base text-muted-foreground">Request and manage your cryptocurrency withdrawals.</p>
    </div>

    <!-- Balance Cards -->
    <div class="grid gap-4 sm:grid-cols-2">
        <!-- Main Wallet Balance -->
        <section class="relative overflow-hidden rounded-2xl border border-border/30 bg-card p-6 shadow-md">
            <div class="relative z-10">
                <p class="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Main Wallet Balance</p>
                <h3 class="text-2xl font-bold tabular-nums tracking-tight text-foreground">{formatCurrency(data.balances.main)}</h3>
            </div>
            <div class="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-primary opacity-[0.03] blur-3xl"></div>
        </section>

        <!-- Token Wallet Balance -->
        <section class="relative overflow-hidden rounded-2xl border border-border/30 bg-card p-6 shadow-md">
            <div class="relative z-10">
                <p class="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Token Wallet Balance</p>
                <h3 class="text-2xl font-bold tabular-nums tracking-tight text-foreground">{formatCurrency(data.balances.token)}</h3>
            </div>
            <div class="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-success opacity-[0.03] blur-3xl"></div>
        </section>
    </div>

    <!-- Stats & Action Bar -->
    <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <!-- Status Badges -->
        <div class="flex flex-wrap items-center gap-2">
            <div class="flex items-center gap-1.5 rounded-full border border-border/50 bg-background px-3 py-1.5 text-xs font-bold shadow-sm">
                <File class="h-4 w-4 text-primary" />
                <span class="text-muted-foreground">Total:</span>
                <span class="text-foreground">{total}</span>
            </div>
            <div class="flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1.5 text-xs font-bold text-success shadow-sm">
                <FileCheck class="h-4 w-4" />
                <span>Paid: {paid}</span>
            </div>
            <div class="flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-3 py-1.5 text-xs font-bold text-warning shadow-sm">
                <FileQuestionMark class="h-4 w-4" />
                <span>Pending: {pending}</span>
            </div>
            <div class="flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-bold text-destructive shadow-sm">
                <FileX class="h-4 w-4" />
                <span>Rejected: {rejected}</span>
            </div>
        </div>

        <!-- Search & Actions -->
        <div class="flex items-center gap-3">
            <InputGroup.Root>
                <InputGroup.Input placeholder="Search withdrawals..." bind:value={searchQuery} class="h-10" />
                <InputGroup.Addon>
                    <Search class="h-4 w-4" />
                </InputGroup.Addon>
                <InputGroup.Addon align="inline-end">
                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger class={cn(buttonVariants({ variant: 'secondary', size: 'icon' }), 'size-6')}>
                            <ListFilter class="size-4" />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content align="end" class="w-48">
                            <DropdownMenu.Label>Filter by Status</DropdownMenu.Label>
                            <DropdownMenu.Item class="gap-2" onclick={() => (searchQuery = '')}>
                                <span>All</span>
                            </DropdownMenu.Item>
                            {#each [{ value: 'paid', label: 'Paid' }, { value: 'pending', label: 'Pending' }, { value: 'rejected', label: 'Rejected' }] as status}
                                <DropdownMenu.Item class="gap-2" onclick={() => (searchQuery = status.value)}>
                                    <span>{status.label}</span>
                                </DropdownMenu.Item>
                            {/each}
                        </DropdownMenu.Content>
                    </DropdownMenu.Root>
                </InputGroup.Addon>
            </InputGroup.Root>

            <CreateWithdrawalModal />
        </div>
    </div>

    <!-- Withdrawals Table -->
    <section class="space-y-4">
        <h4 class="text-lg font-semibold text-foreground">Withdrawal History</h4>
        
        <Card.Root class="overflow-hidden border border-border/60 shadow-sm">
            <Table.Root>
                <Table.Header class="bg-muted/20">
                    <Table.Row>
                        <Table.Head class="px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</Table.Head>
                        <Table.Head class="px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Crypto</Table.Head>
                        <Table.Head class="px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Address</Table.Head>
                        <Table.Head class="px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</Table.Head>
                        <Table.Head class="px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Created</Table.Head>
                        <Table.Head class="px-6 py-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Paid</Table.Head>
                        <Table.Head class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Actions</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each filteredWithdrawals as withdrawal (withdrawal.id)}
                        <Table.Row class="border-b border-border/30 transition-colors last:border-0 hover:bg-muted/20">
                            <Table.Cell class="px-6 py-4 font-mono text-sm font-bold tabular-nums text-success">{formatCurrency(withdrawal.amount)}</Table.Cell>
                            <Table.Cell class="px-6 py-4 text-sm font-bold text-foreground">
                                {withdrawal.crypto}
                            </Table.Cell>
                            <Table.Cell class="px-6 py-4">
                                <span class="max-w-[200px] truncate font-mono text-sm text-muted-foreground">
                                    {withdrawal.address}
                                </span>
                            </Table.Cell>
                            <Table.Cell class="px-6 py-4">
                                <Status status={withdrawal.status} />
                            </Table.Cell>
                            <Table.Cell class="px-6 py-4 text-sm text-muted-foreground">{formatDateExt(withdrawal.createdAt)}</Table.Cell>
                            <Table.Cell class="px-6 py-4 text-sm text-muted-foreground">{formatDateExt(withdrawal.updatedAt)}</Table.Cell>
                            <Table.Cell class="px-6 py-4 text-right">
                                {#if withdrawal.status === 'pending'}
                                    <Button variant="destructive" size="sm" class="h-8 cursor-pointer" onclick={() => cancelWithdrawal(withdrawal.id)}>
                                        Cancel
                                    </Button>
                                {/if}
                            </Table.Cell>
                        </Table.Row>
                    {:else}
                        <Table.Row>
                            <Table.Cell colspan={7} class="h-64 text-center">
                                <div class="flex flex-col items-center justify-center text-muted-foreground">
                                    <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
                                        <ArrowDownToLine class="h-8 w-8 opacity-20" />
                                    </div>
                                    <p class="text-base font-medium">No withdrawal requests found</p>
                                    <p class="mt-1 text-sm">Create your first withdrawal to get started</p>
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>
            </Table.Root>
        </Card.Root>
    </section>

    <!-- Pagination -->
    {#if filteredWithdrawals.length > 0}
        <Pagination.Root count={30} page={1} class="justify-end">
            {#snippet children({ pages, currentPage })}
                <Pagination.Content>
                    <Pagination.Item>
                        <Pagination.Previous />
                    </Pagination.Item>
                    {#each pages as page (page.key)}
                        {#if page.type === 'ellipsis'}
                            <Pagination.Item>
                                <Pagination.Ellipsis />
                            </Pagination.Item>
                        {:else}
                            <Pagination.Item>
                                <Pagination.Link {page} isActive={currentPage === page.value}>
                                    {page.value}
                                </Pagination.Link>
                            </Pagination.Item>
                        {/if}
                    {/each}
                    <Pagination.Item>
                        <Pagination.Ellipsis />
                    </Pagination.Item>
                    <Pagination.Item>
                        <Pagination.Next />
                    </Pagination.Item>
                </Pagination.Content>
            {/snippet}
        </Pagination.Root>
    {/if}
</div>
