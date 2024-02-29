<template>
  <alex-custom-card
    class="mb-6"
    sizing-class="pa-0"
    full-width
    :title="title"
    :is-editing="isEditing && canEdit"
    :show-icon="canEdit"
    :cancel="cancel"
    :save="updateAbout"
    @toggle:is-editing="toggleIsEditing"
  >
    <template #content>
      <div
        v-if="isEmptyAndIsNotEditing"
        class="d-flex flex-column w-100 justify-center align-center gap-4"
      >
        <alex-custom-empty-placeholder
          empty-text-image="/svg/EmptyAbout.svg"
          :empty-text-message="$t('components.courses.editor.emptyPlaceholder')"
        />
      </div>
      <app-editor
        v-else
        ref="editorDetails"
        v-model="instance"
        class="editorjs w-full p-6 sm:p-16"
        :auto-focus="false"
        :data="{ blocks: info }"
        :class="[isEditing ? 'editing-editor' : 'locked']"
        :spellcheck="isEditing ? 'true' : 'false'"
      >
      </app-editor>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
const { update } = useStrapi();
const { t } = useI18n();
type DetailsEditorProps = {
  info?: { data: any; id: number; type: string; order: number }[];
  courseId: number;
  title: string;
  canEdit: boolean;
};
const props = withDefaults(defineProps<DetailsEditorProps>(), {
  info: () => [],
});

const { info, canEdit } = toRefs(props);
const isEditing = ref(false);
const cancel = async () => {
  await instance.value.render({ blocks: info.value });
};
const emit = defineEmits(['ready', 'update']);
const instance = ref();
const editorDetails = ref();
const isEmptyAndIsNotEditing = computed(
  () => info.value.length === 0 && !isEditing.value,
);
const updateAbout = async () => {
  const editorData = await editorDetails.value?.getData();
  const newData = editorData.data.blocks.map((item, index) => {
    return {
      data: item.data,
      type: item.type,
      order: index,
    };
  });
  await update(`learningplans`, props.courseId, {
    details: { lines: newData },
  });
  isEditing.value = false;
  emit('update', t('components.courses.editor.update'));
};
const toggleIsEditing = () => {
  isEditing.value = !isEditing.value;
};
onMounted(async () => {
  await editorDetails.value?.toggleReadOnly();
  await instance.value.render({ blocks: info.value });
});
watch(
  () => [isEditing.value, instance.value],
  () => {
    if (instance.value?.configuration) {
      instance.value.focus();
    }
  },
);
</script>

<style global lang="scss">
#editorjs {
  width: 100% !important;
}
.locked {
  pointer-events: none;
  -webkit-user-select: text; /* Chrome, Safari, and Opera */
  -moz-user-select: text; /* Firefox */
  -ms-user-select: text; /* Internet Explorer/Edge */
  user-select: text;

  .ce-toolbar__actions.ce-toolbar__actions--opened {
    display: none;
  }
}
#editorjs .codex-editor__redactor {
  padding-bottom: 0 !important;
}
@media (min-width: 651px) {
  #editorjs:not(.locked) {
    .codex-editor--narrow .ce-block {
      margin-right: 0;
      padding-right: 0;
    }
    .ce-block__content {
      margin: 0;
      margin-left: 40px;
    }

    .ce-toolbar__actions {
      right: auto;
      left: -20px;
    }
    .codex-editor--narrow .ce-toolbox .ce-popover,
    .codex-editor--narrow .ce-settings .ce-popover {
      right: auto;
      left: 0;
    }
  }
}
#editorjs:not(.locked) {
  .ce-toolbar__content {
    margin: 0;
  }
}
.ce-block__content {
  margin: 0;
  max-width: none;
}
.info {
  text-align: justify;
  text-justify: inter-word;
  align-self: stretch;
  color: #5d6872;
  font-size: 16px;
  font-weight: 400;
  line-height: 22px;
}
</style>
