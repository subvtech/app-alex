<template>
  <div>
    <alex-learningplan-trails-header
      :trails-title="trailsTitle"
      :trails-description="trailsDescription"
    />
    <div class="container d-flex flex-column">
      <div class="config config-title">
        <p>
          <span class="header-h4">{{ t('pages.trails.settings.title') }}</span>
        </p>
      </div>
      <div class="config">
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
                  t('pages.courses.settings.general.cancel')
                }}</alex-custom-button
              >
              <alex-custom-button
                variant="primary"
                prepend-icon="mdi-check"
                :disabled="theresError"
                @click="onSave"
                >{{
                  t('pages.courses.settings.general.save')
                }}</alex-custom-button
              >
            </div>
          </template>
        </alex-learningplan-settings-general>
        <alex-learningplan-trails-visibility
          :is-trail="isTrail"
          :title="t('pages.trails.settings.visibilityTitle')"
        />
        <alex-learningplan-trails-delete />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const trailsTitle = ref('Roadmap sobre Vue Js');
const trailsDescription = ref(
  'Lorem ipsum dolor sit amet. Ut cupiditate quos et provident iusto et nesciunt amet sed tempore beataLorem ipsum dolor sit amet. Ut cupiditate quos et provident iusto et nesciunt amet sed tempore beata',
);

const { t } = useI18n();
const theresError = ref(false);
const isTrail = ref(true);
</script>
<style scoped lang="scss">
.container {
  display: flex;
}
.config {
  display: flex;
  padding: 24px;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: center !important;
  align-self: stretch;
  width: 100%;
  background-color: #fff;
}

.config-title {
  height: 70px;
  width: 100%;
  flex-wrap: nowrap;
  align-items: flex-start;
  padding: 24px;
  align-self: stretch;
  border-bottom: 1px solid var(--cinza-cinza-100, #ebedef);
}
</style>
