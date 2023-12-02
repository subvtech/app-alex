<template>
  <v-hover #default="{ isHovering, props }">
    <div
      v-bind="props"
      class="d-flex rounded-lg align-center justify-center gap-4 w-fit pa-2 cursor-pointer"
      :class="useClasses(click, active, disabled, isHovering).container"
      @click="emit('onSelect')"
    >
      <div
        class="step-indicator-number-icon rounded-lg"
        :class="useClasses(click, active, disabled, isHovering).bgNumber"
      >
        <v-icon
          v-if="icon || completed"
          :icon="completed ? 'mdi-check' : icon"
          :class="useClasses(active, disabled, isHovering).number"
        />
        <div
          v-else
          class="text-h4"
          :class="useClasses(click, active, disabled, isHovering).number"
        >
          {{ stepNumber }}
        </div>
      </div>
      <div class="d-flex flex-column align-start justify-center text-gray-300">
        <div
          class="text-body-2"
          :class="useClasses(click, active, disabled, isHovering).title"
        >
          {{ title }}
        </div>
        <div
          v-if="subtitle"
          class="text-body-3"
          :class="useClasses(click, active, disabled, isHovering).subtitle"
        >
          {{ subtitle }}
        </div>
      </div>
    </div>
  </v-hover>
</template>

<script setup lang="ts">
const emit = defineEmits(['onSelect']);
defineProps({
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
  completed: { type: Boolean, default: false },
});

const states = {
  hovering: {
    title: 'text-gray-600',
    subtitle: 'text-gray-400',
    bgNumber: 'bg-gray-blue',
    number: 'text-gray-400 number',
    container: 'border-1-gray-blue elevation-4',
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
    number: 'text-gray-300 ',
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

const useClasses = (
  click: boolean,
  active: boolean,
  disabled: boolean,
  hovering: boolean
) => {
  if (click) return states['click'];
  else if (active) return states['active'];
  else if (hovering && disabled && !active) return states['hovering'];
  else if (hovering && active) return states['active'];
  else return states['default'];
};
</script>

<style lang="scss">
/* Personalize as classes de estilo conforme necessário */
.step-indicator-number-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
}

.step-indicator-number-icon:active {
  background-color: aqua;
}
.border-1-gray-blue {
  outline: 1px solid rgb(var(--v-theme-gray-100));
}
.w-fit {
  width: fit-content;
  height: fit-content;
}
.cursor-pointer {
  cursor: pointer;
}

/* Adicione suas personalizações de estilo aqui */
</style>
