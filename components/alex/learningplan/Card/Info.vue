<template>
  <div class="d-flex gap-2 align-center justify-start width">
    <alex-custom-chip
      v-if="!avatar"
      size="large"
      :icon="icon"
      variant="outlined"
      status="secondary"
    />
    <v-avatar
      v-else
      :variant="hasImage ? 'flat' : 'outlined'"
      :image="avatar.url"
      :alt="avatar?.alt"
      size="36"
      color="gray-600"
      rounded="lg"
    >
      <template v-if="!hasImage" #default>
        {{ initials }}
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
    title: string;
    subtitle: string | number;
    icon?: string;
    avatar?: {
      name: string;
      url?: string;
      alt?: string;
    };
  }>(),
  { icon: 'mdi-account', avatar: undefined },
);
const initials = computed(() => {
  if (!props.avatar) return 'MN';
  return getInitials(props.avatar?.name);
});

const hasImage = computed(() => !!props.avatar?.url);
</script>

<style scoped>
.width {
  width: fit-content;
}
</style>
