<template>
  <!-- Tags -->
  <div class="d-flex flex-wrap align-stretch gap-3">
    <v-menu
      v-if="props.edit"
      v-model="open"
      :close-on-content-click="false"
      class="invite-member"
    >
      <!-- Exibição -->
      <template #activator="{ props: vMenuProps }">
        <alex-custom-button
          v-bind="vMenuProps"
          icon="mdi-plus"
          size="small"
          variant="secondary"
        />
      </template>

      <v-list class="pa-4 rounded-lg">
        <p class="text-body-1 text-gray-800 mb-2">
          {{ $t('components.learningPlan.drawer.task.tags.subtitle') }}
        </p>
        <alex-inputs-tag-autocomplete
          v-model="tags"
          class="hide-select-icon min-w-[264px]"
          name="tag"
          all
          density="compact"
          :placeholder="$t('components.learningPlan.drawer.tags.placeholder')"
          @add-tag="(tag) => addTag(tag)"
        />
      </v-list>
    </v-menu>

    <alex-custom-chip
      v-for="(tag, index) in tags"
      :key="index"
      :text="tag.text"
      :closable="props.edit"
      :clickable="props.edit"
      size="small"
      status="blue"
      variant="tonal"
      @click:close="() => handleRemoveTag(tag)"
    />
  </div>
</template>

<script setup lang="ts">
interface CompProps {
  edit?: boolean;
  taskId: number;
}

const props = withDefaults(defineProps<CompProps>(), {
  edit: true,
  tags: () => [],
});
const open = ref<boolean>(false);
const tags = defineModel<TagSimple[]>({ default: [] });
const strapiUtils = useStrapiUtils();
const strapi = useStrapi();
const { t } = useI18n();
type EmitTag = {
  isPublic: boolean;
  local?: boolean;
  isGeneral?: boolean;
  id?: number;
  text: string;
};

const { setMessage } = useMessageStore();
const notifyError = () => {
  setMessage(
    t('components.learningPlan.drawer.task.tags.errors.save'),
    'error',
    true,
  );
};
const handleRemoveTag = (tag: TagSimple) => {
  if (tag.id) {
    strapi.update('tasks', props.taskId, {
      tags: {
        disconnect: [tag.id],
      },
    });
    tags.value = tags.value.filter((tagValue) => tagValue.id !== tag.id);
    return;
  }
  tags.value = tags.value.filter((tagValue) => tagValue.text !== tag.text);
};
const addTag = async (value: EmitTag | null) => {
  if (!value) return;
  try {
    if (!value.id) {
      const { data: tag } = await strapiUtils.create<TagSimple>('tags', {
        text: value.text,
        isGeneral: value.isGeneral,
        isPublic: value.isPublic,
        // @ts-ignore
        tasks: props.taskId,
      });
      value.id = tag.id;
      tags.value = tags.value.map((oldTag) => {
        if (oldTag.text === tag.text) {
          return tag;
        }
        return oldTag;
      });
    }
    strapi.update('tasks', props.taskId, {
      tags: {
        connect: [value.id],
      },
    });
  } catch (error) {
    notifyError();
  }
};
</script>

<style scoped>
.hide-select-icon
  .v-autocomplete__selections
  .v-autocomplete__selection
  .v-autocomplete__selection-icon {
  display: none !important;
}
</style>
