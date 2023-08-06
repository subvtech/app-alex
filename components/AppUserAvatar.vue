<template>
  <v-avatar v-if="user.avatar && user.avatar.url">
    <img :src="user.avatar.url" :alt="user.fullname" />
  </v-avatar>
  <v-avatar v-else color="accent">
    <span class="text-white text-h5">{{ userInitials }}</span>
  </v-avatar>
</template>
<script>
import { getFullnameInitials } from "@/helpers/utils";

export default {
  name: "AppUserAvatar",
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    userInitials() {
      return getFullnameInitials(this.user.fullname);
    },
  },
};
</script>
