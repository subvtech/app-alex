<template>
  <v-row justify="space-between" align="center" dense class="mb-6">
    <v-col class="max-w-80">
      <alex-inputs-text-field
        v-model="searchModel"
        :name="`search-${$attrs.title}`"
        density="comfortable"
        :placeholder="searchPlaceholder"
        hide-details
        prepend-inner-icon="mdi-magnify"
        class="max-width-320"
      />
    </v-col>
    <v-col cols="auto" class="d-flex gap-2">
      <alex-custom-button
        v-if="!hideSecondaryAction"
        size="large"
        icon="mdi-filter-variant"
        variant="secondary"
        @click="emit('click:filter')" />
      <alex-custom-button
        v-if="!hideAction"
        size="large"
        :prepend-icon="!isMobile ? actionIcon : undefined"
        :icon="isMobile ? actionIcon : undefined"
      >
        <template v-if="!isMobile">{{ actionText }}</template>
        <template v-else><v-icon :icon="actionIcon" /></template>
        <slot v-if="useCustomDialog" name="custom-dialog"></slot>
        <alex-custom-dialog
          v-else
          v-model="dialogModelValue"
          :title="dialogTitle"
          activator="parent"
        >
          <slot name="dialog-content"></slot>
          <template #footer>
            <alex-custom-dialog-footer
              no-secondary-button
              :main-button-text="dialogActionText"
              :main-button-loading="dialogActionLoading"
              :main-button-disabled="dialogActionDisabled"
              @on-main-action="emit('action')"
            />
          </template>
        </alex-custom-dialog> </alex-custom-button
    ></v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify/lib/framework.mjs';

export interface SectionCardHeaderProps {
  dialogTitle: string;
  actionText: string;
  actionIcon: string;
  dialogActionText: string;
  dialogActionLoading?: boolean;
  dialogActionDisabled?: boolean;
  searchPlaceholder: string;
  useCustomDialog?: boolean;
  useMobileBreakpoint?: boolean;
  mobileBreakpoint?: number;
  hideAction?: boolean;
  hideSecondaryAction?: boolean;
}

const emit = defineEmits(['action', 'click:filter']);
const props = withDefaults(defineProps<SectionCardHeaderProps>(), {
  mobileBreakpoint: 600,
});
const { mobile } = useDisplay({ mobileBreakpoint: 600 });
const dialogModelValue = defineModel<boolean>('dialogModel', {
  default: false,
});

const searchModel = defineModel<string>('searchModel', {});

const isMobile = computed(() => props.useMobileBreakpoint && mobile.value);
</script>
