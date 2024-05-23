<template>
  <div>
    <p class="date-output pa-1 text-p3 text-gray-800 rounded-md cursor-pointer">
      {{ formattedDate }}
    </p>
    <v-menu
      v-model="open"
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

const open = ref<boolean>(false);
const selectedDate = ref<Date>(new Date());

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
/** Estilização da página */
.text-p3 {
  /* Body/P3 */
  font-family: Sen;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; /* 18.9px */
  letter-spacing: 0.28px;
}

.text-p4 {
  /* Body/P4 */
  font-family: Sen;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 135%; /* 18.9px */
  letter-spacing: 0.28px;
}

.date-output:hover {
  --v-theme-overlay-multiplier: var(--v-theme-gray-blue-overlay-multiplier);
  background-color: rgb(var(--v-theme-gray-blue)) !important;
  transition: 0.3s;
}
</style>
