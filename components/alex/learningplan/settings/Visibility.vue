<template>
  <alex-custom-card
    :title="$t('components.courses.settings.visibility.title')"
    :show-icon="false"
  >
    <template #content>
      <div class="container-radio">
        <div class="radioButtons">
          <alex-inputs-radio-button
            v-model="activeButton"
            :buttons="firstButton"
            :text="$t('pages.courseSettings.config.showButton')"
          />
          <alex-inputs-radio-button
            v-model="activeButton"
            :buttons="secondButton"
          />
        </div>
      </div>

      <div class="footer-content">
        <span class="action-content-two">
          <alex-custom-button
            class="button"
            :text="$t('pages.courseSettings.config.cancelButton')"
            variant="secondary"
          />
          <alex-custom-button
            class="button"
            :text="$t('pages.courseSettings.config.saveButton')"
            variant="primary"
          />
        </span>
      </div>
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts"></script>
