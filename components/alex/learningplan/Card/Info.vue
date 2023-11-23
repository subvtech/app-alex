<template>
  <div class="d-flex gap-2 align-center justify-start width">
    <alex-custom-chip
      v-if="!image"
      size="large"
      :icon="'mdi-account'"
      variant="outlined"
      color="gray-600"
    />
    <v-avatar
      v-else
      :variant="hasImage ? 'flat' : 'outlined'"
      size="36"
      color="gray-600"
      :image="image?.url"
      rounded="lg"
    >
      <template v-if="!hasImage" #default>
        {{ letters }}
      </template>
    </v-avatar>
    <div class="d-flex flex-column">
      <h4 class="text-body-4 text-gray-800">{{ title }}</h4>
      <p class="text-body-3 text-gray-600">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    icon?: string;
    image?: { url?: string; name: string };
    title: string;
    subtitle: string | number;
  }>(),
  { icon: 'mdi-account', image: undefined },
);

const letters = computed(() => {
  const names = props.image?.name.split(' ');
  if (!names) return 'NM';
  if (names.length >= 2) return names[0][0] + names[1][0];
  return names[0][0];
});

const hasImage = computed(() => !!props.image?.url);
</script>

<style scoped>
.width {
  width: fit-content;
}
</style>
