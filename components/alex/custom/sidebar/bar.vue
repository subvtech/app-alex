<template>
  <div
    class="flex-column pb-2 px-2 bg-primary sidebar overflow-y-auto"
    :class="[!clipped ? 'sidebar-visible' : 'sidebar-hidden']"
  >
    <div class="my-4 w-100 d-flex" :class="clipped ? '' : 'justify-center'">
      <div>
        <NuxtLink to="/">
          <img
            v-if="clipped"
            src="public/images/alex-mini.svg"
            height="28"
            width="43"
          />
          <img v-else src="public/images/alex.svg" height="28" width="84" />
        </NuxtLink>
      </div>
    </div>
    <div v-for="(block, i) in blocks" :key="`menu-${i}`" class="bg-primary">
      <v-list :key="`menu-${i}-list`" class="pa-0 bg-primary">
        <v-list-subheader
          :key="`menu-${i}`"
          class="bg-primary pb-2 text-body-6"
          color="secondary-0"
          :class="
            clipped
              ? 'no-padding d-flex justify-center text-center align-center'
              : 'pl-4 pr-2 '
          "
          density="compact"
          nav
        >
          {{ clipped ? '...' : block.title }}
        </v-list-subheader>
        <v-list-item
          v-for="(item, j) in block.items"
          :key="`menu-${i}-item-${j}`"
          :to="item.to"
          class="rounded-lg bg-primary"
          :class="clipped ? '' : 'px-4'"
          router
          exact
          density="compact"
          nav
          role="list-item"
        >
          <div class="d-flex align-center" style="gap: 16px">
            <v-list-item-action>
              <v-icon color="#d2d6da" role="icon">{{ item.icon }}</v-icon>
            </v-list-item-action>

            <v-list-item-title class="item-name font-weight-medium">{{
              item.title
            }}</v-list-item-title>
          </div>
        </v-list-item>
      </v-list>
    </div>
  </div>
</template>

<script setup lang="ts">
type DrawableProps = {
  blocks: {
    title: string;
    items: { icon: string; title: string; to: string }[];
  }[];
  clipped: boolean;
};
defineProps<DrawableProps>();
</script>

<style lang="scss" scoped>
.sidebar {
  z-index: 2000;
  top: 0;
  left: 0;
  transition: all 140ms ease-in-out;
  height: 100%;
}
.sidebar-visible {
  width: 256px;
}
.sidebar-hidden {
  width: 56px;
}
.sidebar-hidden.mobile {
  z-index: 1000;
  display: none;
}
</style>
