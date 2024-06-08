<template>
  <div>
    <p
      class="pa-1 text-body-3 text-gray-800 rounded-md"
      :class="edit ? 'date-output cursor-pointer' : ''"
    >
      {{ formattedDate }}
    </p>
    <v-menu
      v-model="open"
      :disabled="!edit"
      class="alex-picker"
      transition="scale-transition"
      offset-y
      min-width="auto"
      location="top start"
      activator="parent"
      :close-on-content-click="true"
    >
      <v-date-picker
        v-model="selectedDate"
        color="secondary-0"
        rounded="lg"
        location="bottom start"
        :title="$t('components.date.selectDate')"
        :header="$t('components.date.enterDate')"
        :landscape="true"
        :max-width="360"
        @input="$emit('input', () => (open = false))"
      />
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns';

interface CompProps {
  edit?: boolean;
}

defineProps<CompProps>();

const open = ref<boolean>(false);
const selectedDate = defineModel<Date>({ required: true });
const emit = defineEmits(['updateDate', 'input']);

function updateParentDate() {
  emit('updateDate', selectedDate.value);
}

watch(selectedDate, updateParentDate);

const formattedDate = computed(() => {
  if (!selectedDate.value) {
    return '';
  }

  return format(selectedDate.value, 'dd/MM/yyyy');
});
</script>

<style scoped>
.date-output:hover {
  --v-theme-overlay-multiplier: var(--v-theme-gray-blue-overlay-multiplier);
  background-color: rgb(var(--v-theme-gray-blue)) !important;
  transition: 0.3s;
}
</style>
