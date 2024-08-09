<template>
  <div class="dropdown-menu tw-rounded-sm tw-shadow ga-2 py-2 px-0 bg-white">
    <template v-if="items.length">
      <div
        v-for="(user, index) in items"
        :key="index"
        :class="{ 'is-selected': index === selectedIndex }"
        class="d-flex align-center flex-wrap ga-3 py-2 px-3 text-gray-800 hover:tw-bg-gray-100 tw-cursor-pointer tw-transition"
        role="button"
        @click="selectItem(index)"
      >
        <v-avatar
          :size="40"
          :image="user.avatarUrl"
          class="alex-avatar-group-border alex-avatar-group-margin"
          color="gray-100"
        >
          <template v-if="!user.avatarUrl" #default>
            <p class="text-gray-300 text-body-2">
              {{ getInitials(user.fullname) }}
            </p>
          </template>
        </v-avatar>

        <div>
          <p class="text-body-4 text-gray-900 tw-truncate">
            {{ user.fullname || 'Sem nome' }}
          </p>
          <p class="text-body-5 text-gray-500 tw-truncate">
            {{ user.username || 'Sem username' }}
          </p>
        </div>
      </div>
    </template>
    <div v-else class="text-body-3 text-gray-800 pa-1 item">
      {{ $t('components.learningPlan.drawer.missing.members') }}
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
      const user = this.items[index];

      if (user) {
        this.command({
          username: user.username,
          fullname: user.fullname,
          avatarUrl: user.avatarUrl,
        });
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
  border-radius: 8px;
  box-shadow:
    0px 5px 5px -3px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 8px 10px 1px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 3px 14px 2px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));

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
