<template>
  <div
    class="d-flex align-center justify-space-between card-header"
    :class="[hideDividers ? '' : 'border-bottom', sizingClass ?? (isNested ? '' : 'px-6')]"
  >
    <div class="foretitle text-gray-800 d-flex py-6">
      <span v-if="!href">{{ title }}</span>
      <nuxt-link v-else :href="href" class="text-decoration-none foretitle" role="goback">
        <span class="text-gray-800">{{ title }}</span>
        <v-icon color="gray-600" class="pointer mr-5 pb-2px">mdi-chevron-right</v-icon>
      </nuxt-link>
      <alex-custom-tooltip v-if="showTooltip" show-icon :text="tooltip" :extra-classes="tooltipExtraClass" />
    </div>
    <div
      v-if="isEditing && !isGuest"
      class="buttons d-flex flex-wrap justify-end"
      :class="smallButtons ? 'small-buttons' : ''"
    >
      <alex-custom-button class="btn" variant="secondary" :disabled="controlsLoading" @click="emit('click:cancel')">
        {{ $t('components.card.cancel') }}</alex-custom-button
      >
      <alex-custom-button
        class="btn"
        :disabled="disableSave"
        variant="primary"
        :loading="controlsLoading"
        @click="emit('click:save')"
      >
        {{ $t('components.card.save') }}</alex-custom-button
      >

      <alex-custom-button
        class="small"
        icon="mdi-close"
        variant="secondary"
        :disabled="controlsLoading"
        @click="emit('click:cancel')"
      />
      <alex-custom-button
        class="small"
        icon="mdi-check"
        variant="primary"
        :disabled="disableSave"
        :loading="controlsLoading"
        @click="emit('click:save')"
      />
    </div>
    <alex-documentation-buttons-tooltip
      v-else-if="noIcon && !isGuest"
      :tooltip-text="$t('components.card.edit')"
      variant="text"
      color="gray-600"
      icon="mdi-pencil-outline"
      @click:button="emit('toggle:isEditing')"
    />
  </div>
</template>

<script setup lang="ts">
export interface CardHeaderProps {
  title?: string;
  noIcon?: boolean;
  controlsLoading?: boolean;
  showTooltip?: boolean;
  hideDividers?: boolean;
  sizingClass?: string;
  isNested?: boolean;
  isEditing?: boolean;
  smallButtons?: boolean;
  href?: string;
  tooltip?: string;
  disableSave?: boolean;
  tooltipExtraClass?: string;
  isGuest?: boolean;
}
withDefaults(defineProps<CardHeaderProps>(), {
  title: 'Title',
  href: undefined,
  tooltipExtraClass: undefined,
  tooltip: undefined,
  sizingClass: undefined,
  isGuest: false,
});

const emit = defineEmits(['toggle:isEditing', 'click:save', 'click:cancel']);
</script>

<style scoped>
.card-header {
  .foretitle {
    align-items: center;
    align-self: stretch;

    .min-width {
      width: min-content;
    }
    span {
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
    }
  }

  .buttons {
    gap: 8px;
    .small {
      display: none;
    }
    .btn {
      display: flex;
      text-transform: none !important;
      height: 36px;
      padding-inline: 12px;
    }
    &.small-buttons {
      .small {
        display: flex;
      }

      .btn {
        display: none;
      }
    }
  }
}
</style>
