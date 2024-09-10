import { useMutation } from '@tanstack/vue-query';
import { TaskStatus } from '~/models/simple/taskSimple.model';

type CreateTaskPayload = {
  learningPlanId: number;
  position: number;
  title: string;
};

const { create } = useStrapiUtils();

export const useCreateTask = () =>
  useMutation({
    mutationFn({ learningPlanId, position, title }: CreateTaskPayload) {
      return create('tasks', {
        allowed_editor_plugins: '',
        can_change_from_review: false,
        can_submit_after_deadline: false,
        learningplan: learningPlanId,
        position,
        status: 'draft' as TaskStatus,
        submission_description: '',
        submission_required: false,
        title,
      });
    },
  });
