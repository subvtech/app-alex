<template>
  <div class="text-center">
    <v-menu
      v-model="selectedItem"
      :open-on-click="options.openOnClick"
      :open-on-hover="options.openOnHover"
      :close-on-content-click="options.closeOnContentClick"
      :location="options.location"
      :dark="options.isDarkMode"
      data-testid="testing-dropdown"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          class="dropdown-activator"
          icon="mdi-dots-vertical"
          v-bind="props"
        ></v-btn>
      </template>

      <v-list data-testid="dropdown-content" class="pa-0">
        <v-list-item
          v-for="item in items"
          :key="item.id"
          :class="[
            { hover: item.isHover },
            { warning: item.class === 'warning' },
            { disabled: item.class === 'disabled' },
            { 'dark-theme': options.isDarkMode },
            'default',
          ]"
          @mouseover="item.isHover = true"
          @mouseout="item.isHover = false"
          @click="onSelect(item)"
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
              <alex-inputs-checkbox
                class="dropCheckbox"
                v-model="item.isChecked"
              />
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
import { on } from 'events';
import { defineProps } from 'vue';

type Item = {
  id: number;
  type: string;
  icon?: string;
  text: string;
  class?: string;
};

type Options = {
  openOnClick: boolean;
  openOnHover: boolean;
  closeOnContentClick: boolean;
  location: string;
  isDarkMode: boolean;
};

const selectedItem = ref({} as Item);

const { items, options } = defineProps(['items', 'options']);

const { openOnClick, openOnHover, closeOnContentClick, location, isDarkMode } =
  options as Options;

const { id, text, icon, type } = items as Item;

const onSelect = (item: Item) => {
  selectedItem.value = item;
};
</script>

<style scoped lang="scss">
div {
  font-family: Sen !important;
  font-weight: 700;
  font-size: 14px;
}

.v-menu > .v-overlay__content > .v-card,
.v-menu > .v-overlay__content > .v-sheet,
.v-menu > .v-overlay__content > .v-list {
  border-radius: 8px !important;
  min-width: 200px !important;
  cursor: pointer !important;
}

.dropdown-activator {
  background-color: white !important;
  box-shadow: none;
  color: #4f4f4f !important;
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

div.container.dropCheckbox {
  align-items: center !important;
}
</style>
