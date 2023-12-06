<template>
  <div
    class="header d-flex align-center w-full"
    style="height: 44px; justify-content: space-between"
    data-testid="header"
  >
    <div class="d-flex grow align-center">
      <div class="header__breadcrumb">
        <alex-custom-breadcrumbs
          :title="title"
          :items="items"
          :arrow-back="!noBackArrow"
        />
      </div>
    </div>
    <!-- <div class="header__button d-flex">
      <v-btn
        data-testid="btn"
        :class="isTerciary ? 'terciary' : ''"
        height="44"
        width="103"
        class="button"
        :text="text"
        :icon="btnIcon"
      >
        <p class="ml-2">{{ text }}</p>
      </v-btn>
    </div> -->
  </div>
</template>
<script setup lang="ts">
defineProps({
  hasMainButton: {
    type: Boolean,
    default: false,
  },
  hasSecondaryButton: {
    type: Boolean,
    default: false,
  },
  // mainButton
  noBackArrow: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array as PropType<
      { title: string; disabled: boolean; href: string }[]
    >,
    default: () => [],
  },
});
</script>
<style scoped lang="scss">
.button {
  font-size: 14px;
  font-weight: 700;
  text-transform: none;
}

.terciary {
  color: #6e7a87 !important;
  background-color: #ebedef !important;
}

.divider {
  align-self: center !important;
  height: 24px;
}

.header__arrow {
  margin-right: 16px;
}
</style>
