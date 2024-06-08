<template>
  <v-list-item :value="goal.id" class="pa-2 border rounded-lg">
    <v-list-item-title class="d-flex ga-1"
      ><p class="text-body-3 text-gray-600">{{ goal.id }}.</p>

      <p class="flex-1- text-wrap">
        <span
          v-for="(text, index) in splittedText"
          :key="index"
          :class="
            text.regex
              ? 'font-weight-bold text-secondary-0'
              : 'text-body-3 text-gray-600'
          "
          >{{ text.value }}</span
        >
      </p></v-list-item-title
    >
  </v-list-item>
</template>

<script setup lang="ts">
interface GoalProps {
  id: number;
  description: string;
}

const goal = defineProps<GoalProps>();

interface TextSplitProps {
  value: string;
  regex: boolean;
}

// Separa as partes do texto que devem estar destacadas ou não
function getSplittedText() {
  const regex = /\*\s*(\w+\s*\w*)\s*\*/g;
  const text = goal.description;

  const splitText: TextSplitProps[] = [];
  let currentPos = 0;

  for (const match of text.matchAll(regex)) {
    const fullMatch = match[0];
    const capturedText = match[1].trim();

    if (currentPos < match.index) {
      splitText.push({
        value: text.slice(currentPos, match.index),
        regex: false,
      });
    }

    splitText.push({ value: capturedText, regex: true });
    currentPos = match.index + fullMatch.length;
  }

  if (currentPos < text.length) {
    splitText.push({ value: text.slice(currentPos), regex: false });
  }

  return splitText;
}

const splittedText = ref<TextSplitProps[]>(getSplittedText());
</script>
