<template>
  <div
    class="breadcrumb-block d-flex align-center flex-wrap"
    style="gap: 8px"
    :style="
      backgroundColor
        ? `background-color: ${backgroundColor}`
        : 'background-color: transparent'
    "
    data-testid="breadcrumbs"
  >
    <div class="d-flex align-center">
      <nuxt-link
        v-if="arrowBack && items.length > 1"
        :to="items[items.length - 2].to"
        class="mr-5 arrow-back"
        aria-label="Go Back"
      >
        <v-icon color="#6E7A87" style="cursor: pointer"
          >mdi-chevron-left</v-icon
        >
      </nuxt-link>
      <span
        class="title text-h4 text-sm-h3"
        :style="titleStyle ?? ''"
        role="title"
        >{{ title }}</span
      >
      <v-divider
        v-if="items.length !== 0"
        vertical
        :thickness="thickness"
        class="pl-4 d-none d-md-block"
        style="margin-block: auto; height: 24px"
        :style="barStyle ?? ''"
      />
    </div>
    <v-breadcrumbs
      class="pl-0"
      :class="breadcrumbsVClasses"
      :items="items"
      :divider="divider"
    >
      <template #title="{ item }">
        <v-breadcrumbs-item
          class="text-body-3 text-gray-700"
          :disabled="item.disabled"
          :style="[itemStyle ?? '']"
          :to="item.to"
          :role="item.disabled ? 'breadcrumb-item-disabled' : 'breadcrumb-item'"
        >
          {{ item.title }}
        </v-breadcrumbs-item>
      </template>
      <template #divider>
        <div class="mx-1">
          <slot v-if="overwriteDivider" name="divider" />
          <span v-else class="divider" :style="itemStyle ?? ''">{{
            divider
          }}</span>
        </div>
      </template>
    </v-breadcrumbs>
  </div>
</template>

<script setup lang="ts">
defineProps({
  items: {
    type: Array as PropType<
      { title: string; disabled?: boolean; to?: string }[]
    >,
    default: () => [],
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
    default: 'flex-wrap',
  },
  divider: {
    type: String,
    default: '>',
  },
  thickness: {
    type: Number,
    default: 2,
  },
  title: {
    type: String,
    default: '',
  },
  titleStyle: {
    type: String,
    default: '',
  },
  barStyle: {
    type: String,
    default: '',
  },
  itemStyle: {
    type: String,
    default: '',
  },
  backgroundColor: {
    type: String,
    default: '',
  },
});
</script>

<style lang="scss">
.breadcrumb-block {
  .arrow-back {
    text-decoration: none;
  }
  .title {
    color: #5d6872;
    font-weight: 700;
    width: max-content;
  }
  .v-breadcrumbs-divider .divider {
    stroke-width: 1px;
    color: #abb2b9;
  }
  .v-breadcrumbs-item {
    cursor: pointer;
    text-decoration: none !important;
  }
  .v-breadcrumbs-item--disabled {
    color: #abb2b9 !important;
    opacity: 1 !important;
  }
  .v-breadcrumbs-divider .disabled {
    stroke-width: 1px;
    color: #abb2b9;
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
