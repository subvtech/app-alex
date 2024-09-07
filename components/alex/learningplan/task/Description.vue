<template>
  <div>
    <p class="text-body-4 text-gray-800 mb-2">
      {{ title || $t('components.learningPlan.drawer.task.description.label') }}
    </p>

    <div class="rounded-lg pa-0" :class="edit && 'border tw-min-h-[102px]'">
      <TipTap
        v-model="model"
        :mention-users="mentionUsers"
        :edit="edit"
        :allowed-blocks="['text']"
        :collaboration="false"
        :fixed-menu="edit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MentionUserPropsArray } from '~/components/TipTap/index.vue';

interface DescriptionProps {
  edit?: boolean;
  title?: string;
  mentionUsers?: MentionUserPropsArray;
}

defineProps<DescriptionProps>();

const model = defineModel({ required: true });
</script>
