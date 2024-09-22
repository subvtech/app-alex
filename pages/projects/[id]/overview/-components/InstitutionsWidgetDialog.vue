<script setup lang="ts">
import * as yup from 'yup';
import { get } from '~/utils/get';
import { omit } from '~/utils/omit';
import { onlyNumbers } from '~/utils/only-numbers';

interface InstitutionForm extends Institution {
  userId?: number;
}

interface InstitutionsProps {
  canCreateInstitution: boolean;
  canUpdateInstitution: boolean;
  institution?: Institution | null;
  institutions: Institution[];
  users: StrapiUser[];
}

const emit = defineEmits(['close', 'success']);
const props = defineProps<InstitutionsProps>();

const { t } = useI18n();
const { create, update } = useStrapi();
const { setMessage } = useMessageStore();
const route = useRoute();

const formValid = ref(false);
const openModal = ref(false);
const saving = ref(false);
const formData = ref({} as InstitutionForm);

const learningPlanId = computed(() => {
  return parseInt(route.params?.id.toString());
});

const stepsConfig = {
  step1: {
    title: t('pages.projects.overview.institution_dialog.trade_name'),
    subtitle: t('pages.projects.overview.institution_dialog.information'),
    scheme: yup.object().shape({
      cnpj: yup.string().required(t('pages.projects.overview.institution_dialog.errors.cnpj_required')),
      email: yup
        .string()
        .email(t('pages.projects.overview.institution_dialog.errors.email_invalid'))
        .required(t('pages.projects.overview.institution_dialog.errors.email_required')),
      nomeFantasia: yup.string().required(t('pages.projects.overview.institution_dialog.errors.trade_name_required')),
      razaoSocial: yup
        .string()
        .required(t('pages.projects.overview.institution_dialog.errors.registered_name_required')),
      setor: yup.string().required(t('pages.projects.overview.institution_dialog.errors.sector_required')),
    }),
  },
  step2: {
    title: t('pages.projects.overview.institution_dialog.legal_representative'),
    subtitle: t('pages.projects.overview.institution_dialog.information'),
    scheme: yup.object().shape({
      legalRepresentativeId: yup
        .number()
        .required(t('pages.projects.overview.institution_dialog.errors.legal_representative_required')),
    }),
  },
};

const rules = {
  cnpj: [(v: string) => !!v || t('pages.projects.overview.institution_dialog.errors.cnpj_required')],
  email: [(v: string) => !!v || t('pages.projects.overview.institution_dialog.errors.email_required')],
  sector: [(v: string) => !!v || t('pages.projects.overview.institution_dialog.errors.sector_required')],
  socialName: [(v: string) => !!v || t('pages.projects.overview.institution_dialog.errors.registered_name_required')],
  tradeName: [(v: string) => !!v || t('pages.projects.overview.institution_dialog.errors.trade_name_required')],
};

const formatCNPJ = () => {
  const parsed = onlyNumbers(formData.value.cnpj);
  const formatted = parsed.padStart(14, '0').replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');

  formData.value.cnpj = formatted;
  if (parsed.length === 14) fetchCNPJ(parsed);
};

const fetchCNPJ = async (value: string) => {
  try {
    const res = await fetch(`https://api-publica.speedio.com.br/buscarcnpj?cnpj=${onlyNumbers(value)}`);
    const data = await res.json();

    if (data?.CNPJ) {
      formData.value = {
        ...formData.value,
        address: data.address || `${data['TIPO LOGRADOURO']} ${data.LOGRADOURO}, ${data.BAIRRO}, ${data.MUNICIPIO} - ${data.UF}, ${data.CEP}`, // prettier-ignore
        email: data.EMAIL || data.email,
        name: data['NOME FANTASIA'] || data.nomeFantasia,
        phone: `${data.DDD} ${data.TELEFONE}` || data.phone,
        sector: data.SETOR || data.sector,
        socialName: data['RAZAO SOCIAL'] || data.razaoSocial,
      };
    } else {
      throw new Error(t('pages.projects.overview.institution_dialog.errors.cnpj_not_found'));
    }
  } catch (err) {
    setMessage((err as Error).message, 'red');
  }
};

const handleAfterClose = () => {
  formData.value = {} as InstitutionForm;
  emit('close');
};

const handleSubmit = async () => {
  saving.value = true;

  try {
    // TODO: Criar endpoint de criação de instituição que vincule com o learning plan
    // para garantir que os dados estejam consistentes (adicionar transaction)... Além disso,
    // validar os atributos que podem ser criados/alterados pelo usuário.
    const data = { ...omit('userId', formData.value), users: [formData.value.userId] };
    const res = formData.value.id
      ? await update(`institutions/${formData.value.id}`, data)
      : await create('institutions', data);
    const ids = props.institutions.map(get('id')).concat(res.data.id);

    await update(`learningplans/${learningPlanId.value}`, { institutions: ids });
    openModal.value = false;

    emit('success', {
      ...res.data.attributes,
      id: res.data.id,
      users: props.users.filter((user) => user.id === formData.value.userId),
    });
  } catch (err) {
    setMessage((err as Error).message, 'red');
  } finally {
    saving.value = false;
  }
};

watchEffect(() => {
  if (props.institution) {
    formData.value = { ...props.institution, userId: props.institution.users?.[0]?.id };
    openModal.value = true;
  }
});
</script>

