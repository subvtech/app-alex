<template>
  <profile-components-general
    :email="email ?? 'no-email'"
    :telephone="phone"
    :socials="socials"
    :institutions="institutions"
    :technicalTags="technicalTags"
    :generalTags="generalTags"
    :info="info ?? ''"
    :user-id="strapiUser.id"
    :can-edit="canEdit"
    @update:user="(message) => updateUser(true, message)"
  />
</template>
<script setup lang="ts">
const userStore = useUserStore();
const {
  email,
  phone,
  socials,
  username,
  id,
  fullname,
  cover,
  avatar,
  isProfessor,
  institutions,
  tags,
  info,
  canEdit,
} = toRefs(userStore);

const generalTags = ref();
const technicalTags = ref();
const { updateUser } = useUpdateStrapi();

const strapiUser = useStrapiUser<User>().value;

generalTags.value = tags.value.filter((item) => item.isGeneral);
technicalTags.value = tags.value.filter((item) => !item.isGeneral);
</script>
<style scoped lang="scss">
</style>
