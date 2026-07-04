<script lang="ts">
    import { Button } from '@/components/ui/button';
    import * as Card from '@/components/ui/card';
    import { Label } from '@/components/ui/label';
    import { Textarea } from '@/components/ui/textarea';
    import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
    import { Checkbox } from '@/components/ui/checkbox';
    import { Loader } from 'lucide-svelte';

    let { survey } = $props();

    function getInitialAnswers(questions: any[]) {
        const initial: Record<string, any> = {};
        if (questions) {
            questions.forEach((q: any, index: number) => {
                const key = q.id || index;
                if (q.type === 'Multiple Choice') {
                    initial[key] = [];
                } else if (q.type === 'Single Choice' || q.type === 'Text') {
                    // Initialize with empty string to avoid "bind:value={undefined}" error
                    initial[key] = '';
                }
            });
        }
        return initial;
    }

    let answers = $state<Record<string, any>>(getInitialAnswers(survey.questions));
    let submitting = $state(false);
    let submitted = $state(false);

    function handleSubmit() {
        submitting = true;
        // Mock submission
        setTimeout(() => {
            console.log('Submitted Answers:', answers);
            submitting = false;
            submitted = true;
        }, 1000);
    }

    function handleCheckboxChange(questionId: string, option: string, checked: boolean) {
        let currentAnswers = answers[questionId] || [];
        if (checked) {
            answers[questionId] = [...currentAnswers, option];
        } else {
            answers[questionId] = currentAnswers.filter((a: string) => a !== option);
        }
    }
</script>

<div class="max-w-3xl mx-auto space-y-6">
    {#if submitted}
        <Card.Root class="text-center p-8">
            <Card.Header>
                <Card.Title class="text-2xl text-green-600">Thank You!</Card.Title>
                <Card.Description>Your response has been recorded.</Card.Description>
            </Card.Header>
            <Card.Content>
                <p class="text-muted-foreground">We appreciate your feedback.</p>
                <Button variant="outline" class="mt-4" onclick={() => window.location.reload()}>Submit Another Response</Button>
            </Card.Content>
        </Card.Root>
    {:else}
        <Card.Root>
            <Card.Header>
                <Card.Title class="text-2xl">{survey.name}</Card.Title>
                <Card.Description>{survey.description || 'Please answer the following questions.'}</Card.Description>
            </Card.Header>
        </Card.Root>

        <form
            class="space-y-6"
            onsubmit={(e) => {
                e.preventDefault();
                handleSubmit();
            }}
        >
            {#each survey.questions as question, index (index)}
                <Card.Root>
                    <Card.Header>
                        <Card.Title class="text-lg font-medium">
                            <span class="mr-2 text-muted-foreground">{index + 1}.</span>
                            {question.text}
                            {#if question.required}
                                <span class="text-red-500 ml-1">*</span>
                            {/if}
                        </Card.Title>
                    </Card.Header>
                    <Card.Content>
                        {#if question.type === 'Single Choice'}
                            <RadioGroup bind:value={answers[question.id || index]}>
                                {#each question.options as option}
                                    <div class="flex items-center space-x-2">
                                        <RadioGroupItem value={option} id={`${question.id || index}-${option}`} />
                                        <Label for={`${question.id || index}-${option}`}>{option}</Label>
                                    </div>
                                {/each}
                            </RadioGroup>
                        {:else if question.type === 'Multiple Choice'}
                            <div class="space-y-2">
                                {#each question.options as option}
                                    <div class="flex items-center space-x-2">
                                        <Checkbox
                                            id={`${question.id || index}-${option}`}
                                            checked={answers[question.id || index]?.includes(option)}
                                            onCheckedChange={(v) => handleCheckboxChange(question.id || index, option, v as boolean)}
                                        />
                                        <Label for={`${question.id || index}-${option}`}>{option}</Label>
                                    </div>
                                {/each}
                            </div>
                        {:else if question.type === 'Text'}
                            <Textarea placeholder="Type your answer here..." bind:value={answers[question.id || index]} rows={4} />
                        {/if}
                    </Card.Content>
                </Card.Root>
            {/each}

            <div class="flex justify-end">
                <Button type="submit" disabled={submitting} size="lg">
                    {#if submitting}
                        <Loader class="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                    {:else}
                        Submit Response
                    {/if}
                </Button>
            </div>
        </form>
    {/if}
</div>
