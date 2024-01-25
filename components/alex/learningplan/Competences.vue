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
export type CompetenceTag = Pick<
  TagSimple,
  'id' | 'isGeneral' | 'text' | 'verified_by' | 'isPublic'
> & { learningplanId: number };
type CompetencesProps = {
  tags: CompetenceTag[];
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
const strapi = useStrapi();
const { create } = useStrapiUtils();
const isEditing = ref(false);
const selectedTags = ref<CompetenceTag[]>(props.tags);
const temporaryTags = ref<CompetenceTag[]>(props.tags);

const updateLocalTag = (
  localTags: CompetenceTag[],
  serverTag: Partial<TagSimple>,
) => {
  localTags.map((localTag) => {
    if (localTag.text === serverTag.text) {
      return serverTag;
    }
    return localTag;
  });
};
const createTags = async (tags: CompetenceTag[]) => {
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

  const createTags = await Promise.allSettled(promises);
  createTags.forEach((tag) => {
    if (tag.status === 'fulfilled') {
      updateLocalTag(selectedTags.value, tag.value.data);
    }
  });
};
const deleteTags = async () => {
  const deletedTags = selectedTags.value.filter(
    (selectedTag) =>
      !temporaryTags.value.find((tag) => tag.text === selectedTag.text),
  );
  const deletedPromises = deletedTags
    .filter((tag) => tag.id)
    .map((tag) => {
      return strapi.delete('tags', tag.id);
    });
  await Promise.allSettled(deletedPromises);
};

const updateTags = (tags: CompetenceTag[]) => {
  const serverTags = tags.filter((tag) => !tag.learningplanId);
  console.log(serverTags);
};
const onCancel = () => {
  temporaryTags.value = selectedTags.value;
};
const onSave = () => {
  deleteTags();
  selectedTags.value = temporaryTags.value;
  updateTags(selectedTags.value);
  createTags(selectedTags.value);
};
const onRemove = (text?: string) => {
  temporaryTags.value = temporaryTags.value.filter(
    (item) => item.text !== text,
  );
};
</script>
