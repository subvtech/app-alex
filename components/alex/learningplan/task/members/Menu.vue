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
  accepted: true,
});

const { t } = useI18n();
const emit = defineEmits(['remove-click', 'to-profile', 'invite-click']);
const items = computed(() => {
  const defaultItems: AlexDropdownItem[] = [
    {
      text: t('components.learningPlan.members.menu.profile'),
      onClick: () => emit('to-profile'),
    },
  ];
  if (!props.accepted) {
    defaultItems.push({
      text: t('components.learningPlan.members.menu.invite'),
      onClick: () => emit('invite-click'),
    });
  }
  if (!props.submitted) {
    defaultItems.push({
      text: t('components.learningPlan.members.menu.remove'),
      warning: true,
      onClick: () => emit('remove-click'),
    });
  }
  return defaultItems;
});
</script>