<template>
  <div>
    <alex-custom-button v-if="canCreateInstitution" class="!tw-min-w-fit" :variant="'text'" @click="openModal = true">
      <v-icon>mdi-plus</v-icon>
    </alex-custom-button>
    <v-dialog v-model="openModal" persistent width="50%" @after-leave="handleAfterClose">
      <v-form v-model="formValid" @submit.prevent="handleSubmit">
        <v-card width="100%" class="pa-3">
          <v-card-title class="d-flex justify-space-between align-center font-weight-700">
            {{
              $t('pages.projects.overview.institution_dialog.title', [
                formData.id
                  ? $t('pages.projects.overview.institution_dialog.update')
                  : $t('pages.projects.overview.institution_dialog.add'),
              ])
            }}
            <alex-custom-button class="!tw-min-w-fit" size="default" variant="text" @click="openModal = false">
              <v-icon>mdi-close</v-icon>
            </alex-custom-button>
          </v-card-title>
          <alex-inputs-stepper :loading="saving" :steps-config="stepsConfig" @on-success="handleSubmit">
            <template #step1>
              <v-row justify="start" class="pa-5" dense>
                <v-col cols="12" class="d-flex">
                  <v-col cols="4" class="d-flex flex-column justify-center align-center">
                    <app-user-avatar
                      can-edit
                      can-delete
                      avatar-style="border-radius:10px;"
                      :placeholder="formData.socialName"
                      :profile-picture="formData.cover ? { id: formData.cover.id, url: formData.cover.url } : null"
                      :size="180"
                      :user-id="-1"
                    />
                  </v-col>
                  <v-col cols="8" class="d-flex flex-column">
                    <alex-inputs-text-field
                      v-model="formData.cnpj"
                      required
                      maxlength="18"
                      minlength="14"
                      name="cnpj"
                      :label="$t('pages.projects.overview.institution_dialog.cnpj')"
                      :placeholder="'Ex: 01.234.567/0001-89'"
                      :rules="rules.cnpj"
                      @change="formatCNPJ"
                    />
                    <alex-inputs-text-field
                      v-model="formData.name"
                      required
                      name="nomeFantasia"
                      :label="$t('pages.projects.overview.institution_dialog.trade_name')"
                      :placeholder="'Instituto Federal de Alagoas'"
                      :rules="rules.tradeName"
                    />
                  </v-col>
                </v-col>
                <v-col cols="12">
                  <alex-inputs-text-field
                    v-model="formData.socialName"
                    required
                    name="razaoSocial"
                    :label="$t('pages.projects.overview.institution_dialog.registered_name')"
                    :placeholder="'Ex: Instituto Federal de Alagoas'"
                    :rules="rules.socialName"
                  />
                </v-col>
                <v-col cols="12">
                  <alex-inputs-text-field
                    v-model="formData.email"
                    required
                    name="email"
                    :label="$t('pages.projects.overview.institution_dialog.email')"
                    :placeholder="'Ex: ifal@ifal.edu.br'"
                    :rules="rules.email"
                  />
                </v-col>
                <v-col cols="6">
                  <alex-inputs-text-field
                    v-model="formData.sector"
                    name="setor"
                    required
                    :label="$t('pages.projects.overview.institution_dialog.sector')"
                    :placeholder="'Ex: Educação'"
                    :rules="rules.sector"
                  />
                </v-col>
                <v-col cols="6">
                  <alex-inputs-text-field
                    v-model="formData.phone"
                    minlength="10"
                    name="telefone"
                    maxlength="11"
                    :label="$t('pages.projects.overview.institution_dialog.phone')"
                    :placeholder="'Ex: 3355-7722'"
                  />
                </v-col>
                <v-col cols="12">
                  <alex-inputs-text-field
                    v-model="formData.address"
                    name="endereco"
                    :label="$t('pages.projects.overview.institution_dialog.address')"
                    :placeholder="'Ex: R. Mizael Domingues, 530 - Centro, Maceió - AL, 57020-600'"
                  />
                </v-col>
              </v-row>
            </template>
            <template #step2>
              <v-row justify="start" class="pa-5" dense>
                <v-col cols="12" class="d-flex justify-center align-center">
                  <div class="rounded-circle w-130 h-130 d-flex justify-center align-center upload-container">
                    <app-user-avatar
                      can-edit
                      can-delete
                      avatar-style="border-radius: 10%"
                      :size="180"
                      :profile-picture="formData.cover ? { id: formData.cover.id, url: formData.cover.url } : null"
                      :user-id="formData.userId"
                    />
                  </div>
                </v-col>
                <v-col cols="12">
                  <alex-inputs-select
                    v-model="formData.userId"
                    required
                    name="legalRepresentativeId"
                    :items="users.map((user) => ({ title: user.fullname, value: user.id }))"
                    :label="$t('pages.projects.overview.institution_dialog.legal_representative')"
                    :placeholder="$t('pages.projects.overview.institution_dialog.search_member')"
                  />
                </v-col>
              </v-row>
            </template>
            <template #controls="{ isFirstStep, isValid, loading, onPrevStep }">
              <div class="tw-flex tw-justify-between tw-gap-4 tw-px-5 tw-pb-4">
                <alex-custom-button
                  variant="secondary"
                  :text="t('pages.projects.overview.institution_dialog.cancel')"
                  @click="openModal = false"
                />
                <div class="tw-flex tw-gap-4">
                  <alex-custom-button
                    variant="secondary"
                    :disabled="isFirstStep"
                    :text="t('pages.projects.overview.institution_dialog.back')"
                    @click="onPrevStep"
                  />
                  <alex-custom-button
                    type="submit"
                    :disabled="!isValid || !formData.cnpj || (!isFirstStep && !formData.userId)"
                    :loading="loading"
                    :text="
                      isFirstStep
                        ? $t('pages.projects.overview.institution_dialog.next')
                        : formData.id
                        ? $t('pages.projects.overview.institution_dialog.update')
                        : $t('pages.projects.overview.institution_dialog.add')
                    "
                  />
                </div>
              </div>
            </template>
          </alex-inputs-stepper>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>
