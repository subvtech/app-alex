<template>
  <div
    class="breadcrumb-block d-flex align-baseline"
    style="gap: 8px"
    :style="
      backgroundColor
        ? `background-color: ${backgroundColor}`
        : 'background-color: transparent'
    "
    data-testid="breadcrumbs"
  >
    <div class="d-flex align-center">
      <a
        v-if="arrowBack && items.length > 1"
        :href="items[items.length - 2].href"
        role="goback"
      >
        <v-icon color="#6E7A87" style="cursor: pointer"
          >mdi-chevron-left</v-icon
        >
      </a>

      <span
        class="title text-h4 text-sm-h3"
        :style="titleStyle ?? ''"
        role="title"
        >{{ title }}</span
      >
      <v-divider
        vertical
        :thickness="thickness"
        class="pl-2"
        style="margin-block: auto; height: 24px"
        :style="barStyle ?? ''"
      />
    </div>
    <v-breadcrumbs
      class="w-100 pl-0"
      :class="breadcrumbsVClasses ?? 'flex-wrap'"
      :items="items"
      :divider="divider"
    >
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
      <template v-slot:divider>
        <slot v-if="overwriteDivider" name="divider" />
        <span v-else :style="itemStyle ?? ''">{{ divider }}</span>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script setup lang="ts">
defineProps({
  items: {
    type: Array as PropType<
      { title: string; disabled: boolean; href: string }[]
    >,
    default: [],
  },
  arrowBack: {
    type: Boolean,
    default: false,
  },
  overwriteDivider: {
    type: Boolean,
    default: false,
  },
  breadcrumbsVClasses: {
    type: String,
  },
  divider: {
    type: String,
    default: '>',
  },
  thickness: {
    type: Number,
    default: 2,
  },
  title: { type: String },
  titleStyle: { type: String },
  barStyle: { type: String },
  itemStyle: { type: String },
  backgroundColor: { type: String },
});
</script>

<style scoped lang="scss">
.breadcrumb-block {
  .title {
    color: #5d6872;
    font-weight: 700;
    width: max-content;
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
      width: unset !important;
    }
  }
}

@media (max-width: 340px) {
  .breadcrumb-block {
    flex-wrap: wrap !important;
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
