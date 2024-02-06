<template>
  <div v-if="user" class="d-flex flex-column flex-md-row gap-6 w-100">
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
    <div class="d-flex flex-column gap-6">
      <alex-profile-settings-security :id="id" :email="user.email" />
      <alex-profile-settings-wallet
        :wallet="user.user_wallet"
        @update:wallet="linkWallet(id)"
        @remove:wallet="(walletId) => unlinkWallet(walletId)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['update']);
const loading = ref(false);

const { linkWallet, unlinkWallet } = useMetamask(loading);

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
