<template>
  <div class="content-area delete">
    <div class="card-title">
      <p>
        <span class="text-h4 text-gray-800">{{
          t('components.trails.settings.delete.deleteTrailTitle')
        }}</span>
      </p>
    </div>
    <div class="content-body">
      <p>
        {{ t('components.trails.settings.delete.deleteTrailDescription') }}
      </p>
    </div>
    <div class="footer-content">
      <span class="action-content">
        <alex-custom-button
          class="button"
          prepend-icon="mdi-trash-can-outline"
          variant="error"
          @click="openDialog = true"
        >
          {{ t('components.trails.settings.delete.deleteButton') }}
          <alex-learningplan-dialogs-alert
            :model-value="openDialog"
            :title="$t('components.trails.settings.delete.deleteConfirmation')"
            :subtitle="
              $t('components.trails.settings.delete.deleteDescription')
            "
            :image="imageProp"
            :submit-button-text="
              $t('components.trails.settings.delete.deleteWord')
            "
            :input-word-confirmation="
              $t('components.trails.settings.delete.deleteWord')
            "
            :input-label-confirmation="
              $t('components.trails.settings.delete.deleteLabel')
            "
            :input-placeholder-confirmation="
              $t('components.trails.settings.delete.deletePlaceholder')
            "
            :no-input-confirmation="false"
            variant="error"
            :word-confirmation="wordConfirmation"
            :error-message-text="
              $t('components.trails.settings.delete.matchError')
            "
            @submit="removeTrail"
            @cancel="openDialog = false"
          />
        </alex-custom-button>
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
const openDialog = ref(false);
const { delete: _delete } = useStrapi();
const { setMessage } = useMessageStore();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { trailId } = route.params;

const imageProp = {
  src: 'https://i.ibb.co/PQpmJGH/exclusion-Image.png',
  alt: t('components.trails.settings.delete.deleteImgAlt'),
  width: 114,
  height: 102,
};

const wordConfirmation = ref('');
async function removeTrail() {
  await _delete('trails', parseInt(trailId.toString()));

  router.push(`/courses/me`);
  setMessage(t('components.trails.settings.delete.update'), 'green', true);
}
</script>
<style lang="scss" scoped>
.content-area {
  display: flex;
  max-width: 850px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
  border-radius: 8px !important;
  border: 1px solid var(--cinza-cinza-200, #d2d6da) !important;
  background: var(--principais-branco, #fff);
  margin-top: 24px;
}

.content-body {
  display: flex;
  padding: 24px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  align-self: stretch;
}
.card-title {
  display: flex;
  height: 72px;
  padding: 16px 18px 16px 24px;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-bottom: 1px solid var(--cinza-cinza-100, #ebedef);
}

p {
  color: var(--cinza-cinza-400, #a0a8b1);
  text-align: center;
  font-family: Sen;
}

.footer-content {
  display: flex;
  padding: 16px 24px;
  justify-content: flex-end;
  align-items: center !important;
  gap: 16px;
  align-self: stretch;
  border-top: 1px solid var(--cinza-cinza-100, #ebedef);
}

.action-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 24px;
  align-self: stretch;
}
</style>
