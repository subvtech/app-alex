<template>
  <div
    class="d-flex align-center"
    :class="{ 'flex-row-reverse': order === 'FIRST_ON_TOP' }"
  >
    <template v-for="(avatar, index) in showPeaple" :key="index">
      <v-avatar
        :size="size"
        :image="avatar.image?.url"
        class="alex-avatar-group-border alex-avatar-group-margin"
        color="gray-100"
      >
        <template v-if="!avatar.image" #default>
          <p class="text-gray-600">
            {{ getLetters(avatar.name) }}
          </p>
        </template>
      </v-avatar>
    </template>

    <v-avatar
      v-if="avatarsNumber && avatarsNumber > 0"
      color="gray-100"
      class="alex-avatar-group-border alex-avatar-group-margin"
      :size="size"
    >
      <span class="text-body-3 text-gray-600">+{{ avatarsNumber }}</span>
    </v-avatar>
  </div>
</template>

<script setup lang="ts">
interface person {
  name: string;
  image?: {
    url: string;
    alt?: string;
  };
}
interface AvatarGroupProps {
  peaple: person[];
  max?: number;
  size?: number;
  order?: 'FIRST_ON_TOP' | 'LAST_ON_TOP';
}
const props = withDefaults(defineProps<AvatarGroupProps>(), {
  max: 4,
  size: 32,
  order: 'LAST_ON_TOP',
});

const avatarsNumber = computed(() => {
  const length = props.peaple.length;
  const exceedNumber = length - props.max;
  return exceedNumber;
});

const showPeaple = computed(() => props.peaple.slice(0, props.max));
</script>

<style scoped>
.alex-avatar-group-border {
  border: 2px solid rgb(var(--v-theme-white)) !important;
}

.alex-avatar-group-margin {
  margin-inline-start: -0.75rem;
}
</style>
