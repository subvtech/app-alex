<template>
  <div v-if="user" class="header">
    <v-avatar v-if="user.avatar && user.avatar.url">
      <img :src="strapiBaseUrl + user.avatar.url" :alt="user.fullname" />
    </v-avatar>
    <div class="info">
      <span class="fullname">
        {{ user.fullname }}
      </span>

      <span class="role">
        {{ user.isProfessor ? 'Professor' : 'Aluno' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from '../../../models/user.model';

const { findOne } = useStrapi();
const strapiUrl = useStrapiUrl();
const strapiBaseUrl = computed(() => strapiUrl.replace('/api', ''));

const user = ref<User>();
definePageMeta({
  middleware: 'auth',
});

const { id } = useStrapiUser<User>().value;
user.value = await findOne<User>('users', id, { populate: '*' });
console.log({ user: user.value });
</script>

<style lang="scss">
.header {
  display: flex;
  font-family: 'Sen';

  .v-avatar {
    width: 160px;
    height: 160px;
    border: 4px solid #fff;
  }

  .info {
    display: flex;
    justify-content: end;
    flex-direction: column;

    .fullname {
      color: #001529;
      font-size: 24px;
      font-style: normal;
      font-weight: bold;
      line-height: 28px;
    }

    .role {
      color: #abb2b9;
      font-size: 18px;
      font-weight: bold;

      line-height: 22px;
    }
  }
}
</style>
