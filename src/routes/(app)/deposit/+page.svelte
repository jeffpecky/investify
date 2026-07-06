<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import * as Card from '$lib/components/ui/card';
    import { Copy, Check, ArrowUp, AlertCircle, Send } from 'lucide-svelte';
    import { formatCurrency, formatDateExt } from '$lib/utils';
    import { toast } from 'svelte-sonner';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    const CRYPTOS = [
        { symbol: 'BTC', name: 'Bitcoin', color: 'bg-[#f7931a]' },
        { symbol: 'ETH', name: 'Ethereum', color: 'bg-[#627eea]' },
        { symbol: 'USDT-BEP20', name: 'USDT BEP20', color: 'bg-[#26a17b]' },
        { symbol: 'USDT-TRC20', name: 'USDT (TRC20)', color: 'bg-[#26a17b]' },
        { symbol: 'USDT-ERC20', name: 'USDT ERC20', color: 'bg-[#26a17b]' },
        { symbol: 'USDC', name: 'Usdc', color: 'bg-[#2775ca]' }
    ];

    let selectedCrypto = $state('BTC');
    let copied = $state(false);
    let amount = $state('');
    let transactionHash = $state('');

    const selectedAddress = $derived(data.platformWallets[selectedCrypto as keyof typeof data.platformWallets]);

    async function copyAddress() {
        try {
            await navigator.clipboard.writeText(selectedAddress);
            copied = true;
            toast.success('Address copied to clipboard');
            setTimeout(() => copied = false, 2000);
        } catch (err) {
            toast.error('Failed to copy address');
        }
    }
</script>

<svelte:head>
    <title>Deposit Funds | Ethercore</title>
</svelte:head>

