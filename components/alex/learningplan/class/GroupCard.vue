<template>
  <v-card
    class="pt-10 pb-6 px-6 bg-white w-100 d-flex flex-column gap-4"
    rounded="lg"
    elevation="0"
    variant="outlined"
    color="gray-100"
    :max-width="320"
    :min-width="200"
    @click="$emit('open')"
  >
    <alex-custom-dropdown
      v-if="!noOptions"
      v-model="showOptions"
      :items="items"
      close-on-content-click
    >
      <template #activator="{ props: propsMenu }">
        <v-tooltip
          :text="$t('components.learningPlan.card.options')"
          location="bottom center"
        >
          <template #activator="{ props: optionsTooltipProps }">
            <alex-custom-button
              data-testid="alex-learningplan-card-hover-options"
              variant="text"
              v-bind="{ ...propsMenu, ...optionsTooltipProps }"
              icon="mdi-dots-vertical"
              class="options"
              size="small"
            />
          </template>
        </v-tooltip>
      </template>
    </alex-custom-dropdown>
    <v-card-text class="pa-0">
      <v-card-title class="pa-0 text-h3 text-gray-800 ellipsis lines-2">{{
        title
      }}</v-card-title>
      <v-card-subtitle class="pa-0 text-body-1 text-gray-600 opacity-1">{{
        leader.length ? leader[0].name : $t('pages.classes.noOneResponsible')
      }}</v-card-subtitle>
    </v-card-text>

    <alex-custom-avatar-group
      class="pl-2 w-100"
      :avatar-items="members"
      :size="48"
    />
    <v-card-subtitle class="pa-0 text-body-1 text-gray-600 opacity-1">{{
      `${members.length} ${$t(
        members.length > 1
          ? 'pages.classes.participants'
          : 'pages.classes.participant',
      )}`
    }}</v-card-subtitle>
  </v-card>
</template>

<script setup lang="ts">
interface LearningMemberGroupProps {
  title: string;
  members: {
    name: string;
    image?: {
      url: string;
      alt?: string;
    };
    role: 'in_charge' | 'standard';
  }[];
  noOptions?: boolean;
}

const showOptions = ref(false);
const emit = defineEmits(['edit', 'delete', 'open']);
const props = withDefaults(defineProps<LearningMemberGroupProps>(), {
  noOptions: false,
});

const leader = computed(() =>
  props.members.filter((user) => user.role === 'in_charge'),
);
const { t } = useI18n();
const items = [
  {
    text: t('pages.classes.editGroup'),
    icon: 'mdi-pencil-outline',
    onClick: () => emit('edit'),
  },
  {
    text: t('pages.classes.removeGroup'),
    icon: 'mdi-trash-can-outline',
    onClick: () => emit('delete'),
    warning: true,
  },
];
</script>

<style scoped lang="scss">
.options {
  position: absolute;
  top: 16px;
  right: 16px;
}

.opacity-1 {
  opacity: 1;
}
</style>
