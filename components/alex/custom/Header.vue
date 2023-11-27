<template>
  <div
    class="header d-flex align-center w-full"
    style="height: 44px; justify-content: space-between"
    data-testid="header"
  >
    <div class="d-flex grow align-center">
      <a
        v-if="!noBackArrow"
        :href="items[items.length - 2].href"
        data-testid="back_arrow"
      >
        <v-icon
          class="header__arrow"
          data-testid="back_arrow"
          color="#6E7A87"
          style="cursor: pointer"
          >mdi-chevron-left</v-icon
        >
      </a>
      <div>
        <p
          class="header__title"
          style="
            font-size: 24px;
            font-weight: 700;
            line-height: 28px;
            color: #5d6872;
          "
          :title="title"
        >
          {{ title }}
        </p>
      </div>
      <!-- <v-divider vertical class="divider ml-4 align-center" /> -->
      <div class="header__breadcrumb">
        <slot name="breadcrumbs" :items="items">
          <alex-custom-breadcrumbs :items="items" />
        </slot>
      </div>
    </div>
    <div class="header__button d-flex">
      <v-btn
        data-testid="btn"
        :class="isTerciary ? 'terciary' : ''"
        height="44"
        width="103"
        class="button"
        :text="text"
        :icon="btnIcon"
        @click="() => toggleDialog"
        ><v-icon data-testid="btn-icon" width="20" height="20">
          {{ icon }}
        </v-icon>
        <p class="ml-2">{{ text }}</p>
      </v-btn>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  isTerciary: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: 'Botão',
  },
  btnIcon: {
    type: String,
    default: 'mdi-plus',
  },
  title: {
    type: String,
    default: 'Título da página',
  },
  noBackArrow: {
    type: Boolean,
    default: false,
  },
});

const items = [
  { title: 'Início', disabled: false, href: '/inicio' },
  { title: 'Página', disabled: false, href: '/pagina' },
];
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
