<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column tw-gap-6 align-center pb-15"
  >
    <alex-documentation-header :title="title" :description="description" />
    <alex-documentation-accordions-props-list
      :title="title"
      :data="listProps"
    />
    <alex-documentation-example
      v-for="(item, index) in examples"
      :key="index"
      :snippets="item.snippets"
      :title="item.title"
      :description="item.description"
      has-example
    />
    <div class="tw-flex tw-flex-col tw-gap-2 tw-w-full">
      <alex-learningplan-task-chat
        v-model:attached-message="attachedMessage"
        :messages="messages"
        class="tw-w-full"
      />
      <alex-learningplan-task-chat-input
        v-model:attached-message="attachedMessage"
        class="tw-w-full"
        :submissions="submissions"
        @submit="
          ({ text, audio, attachedMessage, attachedSubmission }) =>
            handleSubmitMessage(
              text,
              audio?.blob,
              audio?.duration,
              attachedMessage,
              attachedSubmission,
            )
        "
      />
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ExampleComponentType } from '~/components/alex/documentation/Example.vue';
import { PlaygroundItemType } from '~/components/alex/documentation/Playground.vue';

definePageMeta({
  layout: 'components',
  middleware: 'auth',
});

const title = 'Alex Chat';
const description =
  'A component of a chat, that you can send, text messages, audio messages, and attach submissions';
const listProps: PlaygroundItemType[] = [
  {
    name: 'messages',
    type: 'Message',
    required: true,
    description: 'a list of messages',
    initialValue: [],
  },
];
const messages = ref<Message[]>([]);
const submissions: Array<AttachedSubmission> = [
  {
    id: 1,
    status: 'reviewed',
    time: new Date(),
    mark: 9.5,
    maxMark: 10,
    justification: {
      text: 'Amigos, a mobilidade dos capitais internacionais não pode mais se dissociar das formas de ação. A prática cotidiana prova que a crescente influência da mídia oferece uma interessante oportunidade para verificação dos relacionamentos verticais entre as hierarquias. ',
    },
  },
];
const attachedMessage = ref<Message>();
const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<div class="tw-flex tw-flex-col tw-gap-2 tw-w-full">
      <alex-learningplan-task-chat :messages="messages" class="tw-w-full" />
      <alex-learningplan-task-chat-input class="tw-w-full" />
</div>`,
        label: 'Template',
      },
      {
        template: `const messages = ref<Message[]>([]);`,
        label: 'Script',
      },
    ],
    hasExample: true,
    title: 'Basic Usage',
    description: '',
  },
]);
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
    id: Math.round(Math.random() * 10000),
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
