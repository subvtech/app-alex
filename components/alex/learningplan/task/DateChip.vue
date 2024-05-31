<template>
  <alex-custom-chip
    :status="color"
    :text="deadline"
    size="small"
    prepend-icon="mdi-calendar-range"
  ></alex-custom-chip>
</template>

<script setup lang="ts">
import { format } from 'date-fns';
import { enIN, ptBR } from 'date-fns/locale';
const i18 = useI18n();
interface Props {
  date: string;
  isPublished: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  date: '',
  isPublished: false,
});

const deadline = computed(() => {
  return format(new Date(props.date), 'dd MMM yyyy', {
    locale: i18.locale.value === 'pt' ? ptBR : enIN,
  });
});

const differenceInDays = (date: Date, date2: Date) => {
  const date1 = new Date(date);
  date1.setHours(23, 59, 59, 999);
  const diffTime = date1.getTime() - date2.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60));
};

const color = computed(() => {
  if (!props.isPublished) return 'secondary';
  const diff = differenceInDays(new Date(props.date), new Date());
  if (diff <= 24) return 'red';
  if (diff <= 72) return 'orange';
  return 'blue';
});
</script>
