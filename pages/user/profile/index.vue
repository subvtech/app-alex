<template>
  <div id="profile" class="w-100 d-flex" v-if="user">
    <div class="header w-100">
      <span class="title h-">Perfil do usuário</span>
      <div class="pages d-flex h-100">
        <span class="go-back" style="cursor: pointer">Home</span>
        <span class="go-back">></span>
        <span class="current-page">Perfil do usuário</span>
      </div>
    </div>
    <div class="user-block my-6">
      <img class="cover" src="https://picsum.photos/1800/500" alt="" />
      <div class="card">
        <div class="photo">
          <div class="avatar" v-if="user.avatar && user.avatar.url">
            <img :src="strapiBaseUrl + user.avatar.url" :alt="user.fullname" />
          </div>
          <v-icon class="edit" color="black" small title="Editar"
            >mdi-pencil-outline</v-icon
          >
        </div>

        <div class="info">
          <div>
            <span class="fullname">
              {{ user.fullname }}
            </span>
            <span class="social"> @jojozap </span>
          </div>

          <span class="role">
            {{ user.isProfessor ? 'Professor' : 'Aluno' }}
          </span>
        </div>
      </div>
      <div class="menu d-flex">
        <span
          :class="selectedOption === link ? 'selected' : ''"
          @click="selectedOption = link"
          v-for="link in links"
        >
          {{ link }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { User } from '../../../models/user.model';

const { findOne } = useStrapi();
const strapiUrl = useStrapiUrl();
const strapiBaseUrl = computed(() => strapiUrl.replace('/api', ''));

const user = ref<any>();
definePageMeta({
  middleware: 'auth',
});

const { id } = useStrapiUser<User>().value;
user.value = await findOne<User>('users', id, { populate: '*' });
console.log(typeof user.value, { user: user.value });

const selectedOption = ref('Visão geral');
const links = ref([
  'Visão geral',
  'Cursos',
  'Projetos',
  'Tarefas',
  'Eventos',
  'Configurações',
]);
</script>

<style lang="scss">
#profile {
  flex-direction: column;
  font-family: 'Sen';
  height: 100%;

  .header {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    align-self: stretch;
    height: 44px;

    .title {
      color: #5D6872;
      font-size: 24px;
      font-weight: bold;
      line-height: 28px;
      padding-right: 16px;
    }

    .pages {
      padding-left: 16px;
      gap: 12px;
      align-items: center;
      border-left: 1px solid #e1e4e7;
      .go-back {
        color: #abb2b9;
        font-size: 14px;
        font-weight: 400;
        line-height: normal;
      }

      .current-page {
        color: #5d6872;
        font-size: 14px;
        font-weight: 400;
        line-height: normal;
      }
    }
  }

  .user-block {
    background-color: white;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 0px;
    .card {
      display: flex;
      flex-direction: row;
      width: 100%;
      padding-inline: 40px;
      gap: 12px;

      .photo {
        display: flex;
        position: relative;
        .avatar {
          display: flex;
          align-items: flex-end;
          img {
            max-width: 160px;
            max-height: 160px;

            aspect-ratio: 1 / 1; /* defining the aspect ratio of the image */
            object-fit: cover;
            border-top-left-radius: 4px;
            border-top-right-radius: 4px;
            border: solid #fff;
            margin-top: -80px;
            border-radius: 100%;
          }
        }

        .edit {
          display: flex;
          width: 32px;
          height: 32px;
          padding: 10px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 10px;
          right: 0px;
          bottom: 32px;
          position: absolute;
          border-radius: 99px;
          border: 1px solid #abb2b9;
          background: #f1f5f9;
          cursor: pointer;
        }
      }

      .info {
        display: flex;
        flex-direction: column;
        margin-block: 16px;

        .fullname {
          color: #001529;
          font-size: 24px;
          font-style: normal;
          font-weight: bold;
          line-height: 28px;
        }

        .social {
          color: #abb2b9;
          font-size: 24px;
          font-weight: 400;
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
    .cover {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 300px;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    .menu {
      border-top: 1px solid #eaeef1;
      gap: 24px;
      padding-inline: 24px;
      margin-top: 18px;
      span {
        color: #5d6872;
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
        cursor: pointer;
        padding-block: 16px;
        &:hover {
          color: #279ee3;
        }
      }

      .selected {
        color: #279ee3;
        border-bottom: 2px solid #279ee3;
      }
    }
  }
}
</style>
