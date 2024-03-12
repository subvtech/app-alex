<template>
  <alex-custom-button
    class="button"
    prepend-icon="mdi-trash-can-outline"
    variant="error"
    @click="openDialog = true"
  >
    {{ $t(`components.${props.namespace}.settings.delete.button`) }}
    <alex-custom-dialog
      :model-value="openDialog"
      title=""
      body-classes="criticalAttention"
      width="520px"
      :scrollable="false"
      no-footer
    >
      <template #header></template>
      <div class="criticalAttention">
        <div class="exclusionBody px-6 pt-10 pb-5">
          <span class="exclusionIMG">
            <img src="@/assets/svg/exclusionImage.svg" alt="attention image" />
          </span>
          <div class="d-flex flex-column gap-4 w-80">
            <div class="d-flex flex-column align-center text-center gap-2">
              <span class="header-h4">{{
                $t(`components.${namespace}.settings.delete.confirmation`)
              }}</span>
              <span class="body-p1">{{
                $t(`components.${namespace}.settings.delete.description`)
              }}</span>
            </div>

            <div class="d-flex flex-column gap-2">
              <div class="label d-flex flex-start w-100">
                <label for="exclusionLabel" class="body-p1">
                  {{ $t(`components.${namespace}.settings.delete.label`) }}
                  <strong>{{
                    $t(`components.${namespace}.settings.delete.word`)
                  }}</strong>
                </label>
              </div>
              <alex-inputs-text-field
                v-model="value"
                name="word"
                class="w-100"
                required
                :placeholder="
                  $t(`components.${namespace}.settings.delete.placeholder`)
                "
                :error-messages="errorMessage"
              />
            </div>
          </div>
        </div>
        <div class="exclusionFooter">
          <alex-custom-button
            class="button"
            :text="$t(`components.${namespace}.settings.delete.cancel`)"
            variant="secondary"
            size="large"
            @click="() => closeDialog()"
          />
          <alex-custom-button
            class="button error"
            :text="$t(`components.${namespace}.settings.delete.word`)"
            variant="error"
            size="large"
            :disabled="theresError"
            @click="onUpdate"
          />
        </div>
      </div>
    </alex-custom-dialog>
  </alex-custom-button>
</template>
<script setup lang="ts">
import { useField } from 'vee-validate';
import * as yup from 'yup';

const i18n = useI18n();
const emit = defineEmits(['update']);

const props = defineProps({
  namespace: {
    type: String as PropType<'courses' | 'trails'>,
    default: 'courses',
  },
});

const openDialog = ref(false);

const closeDialog = () => {
  openDialog.value = false;
};
const regex = new RegExp(
  `^${i18n.t(`components.${props.namespace}.settings.delete.word`)}$`,
);

const wordSchema = yup
  .string()
  .matches(regex, i18n.t(`components.${props.namespace}.settings.delete.match`))
  .required(i18n.t(`components.${props.namespace}.settings.delete.match`))
  .trim();

const { value, errorMessage } = useField('word', wordSchema, {
  initialValue: '',
});

const onUpdate = () => {
  closeDialog();
  emit('update');
};

const theresError = computed(
  () => typeof errorMessage.value === 'string' || value.value === '',
);
</script>

<style scoped lang="scss">
.w-80 {
  width: 320px;
}
.criticalAttention {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  justify-content: center;
}

.body-p1 {
  font-size: 16px !important;
  font-style: normal !important;
  font-weight: 400 !important;
  line-height: 135%;
  letter-spacing: 0.32px;
  color: var(--cinza-cinza-800, #454d54) !important;
}

.exclusionBody {
  display: flex;
  min-height: 300px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  align-self: stretch;
}

.header-h4 {
  color: var(--cinza-cinza-800, #454d54);
  font-size: 20px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.2px;
}
.header-h5 {
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
  letter-spacing: 0.36px;
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
