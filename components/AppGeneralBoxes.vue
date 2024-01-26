<template>
  <div
    class="boxes d-flex justify-center w-100 pb-6 gap-4"
    :class="hideDivider ? '' : 'border-bottom'"
  >
    <alex-profile-box-item
      v-for="(item, index) in boxes"
      :key="index"
      :icon="item.icon"
      :label="item.label"
      :number="item.number"
    />
  </div>
</template>
<script setup lang="ts">
import { BoxItemType } from '@/components/alex/profile/BoxItem.vue';

defineProps({
  boxes: {
    type: Array as PropType<BoxItemType[]>,
    default: [],
  },
  hideDivider: {
    type: Boolean,
    default: false,
  },
});
</script>
<style scoped lang="scss">
.boxes {
  &.border-bottom {
    border-bottom: 1px solid #eaeef1;
  }
}
@media (max-width: 450px) {
  .boxes {
    flex-direction: column;
    align-items: center;
  }
}
</style>
