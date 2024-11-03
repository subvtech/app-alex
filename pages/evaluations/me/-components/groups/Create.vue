<template>
  <alex-custom-dialog
    v-model="open"
    :title="props.editContent ? 'Editar grupo' : 'Criar grupo'"
    :main-button-text="
      props.editContent ? $t(`pages.evaluations.rubrics.edit`) : $t(`pages.evaluations.rubrics.create`)
    "
    :secondary-button-text="$t(`pages.evaluations.rubrics.cancel`)"
    @on-main-action="saveGroup"
    @on-secondary-action="open = false"
    ><alex-inputs-text-field
      v-model="name"
      class="w-100"
      label="Nome do grupo"
      placeholder="Digite o nome do grupo"
      variant="outlined"
      size="default"
      density="comfortable"
      required />

    <alex-inputs-select
      v-model="criteria"
      class="w-100"
      :items="criteriaOptions"
      item-title="name"
      item-value="id"
      label="Critérios avaliativos associados"
      placeholder="Selecione os critérios avaliativos"
      density="comfortable"
      clearable
      multiple
  /></alex-custom-dialog>
</template>

<script setup lang="ts">
import { useStrapiUtils } from '~/composables/useStrapiUtils';
import { useMessageStore } from '~/stores/message';

interface ModalProps {
  editContent: null | any;
}

const { setMessage } = useMessageStore();
const { create, update } = useStrapi();
const { find } = useStrapiUtils();

const props = defineProps<ModalProps>();

const open = defineModel<boolean>({ required: true });

const emit = defineEmits(['update']);

const name = ref<string>('');
const criteria = ref<any>([]);

const criteriaOptions = ref<any>([]);

const getCriteria = async () => {
  try {
    const res = await find('evaluation-criterias');
    criteriaOptions.value = res.data;
  } catch (e) {
    console.error(e);
    setMessage('Falha ao pesquisar critérios', 'error', true);
  }
};

const saveGroup = () => {
  if (!name.value) {
    setMessage('Digite um nome para o grupo', 'warning', true);
    return;
  }

  if (!criteria.value.length) {
    setMessage('O grupo precisa de ao menos um critério', 'error', true);
    return;
  }

  props.editContent ? editGroup() : createGroup();
};

const editGroup = async () => {
  try {
    await update('evaluation-groups', props.editContent.id, {
      name: name.value,
      evaluation_criterias: criteria.value,
    });
    setMessage('Grupo editado com sucesso', 'success', true);
    emit('update');
  } catch (e) {
    console.error(e);
    setMessage('Falha ao editar grupo de critérios', 'error', true);
  } finally {
    open.value = false;
  }
};

const createGroup = async () => {
  try {
    await create('evaluation-groups', {
      name: name.value,
      type: 'standard',
      evaluation_criterias: criteria.value,
    });
    setMessage('Grupo de critérios criado com sucesso', 'success', true);
    emit('update');
  } catch (e) {
    console.error(e);
    setMessage('Falha ao criar grupo de critérios', 'error', true);
  } finally {
    open.value = false;
  }
};

onMounted(() => {
  getCriteria();
});

watch(open, (open) => {
  if (!open) {
    name.value = '';
    criteria.value = [];
  }

  if (!props.editContent) {
    return;
  }

  name.value = props.editContent.name;
  criteria.value = props.editContent.evaluation_criterias;
});
</script>
