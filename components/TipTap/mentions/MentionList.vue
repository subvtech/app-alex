<template>
  <div class="dropdown-menu tw-rounded-sm tw-shadow">
    <template v-if="items.length">
      <div
        v-for="(user, index) in items"
        :key="index"
        :class="{ 'is-selected': index === selectedIndex }"
        class="d-flex align-center flex-wrap ga-3 pa-2 text-gray-800 hover:tw-bg-gray-100 tw-cursor-pointer tw-transition"
        role="button"
        @click="selectItem(index)"
      >
        <app-user-avatar
          :size="35"
          :placeholder="user.fullname"
          :profile-picture="
            user.avatar && { url: user.avatar.url, id: user.avatar.id }
          "
          show-border
        />
        <div>
          <p class="text-gray-800">
            {{ user.fullname || 'Sem nome' }}
          </p>
          <p class="tw-text-xs text-gray-600">
            {{ user.username || 'Sem username' }}
          </p>
        </div>
      </div>
    </template>
    <div v-else class="item">Sem alunos</div>
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
        this.command({ id: item });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/* Dropdown menu */
.dropdown-menu {
  background: var(--white);
  border: 1px solid var(--gray-1);
  border-radius: 0.7rem;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  overflow: auto;
  padding: 0.4rem;
  position: relative;

  button {
    align-items: center;
    background-color: transparent;
    display: flex;
    gap: 0.25rem;
    text-align: left;
    width: 100%;

    &:hover,
    &:hover.is-selected {
      background-color: var(--gray-3);
    }

    &.is-selected {
      background-color: var(--gray-2);
    }
  }
}
</style>
