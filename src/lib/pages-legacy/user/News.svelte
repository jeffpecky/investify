<script lang="ts">
    import UserLayout from '@/layouts/UserLayout.svelte';
    import { type BreadcrumbItem } from '@/types';
    import * as Card from '@/components/ui/card';
    import * as Dialog from '@/components/ui/dialog';
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import * as Pagination from '@/components/ui/pagination/index.js';
    import { Calendar, ChevronRight, Share2, X, Search, ListFilter } from 'lucide-svelte';
    import * as InputGroup from '@/components/ui/input-group/index.js';
    import * as DropdownMenu from '@/components/ui/dropdown-menu';

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'News & Updates',
            href: '/user/news',
        },
    ];

    interface NewsArticle {
        id: number;
        title: string;
        date: string;
        category: string;
        summary: string;
        content: string;
        imageUrl: string;
    }

    const newsArticles: NewsArticle[] = [
        {
            id: 1,
            title: 'Q1 2026 Financial Results Exceed Expectations',
            date: 'Feb 8, 2026',
            category: 'Financial',
            summary:
                'We are thrilled to announce that our first-quarter financial results have surpassed all projections, driven by strong growth in our core markets.',
            content: `
                <p class="mb-4">We are thrilled to announce that our first-quarter financial results have surpassed all projections, driven by strong growth in our core markets. This achievement is a testament to the hard work and dedication of our team, as well as the continued trust and support of our valued investors.</p>
                <p class="mb-4">Key highlights from the report include:</p>
                <ul class="list-disc pl-5 mb-4 space-y-2">
                    <li><strong>Revenue Growth:</strong> A 15% increase in total revenue compared to the same period last year.</li>
                    <li><strong>User Acquisition:</strong> A significant surge in new user registrations, expanding our community by 20%.</li>
                    <li><strong>Product Innovation:</strong> Successful launch of three new investment products that have gained immediate traction.</li>
                </ul>
                <p>Looking ahead, we remain committed to maintaining this momentum and delivering exceptional value to our stakeholders. We have an exciting roadmap for the rest of the year, with several major initiatives in the pipeline.</p>
            `,
            imageUrl: 'https://images.unsplash.com/photo-1554224155-9726b30c8d1b?q=80&w=2670&auto=format&fit=crop',
        },
        {
            id: 2,
            title: 'Introducing Our New Mobile App Features',
            date: 'Feb 5, 2026',
            category: 'Product Update',
            summary:
                'Experience a seamless investment journey with the latest updates to our mobile application, featuring enhanced security and intuitive design.',
            content: `
                <p class="mb-4">Experience a seamless investment journey with the latest updates to our mobile application, featuring enhanced security and intuitive design. We've been listening to your feedback and have implemented several key improvements to make managing your portfolio easier than ever.</p>
                <h4 class="text-lg font-semibold mb-2">What's New:</h4>
                <ul class="list-disc pl-5 mb-4 space-y-2">
                    <li><strong>Biometric Login:</strong> Faster and more secure access using FaceID and TouchID.</li>
                    <li><strong>Real-time Notifications:</strong> Get instant alerts on market movements and account activity.</li>
                    <li><strong>Enhanced Charts:</strong> Interactive charts for better visualization of your asset performance.</li>
                </ul>
                <p>Update your app today to enjoy these new features and report any issues to our support team.</p>
            `,
            imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b5bbb695?q=80&w=2670&auto=format&fit=crop',
        },
        {
            id: 3,
            title: 'Global Market Outlook: Trends to Watch',
            date: 'Jan 28, 2026',
            category: 'Market Analysis',
            summary:
                'Our expert analysts provide a deep dive into the emerging trends shaping the global economy and what they mean for your portfolio.',
            content: `
                <p class="mb-4">Our expert analysts provide a deep dive into the emerging trends shaping the global economy and what they mean for your portfolio. In this comprehensive report, we analyze the shifting dynamics in technology, energy, and emerging markets.</p>
                <p class="mb-4"><strong>Technology Sector:</strong> AI and automation continue to drive productivity gains, offering new opportunities for growth investors.</p>
                <p class="mb-4"><strong>Clean Energy:</strong> The transition to renewable energy sources is accelerating, creating a robust landscape for sustainable investments.</p>
                <p>Stay ahead of the curve by understanding these macro trends and positioning your portfolio for long-term success.</p>
            `,
            imageUrl: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2574&auto=format&fit=crop',
        },
        {
            id: 4,
            title: 'Maintenance Scheduled for February 15th',
            date: 'Jan 20, 2026',
            category: 'System Update',
            summary:
                'Please be advised of scheduled system maintenance to upgrade our server infrastructure. Service may be intermittently unavailable.',
            content: `
                <p class="mb-4">Please be advised of scheduled system maintenance to upgrade our server infrastructure. Service may be intermittently unavailable on <strong>February 15th, 2026, from 2:00 AM to 6:00 AM UTC</strong>.</p>
                <p>During this time, you may experience temporary disruptions in accessing your dashboard and performing transactions. We apologize for any inconvenience this may cause and appreciate your patience as we work to improve our platform's reliability and performance.</p>
            `,
            imageUrl: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=2670&auto=format&fit=crop',
        },
        {
            id: 5,
            title: 'Community Spotlight: Top Investors of 2025',
            date: 'Jan 10, 2026',
            category: 'Community',
            summary:
                'Celebrating the success stories of our most top-performing investors from the past year. Learn from their strategies and insights.',
            content: `
                <p class="mb-4">Celebrating the success stories of our most top-performing investors from the past year. Learn from their strategies and insights.</p>
                <p class="mb-4">We interviewed our top 3 investors to understand their approach to risk management, diversification, and long-term planning.</p>
                <ul class="list-disc pl-5 mb-4 space-y-2">
                    <li><strong>Sarah J. - +45% Return:</strong> Focuses on high-growth tech stocks and regular rebalancing.</li>
                    <li><strong>Michael T. - +38% Return:</strong> Uses a dividend-focused strategy with reinvestment.</li>
                    <li><strong>Elena R. - +32% Return:</strong> Diversifies across real estate and emerging markets.</li>
                </ul>
                <p>Read their full interviews on our blog to gain valuable insights for your own investment journey.</p>
            `,
            imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2671&auto=format&fit=crop',
        },
        {
            id: 6,
            title: 'Security Alert: Phishing Campaigns on the Rise',
            date: 'Jan 05, 2026',
            category: 'Security',
            summary:
                'Important security reminder regarding recent phishing attempts targeting financial platforms. Learn how to protect your account.',
            content: `
                <p class="mb-4">Important security reminder regarding recent phishing attempts targeting financial platforms. Learn how to protect your account.</p>
                <p class="mb-4">We have noticed an increase in sophisticated phishing emails pretending to be from our support team. Please remember:</p>
                <ul class="list-disc pl-5 mb-4 space-y-2">
                    <li>We will <strong>never</strong> ask for your password or 2FA code via email.</li>
                    <li>Always verify the sender's email address matches our official domain.</li>
                    <li>Do not click on suspicious links or download unknown attachments.</li>
                </ul>
                <p>If you suspect any unauthorized activity, please contact our support team immediately.</p>
            `,
            imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1470&auto=format&fit=crop',
        },
    ];

    let selectedArticle: NewsArticle | null = $state(null);
    let open = $state(false);
    let searchQuery = $state('');

    function openArticle(article: NewsArticle) {
        selectedArticle = article;
        open = true;
    }

    // Derived state for filtering
    let filteredArticles = $derived(
        newsArticles.filter((article) => {
            const query = searchQuery.toLowerCase();
            return (
                article.title.toLowerCase().includes(query) ||
                article.summary.toLowerCase().includes(query) ||
                article.category.toLowerCase().includes(query)
            );
        }),
    );
