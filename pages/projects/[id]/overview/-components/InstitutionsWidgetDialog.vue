<script setup lang="ts">
import * as yup from 'yup';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { formatCNPJ } from '~/utils/format-cnpj';
import { formatPhone } from '~/utils/format-phone';
import { onlyNumbers } from '~/utils/only-numbers';

interface InstitutionForm extends Institution {
  files?: FileList | null;
  userId?: number;
}

interface InstitutionsProps {
  canCreateInstitution: boolean;
  canUpdateInstitution: boolean;
  institution?: Institution | null;
  institutions: Institution[];
  users: StrapiUser[];
}

const emit = defineEmits(['close', 'update']);
const props = defineProps<InstitutionsProps>();

const { t } = useI18n();
const { setMessage } = useMessageStore();
const strapiClient = useStrapiClient();
const route = useRoute();

const formValid = ref(false);
const openModal = ref(false);
const saving = ref(false);
const form = ref({} as InstitutionForm);
const instImgInput = ref<HTMLInputElement | null>(null);

const learningPlanId = computed(() => {
  return +route.params?.id;
});

const selectedUser = computed(() => {
  return props.users.find((user) => user.id === form.value.userId);
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
      name: yup.string().required(t('pages.projects.overview.institution_dialog.errors.trade_name_required')),
      phone: yup
        .string()
        .test('phone-length', t('pages.projects.overview.institution_dialog.errors.phone_invalid'), (_, item) => {
          if (!item.parent.telefone) return true;
          const { length } = onlyNumbers(item.parent.telefone);
          return length >= 10 && length <= 11; // TODO: Colocar indicação visual no erro da validação do telefone
        }),
      socialName: yup
        .string()
        .required(t('pages.projects.overview.institution_dialog.errors.registered_name_required')),
      sector: yup.string().required(t('pages.projects.overview.institution_dialog.errors.sector_required')),
    }),
  },
  step2: {
    title: t('pages.projects.overview.institution_dialog.legal_representative'),
    subtitle: t('pages.projects.overview.institution_dialog.information'),
    scheme: yup.object().shape({
      userId: yup
        .number()
        .required(t('pages.projects.overview.institution_dialog.errors.legal_representative_required')),
    }),
  },
};

const fetchCNPJ = async (value: string) => {
  try {
    // TODO: Procurar outro serviço de CNPJ
    const res = await fetch(`https://api-publica.speedio.com.br/buscarcnpj?cnpj=${onlyNumbers(value)}`);
    const data = await res.json();

    if (data?.CNPJ) {
      form.value = {
        ...form.value,
        address: data.address || `${data['TIPO LOGRADOURO']} ${data.LOGRADOURO}, ${data.BAIRRO}, ${data.MUNICIPIO} - ${data.UF}, ${data.CEP}`, // prettier-ignore
        email: data.EMAIL || data.email,
        name: data['NOME FANTASIA'] || data.nomeFantasia,
        phone: formatPhone(`(${data.DDD}) ${data.TELEFONE}` || data.phone),
        sector: data.SETOR || data.sector,
        socialName: data['RAZAO SOCIAL'] || data.razaoSocial,
      };
    } else {
      throw new Error(t('pages.projects.overview.institution_dialog.errors.cnpj_not_found'));
    }
  } catch (err) {
    // TODO: Checar porque não funciona
    setMessage((err as Error).message, 'red');
  }
};

const handleAfterClose = () => {
  form.value = {} as InstitutionForm;
  emit('close');
};

const handleFilePick = (event: Event) => {
  const { files } = event.target as HTMLInputElement;

  if (files?.length) {
    const reader = new FileReader();
    form.value.files = files;
    reader.onload = () => {
      form.value.cover = {
        name: files[0].name,
        url: reader.result as string,
      };
    };
    reader.readAsDataURL(files[0]);
  }
};

// TODO: Criar endpoint de criação de instituição que vincule com o learning plan e trate
// o upload de imagem para garantir que os dados estejam consistentes (adicionar transaction).
// Além disso, validar os atributos que podem ser criados/alterados pelo usuário.
const handleSubmit = async () => {
  saving.value = true;

  try {
    const { cover: prevCover } = props.institution || {};
    const { files, userId, ...value } = form.value;
    const formData = new FormData();

    value.phone = onlyNumbers(value.phone);
    formData.append('userId', String(userId));
    for (const key in value) formData.append(key, value[key]);

    if (files?.[0]) {
      formData.append('cover', files[0]);
      formData.append('action', prevCover ? 'update-cover' : 'create-cover');
    } else if (!value.cover && prevCover) {
      formData.append('action', 'remove-cover');
    }

    const url = `learningplans/${learningPlanId.value}/institutions`;
    const res = form.value.id
      ? await strapiClient<Institution>(`${url}/${form.value.id}`, { method: 'PUT', body: formData })
      : await strapiClient<Institution>(url, { method: 'POST', body: formData });

    emit('update', res);
    openModal.value = false;
  } catch (err) {
    // TODO: Checar porque não funciona
    setMessage((err as Error).message, 'red');
  } finally {
    saving.value = false;
  }
};

watchEffect(() => {
  if (props.institution) {
    form.value = {
      ...props.institution,
      cnpj: formatCNPJ(props.institution.cnpj),
      phone: formatPhone(props.institution.phone),
      userId: props.institution.institution_users.find((v) => v.role === 'representative')?.user.id,
    };
    openModal.value = true;
  }
});

