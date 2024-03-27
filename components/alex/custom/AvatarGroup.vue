<template>
  <div
    class="d-flex align-center"
    :class="{ 'flex-row-reverse': order === 'FIRST_ON_TOP' }"
    data-testid="alex-avatar-group"
  >
    <template v-for="({ name, image }, index) in avatarsToShow" :key="index">
      <v-avatar
        data-testid="alex-avatar"
        :size="size"
        :image="image?.url"
        class="alex-avatar-group-border alex-avatar-group-margin"
        color="gray-100"
      >
        <template v-if="!image" #default>
          <p class="text-gray-600">
            {{ getInitials(name) }}
          </p>
        </template>
      </v-avatar>
    </template>

    <v-avatar
      v-if="exceedingAvatarCount && exceedingAvatarCount > 0"
      color="gray-100"
      class="alex-avatar-group-border alex-avatar-group-margin"
      :size="size"
    >
      <span class="text-body-3 text-gray-600">+{{ exceedingAvatarCount }}</span>
    </v-avatar>
  </div>
</template>

<script setup lang="ts">
interface AvatarImageType {
  url: string;
  alt?: string;
}
interface avatar {
  name: string;
  image?: AvatarImageType;
}
interface AvatarGroupProps {
  avatarItems: avatar[];
  max?: number;
  size?: number;
  order?: 'FIRST_ON_TOP' | 'LAST_ON_TOP';
}
const props = withDefaults(defineProps<AvatarGroupProps>(), {
  max: 4,
  size: 32,
  order: 'LAST_ON_TOP',
});

const exceedingAvatarCount = computed(() => {
  const length = (props.avatarItems || []).length;
  const exceedNumber = length - props.max;
  return exceedNumber;
});

const avatarsToShow = computed(() => {
  return (props.avatarItems || []).slice(0, props.max);
});
</script>

<style scoped>
.alex-avatar-group-border {
  border: 2px solid rgb(var(--v-theme-white)) !important;
}

.alex-avatar-group-margin {
  margin-inline-start: -0.75rem;
}
</style>
