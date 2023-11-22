<template>
  <v-dialog width="640" v-model="model" data-testid="dialog">
    <template v-slot:activator>
      <v-btn
        v-if="!overwriteActivator"
        @click="toggleDialog"
        text="Open Dialog"
        :variant="btnVariant"
      >
      </v-btn>
      <slot v-else name="activator" />
    </template>

    <template v-slot:default>
      <v-card
        v-if="!overwriteDefault"
        class="block"
        :class="extraPadding ? 'pa-10' : ''"
        role="default"
      >
        <v-card-title class="d-flex flex-row align-center px-6 py-0 header">
          <span
            style="
              white-space: nowrap;
              overflow: hidden !important;
              text-overflow: ellipsis;
            "
            >{{ title }}</span
          >
          <v-spacer />
          <v-icon
            size="small"
            color="#6E7A87"
            @click="toggleDialog"
            style="cursor: pointer"
            >mdi-close</v-icon
          >
        </v-card-title>

        <v-card-text class="pa-6">
          <slot name="content" />
        </v-card-text>

        <v-card-actions
          class="py-4 actions"
          :role="prependIcon ? 'prepend' : ''"
        >
          <v-spacer />

          <v-btn
            :prepend-icon="prependIcon ? 'mdi-close' : ''"
            class="btn"
            color="#F1F5F9"
            @click="
              () => {
                toggleDialog();
                emit('cancel');
              }
            "
            :variant="btnVariant"
            style="color: #6e7a87"
          >
            {{ $t('components.profile.settings.cancel') }}</v-btn
          >
          <v-btn
            :prepend-icon="prependIcon ? 'mdi-check' : ''"
            class="btn"
            color="#00B7CC"
            :variant="btnVariant"
            @click="emit('save')"
          >
            {{ $t('components.profile.settings.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
      <slot v-else name="default" />
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
const emit = defineEmits(['save', 'cancel']);
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false,
  },

  extraPadding: {
    type: Boolean,
    default: false,
  },

  prependIcon: {
    type: Boolean,
    default: false,
  },

  overwriteActivator: {
    type: Boolean,
    default: false,
  },
  overwriteDefault: {
    type: Boolean,
    default: false,
  },

  btnVariant: {
    type: String as PropType<
      | NonNullable<
          'flat' | 'tonal' | 'text' | 'elevated' | 'outlined' | 'plain'
        >
      | undefined
    >,
    default: 'flat',
  },

  toggleDialog: {
    type: Function as PropType<() => void>,
    default: () => {},
  },

  title: {
    type: String,
    default: 'Dialog',
  },
});

const model = ref(props.isActive);

watch(
  () => props.isActive,
  (value) => {
    model.value = value;
  },
);
</script>

<style scoped lang="scss">
.v-card-text {
  overflow-y: auto !important;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
}

.v-card-title {
  span {
    color: #5d6872;

    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 0.2px;
  }
}
.btn {
  text-transform: none !important;
  height: 36px;
  padding-inline: 16px;
  font-size: 14px;

  font-weight: 700;
  line-height: 19px;
  letter-spacing: 0.02em;
  text-align: left;
}

.header {
  height: 72px;
  gap: 16px;
  border-bottom: 1px solid #ebedef;
}

.actions {
  height: 76px;
  gap: 8px;
  border-top: 1px solid #ebedef;
}
</style>
