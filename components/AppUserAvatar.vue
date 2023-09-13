<template>
  <v-avatar v-if="user.avatar && user.avatar.url">
    <img :src="user.avatar.url" :alt="user.fullname" />
  </v-avatar>
  <v-avatar v-else color="accent">
    <span class="text-white text-h5">{{ userInitials }}</span>
  </v-avatar>
</template>
<script setup lang="ts">
import { User } from 'models/user.model';
const { fetchUser } = useStrapiAuth();
const user = await fetchUser();

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true,
  },
});

console.log({ user });

const userInitials = computed(() => {
  return getFullnameInitials(props.user.fullname);
});
</script>
