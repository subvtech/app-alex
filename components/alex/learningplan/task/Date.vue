<template>
  <div>
    <p
      class="pa-1 text-body-3 min-h-6 rounded-md"
      :class="[
        edit && 'date-output cursor-pointer',
        !formattedDate && 'text-gray-400',
        formattedDate && 'text-gray-800',
      ]"
    >
      {{
        formattedDate ||
        $t(
          `components.learningPlan.drawer.${
            edit ? 'date.placeholder' : 'missing.date'
          }`,
        )
      }}
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
      :close-on-content-click="false"
    >
      <v-date-picker
        v-model="selectedDateValue"
        color="secondary-0"
        rounded="lg"
        location="bottom start"
        :title="$t('components.date.selectDate')"
        :header="$t('components.date.enterDate')"
        :landscape="true"
        :max-width="360"
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
const selectedDate = defineModel<Date | string | null>();
const emit = defineEmits(['change', 'input']);

defineExpose({
  close: () => (open.value = false),
});

const selectedDateValue = computed({
  get() {
    if (typeof selectedDate.value === 'string') {
      return new Date(selectedDate.value.replaceAll('-', '/'));
    }
    return selectedDate.value;
  },
  set(newValue) {
    selectedDate.value = newValue;
  },
});

const formattedDate = computed(() => {
  if (!selectedDateValue.value) {
    return '';
  }
  return format(selectedDateValue.value.getTime(), 'dd/MM/yyyy');
});

function updateParentDate() {
  emit('change', selectedDateValue.value);
}

watch(selectedDate, () => {
  updateParentDate();
});
</script>

<style scoped>
.date-output:hover {
  --v-theme-overlay-multiplier: var(--v-theme-gray-blue-overlay-multiplier);
  background-color: rgb(var(--v-theme-gray-blue)) !important;
  transition: 0.3s;
}
</style>
