<template>
  <div
    id="Card"
    class="d-flex flex-column rounded-lg"
    :class="[fullWidth ? 'w-100' : '', isNested ? '' : 'float']"
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
        <span :class="isEditing && showTooltip ? 'min-width' : ''">{{
          title
        }}</span>
        <a v-if="href" :href="href" class="mr-5" role="goback">
          <v-icon color="#6E7A87" class="pointer">mdi-chevron-right</v-icon>
        </a>
        <alex-custom-tooltip v-if="showTooltip" show-icon :text="tooltip" />
      </div>

      <div v-if="isEditing" class="buttons d-flex justify-end">
        <v-btn
          class="btn"
          color="accent"
          @click="cancelledAction"
          variant="outlined"
        >
          {{ $t('components.profile.settings.cancel') }}</v-btn
        >
        <v-btn class="btn" color="accent" @click="savedAction" type="submit">
          {{ $t('components.profile.settings.save') }}
        </v-btn>

        <v-btn
          class="hide rounded-circle"
          color="accent"
          @click="cancelledAction"
          variant="outlined"
          icon="mdi-cancel"
        />
        <v-btn
          class="hide rounded-circle"
          icon="mdi-check"
          color="accent"
          @click="save"
          type="submit"
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
  sizingClass: {
    type: String as PropType<SizingClass>,
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
  tooltip: {
    type: String,
  },
  isNested: {
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
//prettier-ignore
type SizingClass = 
'pa-0' | 'pa-1' | 'pa-2' | 'pa-3' | 'pa-4' | 'pa-5' | 'pa-6' | 'pa-7' | 'pa-8' | 'pa-9' | 'pa-10' | 'pa-11' | 'pa-12' | 'pa-13' | 'pa-14' | 'pa-15' | 'pa-16'|
'pt-0' | 'pt-1' | 'pt-2' | 'pt-3' | 'pt-4' | 'pt-5' | 'pt-6' | 'pt-7' | 'pt-8' | 'pt-9' | 'pt-10' | 'pt-11' | 'pt-12' | 'pt-13' | 'pt-14' | 'pt-15' | 'pt-16'|
'pb-0' | 'pb-1' | 'pb-2' | 'pb-3' | 'pb-4' | 'pb-5' | 'pb-6' | 'pb-7' | 'pb-8' | 'pb-9' | 'pb-10' | 'pb-11' | 'pb-12' | 'pb-13' | 'pb-14' | 'pb-15' | 'pb-16'|
'pl-0' | 'pl-1' | 'pl-2' | 'pl-3' | 'pl-4' | 'pl-5' | 'pl-6' | 'pl-7' | 'pl-8' | 'pl-9' | 'pl-10' | 'pl-11' | 'pl-12' | 'pl-13' | 'pl-14' | 'pl-15' | 'pl-16'|
'px-0' | 'px-1' | 'px-2' | 'px-3' | 'px-4' | 'px-5' | 'px-6' | 'px-7' | 'px-8' | 'px-9' | 'px-10' | 'px-11' | 'px-12' | 'px-13' | 'px-14' | 'px-15' | 'px-16'|
'py-0' | 'py-1' | 'py-2' | 'py-3' | 'py-4' | 'py-5' | 'py-6' | 'py-7' | 'py-8' | 'py-9' | 'py-10' | 'py-11' | 'py-12' | 'py-13' | 'py-14' | 'py-15' | 'py-16'|
'pr-0' | 'pr-1' | 'pr-2' | 'pr-3' | 'pr-4' | 'pr-5' | 'pr-6' | 'pr-7' | 'pr-8' | 'pr-9' | 'pr-10' | 'pr-11' | 'pr-12' | 'pr-13' | 'pr-14' | 'pr-15' | 'pr-16'|


'ma-0' | 'ma-1' | 'ma-2' | 'ma-3' | 'ma-4' | 'ma-5' | 'ma-6' | 'ma-7' | 'ma-8' | 'ma-9' | 'ma-10' | 'ma-11' | 'ma-12' | 'ma-13' | 'ma-14' | 'ma-15' | 'ma-16'|
'mt-0' | 'mt-1' | 'mt-2' | 'mt-3' | 'mt-4' | 'mt-5' | 'mt-6' | 'mt-7' | 'mt-8' | 'mt-9' | 'mt-10' | 'mt-11' | 'mt-12' | 'mt-13' | 'mt-14' | 'mt-15' | 'mt-16'|
'mb-0' | 'mb-1' | 'mb-2' | 'mb-3' | 'mb-4' | 'mb-5' | 'mb-6' | 'mb-7' | 'mb-8' | 'mb-9' | 'mb-10' | 'mb-11' | 'mb-12' | 'mb-13' | 'mb-14' | 'mb-15' | 'mb-16'|
'ml-0' | 'ml-1' | 'ml-2' | 'ml-3' | 'ml-4' | 'ml-5' | 'ml-6' | 'ml-7' | 'ml-8' | 'ml-9' | 'ml-10' | 'ml-11' | 'ml-12' | 'ml-13' | 'ml-14' | 'ml-15' | 'ml-16'|
'mx-0' | 'mx-1' | 'mx-2' | 'mx-3' | 'mx-4' | 'mx-5' | 'mx-6' | 'mx-7' | 'mx-8' | 'mx-9' | 'mx-10' | 'mx-11' | 'mx-12' | 'mx-13' | 'mx-14' | 'mx-15' | 'mx-16'|
'my-0' | 'my-1' | 'my-2' | 'my-3' | 'my-4' | 'my-5' | 'my-6' | 'my-7' | 'my-8' | 'my-9' | 'my-10' | 'my-11' | 'my-12' | 'my-13' | 'my-14' | 'my-15' | 'my-16'|
'mr-0' | 'mr-1' | 'mr-2' | 'mr-3' | 'mr-4' | 'mr-5' | 'mr-6' | 'mr-7' | 'mr-8' | 'mr-9' | 'mr-10' | 'mr-11' | 'mr-12' | 'mr-13' | 'mr-14' | 'mr-15' | 'mr-16';
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
  }
  .btn {
    text-transform: none !important;
    height: 36px;
    padding-inline: 12px;
  }
  .hide {
    display: none;
  }
}
@media (max-width: 800px) {
  #Card {
    width: 100%;
  }
}

@media (max-width: 400px) {
  #Card {
    .buttons {
      .btn {
        display: none;
      }
      .hide {
        display: flex;
        height: 36px !important;
        width: 36px !important;
      }
    }
  }
}
</style>
