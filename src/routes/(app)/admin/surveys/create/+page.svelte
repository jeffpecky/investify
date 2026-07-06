<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Plus, Trash2, GripVertical, ArrowLeft } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge';

	interface Question {
		id: string;
		text: string;
		type: 'text' | 'textarea' | 'radio' | 'checkbox' | 'select';
		options: string[];
		required: boolean;
	}

	let surveyName = $state('');
	let surveyDescription = $state('');
	let questions = $state<Question[]>([]);

	function addQuestion() {
		questions = [
			...questions,
			{
				id: crypto.randomUUID(),
				text: '',
				type: 'text',
				options: [],
				required: false
			}
		];
	}

	function removeQuestion(id: string) {
		questions = questions.filter((q) => q.id !== id);
	}

	function addOption(questionId: string) {
		questions = questions.map((q) =>
			q.id === questionId ? { ...q, options: [...q.options, ''] } : q
		);
	}

	function removeOption(questionId: string, index: number) {
		questions = questions.map((q) =>
			q.id === questionId ? { ...q, options: q.options.filter((_, i) => i !== index) } : q
		);
	}
</script>

<svelte:head>
	<title>Create Survey - Admin</title>
</svelte:head>

<div class="mx-auto w-full space-y-4 px-4 py-4 sm:px-6 lg:px-8">
	<div class="flex items-center gap-3">
		<a href="/admin/surveys">
			<Button variant="ghost" size="icon" class="h-8 w-8">
				<ArrowLeft class="h-4 w-4" />
			</Button>
		</a>
		<div>
			<h1 class="text-2xl font-semibold text-foreground">Create Survey</h1>
			<p class="mt-1 text-sm text-muted-foreground">Build a new user survey</p>
		</div>
	</div>

	<form method="POST">
		<Card class="border-border/50">
			<CardHeader class="pb-2">
				<CardTitle class="text-base">Survey Details</CardTitle>
			</CardHeader>
			<CardContent class="space-y-3 p-3 pt-0">
				<div class="grid gap-3 md:grid-cols-2">
					<div class="space-y-1.5">
						<Label for="name" class="text-xs">Survey Name</Label>
						<Input id="name" name="name" bind:value={surveyName} required />
					</div>
					<div class="space-y-1.5">
						<Label for="description" class="text-xs">Description</Label>
						<Textarea id="description" name="description" bind:value={surveyDescription} rows={2} />
					</div>
				</div>
			</CardContent>
		</Card>

		<div class="mt-4 space-y-3">
			<div class="flex items-center justify-between">
				<h2 class="text-base font-semibold text-foreground">Questions</h2>
				<Button type="button" variant="outline" size="sm" onclick={addQuestion} class="gap-1.5">
					<Plus class="h-3.5 w-3.5" />
					Add Question
				</Button>
			</div>

			{#each questions as question, index (question.id)}
				<Card class="border-border/50">
					<CardContent class="p-3">
						<div class="flex items-start gap-3">
							<GripVertical class="mt-2 h-4 w-4 text-muted-foreground shrink-0" />
							<div class="flex-1 space-y-2.5">
								<div class="flex items-center gap-2">
									<Badge variant="secondary" class="text-xs">{index + 1}</Badge>
									<Input
										placeholder="Question text"
										bind:value={question.text}
										name="questions[{index}][text]"
										required
										class="h-8 text-sm"
									/>
								</div>
								<div class="grid grid-cols-2 gap-2">
									<select
										bind:value={question.type}
										name="questions[{index}][type]"
										class="flex h-8 w-full rounded-md border border-input bg-background px-2.5 text-sm"
									>
										<option value="text">Short Text</option>
										<option value="textarea">Long Text</option>
										<option value="radio">Single Choice</option>
										<option value="checkbox">Multiple Choice</option>
										<option value="select">Dropdown</option>
									</select>
									<label class="flex items-center gap-2">
										<input
											type="checkbox"
											bind:checked={question.required}
											name="questions[{index}][required]"
											class="h-3.5 w-3.5 rounded border-input"
										/>
										<span class="text-xs">Required</span>
									</label>
								</div>
								{#if ['radio', 'checkbox', 'select'].includes(question.type)}
									<div class="space-y-1.5 pl-3 border-l-2 border-border/50">
										<Label class="text-xs">Options</Label>
										{#each question.options as option, optIndex}
											<div class="flex gap-1.5">
												<Input
													placeholder="Option {optIndex + 1}"
													bind:value={question.options[optIndex]}
													name="questions[{index}][options][{optIndex}]"
													class="h-8 text-sm"
												/>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													class="h-8 w-8 shrink-0 text-destructive"
													onclick={() => removeOption(question.id, optIndex)}
												>
													<Trash2 class="h-3.5 w-3.5" />
												</Button>
											</div>
										{/each}
										<Button
											type="button"
											variant="outline"
											size="sm"
											class="gap-1"
											onclick={() => addOption(question.id)}
										>
											<Plus class="h-3 w-3" />
											Add Option
										</Button>
									</div>
								{/if}
							</div>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								class="h-8 w-8 shrink-0 text-destructive"
								onclick={() => removeQuestion(question.id)}
							>
								<Trash2 class="h-4 w-4" />
							</Button>
						</div>
					</CardContent>
				</Card>
			{/each}
		</div>

		<input type="hidden" name="questionsJson" value={JSON.stringify(questions)} />

		<div class="flex gap-2 mt-4">
			<Button type="submit" size="sm">Create Survey</Button>
			<Button variant="outline" size="sm" type="button" onclick={() => window.history.back()}>Cancel</Button>
		</div>
	</form>
</div>
