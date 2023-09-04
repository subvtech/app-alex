<template>
  <div id="Card" class="d-flex flex-column" :class="fullWidth ? 'w-100' : ''">
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
  fullWidth: {
    type: Boolean,
    default: false,
  },
});

const { title } = toRefs(props);
</script>

<style lang="scss">
#Card {
  background-color: white;
  font-family: Sen;
  width: 450px;
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
@media (max-width: 800px) {
  #Card {
    width: 100%;
  }
}
</style>
