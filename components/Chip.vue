<template>
  <v-chip
    :class="[size, icon ? 'icon pa-2' : '']"
    :append-icon="appendIcon"
    :prepend-icon="prependIcon"
    :draggable="draggable"
    :variant="
      style
        ? ['outlined', 'elevated', 'text', 'plain'].includes(variant ?? '')
          ? variant
          : 'outlined'
        : variant
    "
    :color="style ? undefined : color"
    :closable="closable"
    @click:chip="emit('click:chip')"
    @click:close="
      () => {
        emit('click:close');
        chip = false;
      }
    "
    :style="[style ? style : '', icon ? 'gap: 0px !important' : '']"
  >
    <div v-if="icon" style="display: inline-flex">
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
    required: true,
  },
  closable: {
    type: Boolean,
    default: false,
  },

  draggable: {
    type: Boolean,
    default: false,
  },
  prependIcon: {
    type: String,
  },
  icon: {
    type: String,
  },
  appendIcon: {
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
      'warning' | 'success' | 'error' | 'blue' | 'grey' | 'dark'
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

const chip = ref(false);

const style = computed(() => {
  if (!props.status) return null;
  const temp: { color: string; 'background-color': string } = {
    color: '',
    'background-color': '',
  };
  switch (props.status) {
    case 'success':
      temp['background-color'] = '#BFF2D6';
      temp.color = '#156A3B';
      break;
    case 'error':
      temp['background-color'] = '#F9D1D1';
      temp.color = '#B61617';
      break;
    case 'warning':
      temp['background-color'] = '#FFE5CC';
      temp.color = '#CC6400';
      break;
    case 'blue':
      temp['background-color'] = '#CCEEFF';
      temp.color = '#005C66';
      break;
    case 'grey':
      temp['background-color'] = '#EBEDEF';
      temp.color = '#6E7A87';
      break;
    case 'dark':
      temp['background-color'] = '#001A33';
      temp.color = '#FFFFFF';
      break;
    default:
      return null;
  }

  if (props.variant === 'outlined')
    return {
      'background-color': 'white',
      color: temp.color === '#FFFFFF' ? temp['background-color'] : temp.color,
    };
  else return temp;
});
</script>

<style scoped lang="scss">
.v-chip__content {
  width: 100%;
  display: flex;
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
  max-width: 32px;
  max-height: 32px;
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
