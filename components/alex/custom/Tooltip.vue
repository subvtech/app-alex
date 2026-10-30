<template>
  <div class="tooltip d-flex">
    <slot name="content" />
    <img
      v-if="showIcon"
      class="pl-1 z-index-999"
      src="/svg/tooltip.svg"
      width="24"
      height="24"
    />
    <div v-if="text" class="px-4 z-index-999" :class="extraClasses ?? ''">
      <span>{{ text }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  text: {
    type: String,
  },
  showIcon: {
    type: Boolean,
    default: false,
  },
  extraClasses: {
    type: String,
  },
});
</script>

<style scoped lang="scss">
.z-index-999 {
  z-index: 999;
}
.tooltip {
  position: relative !important;
  &:hover {
    .px-4 {
      display: block !important;
    }
  }

  img:hover + .px-4 {
    display: block !important;
  }
  .px-4 {
    position: absolute;
    display: none;
    z-index: 999;
    top: 120%;
    left: 50%;
    transform: translateX(-50%);
    color: var(--principais-branco, #fff);

    max-width: 300px;
    width: max-content;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 6.5px 16px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    background: var(--cinza-cinza-800, #454d54);
    box-shadow: 0px 4px 10px 0px rgba(0, 0, 0, 0.15);

    span {
      color: var(--principais-branco, #fff);

      font-size: 14px;
      font-weight: 400;
      letter-spacing: 0.28px;
    }
  }
}
</style>
