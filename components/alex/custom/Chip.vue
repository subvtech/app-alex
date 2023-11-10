<template>
  <v-chip
    :class="[
      size,
      status ?? '',
      isActive ? '' : 'disabled',
      icon ? 'icon pa-2' : '',
    ]"
    :prepend-icon="prependIcon"
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
        chip = false;
      }
    "
    :style="[
      clickable ? 'cursor: pointer' : '',
      icon ? 'gap: 0px !important' : '',
    ]"
    style="width: min-content"
    data-testid="chip"
  >
    <div v-if="icon" style="display: inline-flex" data-testid="icon">
      <v-icon :size="['x-small', 'small'].includes(size) ? 'medium' : '20'">{{
        icon
      }}</v-icon>
    </div>
    <div
      class="d-flex w-100 justify-center align-center overflow-hidden"
      v-else
    >
      <v-icon
        v-if="!(prependIcon || icon)"
        class="mr-1"
        :size="['x-small', 'small'].includes(size) ? 'medium' : '20'"
        >mdi-circle-medium</v-icon
      >

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

  size: {
    type: String as PropType<
      'x-small' | 'small' | 'medium' | 'large' | 'x-large'
    >,
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
    type: String as PropType<
      | '#B61617'
      | '#001A33'
      | '#EBEDEF'
      | '#BFF2D6'
      | '#15693B'
      | 'green'
      | 'secondary'
      | 'primary'
    >,
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
.v-chip__content {
  width: 100%;
  display: flex;
}

.success {
  background-color: #bff2d6;
  color: #156a3b;
}

.error {
  background-color: #f9d1d1;
  color: #b61617;
}

.warning {
  background-color: #ffe5cc;
  color: #cc6400;
}

.blue {
  background-color: #cceeff;
  color: #005c66;
}

.grey {
  background-color: #ebedef;
  color: #6e7a87;
}

.dark {
  background-color: #001a33;
  color: #ffffff;
}

.primary {
  background-color: #d1f6fa;
  color: #008a99;
  border: 1px solid #008a99;

  .disabled {
    border: 1px solid #b9bfc6 !important;
    background-color: #ebedef !important;
  }
  &:hover {
    color: #005c66;
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
  border: 1px solid #a0a8b1;

  .disabled {
    border: 1px solid #b9bfc6 !important;
    background-color: #ebedef !important;
  }
  &:hover {
    color: #005c66;
    background-color: #ebedef;
  }

  &:active {
    background-color: #30363b;
    color: #fff;
    &:hover {
      background-color: #6e7a87;
    }
  }
}

.x-large {
  display: inline-flex;
  height: 40px;
  padding: 0px 12px;
  justify-content: center;
  align-items: center;

  flex-shrink: 0;
  border-radius: 8px;

  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  letter-spacing: 0.32px;

  overflow: hidden;
}
.x-large.icon {
  width: 40px !important;
  height: 40px !important;
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
