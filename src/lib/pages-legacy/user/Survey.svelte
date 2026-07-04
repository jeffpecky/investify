<script lang="ts">
    import { Link } from '@inertiajs/svelte';
    import * as Card from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import * as Table from '@/components/ui/table';
    import StatCard from '@/components/StatCard.svelte';
    import { router } from '@inertiajs/svelte';
    import { Users, FileText, ChartColumn, Clock, Plus, Pen, Trash2, EllipsisVertical } from 'lucide-svelte';
    import * as DropdownMenu from '@/components/ui/dropdown-menu';
    import UserComboBox from '@/components/ComboBox.svelte';
    import UserLayout from '@/layouts/UserLayout.svelte';
    import { type BreadcrumbItem } from '@/types';
    import * as Empty from '@/components/ui/empty';
    import PlaceholderPatternn from '@/components/PlaceholderPatternn.svelte';
    import SurveyViewer from '@/components/SurveyViewer.svelte';

    let { id } = $props();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Survey', href: '/user/survey' },
        { title: id, href: `/user/survey/${id}` },
    ];

    const survey = {
        id: 1,
        name: 'Customer Satisfaction Q1 2026',
        description: 'We value your feedback. Please take a moment to answer these questions.',
        created_at: '2026-01-15',
        type: 'Feedback',
        status: 'Active',
        questions: [
            {
                id: 'q1',
                text: 'How satisfied are you with our service?',
                type: 'Single Choice',
                options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
                required: true,
            },
            {
                id: 'q2',
                text: 'Which features do you use the most?',
                type: 'Multiple Choice',
                options: ['Dashboard', 'Reports', 'Settings', 'Profile'],
                required: false,
            },
            {
                id: 'q3',
                text: 'Any additional comments?',
                type: 'Text',
                options: [],
                required: false,
            },
        ],
    };
</script>

<svelte:head>
    <title>Survey</title>
</svelte:head>
<UserLayout {breadcrumbs}>
    <div class="space-y-6 px-6 py-8">
        <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
                <h1 class="text-xl font-bold">Survey</h1>
                <p class="text-muted-foreground mt-1 text-sm">{survey.name}</p>
            </div>
        </div>

        <SurveyViewer {survey} />
    </div>
</UserLayout>
