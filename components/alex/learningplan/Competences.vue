<template>
  <alex-custom-card
    full-width
    :title="title"
    :is-editing="isEditing && canEdit"
    :show-icon="canEdit"
    align-content="align-start"
    show-tooltip
    no-footer
    :tooltip="
      isGeneral
        ? $t('components.competences.general.tooltip')
        : $t('components.competences.technical.tooltip')
    "
    @click:cancel="onCancel"
    @click:save="onSave"
    @toggle:is-editing="isEditing = !isEditing"
  >
    <template #content>
      <div class="gap-3 d-flex flex-column w-100">
        <div v-if="isEditing" class="d-flex flex-column gap-2">
          <alex-inputs-tag-autocomplete
            v-model="temporaryTags"
            name="competence"
            :placeholder="`Digite uma competência ${
              isGeneral ? 'geral' : 'técnica'
            }`"
            :label="`Qual a nova competência ${
              isGeneral ? 'geral' : 'técnica'
            }?`"
            :is-general="isGeneral"
            required
          />
        </div>

        <div class="d-flex flex-column align-start gap-2">
          <div class="d-flex flex-wrap justify-start gap-2">
            <template v-if="temporaryTags.length !== 0">
              <alex-custom-chip
                v-for="(tag, index) in temporaryTags"
                :key="index"
                :text="tag.text"
                :closable="isEditing"
                :uncloseable="isEditing"
                variant="outlined"
                color="#000"
                @click:close="isEditing && onRemove(tag.text)"
              />
            </template>

            <alex-custom-chip
              v-else
              variant="outlined"
              color="#000"
              :text="emptyMessage"
            />
          </div>
        </div>
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
type CompetencesProps = {
  tags: Omit<TagSimple, 'learningplans'>[];
  title: string;
  emptyMessage: string;
  placeholder: string;
  userId: number;
  learningPlanId: number;
  canEdit: boolean;
  isGeneral?: boolean;
};
const props = withDefaults(defineProps<CompetencesProps>(), {
  tags: () => [],
  canEdit: false,
  isGeneral: false,
});
const { setMessage } = useMessageStore();
const i18n = useI18n();
const isEditing = ref(false);
const initialTags = ref<Omit<TagSimple, 'learningplans'>[]>(props.tags);
const temporaryTags = ref<Omit<TagSimple, 'learningplans'>[]>(props.tags);
const client = useStrapiClient();
const onCancel = () => {
  temporaryTags.value = initialTags.value;
  isEditing.value = !isEditing.value;
};
const onSave = async () => {
  const updatedArray: Omit<TagSimple, 'learningplans'>[] = await client(
    `/learningplans/${props.learningPlanId}/tags`,
    {
      method: 'PUT',
      body: {
        tags: temporaryTags.value,
        isGeneral: props.isGeneral,
      },
    },
  );
  initialTags.value = updatedArray;
  temporaryTags.value = updatedArray;
  setMessage(
    i18n.t(
      `components.learningPlan.page.${
        props.isGeneral
          ? 'generalCompetencesUpdated'
          : 'technicalCompetencesUpdated'
      }`,
    ),
    'green',
    true,
  );
  isEditing.value = !isEditing.value;
};
const onRemove = (text?: string) => {
  temporaryTags.value = temporaryTags.value.filter(
    (item) => item.text !== text,
  );
};
</script>
