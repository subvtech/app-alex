<template>
  <div
    class="card w-[150px] h-[100px] rounded-lg overflow-hidden cursor-pointer bg-cover d-flex align-end elevation-1"
    :class="{ cardHover: edit && !deleteButton }"
    :style="`background-image: url('${cover}')`"
    @click="emit('openTrail')"
  >
    <alex-custom-button
      v-if="deleteButton"
      class="delete-btn rounded-l"
      variant="secondary"
      size="small"
      icon="mdi-trash-can-outline"
      @click.stop="emit('delete')"
    />
    <div class="text-shadow height-15 w-100 d-flex align-end">
      <p class="ellipsis lines-2 text-body-6 text-white mx-2 my-4">
        {{ title }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface CardProps {
  title: string;
  cover?: string;
  edit?: boolean;
  deleteButton?: boolean;
}

const emit = defineEmits(['delete', 'openTrail']);

withDefaults(defineProps<CardProps>(), {
  cover: '/images/cover_image_course.svg',
  edit: false,
});
</script>

<style scoped>
.card {
  position: relative;
  background-position: center;
  min-width: 150px;
  transition:
    box-shadow 0.5s,
    transform 0.3s;
}

.text-shadow {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 10.81%,
    rgba(0, 0, 0, 0.37) 48.72%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

.cardHover:hover {
  transform: scale(1.05);
}

.delete-btn {
  position: absolute !important;
  top: 8px;
  right: 8px;
}
</style>