</script>

<svelte:head>
    <title>News & Updates | User Dashboard</title>
</svelte:head>

<UserLayout {breadcrumbs}>
    <div class="space-y-6 px-6 py-8">
        <!-- Header Section -->
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 class="text-xl font-bold">News & Updates</h1>
                <p class="text-muted-foreground mt-1 text-sm">Stay informed with the latest announcements, market insights, and platform updates.</p>
            </div>

            <div class="flex items-center gap-3">
                <!-- Search -->
                <InputGroup.Root>
                    <InputGroup.Input placeholder="Search news..." bind:value={searchQuery} />
                    <InputGroup.Addon>
                        <Search />
                    </InputGroup.Addon>
                </InputGroup.Root>
            </div>
        </div>

        <!-- News Grid -->
        <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {#each filteredArticles as article (article.id)}
                <div class="group h-full">
                    <Card.Root
                        class="h-full flex flex-col overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-primary/20 hover:-translate-y-1"
                    >
                        <!-- Image Container -->
                        <div class="relative h-48 overflow-hidden bg-muted">
                            <img
                                src={article.imageUrl}
                                alt={article.title}
                                class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div class="absolute top-3 left-3">
                                <Badge
                                    variant="secondary"
                                    class="bg-background/80 backdrop-blur-md shadow-sm text-xs font-medium px-2.5 py-0.5 border-none"
                                >
                                    {article.category}
                                </Badge>
                            </div>
                        </div>

                        <Card.Header class="space-y-2 pb-2">
                            <div class="flex items-center justify-between text-xs text-muted-foreground">
                                <div class="flex items-center gap-1.5">
                                    <Calendar class="h-3.5 w-3.5" />
                                    <span>{article.date}</span>
                                </div>
                            </div>
                            <Card.Title class="text-xl leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
                                {article.title}
                            </Card.Title>
                        </Card.Header>
 
                        <Card.Content class="flex-grow">
                            <p class="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                {article.summary}
                            </p>
                        </Card.Content>

                        <Card.Footer class="pt-4 border-t border-border/30 mt-auto">
                            <Button
                                variant="link"
                                size="sm"
                                class="hover:underline cursor-pointer"
                                onclick={() => openArticle(article)}
                            >
                                <span class="text-sm font-medium">Read Article</span>
                            </Button>
                        </Card.Footer>
                    </Card.Root>
                </div>
            {/each}
        </div>

        <!-- Pagination -->
        <Pagination.Root count={newsArticles.length} page={1} perPage={6} class="justify-end">
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
                        <Pagination.Next />
                    </Pagination.Item>
                </Pagination.Content>
            {/snippet}
        </Pagination.Root>
    </div>

    <!-- Article Detail Dialog -->
    <Dialog.Root bind:open>
        <Dialog.Content class="max-w-5xl min-w-5xl max-h-[95vh] overflow-y-auto p-0 gap-0 border-none sm:rounded-2xl">
            {#if selectedArticle}
                <div class="relative h-64 sm:h-96 w-full overflow-hidden">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                    <img src={selectedArticle.imageUrl} alt={selectedArticle.title} class="h-full w-full object-cover" />
                    <div class="absolute top-4 right-4 z-20">
                        <Button
                            variant="secondary"
                            size="icon"
                            class="h-8 w-8 rounded-full bg-background/20 backdrop-blur-md hover:bg-background/40 border-none text-white"
                            onclick={() => (open = false)}
                        >
                            <X class="h-4 w-4" />
                            <span class="sr-only">Close</span>
                        </Button>
                    </div>
                    <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-20">
                        <Badge variant="outline" class="mb-4 text-white border-white/30 bg-black/20 backdrop-blur-md">
                            {selectedArticle.category}
                        </Badge>
                        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-4 text-shadow-sm">
                            {selectedArticle.title}
                        </h2>
                        <div class="flex items-center gap-4 text-white/80 text-sm sm:text-base">
                            <div class="flex items-center gap-2">
                                <Calendar class="h-5 w-5" />
                                <span>{selectedArticle.date}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-6 sm:p-10 bg-background">
                    <div class="prose prose-sm sm:prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                        {@html selectedArticle.content}
                    </div>

                    <div class="mt-10 pt-6 border-t flex justify-end">
                        <Button variant="outline" class="gap-2">
                            <Share2 class="h-4 w-4" />
                            Share Article
                        </Button>
                    </div>
                </div>
            {/if}
        </Dialog.Content>
    </Dialog.Root>
</UserLayout>

<style>
    .text-shadow-sm {
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    }
</style>
