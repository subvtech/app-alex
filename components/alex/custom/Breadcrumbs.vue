<template>
  <div
    class="breadcrumb-block d-flex align-center"
    style="gap: 8px"
    :style="
      backgroundColor
        ? `background-color: ${backgroundColor}`
        : 'background-color: transparent'
    "
    data-testid="breadcrumbs"
  >
    <a
      v-if="arrowBack && items.length > 1"
      :href="items[items.length - 2].href"
      role="goback"
    >
      <v-icon color="#6E7A87" style="cursor: pointer">mdi-chevron-left</v-icon>
    </a>

    <span
      class="title text-h4 text-sm-h3"
      style="display: inline-flex; flex-shrink: 0"
      :style="titleStyle ?? ''"
      role="title"
      >{{ title }}</span
    >
    <v-divider vertical class="pl-2" style="margin-block: auto; height: 24px" />
    <v-breadcrumbs class="w-100 pl-0" :items="items" divider=">">
      <template v-slot:title="{ item }">
        <v-breadcrumbs-item
          :href="item.href"
          :disabled="item.disabled"
          :style="[item.disabled ? '' : 'cursor: pointer', itemStyle ?? '']"
          :role="item.disabled ? 'breadcrumb-item-disabled' : 'breadcrumb-item'"
        >
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  items: {
    type: Array as PropType<
      { title: string; disabled: boolean; href: string }[]
    >,
    default: [],
  },
  arrowBack: {
    type: Boolean,
    default: true,
  },
  title: { type: String },
  titleStyle: { type: String },
  itemStyle: { type: String },
  backgroundColor: { type: String },
});
</script>

<style scoped lang="scss">
.breadcrumb-block {
  .title {
    color: #5d6872;
    font-weight: 700;
  }

  .v-breadcrumbs-item {
    color: #5d6872;

    /* Body/P3 */
    font-family: Sen;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0.28px;
  }

  .v-breadcrumbs-item .v-breadcrumbs-item--disabled {
    color: #abb2b9 !important;
    opacity: unset !important;
    /* Body/P3 */
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    letter-spacing: 0.28px;
  }
}
@media (max-width: 400px) {
  .breadcrumb-block {
    gap: 6px;
    .title {
      flex-shrink: unset !important;
    }
  }
}

@media (max-width: 340px) {
  .breadcrumb-block {
    flex-wrap: wrap;
    gap: 6px;
  }
}

@media (max-width: 260px) {
  .breadcrumb-block {
    gap: 6px;
    flex-wrap: nowrap;
  }
}
</style>
