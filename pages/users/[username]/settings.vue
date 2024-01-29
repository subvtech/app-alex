<template>
  <div v-if="user" class="d-flex flex-column flex-md-row gap-6 w-100">
    <alex-profile-settings-basic-info
      :cpf="user.cpf"
      :phone="user.phone"
      :fullname="user.fullname"
      @update="
        (data) => emit('update', data, $t('components.profile.settings.update'))
      "
    />
    <div class="d-flex flex-column gap-6">
      <alex-profile-settings-security :email="user.email" :id="id" />
      <alex-profile-settings-wallet :user-id="id" :wallet="user.user_wallet" />
    </div>
  </div>
</template>

<script setup lang="ts">
const client = useStrapiClient();
const messageStore = useMessageStore();
const emit = defineEmits(['update']);
const loading = ref(false);

definePageMeta({
  middleware: 'auth',
});

const userStore = useUserStore();
const { user } = toRefs(userStore);
const { id } = useStrapiUser<User>().value;
</script>

<style scoped lang="scss">
.gap-6 {
  gap: 24px;
}
</style>
