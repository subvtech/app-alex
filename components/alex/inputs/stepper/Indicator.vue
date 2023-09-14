<template>
  <v-hover #default="{ isHovering, props }"  >
    <div
      v-bind="props"
      class="d-flex rounded-lg align-center justify-center gap-4 w-fit pa-2 cursor-pointer"
      :class="useClasses(active, disabled, isHovering).container"
      @click="emit('onSelect')"
    >
      <div
        class="step-indicator-number-icon rounded-lg"
        :class="useClasses(active, disabled, isHovering).bgNumber"
      >
        <v-icon
          v-if="icon"
          :icon="icon"
          :class="useClasses(active, disabled, isHovering).number"
        />
        <div
          v-else
          class="text-h4"
          :class="useClasses(active, disabled, isHovering).number"
        >
          {{ stepNumber }}
        </div>
      </div>
      <div class="d-flex flex-column align-start justify-center text-gray-300">
        <div class="text-body-2" :class="useClasses(active, disabled, isHovering).title">
          {{ title }}
        </div>
        <div
          v-if="subtitle"
          class="text-body-3"
          :class="useClasses(active, disabled, isHovering).subtitle"
        >
          {{ subtitle }}
        </div>
      </div>
    </div>
  </v-hover>
</template>

<script setup lang="ts">
// interface Props {
//   title: string;
//   subtitle?: string;
//   icon?: string;
//   stepNumber: string;
//   checked?: boolean;
//   active?: boolean;
// }
// const props = withDefaults(defineProps<Props>(), {checked: false, active: false})
const emit = defineEmits(['onSelect']);
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: { type: String },
  icon: { type: String },
  stepNumber: { type: Number, required: true },
  checked: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  disabled: { type: Boolean, default: true },
});

const activeClasses = computed(() =>
  props.active ? 'bg-secondary-0 text-white' : 'bg-gray-blue text-gray-300',
);

const states = {
  hovering: {
    title: 'text-gray-600',
    subtitle: 'text-gray-400',
    bgNumber: 'bg-gray-blue',
    number: 'text-gray-400',
    container: 'border-1-gray-blue elevation-1',
  },
  active: {
    title: 'text-gray-600',
    subtitle: 'text-gray-400',
    bgNumber: 'bg-secondary-0',
    number: 'text-white',
    container: '',
  },
  default: {
    title: 'text-gray-300',
    subtitle: 'text-gray-300',
    bgNumber: 'bg-gray-blue',
    number: 'text-gray-300',
    container: '',
  },
  click: {
    title: 'text-gray-600',
    subtitle: 'text-gray-400',
    bgNumber: 'bg-gray-blue',
    number: 'text-secondary-0',
    container: '',
  },
};
const useClasses = (active: boolean, disabled: boolean, hovering?: boolean, click?: boolean) => {
  if (click) return states['click'];
  else if (hovering && !active && !disabled) return states['hovering'];
  else if (active) return states['active'];
  else return states['default'];
};
</script>

<style scoped lang="scss">
.step-indicator-number-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
}
.border-1-gray-blue {
  outline: 1px solid rgb(var(--v-theme-gray-100));
}
.w-fit {
  width: fit-content;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
