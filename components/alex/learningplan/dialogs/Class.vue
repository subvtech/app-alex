<template>
  <alex-custom-dialog
    v-model="model"
    activator="parent"
    title="Adicionar nova turma"
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
                  !noSelectUsers ? 'createClass' : 'addClass'
                }`,
              )
            "
            :prepend-icon="'mdi-plus'"
          />
        </template>
        <template #secondarySlotButton>
          <alex-custom-button
            :text="$t('components.courses.meeting.cancel')"
            variant="secondary"
            size="large"
            prepend-icon="mdi-close"
            @click="model = false"
          />
        </template>
      </alex-custom-dialog-footer>
    </v-form>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
type ClassData = { className: string; responsible: number } | null;
type ClassDialogProps = {
  noSelectUsers?: boolean;
};
const { noSelectUsers = true } = defineProps<ClassDialogProps>();
const emit = defineEmits(['submit']);
const model = ref(false);
const data = defineModel<ClassData>('data', {
  default: null,
});
const { createEditClassRules } = useFormRules();
const members = ref([]);
const { handleSubmit } = useForm({
  initialValues: {
    className: data.value?.className,
    responsible: data.value?.responsible,
  },
  validationSchema: createEditClassRules,
});
const onSubmit = handleSubmit(({ className, responsible }) => {
  const membersValue = JSON.parse(JSON.stringify(members.value));
  emit('submit', { className, responsible, members: membersValue });
});
const owner = useStrapiUser();
const { find } = useStrapi();
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
    };
    return [...responsiblesData.value, ownerItem];
  }
  return responsiblesData.value;
});
</script>
