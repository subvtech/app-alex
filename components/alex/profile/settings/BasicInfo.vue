<template>
  <alex-custom-card
    class="basic-info"
    :title="$t('components.profile.settings.title')"
    :show-icon="false"
    align-content="align-center"
    full-width
  >
    <template #content>
      <div class="d-flex w-100 max-w-200">
        <div color="black" class="d-flex flex-column w-100">
          <alex-inputs-text-field
            :label="$t('components.profile.settings.fullname')"
            :model-value="computedFullname"
            name="fullname"
            class=""
          />
          <div class="block gap-6 d-flex">
            <alex-inputs-text-field
              v-maska:[phoneMask]
              :placeholder="$t('components.profile.settings.phonePlaceholder')"
              :label="$t('components.profile.settings.phone')"
              name="phone"
              :model-value="computedTelephone"
              class="w-100"
            />

            <alex-inputs-text-field
              :model-value="cpf"
              :placeholder="$t('pages.register.cpfHolder')"
              label="CPF"
              variant="solo"
              flat
              readonly
              name="cpf"
              class="w-100"
            />
          </div>
          <div class="buttons d-flex justify-end gap-4">
            <alex-custom-button
              variant="secondary"
              size="large"
              @click="onCancel"
            >
              {{ $t('components.profile.settings.cancel') }}</alex-custom-button
            >
            <alex-custom-button
              variant="primary"
              size="large"
              type="submit"
              :disabled="theresError"
              @click="onSave"
            >
              {{ $t('components.profile.settings.save') }}
            </alex-custom-button>
          </div>
        </div>
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
export interface BasicInfoComponentType {
  cpf: string;
  fullname: string;
  phone?: string;
}

export interface BasicInfoEmits {
  (e: 'update', value: { fullname: string; phone: string }): void;
}

const props = withDefaults(defineProps<BasicInfoComponentType>(), {
  phone: undefined,
});

const emit = defineEmits<BasicInfoEmits>();

const { phone, cpf, fullname } = toRefs(props);

const { find } = useStrapiUtils();

const { t } = useI18n();
const { profileSchema } = useFormRules();
const phoneMask = {
  mask: '(##) #####-####',
  eager: true,
};

const computedFullname = ref(props.fullname);
const computedTelephone = ref(props.phone);

const { handleSubmit, errors, values, setErrors, setValues } = useForm({
  validationSchema: profileSchema,
  keepValuesOnUnmount: true,
});

const onCancel = () => {
  setValues({ phone: props.phone, fullname: props.fullname });
  computedTelephone.value = props.phone;
  computedFullname.value = props.fullname;
};

const theresError = computed(() => Object.keys(errors.value).length !== 0);

const onSave = handleSubmit(async () => {
  const userPhone = values.phone.replace(/[^0-9]/g, '');
  const isPhoneTaken = await find('users', { filters: { phone: userPhone } });
  if (isPhoneTaken.data.length !== 0 && userPhone !== props.phone) {
    setErrors({ phone: t('components.profile.settings.phoneDuplicated') });
    return;
  }
  emit('update', {
    fullname: values.fullname,
    phone: userPhone,
  });
});

watch([fullname, phone], () => {
  computedFullname.value = fullname.value;
  if (phone?.value) computedTelephone.value = phone.value;
});
</script>
<style scoped lang="scss">
.max-w-200 {
  max-width: 800px;
}
</style>
