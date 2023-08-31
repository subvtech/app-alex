<template>
  <div id="Card" class="d-flex flex-column">
    <div class="foretitle d-flex pa-6">
      <span>{{ title }}</span>
    </div>
    <div class="d-flex flex-column pa-6">
      <slot name="content" />
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const { title } = toRefs(props);
</script>

<style lang="scss">
#Card {
  background-color: white;
  font-family: Sen;
  min-width: 400px;
  border-radius: 8px;
  .foretitle {
    align-items: center;
    align-self: stretch;
    border-bottom: 1px solid #eaeef1;
    span {
      color: #5d6872;
      font-size: 20px;
      font-weight: 700;
      line-height: 24px;
    }
  }
}
</style>
