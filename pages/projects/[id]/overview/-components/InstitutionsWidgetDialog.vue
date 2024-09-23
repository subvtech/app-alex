<script setup lang="ts">
import * as yup from 'yup';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';
import { formatCNPJ } from '~/utils/format-cnpj';
import { formatPhone } from '~/utils/format-phone';
import { get } from '~/utils/get';
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

const emit = defineEmits(['close', 'success']);
const props = defineProps<InstitutionsProps>();

const { t } = useI18n();
const { create, update } = useStrapi();
const { setMessage } = useMessageStore();
const { removeImage, updateImage, uploadImage } = useUploadedImage();
const route = useRoute();

const formValid = ref(false);
const openModal = ref(false);
const saving = ref(false);
const formData = ref({} as InstitutionForm);
const instImgInput = ref<HTMLInputElement | null>(null);

const learningPlanId = computed(() => {
  return +route.params?.id;
});

const selectedUser = computed(() => {
  return props.users.find((user) => user.id === formData.value.userId);
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
      phone: yup
        .string()
        .test('phone-length', t('pages.projects.overview.institution_dialog.errors.phone_invalid'), (_, item) => {
          if (!item.parent.telefone) return true;
          const { length } = onlyNumbers(item.parent.telefone);
          return length >= 10 && length <= 11; // TODO: Colocar indicação visual no erro da validação do telefone
        }),
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
        phone: formatPhone(`(${data.DDD}) ${data.TELEFONE}` || data.phone),
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

const handleFileUpload = (event: Event) => {
  const { files } = event.target as HTMLInputElement;

  if (files?.length) {
    const reader = new FileReader();
    formData.value.files = files;
    reader.onload = () => {
      formData.value.cover = {
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
    const { files, userId, ...value } = formData.value;

    const image = await (async (): Promise<Upload | null | void> => {
      if (value.cover && !prevCover?.id) {
        return (await uploadImage({ target: { files } } as never))[0];
      } else if (value.cover && prevCover?.id) {
        return await updateImage({ target: { files } } as never, prevCover!.id!);
      } else if (!value.cover && prevCover?.id) {
        await removeImage(prevCover.id);
        return null;
      }
    })();

    value.cover = image?.id as never;
    value.phone = onlyNumbers(value.phone);
    value.users = [userId] as never;

    const res = formData.value.id
      ? await update(`institutions/${formData.value.id}`, value)
      : await create('institutions', value);

    if (!props.institutions.find((v) => v.id === res.data.id)) {
      const ids = props.institutions.map(get('id')).concat(res.data.id);
      await update(`learningplans/${learningPlanId.value}`, { institutions: ids });
    }

    openModal.value = false;

    emit('success', {
      ...res.data.attributes,
      cover: image,
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
    formData.value = {
      ...props.institution,
      cnpj: formatCNPJ(props.institution.cnpj),
      phone: formatPhone(props.institution.phone),
      userId: props.institution.users?.[0]?.id,
    };
    openModal.value = true;
  }
});

watchEffect(() => {
  const cnpj = onlyNumbers(formData.value.cnpj);
  if (cnpj.length === 14 && formData.value.cnpj !== props.institution?.cnpj) fetchCNPJ(cnpj);
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
                  <v-col cols="4" class="tw-flex tw-p-4 tw-items-center tw-justify-center">
                    <div class="tw-relative tw-flex tw-overflow-hidden tw-size-[175px] tw-text-center">
                      <input
                        ref="instImgInput"
                        type="file"
                        accept="image/*"
                        class="tw-hidden"
                        @change="handleFileUpload"
                      />
                      <img
                        v-if="formData.cover"
                        class="tw-border-[1px] tw-border-solid tw-flex-1 tw-object-cover tw-rounded-full"
                        :src="formData.cover.url"
                      />
                      <div
                        v-else
                        :class="[
                          'tw-border-2 tw-border-dashed tw-cursor-pointer tw-rounded-full',
                          'tw-flex tw-flex-1 tw-flex-col tw-items-center tw-justify-center',
                        ]"
                        @click="!formData.cover && instImgInput?.click()"
                      >
                        <v-icon class="tw-text-slate-300" size="64">mdi-image</v-icon>
                        <span class="tw-mx-4 tw-text-sm tw-text-slate-400">
                          Clique aqui para adicionar uma imagem
                        </span>
                      </div>
                      <div
                        v-if="formData.cover"
                        :class="[
                          'tw-absolute tw-inset-0 tw-cursor-pointer tw-flex tw-items-center tw-justify-center tw-rounded-full',
                          'tw-bg-black/50 tw-opacity-0 hover:tw-opacity-100 tw-transition-opacity !tw-duration-500',
                        ]"
                        @click.stop="instImgInput?.click()"
                      >
                        <v-icon class="tw-text-white tw-mr-1 tw-mt-[1px]" size="small">mdi-pencil</v-icon>
                      </div>
                      <alex-custom-button
                        v-if="formData.cover"
                        class="!tw-absolute !tw-bottom-2 !tw-right-2 !tw-min-w-fit !tw-min-h-fit"
                        size="small"
                        variant="error"
                        style="padding: 6px 6px !important"
                        @click.stop="formData.cover = null"
                      >
                        <img src="/svg/trash.svg" width="20" height="20" />
                      </alex-custom-button>
                    </div>
                  </v-col>
                  <v-col cols="8" class="d-flex flex-column">
                    <alex-inputs-text-field
                      v-model="formData.cnpj"
                      required
                      maxlength="18"
                      minlength="14"
                      name="cnpj"
                      :label="$t('pages.projects.overview.institution_dialog.cnpj')"
                      :placeholder="'01.234.567/0001-89'"
                      @input="formData.cnpj = formatCNPJ(formData.cnpj)"
                    />
                    <alex-inputs-text-field
                      v-model="formData.name"
                      required
                      name="nomeFantasia"
                      :label="$t('pages.projects.overview.institution_dialog.trade_name')"
                      :placeholder="'Instituto Federal de Alagoas'"
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
                  />
                </v-col>
                <v-col cols="12">
                  <alex-inputs-text-field
                    v-model="formData.email"
                    required
                    name="email"
                    :label="$t('pages.projects.overview.institution_dialog.email')"
                    :placeholder="'Ex: ifal@ifal.edu.br'"
                  />
                </v-col>
                <v-col cols="6">
                  <alex-inputs-text-field
                    v-model="formData.sector"
                    name="setor"
                    required
                    :label="$t('pages.projects.overview.institution_dialog.sector')"
                    :placeholder="'Ex: Educação'"
                  />
                </v-col>
                <v-col cols="6">
                  <alex-inputs-text-field
                    v-model="formData.phone"
                    name="telefone"
                    :label="$t('pages.projects.overview.institution_dialog.phone')"
                    :placeholder="'(12) 3456-7890'"
                    @input="(formData.phone = formatPhone(formData.phone)), console.log(formData.phone)"
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
                  <Avatar size="lg">
                    <AvatarImage :src="selectedUser?.avatar?.url || ''" :alt="selectedUser?.fullname" />
                    <AvatarFallback class="tw-text-2xl tw-text-slate-500">
                      {{ getInitials(selectedUser?.fullname || '') }}
                    </AvatarFallback>
                  </Avatar>
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
