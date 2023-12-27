<template>
  <div>
    <alex-custom-breadcrumbs
      :arrow-back="true"
      title="Configurações"
      :items="[
        { title: 'Início', disabled: false, href: '/' },
        { title: 'Visão Geral', disabled: false, href: '/overview' },
        { title: 'Configurações', disabled: true, href: '/settings' },
      ]"
    />
    <alex-learningplan-settings-banner />

    <alex-learningplan-settings-general :is-trail="isTrail">
      <template #content>
        <alex-inputs-text-field
          id="courseName"
          v-model="trailsTitle"
          name="name"
          class="w-100"
          density="comfortable"
          required
        />
        <alex-inputs-text-area
          id="description"
          v-model="trailsDescription"
          name="description"
          class="w-100"
          density="comfortable"
          required
        />
      </template>
      <template #footer>
        <div class="d-flex w-100 justify-end gap-4">
          <alex-custom-button
            variant="secondary"
            prepend-icon="mdi-close"
            @click="onCancel"
            >{{
              t('components.courses.settings.general.cancel')
            }}</alex-custom-button
          >
          <alex-custom-button
            variant="primary"
            prepend-icon="mdi-check"
            @click="onSave"
            :disabled="theresError"
            >{{
              t('components.courses.settings.general.save')
            }}</alex-custom-button
          >
        </div>
      </template>
    </alex-learningplan-settings-general>
    <alex-learningplan-settings-visibility
      :is-trail="isTrail"
      :title="t('components.trails.settings.visibilityTitle')"
    />
  </div>
</template>
<script setup lang="ts">
const trailsTitle = ref('OI OI OI');
const trailsDescription = ref('lorem ipsum dolor sit amet');

const { t } = useI18n();
const theresError = ref(false);
const isTrail = ref(true);
</script>
<style scoped lang="scss"></style>
