<template>
  <v-container
    class="page rounded-lg bg-white pa-6 d-flex flex-column gap-6 align-center pb-15"
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
    <div class="flex flex-col gap-2 w-full">
      <alex-learningplan-task-chat :messages="messages" class="w-full" />
      <alex-learningplan-task-chat-input
        class="w-full"
        @submit="
          ({ text, audio }) => handleSubmit(text, audio?.blob, audio?.duration)
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
const messages = ref<ChatMessage[]>([]);
const examples = ref<ExampleComponentType[]>([
  {
    snippets: [
      {
        template: `<div class="flex flex-col gap-2 w-full">
      <alex-learningplan-task-chat :messages="messages" class="w-full" />
      <alex-learningplan-task-chat-input class="w-full" />
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
const handleSubmit = (text: string, audio?: Blob | null, duration?: number) => {
  if (!text && !audio) return;
  const message: ChatMessage = {
    date: new Date(),
    id: 1,
    user: { name: 'zig' },
    content: {
      text,
    },
    current: true,
  };
  if (audio) {
    message.content.audio = {
      src: URL.createObjectURL(audio),
      duration,
    };
  }
  messages.value.push(message);
};
</script>
