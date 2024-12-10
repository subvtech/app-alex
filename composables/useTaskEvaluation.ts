import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';

const { find, findOne, create, update } = useStrapiUtils();

const strapi = useStrapi();

export const useTaskEvaluation = (learningPlanId, taskId, user, submissionId: null | Ref<any> = null) => {
  const learningPlanGradesQuery = ['grades', learningPlanId];
  const taskEvaluationDataQuery = ['taskEvaluationData', taskId];
  const taskSubmissionEvaluationDataQuery = ['taskSumbmissionEvaluationData', submissionId];
  const learningPlanTasksQuery = ['tasks', learningPlanId];

  const userEvaluationCriteriaQuery = ['criteria', user];

  const queryClient = useQueryClient();
  return {
    getLearningPlanTasks() {
      return useQuery({
        queryKey: learningPlanTasksQuery,
        queryFn: async () => {
          const { data } = await find('tasks', {
            filters: { learningplan: { id: learningPlanId.value } },
            // populate: ['grade_compositions.grade_composition_tasks.task.evaluation_group'],
          });
          return data;
        },
      });
    },
    getLearningPlanGrades() {
      return useQuery({
        queryKey: learningPlanGradesQuery,
        queryFn: async () => {
          const { data } = await find('grades', {
            filters: { learningplan: { id: learningPlanId.value } },
            populate: ['grade_compositions.grade_composition_tasks.task.evaluation_group'],
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
              disabled_at: {
                $null: true,
              },
            },
            populate: {
              task_submission_evaluations: true,
              evaluation_criterias: {
                sort: 'id:asc',
              },
              rubric_grade_levels: {
                populate: {
                  grade_level_criterias: {
                    populate: {
                      evaluation_criterion: true,
                    },
                    sort: 'id:asc',
                  },
                },
              },
            },
          });

          return groups.data;
        },
      });
    },
    createUserEvaluationGroupMutation() {
      return useMutation({
        mutationFn: (id) => {
          return strapi.delete('evaluation-groups', id);
        },
        onError(e) {
          console.error(e);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: userEvaluationCriteriaQuery });
        },
      });
    },
    deleteUserEvaluationGroupMutation() {
      return useMutation({
        mutationFn: (id) => {
          return strapi.delete('evaluation-groups', id);
        },
        onError(e) {
          console.error(e);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: userEvaluationCriteriaQuery });
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
            populate: [
              'criteria_evaluations.criteria.criteria',
              'evaluation_group.rubric_grade_levels.grade_level_criterias.criteria',
            ],
          });

          return composition.data[0] || null;
        },
        enabled: () => submissionId?.value > 0,
      });
    },

    getUserEvaluations() {
      return useQuery({
        queryKey: userEvaluationCriteriaQuery,
        queryFn: async () => {
          const res = await find('evaluation-criterias', {
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
            },
            populate: {
              evaluation_groups: true,
            },
          });

          return res.data;
        },
      });
    },

    createUserEvaluationMutation() {
      return useMutation({
        mutationFn: ({ name, description }) => {
          return create('evaluation-criterias', {
            name,
            description,
            public: false,
            user: user.value?.id ?? null,
          });
        },
        onError(e) {
          console.error(e);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: userEvaluationCriteriaQuery });
        },
      });
    },

    updateUserEvaluationMutation() {
      return useMutation({
        mutationFn: ({ id, name, description }) => {
          return update('evaluation-criterias', id, {
            name,
            description,
          });
        },
        onError(e) {
          console.error(e);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: userEvaluationCriteriaQuery });
        },
      });
    },

    deleteUserEvaluationMutation() {
      return useMutation({
        mutationFn: (id) => {
          return strapi.delete('evaluation-criterias', id);
        },
        onError(e) {
          console.error(e);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: userEvaluationCriteriaQuery });
        },
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
    gradeSubmissionEvaluationCriteriasMutation() {
      return useMutation({
        mutationFn: ({ evaluationId, criteriaEvaluations, totalGrade }: any) => {
          return update('task-submission-evaluations', evaluationId, {
            grade: totalGrade,
            criteria_grades: criteriaEvaluations,
          });
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
    createGradeMutation(successCallback: any = null) {
      return useMutation({
        mutationFn: ({ learningplan }: any) => {
          return create('grades', { weight: 1, learningplan });
        },
        onSuccess(result) {
          queryClient.setQueryData(learningPlanGradesQuery, (oldData) => {
            const oldGrades: any = structuredClone(oldData);

            return oldGrades?.length ? [...oldGrades, result.data] : [result.data];
          });

          if (successCallback) {
            successCallback(result.data);
          }
        },
      });
    },
    deleteGradeMutation() {
      return useMutation({
        mutationFn: (id: number) => {
          return strapi.delete('grades', id);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: learningPlanGradesQuery });
        },
        onError(e) {
          console.error(e);
        },
      });
    },
    addTaskToGradeCompositionMutation() {
      return useMutation({
        mutationFn: ({ tasksIds, gradeCompositionId }: any) => {
          return update('grade-compositions', gradeCompositionId, { addTasks: tasksIds });
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: learningPlanGradesQuery });
        },
      });
    },
    updateTaskCompositionWeight() {
      return useMutation({
        mutationFn: ({ taskCompositionId, weight }: any) => {
          return update('grade-composition-tasks', taskCompositionId, { weight });
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: learningPlanGradesQuery });
        },
      });
    },
    deleteTaskComposition() {
      return useMutation({
        mutationFn: ({ taskCompositionId }: any) => {
          return strapi.delete('grade-composition-tasks', taskCompositionId);
        },
        onSuccess() {
          queryClient.invalidateQueries({ queryKey: learningPlanGradesQuery });
        },
      });
    },
    updateGradeTitleMutation() {
      return useMutation({
        mutationFn: ({ title, id }: any) => {
          return update('grades', id, { title });
        },
        onSuccess(result: any) {
          const { id, title } = result.data;
          queryClient.setQueryData(learningPlanGradesQuery, (grades) => {
            const gradesData: any = structuredClone(grades);

            return gradesData.map((grade) => {
              if (grade.id === id) {
                grade.title = title;
              }
              return grade;
            });
          });
        },
      });
    },
    setEvaluationDateMutation() {
      return useMutation({
        mutationFn: (evaluationId) => {
          return update('task-submission-evaluations', evaluationId, {
            evaluated_at: new Date().toISOString(),
          });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: taskSubmissionEvaluationDataQuery });
        },
      });
    },
  };
};
