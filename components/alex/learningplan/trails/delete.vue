<template>
  <div class="content-area delete">
    <div class="card-title">
      <p>
        <span class="header-h4">{{
          t('components.trails.delete.deleteTrailTitle')
        }}</span>
      </p>
    </div>
    <div class="content-body">
      <p>
        {{ t('components.trails.delete.deleteTrailDescription') }}
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
          {{ t('components.trails.delete.deleteButton') }}
          <alex-custom-dialog
            :model-value="openDialog"
            title=""
            body-classes="criticalAttention"
            width="520px"
            :scrollable="false"
            max-height="500px"
          >
            <template #header>
              <alex-custom-dialog-header title="" class="noShow"
            /></template>
            <div class="criticalAttention">
              <div class="exclusionBody">
                <span class="exclusionIMG">
                  <img
                    src="@/assets/svg/exclusionImage.svg"
                    alt="attention image"
                  />
                </span>
                <p>
                  <span class="header-h4">{{
                    t('components.trails.delete.deleteConfirmation')
                  }}</span>
                  <br />
                  <span class="body-p1">{{
                    t('components.trails.delete.deleteDescription')
                  }}</span>
                </p>
                <div class="label d-flex flex-start w-100">
                  <label for="exclusionLabel" class="body-p1">
                    {{ t('components.trails.delete.deleteLabel') }}
                    <strong>{{
                      t('components.trails.delete.deleteWord')
                    }}</strong>
                  </label>
                </div>
                <alex-inputs-text-field
                  id="exclusionLabel"
                  name="placeholder"
                  class="w-100"
                  required
                  :placeholder="
                    $t('components.trails.delete.deletePlaceholder')
                  "
                />
              </div>
              <div class="exclusionFooter">
                <alex-custom-button
                  class="button"
                  :text="$t('pages.trails.general.cancel')"
                  variant="secondary"
                  @click="openDialog = false"
                />
                <alex-custom-button
                  class="button error"
                  :text="$t('pages.trails.delete.deleteWord')"
                  variant="error"
                  @click="openDialog = false"
                />
              </div>
            </div>
            <template #footer>
              <alex-custom-dialog-footer class="noShow"
            /></template>
          </alex-custom-dialog>
        </alex-custom-button>
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
const openDialog = ref(false);
const { t } = useI18n();
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

.body-p1 {
  font-size: 16px !important;
  font-style: normal !important;
  font-weight: 400 !important;
  line-height: 135%;
  letter-spacing: 0.32px;
  color: var(--cinza-cinza-800, #454d54) !important;
}
.header-h4 {
  color: var(--cinza-cinza-800, #454d54);
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.2px;
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

.criticalAttention {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  justify-content: center;
}

.exclusionBody {
  display: flex;
  min-height: 300px;
  padding: var(--40px, 40px) 24px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  align-self: stretch;
}

.exclusionFooter {
  display: flex;
  min-height: 76px;
  padding: 16px 24px;
  justify-content: center;
  align-items: center;
  gap: 16px;
  align-self: stretch;
  border-top: 1px solid var(--cinza-cinza-100, #ebedef);
}

.noShow {
  display: none;
}
.border-bottom {
  border-bottom: 1px solid var(--cinza-cinza-100, #ebedef);
}

.button {
  color: var(--principais-branco, #fff) !important;
}
</style>
