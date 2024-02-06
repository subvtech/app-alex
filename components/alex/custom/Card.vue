<template>
  <div
    id="Card"
    class="d-flex flex-column rounded-lg bg-white"
    :class="[
      fullWidth ? 'w-100' : '',
      isNested ? '' : 'float',
      outline ? 'outline' : '',
    ]"
  >
    <div
      v-if="!noHeader"
      class="d-flex align-center justify-space-between"
      :class="[
        hideDividers ? '' : 'border-bottom',
        sizingClass ?? (isNested ? '' : 'px-6'),
      ]"
    >
      <div class="foretitle d-flex py-6">
        <span>{{ title }}</span>
        <nuxt-link v-if="href" :href="href" class="mr-5" role="goback">
          <v-icon color="#6E7A87" class="pointer">mdi-chevron-right</v-icon>
        </nuxt-link>
        <alex-custom-tooltip
          v-if="showTooltip"
          show-icon
          :text="tooltip"
          :extra-classes="tooltipExtraClass"
        />
      </div>
      <div
        v-if="isEditing"
        class="buttons d-flex flex-wrap justify-end"
        :class="smallButtons ? 'small-buttons' : ''"
      >
        <alex-custom-button
          class="btn"
          variant="secondary"
          :disabled="controlsLoading"
          @click="emit('click:cancel')"
        >
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
        v-else-if="showIcon"
        :tooltip-text="$t('components.card.edit')"
        variant="text"
        color="gray-600"
        icon="mdi-pencil-outline"
        @click:button="emit('toggle:isEditing')"
      />
    </div>

    <div
      class="d-flex flex-column w-100"
      :class="[sizingClass ?? (noHeader ? 'px-6' : 'pa-6'), alignContent]"
    >
      <slot name="content" />
    </div>
    <v-divider v-if="showFooterDivider" class="w-100" :thickness="1" />
    <div
      class="d-flex flex-column w-100"
      :class="[sizingClass ?? (noHeader ? 'px-6' : 'px-6 pb-6'), alignContent]"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
export interface CardComponentType {
  title: string;
  fullWidth?: boolean;
  isEditing?: boolean;
  hideDividers?: boolean;
  noHeader?: boolean;
  outline?: boolean;
  showFooterDivider?: boolean;
  controlsLoading?: boolean;
  sizingClass?: string;
  tooltipExtraClass?: string;
  alignContent?: 'align-center' | 'align-start' | 'align-end';
  href?: string;
  showIcon?: boolean;
  showTooltip?: boolean;
  smallButtons?: boolean;
  tooltip?: string;
  isNested?: boolean;
  disableSave?: boolean;
}

withDefaults(defineProps<CardComponentType>(), {
  alignContent: 'align-start',
  showIcon: true,
  hideDividers: false,
  fullWidth: false,
  isNested: false,
  disableSave: false,
  smallButtons: false,
  isEditing: false,
  noHeader: false,
  outline: false,
  showTooltip: false,
  showFooterDivider: false,
  controlsLoading: false,
  href: undefined,
  tooltipExtraClass: undefined,
  sizingClass: undefined,
  tooltip: undefined,
});

const emit = defineEmits(['toggle:isEditing', 'click:save', 'click:cancel']);
</script>

<style scoped lang="scss">
#Card {
  font-family: Sen;

  .pointer {
    cursor: pointer;
  }
  &.float {
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.08);

    .outline {
      box-shadow: none !important;
      border: 1px solid var(--Cinza-Cinza-100, #ebedef);
    }
  }
  .border-bottom {
    border-bottom: 1px solid #eaeef1;
  }
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
@media (max-width: 800px) {
  #Card {
    width: 100%;
  }
}
</style>
