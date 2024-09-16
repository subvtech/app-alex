<template>
  <div
    id="Card"
    class="d-flex flex-column rounded-lg bg-white"
    :class="[fullWidth ? 'w-100' : '', isNested ? '' : 'float', outline ? 'outline' : '']"
  >
    <alex-custom-card-header
      v-if="!noHeader"
      :controls-loading="controlsLoading"
      :title="title"
      :no-icon="noIcon"
      :show-tooltip="showTooltip"
      :hide-dividers="hideDividers"
      :sizing-class="sizingClass"
      :is-nested="isNested"
      :is-editing="isEditing"
      :small-buttons="smallButtons"
      :href="href"
      :tooltip="tooltip"
      :disable-save="disableSave"
      :tooltip-extra-class="tooltipExtraClass"
      @click:cancel="emit('click:cancel')"
      @click:save="emit('click:save')"
      @toggle:is-editing="emit('toggle:isEditing')"
    />
    <slot name="header" />
    <div
      class="d-flex flex-column w-100"
      :class="[sizingClass ?? (noHeader ? 'px-6' : 'pa-6'), alignContent, contentClassName]"
    >
      <slot name="content" />
    </div>
    <v-divider v-if="showFooterDivider && !noFooter" class="w-100" :thickness="1" />
    <div
      v-if="!noFooter"
      class="d-flex flex-column w-100"
      :class="[sizingClass ?? (noHeader ? 'px-6' : 'px-6 pb-6'), alignContent]"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CardHeaderProps } from './Header.vue';

export interface CardComponentType extends CardHeaderProps {
  alignContent?: 'align-center' | 'align-start' | 'align-end';
  contentClassName?: string;
  fullWidth?: boolean;
  noFooter?: boolean;
  noHeader?: boolean;
  outline?: boolean;
  showFooterDivider?: boolean;
}

withDefaults(defineProps<CardComponentType>(), {
  alignContent: 'align-start',
  contentClassName: '',
  controlsLoading: false,
  disableSave: false,
  fullWidth: false,
  hideDividers: false,
  href: undefined,
  isEditing: false,
  isNested: false,
  noFooter: false,
  noHeader: false,
  noIcon: false,
  outline: false,
  showFooterDivider: false,
  showTooltip: false,
  sizingClass: undefined,
  smallButtons: false,
  tooltip: undefined,
  tooltipExtraClass: undefined,
});

const emit = defineEmits(['toggle:isEditing', 'click:save', 'click:cancel']);
</script>

<style scoped lang="scss">
.pb-2px {
  padding-bottom: 2px;
}
#Card {
  font-family: Sen;

  .pointer {
    cursor: pointer;
  }

  &.float {
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.08);

    .outline {
      box-shadow: none !important;
      border: 1px solid var(--Cinza-Cinza-200, #d2d6da);
    }
  }
  .border-bottom {
    border-bottom: 1px solid var(--Cinza-Cinza-100, #ebedef);
  }
}
@media (max-width: 800px) {
  #Card {
    width: 100%;
  }
}
</style>
