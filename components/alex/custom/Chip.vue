<template>
  <v-chip
    :class="[
      size,
      status ?? '',
      active && 'active',
      clickable && 'clickable',
      disabled && 'disabled',
      icon && 'icon pa-2',
      color && 'border-none',
    ]"
    :variant="variant"
    :color="status ? undefined : color"
    :disabled="disabled"
    close-icon="mdi-close"
    data-testid="chip"
    @click:chip="clickable ? emit('click:chip') : undefined"
    @click:close="emit('click:close')"
  >
    <template v-if="closable && clickable" #close>
      <v-icon
        icon="mdi-close"
        @click.stop="
          () => {
            emit('click:close');
          }
        "
      />
    </template>
    <template v-if="prependIcon" #prepend>
      <v-icon
        class="mr-1"
        :size="['x-small', 'small'].includes(size) ? 'medium' : '20'"
        >{{ prependIcon }}</v-icon
      ></template
    >

    <div v-if="icon" style="display: inline-flex" data-testid="icon">
      <v-icon
        class="mx-0"
        :size="['x-small', 'small'].includes(size) ? 'medium' : '20'"
        >{{ icon }}</v-icon
      >
    </div>
    <div v-else class="w-100 overflow-hidden">
      <span>{{ text }}</span>
    </div></v-chip
  >
</template>

<script setup lang="ts">
const emit = defineEmits(['click:close', 'click:chip']);
interface Props {
  text?: string;
  clickable?: boolean;
  active?: boolean;
  prependIcon?: string;
  icon?: string;
  closable?: boolean;
  disabled?: boolean;
  size?: 'x-small' | 'small' | 'medium' | 'large';
  status?: 'primary' | 'secondary' | 'orange' | 'green' | 'red' | 'blue';
  color?: string;
  variant?: 'elevated' | 'flat' | 'tonal' | 'outlined' | 'text' | 'plain';
}

withDefaults(defineProps<Props>(), {
  text: undefined,
  clickable: false,
  active: false,
  prependIcon: undefined,
  icon: undefined,
  closable: false,
  disabled: false,
  size: 'medium',
  status: undefined,
  color: '',
  variant: undefined,
});
</script>

<style scoped lang="scss">
.clickable {
  cursor: pointer;
}
.v-chip__content {
  width: min-content;
}

.green {
  color: rgb(var(--v-theme-success-2));
  &:not(.v-chip--variant-outlined) {
    background-color: rgb(var(--v-theme-success--2));
  }
  &.v-chip--variant-outlined {
    border: 1px solid rgb(var(--v-theme-success-1));
    color: rgb(var(--v-theme-success-1));
  }
}

.red {
  color: rgb(var(--v-theme-error-2));
  &:not(.v-chip--variant-outlined) {
    background-color: rgb(var(--v-theme-error--2));
  }
  &.v-chip--variant-outlined {
    border: 1px solid rgb(var(--v-theme-error-1));
    color: rgb(var(--v-theme-error-1));
  }
}

.orange {
  color: rgb(var(--v-theme-warning-2));
  &:not(.v-chip--variant-outlined) {
    background-color: rgb(var(--v-theme-warning--2));
  }
  &.v-chip--variant-outlined {
    border: 1px solid rgb(var(--v-theme-warning-1));
    color: rgb(var(--v-theme-warning-1));
  }
}

.blue {
  color: rgb(var(--v-theme-secondary-2));
  &:not(.v-chip--variant-outlined) {
    background-color: rgb(var(--v-theme-info--2));
  }
  &.v-chip--variant-outlined {
    border: 1px solid rgb(var(--v-theme-info-2));
    color: rgb(var(--v-theme-info-2));
  }
}

.secondary {
  color: rgb(var(--v-theme-gray-600));
  background-color: transparent;
  &:not(.v-chip--variant-outlined) {
    background-color: rgb(var(--v-theme-gray-100));
  }
  &.v-chip--variant-outlined {
    border: 1px solid rgb(var(--v-theme-gray-400));
    &.disabled {
      border: 1px solid rgb(var(--v-theme-gray-300)) !important;
    }
  }
  &.disabled {
    border: none;
    color: rgb(var(--v-theme-gray-300));
    background-color: rgb(var(--v-theme-gray-100)) !important;
  }

  &.clickable {
    &.v-chip--variant-outlined {
      border: 1px solid rgb(var(--v-theme-gray-500));
      &.disabled {
        border: 1px solid rgb(var(--v-theme-gray-300)) !important;
        color: rgb(var(--v-theme-gray-300)) !important;
      }
    }
    &.disabled {
      border: 1px solid #b9bfc6 !important;
      background-color: #ebedef !important;
    }
    &:hover {
      color: rgb(var(--v-theme-gray-900));
      background-color: rgb(var(--v-theme-gray-100));
    }
    &.active {
      background-color: rgb(var(--v-theme-primary-2));
      color: rgb(var(--v-theme-white));
      &:hover {
        color: rgb(var(--v-theme-white));
        background-color: rgb(var(--v-theme-gray-600));
      }
    }
  }
}
.primary {
  color: rgb(var(--v-theme-white));
  &:not(.v-chip--variant-outlined) {
    background-color: rgb(var(--v-theme-primary-2));
    &.disabled {
      border: none;
      background-color: rgb(var(--v-theme-gray-600)) !important;
    }
  }
  &.v-chip--variant-outlined {
    color: rgb(var(--v-theme-primary-1));
    border: 1px solid rgb(var(--v-theme-primary-1));
    &.disabled {
      border: 1px solid rgb(var(--v-theme-gray-800)) !important;
    }
  }

  &.clickable {
    color: rgb(var(--v-theme-secondary-1));
    border: 1px solid rgb(var(--v-theme-secondary-1));
    &:not(.v-chip--variant-outlined) {
      background-color: rgb(var(--v-theme-secondary--2));
    }
    &:not(.active).v-chip--variant-outlined:hover {
      color: rgb(var(--v-theme-secondary-1));
    }
    &.v-chip--variant-outlined .disabled {
      border: 1px solid rgb(var(--v-theme-gray-300)) !important;
      color: rgb(var(--v-theme-gray-300));
      background-color: transparent !important;
    }
    &.disabled {
      border: 1px solid rgb(var(--v-theme-gray-400)) !important;
      color: rgb(var(--v-theme-gray-300));
      background-color: rgb(var(--v-theme-gray-100)) !important;
    }
    &:hover {
      color: rgb(var(--v-theme-secondary-2));
      background-color: rgb(var(--v-theme-secondary--2));
    }

    &.active {
      color: rgb(var(--v-theme-white));
      background-color: rgb(var(--v-theme-secondary-0));

      &:hover {
        background-color: rgb(var(--v-theme-secondary--1));
        border: 1px solid rgb(var(--v-theme-secondary-0));
      }
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
