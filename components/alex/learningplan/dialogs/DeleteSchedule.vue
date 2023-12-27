<template>
  <alex-custom-dialog
    id="DeleteSchedule"
    :model-value="dialog"
    title=""
    body-classes="criticalAttention"
    width="520px"
    :scrollable="false"
    max-height="500px"
    no-footer
  >
    <template #header></template>
    <template #default>
      <div class="d-flex flex-column w-100 align-center bg-white py-10 px-6">
        <img
          src="@/assets/svg/exclusionImage.svg"
          width="80"
          height="80"
          alt="attention image"
        />

        <div class="d-flex flex-column">
          <span class="title">{{
            $t('components.courses.settings.meetings.delete.confirmation')
          }}</span>
          <br />
          <span class="description">{{
            $t('components.courses.settings.meetings.delete.description')
          }}</span>
        </div>
      </div>
      <div class="d-flex w-100 bg-white justify-center py-4 px-6 gap-4">
        <alex-custom-button
          class="button"
          :text="$t('components.courses.settings.meetings.delete.cancel')"
          variant="secondary"
          @click="emit('close')"
        />
        <alex-custom-button
          class="button"
          :text="$t('components.courses.settings.meetings.delete.button')"
          variant="error"
          @click="() => removeFunction()"
        />
      </div>
    </template>
  </alex-custom-dialog>
</template>
<script setup lang="ts">
const emit = defineEmits(['close']);
defineProps({
  removeFunction: {
    type: Function,
    required: true,
  },
  dialog: {
    type: Boolean,
    default: false,
  },
});
</script>
<style scoped lang="scss">
#DeleteSchedule {
  .title {
    color: var(--Cinza-Cinza-800, #454d54);
    text-align: center;

    /* Header/H4 */
    font-family: Sen;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    letter-spacing: 0.2px;
  }

  .d-flex {
    .description {
      color: var(--Cinza-Cinza-600, #6e7a87);
      text-align: center;

      /* Body/P1 */
      font-family: Sen;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 135%; /* 21.6px */
      letter-spacing: 0.32px;
    }
  }
}
</style>
