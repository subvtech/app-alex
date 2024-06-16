<template>
  <alex-custom-dropdown :items="items"
    ><template #activator="{ props: dropdownProps }"
      ><v-btn v-bind="dropdownProps" icon="mdi-dots-vertical" flat /></template
  ></alex-custom-dropdown>
</template>

<script setup lang="ts">
import { AlexDropdownItem } from '~/components/alex/custom/Dropdown.vue';

interface MenuProps {
  submitted?: boolean;
  accepted?: boolean;
}

const props = withDefaults(defineProps<MenuProps>(), {
  submitted: false,
  accepted: false,
});

const { t } = useI18n();
const emit = defineEmits(['remove-click', 'to-profile']);
const items: AlexDropdownItem[] = [
  {
    text: t('components.learningPlan.members.menu.profile'),
    onClick: () => emit('to-profile'),
  },
  !props.accepted
    ? {
        text: t('components.learningPlan.members.menu.invite'),
      }
    : undefined,
  !props.submitted
    ? {
        text: t('components.learningPlan.members.menu.remove'),
        warning: true,
        onClick: () => emit('remove-click'),
      }
    : undefined,
].filter((item) => item !== undefined);
</script>
