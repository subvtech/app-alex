<template>
  <div
    v-if="user && isCurrentUser"
    class="d-flex flex-column flex-md-row gap-6 w-100"
  >
    <alex-profile-settings-basic-info
      v-model:cpf="user.cpf"
      v-model:phone="user.phone"
      v-model:fullname="user.fullname"
      @update="
        (data) =>
          emit(
            'update',
            { ...data },
            [],
            $t('components.profile.settings.update'),
          )
      "
    />
    <div class="d-flex flex-column gap-6 w-100">
      <alex-profile-settings-security :id="id" :email="user.email" />
      <alex-profile-settings-wallet
        :wallet="user.user_wallet"
        :is-loading="loading"
        full-width
        @update:wallet="linkWallet(id)"
        @remove:wallet="(walletId) => unlinkWallet(walletId)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['update']);

const { linkWallet, unlinkWallet, loading } = useMetamask();

definePageMeta({
  middleware: 'auth',
});

const router = useRouter();
const userStore = useUserStore();
const { user, isCurrentUser } = toRefs(userStore);

if (!isCurrentUser.value) router.push(`/users/${user.value?.username}`);
const { id } = useStrapiUser<User>().value;
</script>

<style scoped lang="scss">
.gap-6 {
  gap: 24px;
}
</style>
