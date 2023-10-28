<template>
  <div class="text-center">
    <v-menu
      :open-on-click="props.options.openOnClick"
      :open-on-hover="props.options.openOnHover"
      :close-on-content-click="props.options.closeOnContentClick"
      :location="props.options.location"
      :dark="props.options.isDarkMode"
      min-width="200"
      border-radius="8"
      class="dropdown-menu"
      data-testid="testing-dropdown"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          style="
            background-color: white !important;
            box-shadow: none;
            color: #4f4f4f !important;
          "
          icon="mdi-dots-vertical"
          v-bind="props"
        ></v-btn>
      </template>

      <v-list>
        <v-list-item
          v-for="item in props.items"
          :key="item.id"
          :class="itemClasses(item)"
          @mouseover="item.isHover = true"
          @mouseout="item.isHover = false"
        >
          <template v-if="item.type === 'text'">
            <v-list-item-title>{{ item.text }}</v-list-item-title>
          </template>
          <template v-else-if="item.type === 'icon'">
            <v-list-item-title>
              <v-icon>{{ item.icon }}</v-icon> {{ item.text }}
            </v-list-item-title>
          </template>
          <template v-else-if="item.type === 'checkbox'">
            <v-list-item-action>
              <alex-inputs-checkbox :checkbox="checkboxDropdown" />
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { Checkbox as CheckboxProps } from '@/components/alex/inputs/Checkbox.vue';

const checkboxDropdown: CheckboxProps = {
  modelValue: false,
  indeterminate: false,
  disabled: false,
  readonly: false,
};

type Item = {
  id: number;
  type: string;
  icon?: string;
  text: string;
};

type Options = {
  openOnClick: boolean;
  openOnHover: boolean;
  closeOnContentClick: boolean;
  location: string;
  isDarkMode: boolean;
};

const props = defineProps({
  items: Array as () => Item[],
  options: Object as () => Options,
});

const itemClasses = (item) => ({
  default: !item.isHover && !item.isDisabled && !item.isWarning,
  hover: item.isHover,
  warning: item.isWarning,
  disabled: item.isDisabled,
  'dark-theme': props.options.isDarkMode,
});
</script>

<style scoped>
div {
  font-family: Sen !important;
  font-weight: 700;
  font-size: 14px;
}

.dropdrown-menu {
  border-radius: 8px;
  min-width: 200px;
  cursor: pointer;
}
.default {
  color: #6e7a87;
}

.default.light-theme {
  background-color: white;
}

.hover {
  color: #30363b;
  background-color: #ebedef;
}

.dark-theme {
  background-color: #001a33;
}

.v-list {
  padding: 0;
}
.hover.dark-theme {
  color: #fff;
  background-color: #042749;
}
.warning {
  color: #e9494a;
}

.warning.dark-theme {
  color: #e9494a;
  background-color: #001a33;
}
.warning.hover.dark-theme {
  color: #e9494a;
  background-color: #042749;
}
</style>
