<template>
  <v-avatar v-if="avatarUrl">
    <NuxtImg class="img" provider="strapi" :src="avatarUrl" placeholder />
  </v-avatar>
  <v-avatar v-else color="accent">
    <span class="text-white text-h5">{{ userInitials }}</span>
  </v-avatar>
</template>
<script setup lang="ts">
const props = defineProps({
  avatarUrl: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
});

const userInitials = computed(() => {
  return getFullnameInitials(props.fullname);
});
</script>

<style scoped lang="scss">
.v-avatar {
  border: 1px solid #a0a8b1;
}
.img {
  aspect-ratio: 1 / 1 !important;
  object-fit: cover !important;
  max-width: 100%;
  max-height: 100%;
}
</style>
