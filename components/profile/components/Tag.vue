<template>
  <div class="item d-flex justify-center align-center">
    <span>{{ text }}</span>
    <v-icon
      v-if="isEditing"
      size="16"
      color="#6E7A87"
      @click="removeAction"
      style="cursor: pointer"
      >mdi-close</v-icon
    >
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  text: {
    type: String,
    required: true,
  },

  isEditing: {
    type: Boolean,
    default: false,
  },
  removeTag: { type: Function, default: () => {} },
});

const { removeTag, isEditing } = toRefs(props);

const removeAction = () => {
  removeTag.value();
};
</script>

<style scoped lang="scss">
.item {
  padding-inline: 8px;
  gap: 4px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid var(--cinza-cinza-500, #8291a1);

  span {
    color: #6e7a87;
    /* Body/P3 */
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.28px;
  }
}
</style>
