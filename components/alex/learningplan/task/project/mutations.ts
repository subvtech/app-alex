import { useMutation } from '@tanstack/vue-query';
import { TaskStatus } from '~/models/simple/taskSimple.model';

export const useCreateTask = () =>
  useMutation({
    mutationFn: async ({
      title,
      learningPlanId,
      position,
    }: {
      title: string;
      learningPlanId: number;
      position: number;
    }) => {
      const { create } = useStrapiUtils();
      const res = await create('tasks', {
        title,
        status: 'draft' as TaskStatus,
        learningplan: learningPlanId,
        position,
        allowed_editor_plugins: '',
        submission_description: '',
        submission_required: false,
        can_submit_after_deadline: false,
        can_change_from_review: false,
      });
      return res;
    },
  });
