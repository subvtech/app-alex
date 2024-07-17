<template>
  <ToggleGroup
    type="single"
    class="d-flex flex-wrap justify-space-evenly toggle-group"
    size="sm"
  >
    <ToggleGroupItem
      v-for="color in colors"
      :key="color.value"
      :value="color.value"
      :aria-label="color.ariaLabel"
      :data-active="false"
      :style="`background-color: ${color.value};`"
      class="width-5 height-5 hover:tw-scale-125 tw-transition-all color-picker"
      :class="[
        color.ariaLabel,
        {
          'active-color': color.value === props.activeColor,
        },
      ]"
      @click.stop="handleClick(color.value)"
    />
    <ToggleGroupItem
      v-if="false"
      value="#000"
      aria-label="black"
      data-active="false"
      class="width-5 height-5 pa-0 hover:tw-scale-125 hover:tw-bg-white hover:tw-text-black tw-transition-all"
      @click.stop="console.log('color', '#000')"
    >
      <RotateCcw :size="18" />
    </ToggleGroupItem>
  </ToggleGroup>
</template>

<script setup lang="ts">
import { RotateCcw } from 'lucide-vue-next';

interface propsType {
  type: 'highlight' | 'color';
  activeColor: string;
}

const props = defineProps<propsType>();

const emits = defineEmits(['setHighlightColor', 'setTextColor']);

const handleClick = (color: string) => {
  if (props.type === 'highlight') {
    emits('setHighlightColor', color);
  } else {
    emits('setTextColor', color);
  }
};

const colors = [
  { value: '#fb7185', ariaLabel: 'pink-red' },
  { value: '#fdba74', ariaLabel: 'light-orange' },
  { value: '#fcf151', ariaLabel: 'yellow' },
  { value: '#a7f3d0', ariaLabel: 'light-green-cyan' },
  { value: '#a5f3fc', ariaLabel: 'light-cyan' },
  { value: '#a5b4fc', ariaLabel: 'light-blue' },
  props.type === 'highlight'
    ? { value: '#fff', ariaLabel: 'white' }
    : { value: '#000', ariaLabel: 'black' },
];
</script>

<style scoped>
.active-color {
  border: 2px solid #fff;
  outline: 1px solid var(--tw-shadow-color);
  padding: 0;
  &:not(:hover) {
    transform: scale(1.15);
  }
}

.toggle-group {
  pointer-events: none;
}

.toggle-group > * {
  transition: transform 0.3s ease;
  pointer-events: auto;
}

.toggle-group:hover > * {
  transform: none;
  box-shadow: none;
}

.toggle-group:hover > *:hover {
  transform: scale(1.25);
  filter: drop-shadow(0 0 5px var(--tw-shadow-color));
}

.pink-red {
  --tw-shadow-color: #fb7185;
}

.light-orange {
  --tw-shadow-color: #fdba74;
}

.yellow {
  --tw-shadow-color: #fcf151;
}

.light-green-cyan {
  --tw-shadow-color: #a7f3d0;
}

.light-cyan {
  --tw-shadow-color: #a5f3fc;
}

.light-blue {
  --tw-shadow-color: #a5b4fc;
}

.black {
  --tw-shadow-color: #212121;
}

.white {
  --tw-shadow-color: rgb(var(--v-theme-gray-200));
  outline: 1px solid rgb(var(--v-theme-gray-100));
  border-color: #000 !important;
}
</style>
