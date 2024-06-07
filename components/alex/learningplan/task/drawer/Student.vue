<template>
  <v-navigation-drawer
    :id="drawerId"
    v-model="model"
    location="right"
    temporary
    floating
    :width="640"
    scrim="transparent"
    sticky
    class="pa-6 pt-2 rounded-s-lg"
  >
    <template #prepend>
      <alex-custom-button
        icon="mdi-close"
        size="small"
        variant="text"
        @click="handleCloseModal"
      />
    </template>

    <template #default>
      <div class="user-info text-gray-800">
        <v-avatar
          :size="80"
          :image="student.avatar || undefined"
          class="alex-avatar-group-border alex-avatar-group-margin"
          color="gray-100"
        >
          <template v-if="!student.avatar" #default>
            <p class="text-gray-300 text-h2">
              {{ initials }}
            </p>
          </template>
        </v-avatar>
        <h2 class="text-h2">{{ student.name }}</h2>
        <p class="text-subtitle-2">{{ student.studentClass }}</p>
      </div>

      <div class="task-info">
        <div class="d-flex flex-column gap-2 w-full">
          <p class="text-body-4">
            {{ $t('components.courses.tasks.submission.status') }}
          </p>
          <alex-custom-chip
            class="w-fit"
            status="blue"
            :text="$t(`components.courses.tasks.task.status.${task.status}`)"
          />
        </div>
        <div class="d-flex flex-column gap-2 w-full">
          <p class="text-body-4 text-gray-800 mb-1">
            <span class="text-tag-orange-light">* </span
            >{{ $t('components.learningPlan.drawer.task.date.startLabel') }}
          </p>

          <alex-learningplan-task-date v-model="deadline" edit />
        </div>
      </div>
      <div class="task-submission">
        <template v-if="submission">
          <h4 class="text-h4">
            {{ $t('components.courses.tasks.submission.submission') }}
          </h4>

          <div class="d-flex flex-column gap-2 w-fit">
            <div class="d-flex gap-2">
              <alex-custom-switch
                v-model="sendSubmission"
                :label="
                  $t(
                    'components.learningPlan.drawer.task.allowSendAfterSubmission',
                  )
                "
                :disabled="!editSendSubmission"
              />
            </div>
            <p class="text-body-4">
              {{ $t('components.courses.tasks.submission.constraint') }}
            </p>
            <div class="d-flex gap-2">
              <alex-custom-chip
                v-if="!submission.constraints.length"
                status="secondary"
                :text="$t('components.learningPlan.drawer.task.freeEditor')"
              />
              <template v-else
                ><alex-custom-chip
                  v-for="(constraint, index) in submission.constraints"
                  :key="index"
                  status="secondary"
                  :text="constraint"
              /></template>
            </div>
          </div>
          <div class="d-flex flex-column gap-2 w-100">
            <p class="text-body-4">
              {{ $t('components.courses.tasks.submission.description') }}
            </p>
            <p class="text-body-3 text-gray-800">
              {{ submission.description }}
            </p>
          </div>
          <div class="d-flex flex-column gap-2 w-fit">
            <p class="text-body-4">
              {{ $t('components.courses.tasks.submission.last_submission') }}
            </p>
            <alex-learningplan-task-submission
              type="student"
              :status="submission.status"
              :mark="submission.mark"
              :max-mark="submission.maxMark"
            />
          </div>
        </template>
        <template v-else>
          <div class="d-flex gap-2 flex-column w-fit">
            <h4 class="text-h4">
              {{ $t('components.courses.tasks.submission.submission') }}
            </h4>
            <alex-custom-chip
              status="secondary"
              variant="outlined"
              :text="$t('components.courses.tasks.submission.no_submission')"
            />
          </div>
        </template>
      </div>

      <alex-learningplan-task-tabs
        v-model="activePage"
        v-model:attached-message="attachedMessage"
        v-model:attached-submission="attachedSubmission"
        :submission="!!submission"
        :selector-parent="`#${drawerId} .v-navigation-drawer__content`"
        :messages="messages"
        :submissions="submissions"
      />
    </template>

    <template v-if="activePage === '3'" #append>
      <alex-learningplan-task-chat-input
        v-model:attached-message="attachedMessage"
        v-model:attached-submission="attachedSubmission"
        class="border-top-1 border-gray-100 pt-3"
        :submissions="submissions"
        @submit="
          (data) =>
            handleSubmitMessage(
              data.text,
              data.audio?.blob,
              data.audio?.duration,
              data.attachedMessage,
              data.attachedSubmission,
            )
        "
      />
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
type TStatus = 'to_do' | 'in_progress' | 'in_review' | 'done' | (string & {});
interface Student {
  name: string;
  studentClass: string;
  avatar?: string | null;
}
interface Submission {
  description: string;
  constraints: string[];
  status: 'not_started' | 'started' | 'in_review' | 'reviewed' | 'denied';
  mark?: number;
  maxMark?: number;
}
interface Task {
  status: TStatus;
  finalDate: Date;
}
interface TaskUserDrawerProps {
  student: Student;
  task: Task;
  deadline: Date;
  submission?: Submission;
  submissions: AttachedSubmission[];
  sendSubmission: boolean;
  editSendSubmission?: boolean;
}
const props = withDefaults(defineProps<TaskUserDrawerProps>(), {
  submission: undefined,
  editSendSubmission: true,
});
const messages = ref<Message[]>([]);
const model = defineModel({ default: false });
const sendSubmission = toRef(props.sendSubmission);
const deadline = toRef(props.deadline);
const activePage = ref('1');
const initials = computed(() => {
  return getInitials(props.student.name);
});
const handleCloseModal = () => {
  model.value = false;
};
const drawerId = computed(() => `student-drawer-${crypto.randomUUID()}`);
const attachedMessage = ref<Message>();
const attachedSubmission = ref<AttachedSubmission>();
const handleSubmitMessage = (
  text: string,
  audio?: Blob | null,
  duration?: number,
  attachedMessage?: Message,
  attachedSubmission?: AttachedSubmission,
) => {
  if (!text && !audio) return;
  const message: Message = {
    sentAt: new Date(),
    id: Math.round(Math.random() * 10),
    user: { id: 1, name: 'zig' },
    message: text,
  };
  if (audio) {
    message.audio = {
      src: URL.createObjectURL(audio),
      duration,
    };
  }
  if (attachedMessage) {
    message.response = attachedMessage;
  }
  if (attachedSubmission) {
    message.response = attachedSubmission;
  }
  messages.value.push(message);
};
</script>

<style scoped lang="scss">
:deep(.v-navigation-drawer__prepend) {
  display: flex;
  justify-content: flex-end;
}

.w-fit {
  width: fit-content;
}
.user-info {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 16px;
}
.user-info .v-avatar {
  grid-row: span 2;
}
.task-info {
  display: flex;
  gap: 2em;
}
.task-submission {
  display: flex;
  gap: 16px;
  flex-direction: column;
}
</style>
