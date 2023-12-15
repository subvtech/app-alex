<template>
  <div class="tooltip d-flex">
    <slot name="content" />
    <img
      v-if="showIcon"
      class="pl-1"
      src="/svg/tooltip.svg"
      width="24"
      height="24"
    />
    <div v-if="text" class="px-4">
      <span>{{ text }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  text: {
    type: String,
    requrired: true,
  },
  showIcon: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.tooltip {
  position: relative;
  z-index: 999;

  &:hover {
    div {
      display: block !important;
    }
  }
  img:hover + div {
    display: block !important;
  }
  div {
    position: absolute;
    display: none;
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
