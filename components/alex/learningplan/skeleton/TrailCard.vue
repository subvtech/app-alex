<template>
  <v-card
    data-testid="trails-card"
    :min-width="width.min"
    :max-width="width.max"
    :class="{
      'vertical-grid': isVertical,
      'horizontal-grid column-gap-4 card': !isVertical,
    }"
    variant="outlined"
    color="gray-100"
    rounded="lg"
    class="grid bg-white"
  >
    <div class="header">
      <alex-custom-skeleton color="gray-200" class="w-100 h-100" />
    </div>
    <div
      class="d-flex flex-column gap-3 justify-space-around"
      :class="{
        'py-2': !isVertical,
        'pa-4 pb-6': isVertical,
      }"
    >
      <div
        class="d-flex gap-2 align-center justify-space-between flex-wrap"
        :class="{ 'max-width-85': !isVertical }"
      >
        <alex-custom-skeleton
          color="gray-200"
          class="w-100 height-3"
          rounded="lg"
        />

        <div v-if="!isVertical" class="align-self-start"></div>
      </div>

      <div
        class="text-body-5 text-gray-600 ellipsis lines-3 d-flex gap-2 flex-wrap"
        lines="three"
        :class="{ 'max-width-85': !isVertical }"
      >
        <alex-custom-skeleton
          color="gray-200"
          class="w-100 height-2"
          rounded="lg"
        />
        <alex-custom-skeleton
          color="gray-200"
          class="w-100 height-2"
          rounded="lg"
        />
        <alex-custom-skeleton
          color="gray-200"
          class="w-100 height-2"
          rounded="lg"
        />
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
const direction = useDirection('mobile');
const isVertical = computed(() => direction.value === 'VERTICAL');
const width = computed(() =>
  isVertical.value ? { min: 240, max: 260 } : { min: 300, max: 350 },
);
</script>

<style scoped lang="scss">
.card {
  min-height: 175px;
}
.grid {
  display: grid;
  align-content: stretch;
  height: fit-content;
}

.vertical-grid {
  grid-template-rows: 150px 1fr;
  grid-template-columns: 1fr;
}

.horizontal-grid {
  grid-template-columns: 120px 1fr auto;
  grid-template-rows: 1fr;
}

.header {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.favorite,
.hidden-icon,
.options,
.hover {
  position: absolute;
}

.hidden-icon {
  bottom: 16px;
  right: 16px;
  z-index: 1;
}

.options {
  top: 16px;
  right: 16px;
}

.hover {
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0005;
  transition: background 300ms ease-in-out;
}

.hidden {
  visibility: hidden;
}

.grayscale {
  filter: grayscale(100%);
}
.grayscale-2 {
  filter: grayscale(100%);
  opacity: 0.6;
}

.column-gap-4 {
  column-gap: 16px;
}

.documents {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(var(--v-theme-gray-600));
  border: 1px solid #fff;
  border-color: rgb(var(--v-theme-gray-100));
  padding: 8px;
  gap: 8px;
  border-radius: 8px;
  width: fit-content;
}

.max-height-48 {
  max-height: 48px;
}

.max-width-80 {
  max-width: 125px;
}

.hover-shadow {
  box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.1);
}
</style>
