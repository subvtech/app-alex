<template>
  <profile-card title="Detalhes">
    <template v-slot:content>
      <div class="boxes d-flex pb-6">
        <div
          class="box d-flex flex-column pa-4"
          v-for="box in [
            {
              icon: 'mdi-bookmark-box-multiple-outline',
              number: 9,
              label: 'Cursos',
            },
            {
              icon: 'mdi-newspaper-variant-multiple-outline',
              number: 20,
              label: 'Projetos',
            },
            { icon: 'mdi-check-decagram', number: 62, label: 'Tarefas' },
          ]"
        >
          <v-icon color="#00B8CC">{{ box.icon }}</v-icon>
          <div class="d-flex flex-column">
            <h6>{{ box.number }}</h6>
            <span>{{ box.label }}</span>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:footer>
      <div class="d-flex flex-column contacts pt-6 pb-4">
        <div
          class="d-flex align-center contact"
          v-for="contact in [
            {
              title: 'E-MAIL',
              text: 'email@gmail.com',
              icon: 'mdi-email-outline',
            },
            {
              title: 'TELEFONE',
              text: '(82) 99876-5432',
              icon: 'mdi-phone-outline',
            },
          ]"
        >
          <v-icon color="#5D6872">{{ contact.icon }}</v-icon>
          <div class="d-flex flex-column justify-center align-start field">
            <p>{{ contact.title }}</p>
            <span>{{ contact.text }}</span>
          </div>
        </div>
      </div>
      <div class="d-flex contacts pt-6 pb-4">
        <div
          class="d-flex align-center contact"
          v-for="contact in [
            {
              title: 'WEBSITE',
              text: 'lattes.cnpq.br',
              icon: 'assets/svg/website.svg',
            },
            {
              title: 'LINKEDIN',
              text: '/jojo',
              icon: 'assets/svg/linkedin.svg',
            },
            {
              title: 'INSTAGRAM',
              text: '@jojo',
              icon: 'assets/svg/instagram.svg',
            },
            {
              title: 'YOUTUBE',
              text: '@jojotube',
              icon: 'assets/svg/youtube.svg',
            },
          ]"
        >
          <img
            class="icon"
            :alt="contact.title"
            :src="`/_nuxt/${contact.icon}`"
          />
          <div class="d-flex flex-column justify-center align-start field">
            <p>{{ contact.title }}</p>
            <span>{{ contact.text }}</span>
          </div>
        </div>
      </div>
    </template>
  </profile-card>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.boxes {
  align-items: flex-end;
  gap: 16px;
  align-self: stretch;
  border-bottom: 1px solid #eaeef1;
  .box {
    min-width: 90px;
    min-height: 90px;
    width: 33%;
    gap: 16px;
    align-items: flex-start;
    border-radius: 8px;
    border: 1px solid #e1e4e7;
    background-color: #f1f5f9;

    div h6 {
      font-size: 24px;
      color: #001529;
    }

    div span {
      font-size: 16px;
      font-weight: 400;
      line-height: 22px;
      color: #abb289;
    }
  }
}

.contacts {
  gap: 16px;
  border-bottom: 1px solid #eaeef1;
  flex-direction: column;
  .contact {
    gap: 16px;
    .icon {
      width: 24px;
      height: 24px;
      path {
        fill: #5d6872;
      }
    }
    .field {
      gap: 4px;
      p {
        color: #abb2b9;
        font-size: 14px;
        font-weight: 400;
      }

      span {
        color: #5d6872;
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
      }
    }
  }
}
@media (max-width: 800px) {
  .contacts {
    flex-wrap: wrap;
    flex-direction: row;
    .contact {
      max-width: 130px;
    }
  }
}
</style>
