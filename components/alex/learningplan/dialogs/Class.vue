<template>
  <alex-custom-dialog
    v-model="modal"
    activator="parent"
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
          label="Qual o nome da turma?"
          placeholder="Digite o nome da turma"
          required
        />
        <alex-inputs-autocomplete
          name="responsible"
          density="comfortable"
          label="Quem será o responsável pela turma?"
          placeholder="Selecione o responsável"
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
          label="Quem serão os participantes da turma?"
          placeholder="Selecione os participantes para a turma"
        />
      </div>

      <alex-custom-dialog-footer>
        <template #mainSlotButton>
          <alex-custom-button
            type="submit"
            size="large"
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
type ClassData = { id: number; className: string; responsible: number } | null;
type ClassDialogProps = {
  noSelectUsers?: boolean;
};
const { noSelectUsers = true } = defineProps<ClassDialogProps>();
const emit = defineEmits(['submit']);
const modal = defineModel<boolean>({ required: true });
const data = defineModel<ClassData>('data', {
  default: null,
});
const { createEditClassRules } = useFormRules();
const members = ref([]);
const { handleSubmit, setValues } = useForm({
  initialValues: {
    className: data.value?.className,
    responsible: data.value?.responsible,
  },
  validationSchema: createEditClassRules,
});
const onSubmit = handleSubmit(({ className, responsible }) => {
  const membersValue = JSON.parse(JSON.stringify(members.value));
  const id = data.value?.id || Math.round(Math.random() * 12_345_68);
  emit('submit', {
    id,
    className,
    responsible,
    members: membersValue,
  });
  modal.value = false;
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
watch(data, (value) => {
  if (value) {
    setValues({ className: value.className, responsible: value.responsible });
  }
});
</script>