watchEffect(() => {
  const cnpj = onlyNumbers(form.value.cnpj);
  if (cnpj.length === 14 && form.value.cnpj !== props.institution?.cnpj) fetchCNPJ(cnpj);
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
                form.id
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
                  <v-col cols="4" class="tw-flex tw-p-4 tw-items-center tw-justify-center">
                    <div class="tw-relative tw-flex tw-overflow-hidden tw-size-[175px] tw-text-center">
                      <input
                        ref="instImgInput"
                        type="file"
                        accept="image/*"
                        class="tw-hidden"
                        @change="handleFilePick"
                      />
                      <img
                        v-if="form.cover"
                        class="tw-border-[1px] tw-border-solid tw-flex-1 tw-object-cover tw-rounded-full"
                        :src="form.cover.url"
                      />
                      <div
                        v-else
                        :class="[
                          'tw-border-2 tw-border-dashed tw-cursor-pointer tw-rounded-full',
                          'tw-flex tw-flex-1 tw-flex-col tw-items-center tw-justify-center',
                        ]"
                        @click="!form.cover && instImgInput?.click()"
                      >
                        <v-icon class="tw-text-slate-300" size="64">mdi-image</v-icon>
                        <span class="tw-mx-4 tw-text-sm tw-text-slate-400">
                          Clique aqui para adicionar uma imagem
                        </span>
                      </div>
                      <div
                        v-if="form.cover"
                        :class="[
                          'tw-absolute tw-inset-0 tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-rounded-full',
                          'tw-bg-black/50 tw-opacity-0 hover:tw-opacity-100 tw-transition-opacity !tw-duration-500',
                        ]"
                        @click.stop="instImgInput?.click()"
                      >
                        <v-icon class="tw-text-white tw-mr-1 tw-mt-[1px]" size="small">mdi-pencil</v-icon>
                      </div>
                      <alex-custom-button
                        v-if="form.cover"
                        class="!tw-absolute !tw-bottom-2 !tw-right-2 !tw-min-w-fit !tw-min-h-fit"
                        size="small"
                        variant="error"
                        style="padding: 6px 6px !important"
                        @click.stop="form.cover = null"
                      >
                        <img src="/svg/trash.svg" width="20" height="20" />
                      </alex-custom-button>
                    </div>
                  </v-col>
                  <v-col cols="8" class="d-flex flex-column">
                    <alex-inputs-text-field
                      v-model="form.cnpj"
                      required
                      maxlength="18"
                      minlength="14"
                      name="cnpj"
                      :label="$t('pages.projects.overview.institution_dialog.cnpj')"
                      :placeholder="'01.234.567/0001-89'"
                      @input="form.cnpj = formatCNPJ(form.cnpj)"
                    />
                    <alex-inputs-text-field
                      v-model="form.name"
                      required
                      name="name"
                      :label="$t('pages.projects.overview.institution_dialog.trade_name')"
                      :placeholder="'Instituto Federal de Alagoas'"
                    />
                  </v-col>
                </v-col>
                <v-col cols="12">
                  <alex-inputs-text-field
                    v-model="form.socialName"
                    required
                    name="socialName"
                    :label="$t('pages.projects.overview.institution_dialog.registered_name')"
                    :placeholder="'Ex: Instituto Federal de Alagoas'"
                  />
                </v-col>
                <v-col cols="12">
                  <alex-inputs-text-field
                    v-model="form.email"
                    required
                    name="email"
                    :label="$t('pages.projects.overview.institution_dialog.email')"
                    :placeholder="'Ex: ifal@ifal.edu.br'"
                  />
                </v-col>
                <v-col cols="6">
                  <alex-inputs-text-field
                    v-model="form.sector"
                    required
                    name="sector"
                    :label="$t('pages.projects.overview.institution_dialog.sector')"
                    :placeholder="'Ex: Educação'"
                  />
                </v-col>
                <v-col cols="6">
                  <alex-inputs-text-field
                    v-model="form.phone"
                    name="phone"
                    :label="$t('pages.projects.overview.institution_dialog.phone')"
                    :placeholder="'(12) 3456-7890'"
                    @input="form.phone = formatPhone(form.phone)"
                  />
                </v-col>
                <v-col cols="12">
                  <alex-inputs-text-field
                    v-model="form.address"
                    name="address"
                    :label="$t('pages.projects.overview.institution_dialog.address')"
                    :placeholder="'Ex: R. Mizael Domingues, 530 - Centro, Maceió - AL, 57020-600'"
                  />
                </v-col>
              </v-row>
            </template>
            <template #step2>
              <v-row justify="start" class="pa-5" dense>
                <v-col cols="12" class="d-flex justify-center align-center">
                  <Avatar size="lg">
                    <AvatarImage :src="selectedUser?.avatar?.url || ''" :alt="selectedUser?.fullname" />
                    <AvatarFallback class="tw-text-2xl tw-text-slate-500">
                      {{ getInitials(selectedUser?.fullname || '') }}
                    </AvatarFallback>
                  </Avatar>
                </v-col>
                <v-col cols="12">
                  <alex-inputs-select
                    v-model="form.userId"
                    required
                    name="userId"
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
                    :disabled="!isValid || !form.cnpj || (!isFirstStep && !form.userId)"
                    :loading="loading"
                    :text="
                      isFirstStep
                        ? $t('pages.projects.overview.institution_dialog.next')
                        : form.id
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
