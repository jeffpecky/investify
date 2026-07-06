<script lang="ts">
	import Card from '$lib/components/ui/card/card.svelte';
	import CardContent from '$lib/components/ui/card/card-content.svelte';
	import CardHeader from '$lib/components/ui/card/card-header.svelte';
	import CardTitle from '$lib/components/ui/card/card-title.svelte';
	import CardDescription from '$lib/components/ui/card/card-description.svelte';
	import { siteSettings } from '$lib/stores/site.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	// Fallback/Default values for simple auth card layout
	const title = 'Welcome back';
	const description = 'Sign in to access your portfolio and manage your investments';
</script>

<div class="relative flex min-h-svh">
	<!-- Left side: Background image (hidden on mobile) -->
	<div class="relative hidden w-0 flex-1 lg:block">
		<img
			class="absolute inset-0 h-full w-full object-cover"
			src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=2000"
			alt="Financial cityscape"
		/>
		<div class="absolute inset-0 bg-primary/60 mix-blend-multiply"></div>
		<div
			class="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent"
		></div>
		<!-- Overlay content -->
		<div class="absolute bottom-0 left-0 right-0 p-12">
			<blockquote class="space-y-3">
				<p class="text-lg font-light leading-relaxed text-white/90">
					"The best investment you can make is an investment in yourself. The more you learn, the
					more you'll earn."
				</p>
				<footer class="text-sm font-medium text-white/60">— Warren Buffett</footer>
			</blockquote>
		</div>
	</div>

	<!-- Right side: Auth form -->
	<div
		class="relative flex w-full flex-col items-center justify-center bg-background p-6 md:p-10 lg:w-[520px] lg:shrink-0"
	>
		<!-- Subtle background pattern -->
		<div
			class="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
			style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 32px 32px;"
		></div>

		<div class="relative z-10 flex w-full max-w-md flex-col gap-6">
		<!-- Logo + Brand -->
		<a href="/" class="flex items-center justify-center gap-2.5">
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 140" class="h-8 w-auto text-primary">
				<g fill="currentColor">
					<path d="M 36,28 L 46,28 L 46,108 L 36,108 A 6,6 0 0 1 30,102 L 30,34 A 6,6 0 0 1 36,28 Z"/>
					<path d="M 46,60 L 72,60 A 6,6 0 0 1 78,66 L 78,70 A 6,6 0 0 1 72,76 L 46,76 Z"/>
					<path d="M 46,92 L 84,92 A 6,6 0 0 1 90,98 L 90,102 A 6,6 0 0 1 84,108 L 46,108 Z"/>
					<path d="M 46,28 L 76.43,18.11 L 74.58,12.41 L 99.83,18.92 L 83.23,39.03 L 81.38,33.33 L 50.94,43.22 L 46,44 Z"/>
				</g>
				<circle cx="45" cy="84" r="8" fill="#C9A24A"/>
			</svg>
			<span class="text-base font-semibold tracking-tight text-foreground">{siteSettings.siteName}</span>
		</a>

			<Card class="overflow-hidden rounded-2xl border-border/50 shadow-xl">
				<CardHeader class="px-6 pb-0 pt-6 text-center sm:px-8 sm:pt-7">
					<CardTitle class="text-lg font-semibold">{title}</CardTitle>
					<CardDescription class="mt-1 text-xs">
						{description}
					</CardDescription>
				</CardHeader>
				<CardContent class="px-6 py-5 sm:px-8 sm:py-6">
					{@render children?.()}
				</CardContent>
			</Card>

			<p class="text-center text-[11px] leading-relaxed text-muted-foreground">
				By continuing, you agree to our
				<a href="/terms-of-use" class="underline hover:text-foreground">Terms</a>
				and
				<a href="/privacy-policy" class="underline hover:text-foreground">Privacy Policy</a>.
			</p>
		</div>
	</div>
</div>
