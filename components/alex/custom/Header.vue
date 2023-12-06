<template>
  <div
    class="header d-flex align-center w-full"
    style="height: 44px; justify-content: space-between"
    data-testid="header"
  >
    <div class="d-flex grow align-center">
      <div class="header__breadcrumb">
        <alex-custom-breadcrumbs :title="title" :items="items" arrow-back />
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
