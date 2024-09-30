<script setup lang="ts" generic="T">
interface MemberProps {
  name?: string;
  image?: string;
  email?: string;
  responsable?: boolean;
}

interface CompProps {
  member: MemberProps;
  clickable?: boolean;
  noDelete?: boolean;
  noCheckbox?: boolean;
  raw: T;
}
const selectedModel = defineModel<Omit<MemberProps, 'reponsable'>[] | boolean>({ default: false });
withDefaults(defineProps<CompProps>(), {
  edit: true,
  clickable: true,
  noDelete: false,
  noCheckbox: false,
});
type Emit = {
  'remove-click': [value: T];
  'toggle-responsible-click': [value: null | T];
};
defineEmits<Emit>();
</script>

<template>
  <v-hover v-slot="{ isHovering: isHoveringCard, props: propsHover }">
    <div v-bind="propsHover" class="d-flex tw-items-center ga-2 pa-2" :class="{ 'list-card': clickable }">
      <v-checkbox
        v-if="!noCheckbox"
        v-model="selectedModel"
        class="checkbox"
        :value="raw"
        color="secondary-0"
        density="compact"
        hide-details
      />
      <v-img
        class="avatar flex-0-0 rounded-circle"
        :src="member.image || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'"
        :alt="$t('components.learningPlan.members.member.label')"
        aspect-ratio="1"
        cover
      />
      <div class="flex-1-1 tw-flex tw-flex-col tw-ml-2">
        <span class="text-body-4 text-gray-800">{{
          member.name || '(' + $t('components.learningPlan.members.missing.name') + ')'
        }}</span>
        <span class="text-body-3 text-gray-400">{{ member.email }}</span>
      </div>
      <v-hover v-if="member.responsable" v-slot="{ props: propsHoverIcon, isHovering }">
        <div
          v-bind="propsHoverIcon"
          class="tw-flex gap-1 items-center bg-primary-2 tw-text-xs tw-p-1 tw-px-2 tw-rounded-lg"
        >
          <span>Responsável</span>
          <v-icon v-if="isHovering" size="small" @click="$emit('toggle-responsible-click', null)">mdi-close</v-icon>
        </div>
      </v-hover>
      <alex-custom-button
        v-else-if="!member?.responsable && isHoveringCard"
        prepend-icon="mdi-cached"
        size="small"
        variant="secondary"
        text="Tornar Responsável"
        @click="$emit('toggle-responsible-click', raw)"
      />
      <alex-custom-button
        v-if="!noDelete"
        icon="mdi-trash-can-outline"
        size="small"
        variant="text"
        @click.stop="$emit('remove-click', raw)"
      />
    </div>
  </v-hover>
</template>

<style scoped>
.avatar {
  width: 40px;
  height: 40px;
}
.list-card {
  cursor: pointer;
  border-radius: 8px;
}
/* .list-card:hover {
  background: rgb(var(--v-theme-gray-blue)) !important;
} */
/* .list-card:active {
  background: rgb(var(--v-theme-gray-100)) !important;
} */
</style>
