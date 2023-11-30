<template>
  <v-card
    class="handle px-2 py-4 d-flex flex-column justify-space-between"
    style="max-height: 162px"
  >
    <v-card-title class="d-flex align-center">
      <div v-if="priorityText" class="d-flex w-100 align-center">
        <div class="label px-2" :class="priorityText">
          <span>{{
            priorityText[0].toLocaleUpperCase() + priorityText.slice(1)
          }}</span>
        </div>
        <v-spacer />
        <NuxtImg
          v-if="dueDate"
          width="24"
          height="24"
          src="/svg/clock.svg"
          placeholder
        />
      </div>
    </v-card-title>
    <v-card-text class="w-100">
      <div class="d-flex flex-row align-start">
        <span v-if="title.length < 75">{{ title }}</span>
        <span v-else>{{ title.substring(0, 75) + '...' }}</span>
        <v-spacer />
        <div class="pa-1" style="height: 32px">
          <NuxtImg
            v-if="!priorityText && dueDate"
            width="24"
            height="24"
            src="/svg/clock.svg"
            placeholder
          />
        </div>
      </div>
    </v-card-text>

    <v-card-actions
      v-if="files.length > 0 || comments.length > 0"
      class="py-0"
      style="min-height: unset"
    >
      <div class="d-flex justify-start">
        <v-btn v-if="files.length > 0" color="#6E7A87">
          <v-icon size="16" style="margin-right: 10px">mdi-paperclip</v-icon>
          {{ files.length }}
        </v-btn>
        <v-btn v-if="comments.length > 0" color="#6E7A87">
          <v-icon size="16" style="margin-right: 10px">mdi-message-text</v-icon>
          {{ comments.length }}
        </v-btn>
      </div>
    </v-card-actions>
    <v-btn
      class="seal"
      icon="mdi-school-outline"
      size="20"
      color="#6E7A87"
      variant="outlined"
    >
    </v-btn>
  </v-card>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    default: -1,
  },
  text: {
    type: String,
    required: true,
  },

  files: {
    type: Array as PropType<String[]>,
    default: [],
  },
  comments: {
    type: Array as PropType<String[]>,
    default: [],
  },
  dueDate: {
    type: Boolean,
    default: false,
  },
});

const priorityText = computed(() => {
  switch (props.priority) {
    case 0:
      return 'optional';
    case 1:
      return 'medium';
    case 2:
      return 'high';
    case 3:
      return 'critical';
    default:
      return undefined;
  }
});
</script>

<style scoped lang="scss">
.v-card {
  width: 300px;
  min-height: 120px;
}
.label {
  border-radius: 8px;
  height: 28px;
  display: flex;
  span {
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0.28px;
  }
}

.seal {
  position: absolute;
  bottom: 16px;
  right: 24px;
  padding: 6px;
  display: flex;
  max-width: 32px;
  max-height: 32px;
  justify-content: center;
  align-items: center;
  gap: 10px;

  border-radius: 8px;
  border-width: 0px;
  background: var(--cinza-cinza-azulado, #f1f5f9);
}
.v-card-text {
  overflow: hidden;
  color: var(--cinza-cinza-800, #454d54);

  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 0.28px;
}
.optional {
  background-color: aqua;
  color: rgb(100, 175, 150);
}

.medium {
  background-color: rgb(248, 248, 92);
  color: rgb(172, 172, 42);
}

.high {
  background: #f9d1d1;
  color: #e9494a;
}
</style>
