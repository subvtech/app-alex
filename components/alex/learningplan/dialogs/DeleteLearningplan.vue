<template>
  <alex-custom-button
    class="button"
    prepend-icon="mdi-trash-can-outline"
    variant="error"
    @click="openDialog = true"
  >
    {{ $t('components.courses.settings.delete.button') }}
    <alex-custom-dialog
      :model-value="openDialog"
      title=""
      body-classes="criticalAttention"
      width="520px"
      :scrollable="false"
      no-footer
    >
      <template #header>
        <alex-custom-dialog-header title="" class="noShow"
      /></template>
      <div class="criticalAttention">
        <div class="exclusionBody">
          <span class="exclusionIMG">
            <img src="@/assets/svg/exclusionImage.svg" alt="attention image" />
          </span>
          <p>
            <span class="header-h4">{{
              $t('components.courses.settings.delete.confirmation')
            }}</span>
            <br />
            <span class="body-p1">{{
              $t('components.courses.settings.delete.description')
            }}</span>
          </p>
          <div class="label d-flex flex-start w-100">
            <label for="exclusionLabel" class="body-p1">
              {{ $t('components.courses.settings.delete.label') }}
              <strong>{{
                $t('components.courses.settings.delete.word')
              }}</strong>
            </label>
          </div>
          <alex-inputs-text-field
            id="exclusionLabel"
            name="placeholder"
            class="w-100"
            required
            :placeholder="$t('components.courses.settings.delete.placeholder')"
          />
        </div>
        <div class="exclusionFooter">
          <alex-custom-button
            class="button"
            :text="$t('components.courses.settings.delete.cancel')"
            variant="secondary"
            @click="() => closeDialog()"
          />
          <alex-custom-button
            class="button error"
            :text="$t('components.courses.settings.delete.word')"
            variant="error"
            @click="() => closeDialog()"
          />
        </div>
      </div>

    </alex-custom-dialog>
  </alex-custom-button>
</template>
<script setup lang="ts">
const openDialog = ref(false);

const closeDialog = () => {
  console.log({ openDialog: openDialog.value });
  openDialog.value = false;
};
</script>

<style scoped lang="scss">
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
</style>
