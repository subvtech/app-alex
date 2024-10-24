import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

const { find, findOne, create, update } = useStrapiUtils();

export const useTaskEvaluation = (learningPlanId, taskId, user, submissionId: null | Ref<any> = null) => {
  const learningPlanGradesQuery = ['grades', learningPlanId];
  const taskEvaluationDataQuery = ['taskEvaluationData', taskId];
  const taskSubmissionEvaluationDataQuery = ['taskSumbmissionEvaluationData', submissionId];

  const queryClient = useQueryClient();
  return {
    getLearningPlanGrades() {
      return useQuery({
        queryKey: learningPlanGradesQuery,
        queryFn: async () => {
          const { data } = await find('grades', {
            filters: { learningplan: { id: learningPlanId.value } },
            populate: ['grade_compositions'],
          });
          return data;
        },
      });
    },
    getTaskEvaluatonData() {
      return useQuery({
        queryKey: taskEvaluationDataQuery,
        queryFn: async () => {
          const composition = await findOne('tasks', taskId.value, {
            populate: {
              grade_composition_task: { populate: ['grade_composition.grade'] },
              evaluation_group: { populate: ['evaluation_criterias'] },
              task_evaluation_criterias: {
                populate: {
                  criteria: true,
                },
              },
            },
          });

          return composition.data || [];
        },
        enabled: () => taskId.value > 0,
      });
    },
    getUserEvaluationGroupsByType(evaluationGroupType) {
      return useQuery({
        queryKey: ['groups', user, evaluationGroupType],
        queryFn: async () => {
          const groups = await find('evaluation-groups', {
            filters: {
              $or: [
                {
                  public: true,
                },
                {
                  user: {
                    id: user.value?.id,
                  },
                },
              ],
              type: evaluationGroupType.value,
            },
            populate: ['evaluation_criterias'],
          });

          return groups.data;
        },
      });
    },
    getTaskSubmissionEvaluation() {
      return useQuery({
        queryKey: taskSubmissionEvaluationDataQuery,
        queryFn: async () => {
          const composition = await find('task-submission-evaluations', {
            filters: {
              task_submission: {
                id: submissionId?.value,
              },
            },
            populate: ['criteria_evaluations.criteria'],
          });

          return composition.data[0] || null;
        },
        enabled: () => submissionId?.value > 0,
      });
    },

    createSubmissionEvaluationMutation() {
      return useMutation({
        mutationFn: (data: any) => {
          return create('task-submission-evaluations', {
            task_submission: submissionId?.value,
            evaluation_group: data.groupId,
          });
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: taskSubmissionEvaluationDataQuery });
        },
      });
    },
    taskGradeCompositionMutation(sucessConfirmation) {
      return useMutation({
        mutationFn: (data: any) => {
          const { taskCompositionId, weight, gradeCompositionId } = data;
          if (taskCompositionId) {
            return update('grade-composition-tasks', taskCompositionId, {
              grade_composition: gradeCompositionId,
              weight,
            });
          } else {
            return create('grade-composition-tasks', {
              grade_composition: gradeCompositionId,
              weight,
              task: taskId.value,
            });
          }
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: taskEvaluationDataQuery });
          sucessConfirmation.value = false;
        },
      });
    },
    taskEvaluationGroupMutation(successConfirmation) {
      return useMutation({
        mutationFn: (data: any) => {
          return update('tasks', taskId.value, {
            evaluation_group: data.groupId,
            evaluation_criterias: data.evaluationCriterias,
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: taskEvaluationDataQuery });
          successConfirmation.value = false;
        },
      });
    },
  };
};