<div class="mx-auto w-full max-w-[1280px] space-y-8 px-4 py-6 sm:px-6 lg:px-8">
    <!-- Page Header -->
    <div class="space-y-1">
        <h2 class="text-3xl font-bold tracking-tight text-primary">Deposit Funds</h2>
        <p class="text-base text-muted-foreground">Add cryptocurrency to your wallet balance safely and instantly.</p>
    </div>

    <!-- Current Balance Card -->
    <section class="relative overflow-hidden rounded-2xl border border-border/30 bg-card p-8 shadow-md">
        <div class="relative z-10 flex items-center justify-between">
            <div>
                <p class="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">Current Wallet Balance</p>
                <h3 class="text-3xl font-bold tabular-nums tracking-tight text-foreground">{formatCurrency(data.user?.walletBalance || 0)}</h3>
            </div>
            <div class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-muted transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground active:scale-95">
                <ArrowUp class="h-6 w-6" />
            </div>
        </div>
        <!-- Subtle background design element -->
        <div class="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-primary opacity-[0.03] blur-3xl"></div>
    </section>

    <!-- Step 1: Crypto Selection -->
    <section class="space-y-6">
        <div class="flex items-center gap-2">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">1</span>
            <h4 class="text-lg font-semibold text-foreground">Select Cryptocurrency</h4>
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {#each CRYPTOS as crypto}
                <button
                    onclick={() => selectedCrypto = crypto.symbol}
                    class="group relative flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all hover:border-primary hover:bg-muted/30 hover:shadow-md {selectedCrypto === crypto.symbol ? 'border-primary bg-primary/5 ring-4 ring-primary/5' : 'border-border bg-card'}"
                >
                    {#if selectedCrypto === crypto.symbol}
                        <div class="absolute right-2 top-2 text-primary">
                            <Check class="h-5 w-5" />
                        </div>
                    {/if}
                    <div class="flex h-14 w-14 items-center justify-center rounded-full {crypto.color} text-xl font-bold text-white shadow-lg transition-transform group-hover:scale-110">
                        {crypto.symbol.charAt(0)}
                    </div>
                    <div class="text-center">
                        <p class="font-bold text-foreground">{crypto.symbol}</p>
                        <p class="text-sm text-muted-foreground opacity-60">{crypto.name}</p>
                    </div>
                </button>
            {/each}
        </div>
    </section>

    <!-- Step 2: Address Info -->
    <section class="space-y-6">
        <div class="flex items-center gap-2">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">2</span>
            <h4 class="text-lg font-semibold text-foreground">Send {selectedCrypto} to This Address</h4>
        </div>
        <Card.Root class="border border-border/60 shadow-sm">
            <Card.Content class="space-y-6 p-8">
                <!-- Address Display -->
                <div class="space-y-2">
                    <Label class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Platform Wallet Address</Label>
                    <div class="group relative flex items-center gap-3 rounded-lg border border-border/50 bg-muted/50 p-4 transition-colors hover:border-primary">
                        <span class="flex-1 break-all font-mono text-sm text-foreground">{selectedAddress}</span>
                        <button
                            onclick={copyAddress}
                            class="ml-auto flex-shrink-0 text-primary transition-transform hover:scale-110 active:scale-95"
                            title="Copy Address"
                        >
                            {#if copied}
                                <Check class="h-5 w-5" />
                            {:else}
                                <Copy class="h-5 w-5" />
                            {/if}
                        </button>
                    </div>
                </div>

                <!-- Instructions -->
                <div class="flex gap-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                    <AlertCircle class="h-5 w-5 flex-shrink-0 text-blue-500" />
                    <div class="space-y-2">
                        <p class="font-bold text-blue-600 dark:text-blue-400">Important Instructions</p>
                        <ul class="space-y-1 text-sm text-muted-foreground">
                            <li class="flex gap-2">
                                <span>•</span>
                                <span>Send only {selectedCrypto} to this address. Sending any other asset will result in permanent loss.</span>
                            </li>
                            <li class="flex gap-2">
                                <span>•</span>
                                <span>Minimum deposit amount: 0.001 {selectedCrypto}</span>
                            </li>
                            <li class="flex gap-2">
                                <span>•</span>
                                <span>Funds will be credited automatically after 3 network confirmations.</span>
                            </li>
                            <li class="flex gap-2">
                                <span>•</span>
                                <span>Submit your transaction hash below after sending to speed up verification.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </Card.Content>
        </Card.Root>
    </section>

    <!-- Step 3: Confirmation Form -->
    <section class="space-y-6 pb-8">
        <div class="flex items-center gap-2">
            <span class="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">3</span>
            <h4 class="text-lg font-semibold text-foreground">Submit Deposit Proof</h4>
        </div>
        <Card.Root class="border border-border/60 shadow-sm">
            <Card.Content class="p-8">
                <form method="POST" action="?/submitDeposit" class="space-y-6">
                    <input type="hidden" name="cryptocurrency" value={selectedCrypto} />
                    
                    <div class="grid gap-6 md:grid-cols-2">
                        <div class="space-y-2">
                            <Label for="amount" class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount ({selectedCrypto})</Label>
                            <Input
                                type="number"
                                id="amount"
                                name="amount"
                                placeholder="0.00"
                                step="0.00000001"
                                bind:value={amount}
                                class="h-12 rounded-lg border-border/50 bg-background px-4 py-3 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                required
                            />
                        </div>
                        
                        <div class="space-y-2">
                            <Label for="transactionHash" class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Transaction Hash</Label>
                            <Input
                                type="text"
                                id="transactionHash"
                                name="transactionHash"
                                placeholder="0x..."
                                bind:value={transactionHash}
                                class="h-12 rounded-lg border-border/50 bg-background px-4 py-3 transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                                required
                            />
                        </div>
                    </div>

                    <div class="pt-2">
                        <Button 
                            type="submit" 
                            class="flex h-12 items-center justify-center gap-2 rounded-lg px-8 font-bold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
                        >
                            <span>Submit Deposit Proof</span>
                            <Send class="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </Card.Content>
        </Card.Root>
    </section>

    <!-- Recent Deposits -->
    {#if data.pendingDeposits && data.pendingDeposits.length > 0}
        <section class="space-y-6 pb-8">
            <h4 class="text-lg font-semibold text-foreground">Recent Deposits</h4>
            
            <Card.Root class="border border-border/60 shadow-sm">
                <Card.Content class="p-0">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="border-b border-border/40 bg-muted/20">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">Crypto</th>
                                    <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Amount</th>
                                    <th class="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each data.pendingDeposits as deposit}
                                    <tr class="border-b border-border/30 last:border-0 transition-colors hover:bg-muted/20">
                                        <td class="px-6 py-4">
                                            <span class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium {
                                                deposit.status === 'confirmed' ? 'bg-success/10 text-success' :
                                                deposit.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                                                'bg-warning/10 text-warning'
                                            }">
                                                {deposit.status}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 text-sm font-bold text-foreground">{deposit.cryptocurrency}</td>
                                        <td class="px-6 py-4 text-right font-mono text-sm tabular-nums text-foreground">{deposit.amount}</td>
                                        <td class="px-6 py-4 text-right text-sm text-muted-foreground">{formatDateExt(deposit.createdAt)}</td>
                                    </tr>
                                {:else}
                                    <tr>
                                        <td colspan="4" class="px-6 py-8 text-center text-sm text-muted-foreground">
                                            No deposit history yet
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </Card.Content>
            </Card.Root>
        </section>
    {/if}
</div>
