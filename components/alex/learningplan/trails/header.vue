<template>
  <div>
    <alex-custom-breadcrumbs
      :arrow-back="true"
      title="Configurações"
      :items="[
        { title: 'Início', disabled: false, href: '/' },
        { title: 'Visão Geral', disabled: false, href: '/overview' },
        { title: 'Configurações', disabled: false, href: '/settings' },
      ]"
    />
    <div
      style="
        background-color: #fff;
        border-radius: 8px 8px 8px 8px !important;
        margin: 24px 0;
      "
    >
      <v-container fluid class="header">
        <v-row class="header-row">
          <v-col cols="2" width="200px">
            <img
              :src="trailsCover || '/images/cover_image_course.svg'"
              alt="Imagem da trilha"
              class="trailImg"
            />
          </v-col>
          <v-col cols="9">
            <v-row>
              <v-col class="header-text">
                <span class="header-h3">{{ trailsTitle }}</span>
                <span class="body-p1" style="width: 100%">{{
                  trailsDescription
                }}</span>
                <alex-custom-chip
                  text="Jornada Individual"
                  prepend-icon="mdi-check"
                  :size="'x-small'"
                  :status="'dark'"
                  >{{ t('pages.trails.settings.chip') }}</alex-custom-chip
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
      <alex-custom-tabs v-model="activePage" :tabs="tabs" class="customTabs" />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  trailsTitle: {
    type: String,
    required: true,
  },
  trailsDescription: {
    type: String,
    required: true,
  },
  trailsCover: {
    type: String,
    required: true,
  },
});

const activePage = ref('1');
const tabs = [
  { label: 'Visão Geral', value: '1' },
  { label: 'Tarefas', value: '2' },
  { icon: 'mdi-cog-outline', label: '', value: '4' },
];
</script>
<style scoped lang="scss">
.header {
  display: flex;
  padding: 24px;
  justify-content: flex-end;
  align-items: flex-start;
  align-content: flex-start;
  align-self: stretch;
  flex-wrap: wrap;
}
.header-h3 {
  overflow: hidden;
  color: var(--Cinza-Cinza-800, #454d54);
  text-overflow: ellipsis;
  /* Header/H3 */
  font-family: Sen;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.body-p1 {
  font-family: Sen;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; /* 21.6px */
  letter-spacing: 0.32px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  align-self: stretch;
  color: var(--Cinza-Cinza-600, #6e7a87);
}

.trailImg {
  display: flex;
  width: 200px !important;
  height: 150px !important;
  justify-content: flex-end !important;
  align-items: flex-start !important;
  border-radius: 12px !important;
}

.header-text {
  display: flex;
  padding: 12px 24px;
  gap: 8px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
}

.customTabs {
  border-top: 1px solid var(--cinza-cinza-100, #ebedef);
}
</style>
