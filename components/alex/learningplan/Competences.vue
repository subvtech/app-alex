<template>
  <alex-custom-card
    full-width
    :title="title"
    :is-editing="isEditing && canEdit"
    :show-icon="canEdit"
    :cancel="onCancel"
    :save="onSave"
    align-content="align-start"
    show-tooltip
    :tooltip="
      isGeneral
        ? $t('components.competences.general.tooltip')
        : $t('components.competences.technical.tooltip')
    "
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
const { create } = useStrapiUtils();
const { setMessage } = useMessageStore();
const i18n = useI18n();
const strapi = useStrapi();
const isEditing = ref(false);
const initialTags = ref<Omit<TagSimple, 'learningplans'>[]>(props.tags);
const temporaryTags = ref<Omit<TagSimple, 'learningplans'>[]>(props.tags);

const updateLocalTag = (serverTag: Omit<TagSimple, 'learningplans'>) => {
  const index = temporaryTags.value.findIndex((t) => t.text === serverTag.text);
  temporaryTags.value[index] = serverTag;
};
const createTags = async (tags: Omit<TagSimple, 'learningplans'>[]) => {
  const promises = tags
    .filter((tag) => !tag.id)
    .map(({ text }) =>
      create<Omit<TagSimple, 'learningplans'>>('tags', {
        text,
        verified: true,
        isGeneral: props.isGeneral,
        verified_by: props.userId,
        isPublic: false,
        ...(props.learningPlanId && {
          learningplans: {
            connect: [props.learningPlanId],
          },
        }),
      }),
    );

  const createTags = await Promise.all(promises);
  createTags.forEach((tag) => {
    updateLocalTag(tag.data);
  });
  initialTags.value = temporaryTags.value;
};
const deleteTags = () => {
  const deletedTags = initialTags.value.filter(
    (selectedTag) =>
      !temporaryTags.value.find((tag) => tag.text === selectedTag.text),
  );
  if (deletedTags.length === 0) return;
  const deletedPromises = deletedTags
    .filter((tag) => tag.id)
    .map((tag) => {
      if (tag.isPublic) {
        return strapi.update(`tags/${tag.id}`, {
          learningplans: {
            disconnect: [props.learningPlanId],
          },
        });
      }
      return strapi.delete('tags', tag.id);
    });
  Promise.all(deletedPromises);
};
const updatePublicTags = (tags: Omit<TagSimple, 'learningplans'>[]) => {
  const serverTags = tags.filter((tag) => tag.isPublic);
  const updatedTagsPromises = serverTags.map((tag) =>
    strapi.update(`tags/${tag.id}`, {
      learningplans: {
        connect: [props.learningPlanId],
      },
    }),
  );
  Promise.all(updatedTagsPromises);
};
const onCancel = () => {
  temporaryTags.value = initialTags.value;
};
const onSave = async () => {
  deleteTags();
  await createTags(temporaryTags.value);
  updatePublicTags(initialTags.value);
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
};
const onRemove = (text?: string) => {
  temporaryTags.value = temporaryTags.value.filter(
    (item) => item.text !== text,
  );
};
</script>
