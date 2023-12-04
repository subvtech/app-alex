<template>
  <div class="text-center">
    <v-menu
      :open-on-click="options.openOnClick"
      :open-on-hover="options.openOnHover"
      :close-on-content-click="options.closeOnContentClick"
      :location="options.location"
      :dark="options.isDarkMode"
      data-testid="testing-dropdown"
    >
      <template v-slot:activator="{ props }">
        <v-btn class="dropdown-activator" icon="mdi-dots-vertical" v-bind="props"></v-btn>
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
          @click="onClick(item)"
        >
          <template v-if="item.type === 'text'">
            <v-list-item-title>
              <a v-if="item.link" v-bind:href="item.link">{{ item.text }}</a>
              <span v-else>{{ item.text }}</span>
            </v-list-item-title>
          </template>
          <template v-else-if="item.type === 'text-icon'">
            <v-list-item-title>
              <a v-if="item.link" v-bind:href="item.link">
                <v-icon>{{ item.icon }}</v-icon> {{ item.text }}
              </a>
              <span v-else>
                <v-icon>{{ item.icon }}</v-icon> {{ item.text }}
              </span>
            </v-list-item-title>
          </template>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script setup lang="ts">
interface Item {
  id: number;
  type: 'text' | 'text-icon';
  link?: string;
  icon?: string;
  text: string;
  class?: 'warning' | 'disabled' | undefined;
}

interface Options {
  openOnClick?: boolean;
  openOnHover?: boolean;
  closeOnContentClick?: boolean;
  location?: 'top' | 'bottom' | 'end' | 'start' | 'center';
  isDarkMode?: boolean;
  items: Item[];
}

const options = withDefaults(defineProps<Options>(), {
  openOnClick: true,
  openOnHover: false,
  closeOnContentClick: true,
  location: 'bottom',
  isDarkMode: false,
  items: () => [],
});

const emit = defineEmits(['click']);

const onClick = (item) => {
  emit('click', item);
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
  text-decoration: none !important;
}

.dropdown-activator {
  background-color: white !important;
  border-radius: 2px !important;
  color: #4f4f4f !important;
}
.default {
  color: #6e7a87 !important;
  text-decoration: none !important;
}

.default.light-theme {
  background-color: white !important;
  text-decoration: none !important;
}

.hover {
  color: #30363b !important;
  background-color: #ebedef !important;
  text-decoration: none !important;
}

.dark-theme {
  background-color: #001a33 !important;
  text-decoration: none !important;
}

.hover.dark-theme {
  color: #fff !important;
  background-color: #042749 !important;
  text-decoration: none !important;
}
.warning {
  color: #e9494a !important;
  text-decoration: none !important;
}

.warning.dark-theme {
  color: #e9494a !important;
  background-color: #001a33 !important;
  text-decoration: none !important;
}
.warning.hover.dark-theme {
  color: #e9494a !important;
  background-color: #042749 !important;
  text-decoration: none !important;
}

div.container.dropCheckbox {
  align-items: center !important;
}

a {
  color: inherit !important;
  text-decoration: none !important;
}
</style>
