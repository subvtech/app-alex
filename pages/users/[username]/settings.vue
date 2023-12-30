<template>
  <profile-settings
    :email="email ?? ''"
    :cpf="cpf ?? ''"
    :telephone="phone"
    :fullname="fullname ?? ''"
    :id="strapiUser.id"
    @update:user="updateUser(true, $t('components.profile.settings.update'))"
  />
</template>

<script setup lang="ts">
import { User } from '@/models/user.model';
const { updateUser } = useUpdateUserStore();

definePageMeta({
  middleware: 'auth',
});

const router = useRouter();
const userStore = useUserStore();

const {
  email,
  phone,
  id,
  cpf,
  fullname,
  socials,
  institutions,
  tags,
  info,
  canEdit,
} = toRefs(userStore);

const strapiUser = useStrapiUser<User>().value;

//if (!canEdit.value) router.push({ path: '/' });
</script>

<style scoped lang="scss"></style>
