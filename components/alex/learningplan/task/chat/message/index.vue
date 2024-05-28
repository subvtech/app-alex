<template>
  <div
    class="flex flex-col gap-3 border-1 border-gray-100 bg-white p-4 rounded-lg mx-[40px] sm:mx-[60px] md:mx-[80px]"
    :class="[current ? 'left' : 'right', response && 'p-3']"
  >
    <alex-learningplan-task-chat-message-response
      :message-response="isMessage(response) ? response : undefined"
      :submission-response="!isMessage(response) ? response : undefined"
      @click:message="$emit('click-response-message')"
      @click:submission="$emit('click-response-submission')"
    />
    <div class="flex gap-3">
      <v-avatar
        :size="32"
        :image="user.avatar || undefined"
        class="alex-avatar-group-border alex-avatar-group-margin"
        color="gray-100"
      >
        <template v-if="!user.avatar" #default>
          <p class="text-gray-300 text-body-2">
            {{ initials }}
          </p>
        </template>
      </v-avatar>
      <div class="flex flex-col w-full gap-1">
        <div class="flex flex-col-reverse gap-1 sm:flex-row sm:gap-2 w-full">
          <h6 class="text-body-4 text-gray-800 grow">{{ user.name }}</h6>
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
type MessageProps = Message;
const props = withDefaults(defineProps<MessageProps>(), {
  current: false,
  response: undefined,
  duration: undefined,
});
defineEmits(['click-response-message', 'click-response-submission']);
const i18n = useI18n();
const initials = computed(() => {
  return getInitials(props.user.name);
});
const formattedDate = computed(() =>
  format(props.sentAt, `d MMM y '-' HH:mm`, {
    locale: i18n.locale.value === 'pt' ? ptBR : enIN,
  }),
);
</script>

<style scoped>
.left {
  margin-right: 0;
  border-top-right-radius: 0 !important;
}

.right {
  margin-left: 0;
  border-top-left-radius: 0 !important;
}
</style>
