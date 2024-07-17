<template>
  <div class="slash-menu pa-3 width-75 rounded-lg">
    <template v-if="items.length">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="text-gray-600 text-body-3 row"
      >
        <p v-if="item.divider" class="px-2 divider">{{ item.title }}</p>
        <button
          v-else
          class="d-flex ga-3 w-100 tw-p-[6px] rounded w-100"
          :class="{ 'is-selected': index === selectedIndex }"
          @click="selectItem(index)"
        >
          <v-icon v-if="item.icon" :icon="item.icon" size="small" />
          {{ item.title }}
        </button>
      </div>
    </template>
    <div v-else class="text-dark-gray text-body-1 pa-2 rounded w-100">
      No result
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },

    command: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      selectedIndex: 0,
    };
  },

  watch: {
    items() {
      this.selectedIndex = 0;
    },
  },

  methods: {
    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        this.downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        this.enterHandler();
        return true;
      }

      return false;
    },

    upHandler() {
      this.selectedIndex =
        (this.selectedIndex + this.items.length - 1) % this.items.length;
    },

    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
    },

    enterHandler() {
      this.selectItem(this.selectedIndex);
    },

    selectItem(index) {
      const item = this.items[index];

      if (item) {
        this.command(item);
      }
    },
  },
};
</script>

<style lang="scss">
.tippy-box[data-theme='transparent'] {
  background-color: transparent !important;
}

.tippy-arrow {
  display: none;
}

div.row:not(:first-of-type) .divider {
  margin-top: 16px;
}

/* Dropdown menu */
.slash-menu {
  background: #fff;
  border: 1px solid rgb(var(--v-theme-gray-100));
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  overflow: auto;
  position: relative;
  max-height: 350px !important;
  max-width: 240px !important;
  overscroll-behavior: contain;

  button {
    align-items: center;
    gap: 0.25rem;
    // transition: all 0.2s ease;

    &:hover,
    &:hover.is-selected {
      background-color: #f5f5f5;
      color: rgb(var(--v-theme-gray-900)) !important;
    }

    &.is-selected {
      background-color: #f5f5f5;
      color: rgb(var(--v-theme-gray-900)) !important;
    }
  }
}

.slash-menu::-webkit-scrollbar {
  width: 5px;
}

.slash-menu::-webkit-scrollbar-track {
  border-radius: 0 8px 8px 0;
  background-color: #e7e7e7;
}

.slash-menu::-webkit-scrollbar-thumb {
  border-radius: 0 8px 8px 0;
  background-color: #cacaca;
}
</style>
