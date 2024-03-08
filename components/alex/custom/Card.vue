<template>
  <div
    id="Card"
    class="d-flex flex-column rounded-lg"
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
        sizingClass ?? (noHeader ? 'px-6' : isNested ? '' : 'px-6'),
      ]"
    >
      <div class="foretitle d-flex py-6">
        <span :class="isEditing && showTooltip ? '' : ''">{{ title }}</span>
        <nuxt-link v-if="href" :to="href" class="mr-5" role="goback">
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
          @click="cancelledAction"
          variant="secondary"
        >
          {{ $t('components.profile.settings.cancel') }}</alex-custom-button
        >
        <alex-custom-button
          class="btn"
          @click="savedAction"
          :disabled="disableSave"
          variant="primary"
        >
          {{ $t('components.profile.settings.save') }}</alex-custom-button
        >

        <alex-custom-button
          class="small"
          icon="mdi-close"
          variant="secondary"
          @click="cancelledAction"
        />
        <alex-custom-button
          class="small"
          icon="mdi-check"
          variant="primary"
          :disabled="disableSave"
          @click="savedAction"
        />
      </div>
      <div
        v-else-if="showIcon"
        class="pointer"
        @click="emit('toggle:isEditing')"
      >
        <alex-custom-tooltip :text="$t('components.card.edit')">
          <template #content>
            <v-icon color="#6E7A87">mdi-pencil-outline</v-icon>
          </template>
        </alex-custom-tooltip>
      </div>
    </div>

    <div
      class="d-flex flex-column w-100"
      :class="[
        sizingClass ?? (noHeader ? 'px-6' : 'pa-6'),
        alignContent ?? 'align-start',
      ]"
    >
      <slot name="content" />
    </div>
    <v-divider v-if="showFooterDivider" class="w-100" :thickness="1" />
    <div
      class="d-flex flex-column w-100"
      :class="[
        sizingClass ?? (noHeader ? 'px-6' : 'px-6 pb-6'),
        alignContent ?? 'align-start',
      ]"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  cancel: {
    type: Function,
    default: () => {},
  },
  save: {
    type: Function,
    default: () => {},
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  hideDividers: {
    type: Boolean,
    default: false,
  },
  noHeader: {
    type: Boolean,
    default: false,
  },
  outline: {
    type: Boolean,
    default: false,
  },
  showFooterDivider: {
    type: Boolean,
    default: false,
  },
  sizingClass: {
    type: String,
  },
  tooltipExtraClass: {
    type: String,
  },
  alignContent: {
    type: String as PropType<'align-center' | 'align-start' | 'align-end'>,
  },
  href: {
    type: String,
  },
  showIcon: {
    type: Boolean,
    default: true,
  },
  showTooltip: {
    type: Boolean,
    default: false,
  },
  smallButtons: {
    type: Boolean,
    default: false,
  },
  tooltip: {
    type: String,
  },
  isNested: {
    type: Boolean,
    default: false,
  },
  disableSave: {
    type: Boolean,
    default: false,
  },
});

const { title, cancel, isEditing, save } = toRefs(props);
const emit = defineEmits(['toggle:isEditing']);

const savedAction = async () => {
  emit('toggle:isEditing');
  save.value();
};

const cancelledAction = async () => {
  emit('toggle:isEditing');
  cancel.value();
};
</script>

<style scoped lang="scss">
#Card {
  background-color: white;
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
      color: #5d6872;
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
