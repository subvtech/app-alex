<template>
  <alex-custom-dialog
    v-model="modal"
    :activator="parentActivator ? 'parent' : undefined"
    :title="
      !data
        ? $t('components.learningPlan.dialogs.createClass')
        : $t('components.learningPlan.dialogs.editClass')
    "
    body-classes="pa-0 bg-white rounded-b-lg"
    no-footer
  >
    <v-form @submit="onSubmit">
      <div class="pa-6">
        <alex-inputs-text-field
          name="className"
          density="comfortable"
          :label="$t('components.learningPlan.dialogs.whatClassName')"
          :placeholder="$t('components.learningPlan.dialogs.typeClassName')"
          required
        />
        <alex-inputs-autocomplete
          name="responsible"
          density="comfortable"
          :label="$t('components.learningPlan.dialogs.whosIsClassResponsible')"
          :placeholder="$t('components.learningPlan.dialogs.selectResponsible')"
          required
          :items="responsibles"
          item-title="fullname"
          return-object
        >
          <template #item="{ props: propsItem, item, index }">
            <alex-custom-list-item-user
              v-bind="propsItem"
              :key="index"
              :user="{
                email: item.raw.email,
                name: item.raw.fullname,
              }"
              no-delete
              no-checkbox
            />
          </template>
        </alex-inputs-autocomplete>
        <alex-inputs-users-autocomplete
          v-if="!noSelectUsers"
          v-model="members"
          name="members"
          :label="$t('components.learningPlan.dialogs.whoAreClassParticipants')"
          :placeholder="
            $t('components.learningPlan.dialogs.selectClassPartipant')
          "
          :ignore-user-ids="ignoreUserIds"
          :ignore-emails="ignoreUserEmails"
        />
      </div>

      <alex-custom-dialog-footer>
        <template #mainSlotButton>
          <alex-custom-button
            type="submit"
            size="large"
            :loading="loadingSubmit"
            :text="
              $t(
                `components.learningPlan.dialogs.${
                  !data ? 'createClass' : 'save'
                }`,
              )
            "
            :prepend-icon="!data ? 'mdi-plus' : 'mdi-check'"
          />
        </template>
        <template #secondarySlotButton>
          <alex-custom-button
            :text="$t('components.courses.meeting.cancel')"
            variant="secondary"
            size="large"
            prepend-icon="mdi-close"
            @click="modal = false"
          />
        </template>
      </alex-custom-dialog-footer>
    </v-form>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import { LearningClassType } from './create/index.vue';
type ClassDialogProps = {
  noSelectUsers?: boolean;
  closeDialogOnSubmit?: boolean;
  loadingSubmit?: boolean;
  ignoreUserIds?: number[];
  ignoreUserEmails?: string[];
  parentActivator?: boolean;
};

const props = withDefaults(defineProps<ClassDialogProps>(), {
  noSelectUsers: false,
  closeDialogOnSubmit: true,
  loadingSubmit: false,
  ignoreUserIds: () => [],
  ignoreUserEmails: () => [],
  parentActivator: true,
});

const emit = defineEmits(['submit']);
const modal = defineModel<boolean>({ required: true });
const data = defineModel<LearningClassType | null>('data', {
  default: null,
});
const classes = defineModel<LearningClassType[]>('classes', {
  default: [],
});
const { createEditClassRules } = useFormRules();
const members = ref([]);
const alreadyHasClassName = ref<LearningClassType>();
// @ts-ignore
const { handleSubmit, setValues, setFieldError, resetForm } = useForm({
  initialValues: {
    className: data.value?.name,
    responsible: data.value?.in_charge_member || null,
  },
  validationSchema: createEditClassRules,
  keepValuesOnUnmount: false,
});
const onSubmit = handleSubmit(({ className, responsible }) => {
  const membersValue = JSON.parse(JSON.stringify(members.value));
  alreadyHasClassName.value = classes.value.find(
    (item) => item.name === className,
  );
  if (
    alreadyHasClassName.value &&
    alreadyHasClassName.value.id !== data.value?.id
  ) {
    setFieldError('className', 'Já existe essa turma');
    return;
  }
  emit('submit', {
    name: className,
    in_charge_member: responsible,
    schedules: data.value?.schedules || [],
    learning_plan_members: membersValue,
    id: data.value?.id || Math.round(Math.random() * 123_456_789),
  });

  if (props.closeDialogOnSubmit) {
    modal.value = false;
  }
});

const owner = useStrapiUser();
const { find } = useStrapi<User>();
const { data: responsiblesData } = await useAsyncData(
  'collaborators',
  () =>
    find<UserSimple>('users', {
      filters: {
        role: {
          name: 'Professor',
        },
      },
    }) as unknown as Promise<UserSimple[]>,
  {
    transform: (value) =>
      value.map((user) => ({
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        avatar: user.avatar,
      })),
  },
);
const responsibles = computed(() => {
  const hasOwner = responsiblesData.value?.find(
    (responsible) => responsible.id === owner.value?.id,
  );
  if (!hasOwner && owner.value && responsiblesData.value) {
    const ownerItem = {
      id: owner.value.id,
      email: owner.value.email,
      // @ts-ignore
      fullname: owner.value.fullname,
      // @ts-ignore
      avatar: owner.value.avatar,
    };
    return [...responsiblesData.value, ownerItem];
  }
  return responsiblesData.value;
});
onUpdated(() => {
  if (data.value) {
    setValues({
      className: data.value.name,
      responsible: data.value.in_charge_member,
    });
    return;
  }
  resetForm();
});
</script>
