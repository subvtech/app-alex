import type { ComputedRef, InjectionKey, Ref } from 'vue';

export type SubmissionRubricRating = 'excellent' | 'good' | 'reasonable' | 'bad';

export interface SubmissionRubricRow {
  criterion: { text: string; id: number };
  selected?: SubmissionRubricRating;
}

export interface SubmissionEvaluationContext {
  evaluation: Ref<any>;
  rubricRows: ComputedRef<SubmissionRubricRow[]>;
  headers: ComputedRef<{ excellent: string; good: string; reasonable: string; poor: string }>;
  finalGrade: ComputedRef<string>;
  grade: (grade: number, criteriaId: number, isRubric?: boolean) => void;
}

const submissionEvaluationContextKey: InjectionKey<SubmissionEvaluationContext> = Symbol('submissionEvaluationContext');

export function provideSubmissionEvaluationContext(context: SubmissionEvaluationContext) {
  provide(submissionEvaluationContextKey, context);
}

export function useSubmissionEvaluationContext() {
  return inject(submissionEvaluationContextKey, null);
}
