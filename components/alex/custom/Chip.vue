<template>
  <v-chip
    :class="[
      size,
      status ?? '',
      isActive ? '' : 'disabled',
      icon ? 'icon pa-2' : '',
      clickable ? 'clickable' : '',
    ]"
    :variant="
      status
        ? ['outlined', 'elevated', 'text', 'plain', 'filled'].includes(
            variant ?? '',
          )
          ? variant
          : 'outlined'
        : variant
    "
    :color="status ? undefined : color"
    @click:chip="clickable ? emit('click:chip') : () => {}"
    @click:close="
      () => {
        emit('click:close');
        chip = uncloseable;
      }
    "
    :style="[color ? '' : 'border: none']"
    close-icon="mdi-close"
    style="width: min-content"
    data-testid="chip"
  >
    <template #close v-if="uncloseable">
      <v-icon
        icon="mdi-close"
        @click.stop="
          () => {
            emit('click:close');
          }
        "
      />
    </template>
    <v-icon
      v-if="prependIcon"
      class="mr-1"
      slot="prependIcon"
      :size="['x-small', 'small'].includes(size) ? 'medium' : '20'"
      >{{ prependIcon }}</v-icon
    >
    <div v-if="icon" style="display: inline-flex" data-testid="icon">
      <v-icon
        class="mx-0"
        :size="['x-small', 'small'].includes(size) ? 'medium' : '20'"
        >{{ icon }}</v-icon
      >
    </div>
    <div class="w-100 overflow-hidden" v-else>
      <span>{{ text }}</span>
    </div></v-chip
  >
</template>

<script setup lang="ts">
const emit = defineEmits(['click:close', 'click:chip']);
const props = defineProps({
  text: {
    type: String,
  },
  clickable: {
    type: Boolean,
    default: false,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  prependIcon: {
    type: String,
  },
  icon: {
    type: String,
  },
  uncloseable: {
    type: Boolean,
    default: false,
  },

  size: {
    type: String as PropType<'x-small' | 'small' | 'medium' | 'large'>,
    default: 'medium',
  },
  status: {
    type: String as PropType<
      | 'warning'
      | 'success'
      | 'error'
      | 'blue'
      | 'grey'
      | 'dark'
      | 'primary'
      | 'secondary'
    >,
  },
  color: {
    type: String,
    validator: (value: string) => {
      const regExp = new RegExp('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$');
      return regExp.test(value);
    },
  },
  variant: {
    type: String as PropType<
      'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain'
    >,
  },
});

const { isActive } = toRefs(props);

const chip = ref(false);
</script>

<style scoped lang="scss">
.clickable {
  cursor: pointer;
}
.v-chip__content {
  width: 100%;
  display: flex;
}

.success {
  background-color: #bff2d6;
  color: #156a3b;
  border: 1px solid #156a3b;
}

.error {
  background-color: #f9d1d1;
  color: #b61617;
  border: 1px solid #b61617;
}

.warning {
  background-color: #ffe5cc;
  color: #cc6400;
  border: 1px solid #cc6400;
}

.blue {
  background-color: #cceeff;
  color: #005c66;
  border: 1px solid #005c66;
}

.grey {
  background-color: #ebedef;
  color: #6e7a87;
  border: 1px solid #6e7a87;
}

.dark {
  background-color: #001a33;
  color: #ffffff;
  border: 1px solid #ffffff;
}

.primary {
  background-color: #d1f6fa;
  color: #008a99;
  border: 1px solid #008a99;
  .disabled {
    border: 1px solid #b9bfc6 !important;
    background-color: #ebedef !important;
  }
  &.clickable {
    &:hover {
      color: #005c66;
    }
  }

  &:active {
    background-color: #00b7cc;
    color: #fff;
    &:hover {
      background-color: #47d9eb;
      border: 1px solid #00b7cc;
    }
  }
}

.secondary {
  background-color: #f1f5f9;
  color: #6e7a87;
  border: 1px solid #6e7a87;

  .disabled {
    border: 1px solid #b9bfc6 !important;
    background-color: #ebedef !important;
  }
  &.clickable {
    &:hover {
      color: #005c66;
      background-color: #ebedef;
    }
  }

  &:active {
    background-color: #30363b;
    color: #fff;
    &:hover {
      background-color: #6e7a87;
    }
  }
}
.icon {
  gap: 0px !important;
}
.large {
  display: inline-flex;
  height: 36px;
  padding: 0px 12px;
  justify-content: center;
  align-items: center;

  flex-shrink: 0;
  border-radius: 8px;

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.32px;
}
.x-large.icon {
  width: 36px !important;
  height: 36px !important;
}

.medium {
  display: inline-flex;
  height: 32px;
  padding: 0px 12px;
  justify-content: center;
  align-items: center;

  flex-shrink: 0;
  border-radius: 8px;

  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.32px;
}
.medium.icon {
  width: 32px !important;
  height: 32px !important;
}

.small {
  display: inline-flex;
  height: 28px;
  padding: 0px 8px;
  justify-content: center;
  align-items: center;

  flex-shrink: 0;
  border-radius: 8px;

  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.28px;
}
.small.icon {
  width: 28px !important;
  height: 28px !important;
}

.x-small {
  display: inline-flex;
  height: 24px;
  padding: 0px 8px;
  justify-content: center;
  align-items: center;

  flex-shrink: 0;
  border-radius: 8px;

  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.24px;
}
.x-small.icon {
  width: 24px !important;
  height: 24px !important;
}
</style>
