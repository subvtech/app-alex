<template>
  <alex-custom-dialog
    v-model="open"
    :title="props.editContent ? $t(`${i18Dir}.editTitle`) : $t(`${i18Dir}.createTitle`)"
    :main-button-text="
      props.editContent ? $t(`pages.evaluations.rubrics.edit`) : $t(`pages.evaluations.rubrics.create`)
    "
    :secondary-button-text="$t(`pages.evaluations.rubrics.cancel`)"
    @on-main-action="saveGroup"
    @on-secondary-action="open = false"
    ><alex-inputs-text-field
      v-model="name"
      class="w-100"
      :label="$t(`${i18Dir}.name`)"
      :placeholder="$t(`${i18Dir}.typeName`)"
      variant="outlined"
      size="default"
      density="comfortable"
      required
    />

    <alex-inputs-select
      v-model="selectedCriteria"
      class="w-100"
      :items="criteriaOptions"
      item-title="name"
      item-value="id"
      :label="$t(`${i18Dir}.associatedCriteria`)"
      :placeholder="$t(`${i18Dir}.selectCriteria`)"
      density="comfortable"
      clearable
      @update:model-value="
        (criterion) => {
          if (criterion) {
            criteria = [...new Set([...criteria, criterion])];
          }
          selectedCriteria = undefined;
        }
      "
    />
    <!-- Criteria chips -->
    <div class="d-flex tw-flex-wrap ga-2">
      <alex-custom-chip
        v-for="criterion in criteria"
        :key="criterion"
        :text="criteriaOptions.find(({ id }) => id === criterion)?.name ?? 'a'"
        status="secondary"
        clickable
        closable
        @click:close="
          () => {
            criteria = criteria.filter((id) => id !== criterion);
          }
        "
      />
    </div>
  </alex-custom-dialog>
</template>

<script setup lang="ts">
import { useStrapiUtils } from '~/composables/useStrapiUtils';
import { useMessageStore } from '~/stores/message';

interface ModalProps {
  editContent: null | any;
}

const i18Dir = 'pages.evaluations.groupsSec';

const { setMessage } = useMessageStore();
const { create, update } = useStrapi();
const { find } = useStrapiUtils();
const { t } = useI18n();
const user = useStrapiUser();

const props = defineProps<ModalProps>();

const open = defineModel<boolean>({ required: true });

const emit = defineEmits(['update']);

const name = ref<string>('');
const selectedCriteria = ref<number | undefined>(undefined);
const criteria = ref<any>([]);

const criteriaOptions = ref<any>([]);

const getCriteria = async () => {
  try {
    const res = await find('evaluation-criterias', {
      filters: {
        $or: [{ public: true }, { user: user.value?.id ?? null }],
      },
    });
    criteriaOptions.value = res.data;
  } catch (e) {
    console.error(e);
    setMessage(t(`${i18Dir}.failLoadCriteria`), 'error', true);
  }
};

const saveGroup = () => {
  if (!name.value) {
    setMessage(t(`${i18Dir}.missName`), 'warning', true);
    return;
  }

  if (!criteria.value.length) {
    setMessage(t(`${i18Dir}.missCriteria`), 'error', true);
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
    setMessage(t(`${i18Dir}.editSuccess`), 'success', true);
    emit('update');
  } catch (e) {
    console.error(e);
    setMessage(t(`${i18Dir}.editFail`), 'error', true);
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
      user: user.value?.id ?? null,
    });
    setMessage(t(`${i18Dir}.createSuccess`), 'success', true);
    emit('update');
  } catch (e) {
    console.error(e);
    setMessage(t(`${i18Dir}.createFail`), 'error', true);
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
  criteria.value = props.editContent.evaluation_criterias.map(({ id }) => id);
});
</script>
