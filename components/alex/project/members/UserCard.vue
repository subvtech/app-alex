<template>
  <div class="d-flex align-center">
    <app-user-avatar :profile-picture="avatar" :placeholder="name" />
    <div class="d-flex flex-column ml-2 text-start">
      <span class="text-body-1 text-dark-gray">{{ name }}</span>
      <span class="text-body-3 email"> {{ email }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Upload } from '~/models/upload.model';

export interface ProjectMemberUserCardProps {
  name: string;
  email: string;
  avatar?: Upload | null;
}

const props = withDefaults(defineProps<ProjectMemberUserCardProps>(), {
  avatar: undefined,
});
</script>

<style lang="scss" scoped>
.email {
  color: #abb2b9;
}
</style>
