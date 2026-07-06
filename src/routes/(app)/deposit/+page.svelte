<script lang="ts">
    import { Button } from '$lib/components/ui/button';
    import { Input } from '$lib/components/ui/input';
    import { Label } from '$lib/components/ui/label';
    import * as Card from '$lib/components/ui/card';
    import { Copy, Check, ArrowUpToLine, AlertCircle } from 'lucide-svelte';
    import { formatCurrency, formatDateExt } from '$lib/utils';
    import { toast } from 'svelte-sonner';
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    const CRYPTOS = [
        { symbol: 'BTC', name: 'Bitcoin', color: 'bg-orange-500' },
        { symbol: 'ETH', name: 'Ethereum', color: 'bg-blue-500' },
        { symbol: 'USDT', name: 'Tether', color: 'bg-green-500' },
        { symbol: 'BNB', name: 'Binance Coin', color: 'bg-yellow-500' }
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
    <title>Deposit Funds</title>
</svelte:head>

<div class="space-y-4 px-4 py-4 sm:px-6 lg:px-8">
    <!-- Header -->
    <div>
        <h1 class="text-2xl font-bold tracking-tight text-foreground">Deposit Funds</h1>
        <p class="mt-1 text-sm text-muted-foreground">Add cryptocurrency to your wallet balance</p>
    </div>

    <!-- Wallet Balance Info -->
    <Card.Root class="border-primary/20 bg-primary/5">
        <Card.Content class="pt-5">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-sm text-muted-foreground">Current Wallet Balance</p>
                    <p class="text-2xl font-bold tabular-nums text-foreground">{formatCurrency(data.user?.walletBalance || 0)}</p>
                </div>
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <ArrowUpToLine class="h-5 w-5 text-primary" />
                </div>
            </div>
        </Card.Content>
    </Card.Root>

    <!-- Step 1: Select Cryptocurrency -->
    <div class="space-y-3">
        <h2 class="text-base font-semibold text-foreground">Step 1: Select Cryptocurrency</h2>
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {#each CRYPTOS as crypto}
                <button
                    onclick={() => selectedCrypto = crypto.symbol}
                    class="relative flex flex-col items-center gap-2 rounded-lg border p-3 transition-all hover:border-primary/50 {selectedCrypto === crypto.symbol ? 'border-primary bg-primary/5' : 'border-border'}"
                >
                    <div class="flex h-9 w-9 items-center justify-center rounded-full {crypto.color} text-white">
                        <span class="text-sm font-bold">{crypto.symbol.charAt(0)}</span>
                    </div>
                    <div class="text-center">
                        <p class="text-sm font-semibold text-foreground">{crypto.symbol}</p>
                        <p class="text-xs text-muted-foreground">{crypto.name}</p>
                    </div>
                    {#if selectedCrypto === crypto.symbol}
                        <div class="absolute right-2 top-2">
                            <Check class="h-4 w-4 text-primary" />
                        </div>
                    {/if}
                </button>
            {/each}
        </div>
    </div>

    <!-- Step 2: Platform Wallet Address -->
    <div class="space-y-3">
        <h2 class="text-base font-semibold text-foreground">Step 2: Send {selectedCrypto} to This Address</h2>
        
        <Card.Root>
            <Card.Content class="space-y-4 pt-5">
                <!-- Address Display -->
                <div class="space-y-2">
                    <Label class="text-xs uppercase tracking-wide text-muted-foreground">Platform Wallet Address</Label>
                    <div class="relative overflow-hidden rounded-lg border border-border/50 bg-muted/20 p-4">
                        <p class="break-all font-mono text-sm text-foreground">{selectedAddress}</p>
                        <button
                            onclick={copyAddress}
                            class="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-md bg-background/80 transition-colors hover:bg-background"
                        >
                            {#if copied}
                                <Check class="h-4 w-4 text-success" />
                            {:else}
                                <Copy class="h-4 w-4 text-muted-foreground" />
                            {/if}
                        </button>
                    </div>
                </div>

                <!-- Instructions -->
                <div class="space-y-2 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                    <div class="flex gap-2">
                        <AlertCircle class="h-5 w-5 flex-shrink-0 text-blue-500" />
                        <div class="space-y-1 text-sm">
                            <p class="font-medium text-foreground">Important Instructions</p>
                            <ul class="list-inside list-disc space-y-1 text-muted-foreground">
                                <li>Send only {selectedCrypto} to this address</li>
                                <li>Minimum deposit: 0.001 {selectedCrypto}</li>
                                <li>Funds will be credited after network confirmation</li>
                                <li>Submit your transaction hash below after sending</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Card.Content>
        </Card.Root>
    </div>

    <!-- Step 3: Submit Proof -->
    <div class="space-y-3">
        <h2 class="text-base font-semibold text-foreground">Step 3: Submit Deposit Proof</h2>
        
        <Card.Root>
            <Card.Content class="pt-5">
                <form method="POST" action="?/submitDeposit" class="space-y-4">
                    <input type="hidden" name="cryptocurrency" value={selectedCrypto} />
                    
                    <div class="grid gap-4 sm:grid-cols-2">
                        <div class="space-y-2">
                            <Label for="amount">Amount ({selectedCrypto})</Label>
                            <Input
                                type="number"
                                id="amount"
                                name="amount"
                                placeholder="0.00"
                                step="0.00000001"
                                bind:value={amount}
                                required
                            />
                        </div>
                        
                        <div class="space-y-2">
                            <Label for="transactionHash">Transaction Hash</Label>
                            <Input
                                type="text"
                                id="transactionHash"
                                name="transactionHash"
                                placeholder="0x..."
                                bind:value={transactionHash}
                                required
                            />
                        </div>
                    </div>

                    <Button type="submit" class="w-full sm:w-auto">
                        Submit Deposit Proof
                    </Button>
                </form>
            </Card.Content>
        </Card.Root>
    </div>

    <!-- Recent Deposits -->
    {#if data.pendingDeposits && data.pendingDeposits.length > 0}
        <div class="space-y-3">
            <h2 class="text-base font-semibold text-foreground">Recent Deposits</h2>
            
            <Card.Root>
                <Card.Content class="p-0">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="border-b border-border/40 bg-muted/20">
                                <tr>
                                    <th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                                    <th class="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Crypto</th>
                                    <th class="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                                    <th class="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each data.pendingDeposits as deposit}
                                    <tr class="border-b border-border/30 last:border-0">
                                        <td class="px-4 py-2.5">
                                            <span class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {
                                                deposit.status === 'confirmed' ? 'bg-success/10 text-success' :
                                                deposit.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                                                'bg-warning/10 text-warning'
                                            }">
                                                {deposit.status}
                                            </span>
                                        </td>
                                        <td class="px-4 py-2.5 text-sm font-medium text-foreground">{deposit.cryptocurrency}</td>
                                        <td class="px-4 py-2.5 text-right text-sm font-mono tabular-nums text-foreground">{deposit.amount}</td>
                                        <td class="px-4 py-2.5 text-right text-sm text-muted-foreground">{formatDateExt(deposit.createdAt)}</td>
                                    </tr>
                                {:else}
                                    <tr>
                                        <td colspan="4" class="px-4 py-6 text-center text-sm text-muted-foreground">
                                            No deposit history yet
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </Card.Content>
            </Card.Root>
        </div>
    {/if}
</div>
