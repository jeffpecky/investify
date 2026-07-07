<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import {
		CreditCard,
		Wallet,
		Copy,
		Check,
		LoaderCircle,
		CircleAlertIcon,
		ArrowLeft
	} from 'lucide-svelte';
	import { Label } from '$lib/components/ui/label/index.js';
	import { cn } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';

	import ComboBox from '../ComboBox.svelte';
	import { SUPPORT_CRYPTOS, CRYPTO_WALLETS } from '$lib/store';

	import QRCode from 'qrcode';
	import { copy, formatCurrency, convertUSDToCrypto } from '$lib/utils';
	import { enhance } from '$app/forms';

	let { data, open = $bindable(false), class: className = '' } = $props();

    let form = $state({
        plan: null as string | null,
        payoutOption: null as string | null,
        crypto: '' as string,
        amount: 0,
        paymentMethod: '1',
    });

	let isSubmitting = $state(false);
	let showQrCode = $state(false);
	let qrCodeUrl = $state('');
	let selectedWalletAddress = $state('');
	let createdInvestmentId = $state('');
	let transactionHash = $state('');
	let isSubmittingPayment = $state(false);

	const isCalculator = $derived(data && 'plan' in data);
	const activePlan = $derived(isCalculator ? data.plan : data);

    $effect(() => {
        if (data && !open) {
            resetForm();
        }
    });

    function resetForm() {
        if (!data) return;
        form.plan = activePlan?.id;
        form.amount = isCalculator ? data.amount : data.minAmount || 0;
        // Auto-select payout option from plan (don't ask user)
        form.payoutOption = activePlan?.payoutOptions?.[0] || null;
        form.crypto = data.crypto?.symbol || '';
        form.paymentMethod = '1';

		isSubmitting = false;
		showQrCode = false;
		qrCodeUrl = '';
		selectedWalletAddress = '';
		createdInvestmentId = '';
		transactionHash = '';
		isSubmittingPayment = false;
	}

	const formatedPlansOptions = $derived([
		{
			value: activePlan?.id,
			label: activePlan?.name
		}
	]);

	const payoutOptions = $derived.by(() => {
		if (!activePlan?.payoutOptions) return [];
		return activePlan.payoutOptions.map((payoutOption: any) => ({
			value: payoutOption,
			label: payoutOption
		}));
	});

    async function handleCreateInvestment(e: SubmitEvent) {
        e.preventDefault();
        if (isSubmitting) return;
        isSubmitting = true;

        try {
            const formData = new FormData();
            formData.set('planId', form.plan || '');
            formData.set('amount', String(form.amount));
            formData.set('payoutOption', form.payoutOption || '');
            formData.set('paymentMethod', form.paymentMethod);
            formData.set('cryptoSymbol', form.crypto || '');

            console.log('Submitting:', { plan: form.plan, amount: form.amount, crypto: form.crypto, payment: form.paymentMethod });

            const response = await fetch('?/createInvestment', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.type === 'success' && result.data?.investmentId) {
				createdInvestmentId = result.data.investmentId;
				toast.success('Investment created! Please complete payment.');

				// Now generate QR code and show payment details
				if (form.paymentMethod === '1') {
					await generatePaymentQR();
				} else {
					// Wallet balance payment - auto-confirm
					showQrCode = false;
					toast.success('Payment deducted from wallet balance.');
					handleClose();
				}
			} else {
				toast.error(result.data?.error || 'Failed to create investment');
			}
		} catch (err) {
			console.error(err);
			toast.error('Failed to create investment');
		} finally {
			isSubmitting = false;
		}
	}

	async function generatePaymentQR() {
		const cryptoInfo = $SUPPORT_CRYPTOS.find((c) => c.symbol === form.crypto);
		const wallet = $CRYPTO_WALLETS.find((w) => w.name === cryptoInfo?.name);

		if (!wallet?.address) {
			toast.error(
				`No wallet address configured for ${cryptoInfo?.name || form.crypto}. Please contact support.`
			);
			return;
		}

		selectedWalletAddress = wallet.address;

		try {
			const result = await convertUSDToCrypto(form.amount, form.crypto || 'BTC');
			if (result?.amount && cryptoInfo) {
				const scheme = cryptoInfo.name.toLowerCase();
				let paymentURI = selectedWalletAddress;

				if (scheme === 'bitcoin') {
					paymentURI = `bitcoin:${selectedWalletAddress}?amount=${result.amount}`;
				} else if (scheme === 'ethereum') {
					paymentURI = `ethereum:${selectedWalletAddress}?value=${result.amount}`;
				} else {
					paymentURI = `${scheme}:${selectedWalletAddress}?amount=${result.amount}`;
				}

				qrCodeUrl = await QRCode.toDataURL(paymentURI, {
					width: 200,
					margin: 2,
					color: { dark: '#000000', light: '#ffffff' }
				});

				showQrCode = true;
			}
		} catch (err) {
			console.error(err);
			toast.error('Failed to generate payment details');
		}
	}

	async function handleSubmitPayment(e: SubmitEvent) {
		e.preventDefault();
		if (isSubmittingPayment || !transactionHash) return;
		isSubmittingPayment = true;

		try {
			const formData = new FormData();
			formData.append('investmentId', createdInvestmentId);
			formData.append('transactionHash', transactionHash);

			const response = await fetch('?/submitPaymentProof', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();

			if (result.type === 'success') {
				toast.success('Payment proof submitted! Awaiting admin verification.');
				handleClose();
			} else {
				toast.error(result.data?.error || 'Failed to submit payment proof');
			}
		} catch (err) {
			console.error(err);
			toast.error('Failed to submit payment proof');
		} finally {
			isSubmittingPayment = false;
		}
	}

	function handleClose() {
		open = false;
		resetForm();
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger
		class={cn(buttonVariants({ variant: 'default' }), 'hover:cursor-pointer', className)}
	>
		<CreditCard />
		Buy Plan
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[525px]">
		<Dialog.Header>
			<Dialog.Title>{showQrCode ? 'Complete Payment' : 'Buy Plan'}</Dialog.Title>
			<Dialog.Description
				>{showQrCode
					? 'Scan the QR code or copy the address to pay.'
					: 'Buy this plan and start earning'}</Dialog.Description
			>
		</Dialog.Header>

		{#if !showQrCode}
			<form class="flex flex-col gap-4" onsubmit={handleCreateInvestment}>
				<div class="grid gap-2">
					<Label for="plan">Plan</Label>
					<ComboBox
						type="single"
						options={formatedPlansOptions}
						bind:value={form.plan}
						search={true}
					/>
				</div>

				<RadioGroup.Root bind:value={form.paymentMethod} class="grid grid-cols-2 gap-3">
					<div class="flex items-center space-x-2">
						<Label
							class="w-full hover:bg-accent/50 cursor-pointer flex items-start gap-3 rounded-lg border p-3 has-aria-checked:border-primary-600 has-aria-checked:bg-primary-50"
						>
							<RadioGroup.Item
								id="toggle-crypto"
								value="1"
								class="data-[state=checked]:border-primary-600 data-[state=checked]:bg-primary-600 data-[state=checked]:text-white"
							/>
							<div class="grid gap-1.5 font-normal">
								<p class="text-sm leading-none font-medium">Crypto</p>
								<p class="text-muted-foreground text-xs">Pay with cryptocurrency</p>
							</div>
						</Label>
					</div>
					<div class="flex items-center space-x-2">
						<Label
							class="w-full hover:bg-accent/50 cursor-pointer flex items-start gap-3 rounded-lg border p-3 has-aria-checked:border-primary-600 has-aria-checked:bg-primary-50"
						>
							<RadioGroup.Item
								id="toggle-wallet"
								value="2"
								class="data-[state=checked]:border-primary-600 data-[state=checked]:bg-primary-600 data-[state=checked]:text-white"
							/>
							<div class="grid gap-1.5 font-normal">
								<p class="text-sm leading-none font-medium">Wallet Balance</p>
								<p class="text-muted-foreground text-xs">Pay with your wallet balance</p>
							</div>
						</Label>
					</div>
				</RadioGroup.Root>

				<div class="grid gap-2">
					{#if form.paymentMethod === '1'}
						<div class="grid gap-2">
							<Label for="crypto">Pay with</Label>
							<ComboBox
								type="single"
								options={$SUPPORT_CRYPTOS.map((crypto) => ({
									value: crypto.symbol,
									label: crypto.name
								}))}
								value={form.crypto}
								onValueChange={(val) => { form.crypto = val || ''; }}
								search={false}
								disabled={form.plan === null}
							/>
						</div>
					{/if}
				</div>
				<input type="hidden" name="cryptoSymbol" value={form.crypto || ''} />

				<div class="grid gap-2">
					<Label for="amount">Amount</Label>
					<InputGroup.Root>
						<InputGroup.Addon>
							<InputGroup.Text>$</InputGroup.Text>
						</InputGroup.Addon>
						<InputGroup.Input
							placeholder="0.00"
							id="amount"
							name="amount"
							type="number"
							step="0.01"
							bind:value={form.amount}
							required
							disabled={form.plan === null}
						/>
						<InputGroup.Addon align="inline-end">
							<InputGroup.Text>USD</InputGroup.Text>
						</InputGroup.Addon>
					</InputGroup.Root>
				</div>

				<div class="col-span-2 flex justify-end items-center gap-2">
					<Button variant="outline" onclick={handleClose} disabled={isSubmitting} type="button"
						>Cancel</Button
					>
					<Button
						type="submit"
						class="cursor-pointer"
						disabled={form.plan === null || form.amount <= 0 || isSubmitting}
					>
						{#if isSubmitting}
							<LoaderCircle class="size-4 animate-spin" /> Processing...
						{:else}
							Buy
						{/if}
					</Button>
				</div>
			</form>
		{:else}
			<div class="flex flex-col items-center justify-center gap-5 py-2">
				<div class="text-center space-y-1">
					<p class="text-muted-foreground text-sm">Send exactly</p>
					<h2 class="text-2xl font-bold text-success">
						{#await convertUSDToCrypto(form.amount, form.crypto || 'BTC')}
							<span class="animate-pulse">Calculating...</span>
						{:then result}
							{result?.formattedAmount} <span class="text-base">{result?.symbol}</span>
						{:catch}
							<span class="text-destructive">Error calculating amount</span>
						{/await}
					</h2>
					<p class="text-xs font-medium text-muted-foreground uppercase">
						{formatCurrency(form.amount)}
					</p>
				</div>

				<div class="bg-white p-2 rounded-lg">
					<img src={qrCodeUrl} alt="Payment QR Code" class="w-44 h-44 rounded" />
				</div>

				<div class="w-full space-y-2">
					<div class="flex items-center justify-between">
						<Label class="text-xs text-muted-foreground">Wallet Address ({form.crypto})</Label>
						<span class="text-xs font-medium text-warning flex items-center gap-1">
							<LoaderCircle class="animate-spin size-3" />
							Awaiting payment
						</span>
					</div>
					<InputGroup.Root>
						<InputGroup.Addon>
							<Wallet class="size-4" />
						</InputGroup.Addon>
						<InputGroup.Input value={selectedWalletAddress} readonly class="font-mono text-xs" />
						<InputGroup.Addon align="inline-end">
							<InputGroup.Button
								onclick={() => copy(selectedWalletAddress, 'Address copied')}
								class="cursor-pointer hover:text-primary transition-colors"
							>
								<Copy class="size-4" />
							</InputGroup.Button>
						</InputGroup.Addon>
					</InputGroup.Root>
				</div>

				<form class="w-full space-y-3 pt-3 border-t" onsubmit={handleSubmitPayment}>
					<div class="grid gap-2">
						<Label for="hash" class="text-xs">Transaction Hash</Label>
						<Input
							id="hash"
							placeholder="Enter your transaction hash"
							bind:value={transactionHash}
							required
						/>
						<p class="text-[10px] text-muted-foreground">
							Paste the transaction ID from your crypto wallet
						</p>
					</div>

					<div class="flex justify-end gap-2">
						<Button variant="outline" onclick={handleClose} type="button" size="sm">Cancel</Button>
						<Button type="submit" size="sm" disabled={!transactionHash || isSubmittingPayment}>
							{#if isSubmittingPayment}
								<LoaderCircle class="mr-1 size-3 animate-spin" /> Submitting...
							{:else}
								<Check class="mr-1 size-3" /> Submit Payment
							{/if}
						</Button>
					</div>
				</form>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
