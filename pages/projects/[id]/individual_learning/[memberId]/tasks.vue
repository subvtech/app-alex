<script setup lang="ts">
const loading = ref(true);
</script>

<template>
  <div>
    <div v-if="loading">
      <alex-learningplan-task-kanban-loader class="!tw-mt-0" />
    </div>
    <!-- <section
      v-else-if="
        !taskStore.loading && taskStore.task && learningPlanStore.learningPlan?.id
      "
    >
      <alex-learningplan-task-header
        :id="taskStore.task.id"
        :title="taskStore.task.title"
        :tags="headerTags"
        :type="taskStore.task.type"
        :description="taskStore.task.description || ''"
        :deadline-at="taskStore.task.finish_at"
        :start-at="taskStore.task.start_at"
        :status="taskStore.task.status"
        :send-submission="taskStore.task.submission_required"
        :send-submission-after-deadline="taskStore.task.can_submit_after_deadline"
        @edit-click="teacherDrawer = true"
      />
      <alex-learningplan-task-kanban
        ref="kanban"
        v-model="tasks"
        type="professor"
        :classes="
          getClassesOfTaskMembers(taskStore.task.task_members as TaskMember[])
        "
        :columns="[
          {
            title: $t('components.learningPlan.drawer.task.status.toDo'),
            color: 'gray',
            group: 'to_do',
            accept: true,
          },
          {
            title: $t('components.learningPlan.drawer.task.status.inProgress'),
            color: 'blue',
            group: 'in_progress',
            accept: true,
          },
          {
            title: $t('components.learningPlan.drawer.task.status.underReview'),
            color: 'orange',
            group: 'in_review',
            accept: taskStore.task.submission_required ? true : null,
          },
          {
            title: $t('components.learningPlan.drawer.task.status.done'),
            color: 'green',
            group: 'done',
            accept: true,
          },
        ]"
        @card-click="
          (_index, item) => {
            studentDrawer = true;
            studentDetailsId = item.id;
          }
        "
        @card-insert="
          (newIndex, value, newStatus) =>
            handleUpdateStatus(newIndex, value as Task, newStatus)
        "
      />
      <alex-learningplan-task-drawer-student
        v-if="studentDetails"
        v-model="studentDrawer"
        :task-id="taskId"
        :submission="{
          constraints: taskStore.task.allowed_editor_plugins
            ? taskStore.task.allowed_editor_plugins?.split(',')
            : [],
          description: taskStore.task.submission_description,
        }"
        :task="{
          id: taskStore.task.id,
          title: taskStore.task.title,
          startDate: taskStore.task.start_at,
          endDate: taskStore.task.finish_at,
          sendAfterDeadline: taskStore.task.can_submit_after_deadline,
        }"
        :type="studentDetails?.task?.type"
        :learningplan-id="learningPlanStore.learningPlan.id"
        :can-submit-after-deadline-task="taskStore.task.can_submit_after_deadline"
        :can-submit-after-deadline="studentDetails.can_submit_after_deadline"
        :task-member-id="studentDetails.id"
        :doc_name="studentDetails.doc_name"
        :finish-at="studentDetails.finished_at"
        :status="studentDetails.status"
        :task-title="taskStore.task.title"
        :group="studentDetails.learning_plan_group"
        :student-class="
          studentDetails.learning_plan_member?.learning_class?.name ||
          studentDetails.learning_plan_group?.learning_class?.name ||
          ''
        "
        :student="
          studentDetails.learning_plan_member
            ? {
                name: studentDetails.learning_plan_member?.user.fullname || '',
                avatar: studentDetails.learning_plan_member?.user?.avatar?.url,
              }
            : undefined
        "
        @change-finish-at="handleChangeFinishAt"
        @change-submit-after-deadline="handleChangeSendAfterDeadline"
      />
      <alex-learningplan-task-drawer-teacher
        v-model="teacherDrawer"
        :learningplan-id="learningPlanId"
        :task-id="taskId"
        :tags="taskStore.task.tags"
        :title="taskStore.task.title"
        :type="taskStore.task.type"
        :trail="taskStore.task.trail"
        :blocks="taskStore.task.blocks"
        :status="taskStore.task.status"
        :events="taskStore.task.task_events"
        :goals="taskStore.task.learning_goals"
        :description="taskStore.task.description || ''"
        :submission-description="taskStore.task.submission_description"
        :has-submission="taskStore.task.submission_required"
        :can-change-from-review="taskStore.task.can_change_from_review"
        :send-after-deadline="taskStore.task.can_submit_after_deadline"
        :start-date="taskStore.task.start_at"
        :end-date="taskStore.task.finish_at"
        :restrictions="taskStore.task.allowed_editor_plugins || ''"
        :editable="true"
        :members="taskStore.task.task_members"
        @change-values="handleChangeValues"
        @change-description="handleChangeDescription"
        @change-submission-description="handleChangeSubmissionDescription"
        @change-tags="handleChangeTags"
        @change-members="taskStore.updateTaskMembers(taskId)"
        @change-title="handleChangeTitle"
        @change-can-alter-from-review="handleChangeAlterFromReview"
      />
    </section> -->
  </div>
</template>
