<template>
  <div
    :id="`chat-message-${id}`"
    class="tw-flex tw-flex-col tw-gap-3 border-1 border-gray-100 tw-bg-white tw-p-4 tw-rounded-lg tw-mx-[40px] tw-sm:mx-[60px] tw-md:mx-[80px] tw-relative tw-group"
    :class="[align, response && 'tw-p-3']"
  >
    <alex-custom-dropdown :items="menuItems">
      <template #activator="{ props: dropdownProps }">
        <alex-custom-button
          v-bind="dropdownProps"
          variant="secondary"
          icon="mdi-chevron-down"
          size="small"
          class="menu-button"
        />
      </template>
    </alex-custom-dropdown>
    <alex-learningplan-task-chat-message-response
      v-if="attachedMessage || attachedSubmission"
      :message="attachedMessage"
      :submission="attachedSubmission"
      @message-click="(value) => $emit('message-click', value)"
      @submission-click="(value) => $emit('submission-click', value)"
    />
    <div class="tw-flex tw-gap-3">
      <v-avatar
        :size="32"
        :image="user?.avatar || undefined"
        class="alex-avatar-group-border alex-avatar-group-margin"
        color="gray-100"
      >
        <template v-if="!user?.avatar" #default>
          <p class="text-gray-300 text-body-2">
            {{ initials }}
          </p>
        </template>
      </v-avatar>
      <div class="tw-flex tw-flex-col tw-w-full tw-gap-1">
        <div
          class="tw-flex tw-flex-col-reverse tw-gap-1 tw-sm:flex-row tw-sm:gap-2 tw-w-full"
        >
          <h6 class="text-body-4 text-gray-800 tw-grow">{{ user.name }}</h6>
          <p class="text-body-5 text-gray-400">{{ formattedDate }}</p>
        </div>
        <alex-learningplan-task-audio
          v-if="audio"
          :src="audio.src"
          :default-max-time="audio.duration"
        />
        <p v-else class="text-body-3 text-gray-800">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// eslint-disable-next-line import/no-duplicates
import { format } from 'date-fns';
// eslint-disable-next-line import/no-duplicates
import { ptBR, enIN } from 'date-fns/locale';
import { Message } from '@/models/simple/learninplanTaskMemberMessage';
type MessageProps = Message & {
  align?: 'left' | 'right';
};
const props = withDefaults(defineProps<MessageProps>(), {
  current: false,
  response: undefined,
  duration: undefined,
  align: 'right',
});
type Emits = {
  reply: [value: Message];
  'submission-click': [value?: AttachedSubmission];
  'message-click': [value?: Message];
};
const emit = defineEmits<Emits>();
const i18n = useI18n();
const initials = computed(() => {
  return getInitials(props.user.name);
});
const formattedDate = computed(() =>
  format(props.sentAt, `d MMM y '-' HH:mm`, {
    locale: i18n.locale.value === 'pt' ? ptBR : enIN,
  }),
);
const handleAttachMessage = () => {
  const message: Message = {
    id: props.id,
    message: props.message,
    sentAt: props.sentAt,
    user: props.user,
    audio: props.audio,
  };
  emit('reply', message);
};
const attachedMessage = computed(() =>
  isMessage(props.response) ? props.response : undefined,
);
const attachedSubmission = computed(() =>
  !isMessage(props.response) ? props.response : undefined,
);
const menuItems = [
  {
    text: i18n.t('components.learningPlan.drawer.task.chat.reply'),
    onClick: handleAttachMessage,
  },
];
</script>

<style scoped>
.left {
  margin-left: 0;
  border-top-left-radius: 0 !important;
}
.right {
  margin-right: 0;
  border-top-right-radius: 0 !important;
}
.menu-button {
  visibility: hidden;
  position: absolute;
  top: 1rem;
  right: 1rem;
}
.tw-group:hover .menu-button {
  visibility: visible;
}
</style>
