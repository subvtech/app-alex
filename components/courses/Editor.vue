<template>
  <alex-custom-card
    class="mb-6"
    :title="title"
    :isEditing="isEditing && canEdit"
    :showIcon="canEdit"
    @toggle:isEditing="toggleIsEditing"
    :cancel="cancel"
    :save="updateAbout"
    sizingClass="pa-0"
    full-width
  >
    <template v-slot:content>
      <div>
        <div
          v-if="isEmptyAndIsNotEditing"
          class="d-flex flex-column justify-center align-center"
          style="gap: 16px"
        >
          <alex-custom-empty-placeholder
            empty-text-image="/svg/EmptyAbout.svg"
            :empty-text-message="
              $t('components.courses.editor.emptyPlaceholder')
            "
          />
        </div>
      </div>
      <client-only>
        <div
          id="editorjs"
          class="editorjs w-full p-6 sm:p-16"
          :class="[isEditing ? '' : 'locked']"
          :spellcheck="isEditing ? 'true' : 'false'"
        />
      </client-only>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
import EditorJS, { OutputBlockData } from '@editorjs/editorjs';
import Marker from '@editorjs/marker';

import DragDrop from 'editorjs-drag-drop';

import Undo from 'editorjs-undo';
import { i18n } from '~/assets/editor-i18n';
const { create, update, delete: _delete } = useStrapi();
const { t } = useI18n();

const props = defineProps({
  info: {
    type: Array as PropType<OutputBlockData<string, any>[]>,
    default: [],
  },
  courseId: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  canEdit: { type: Boolean, required: true },
});

const { info, canEdit } = toRefs(props);
const isEditing = ref(false);
const cancel = async () => {
  await instance.value.render({ blocks: info.value });
};
const emit = defineEmits(['ready', 'update']);
const instance = ref();

const initialiseEditor = () => {
  console.log({ info: info.value });
  instance.value = new EditorJS({
    tools: {
      marker: {
        class: Marker,
        shortcut: 'CMD+SHIFT+M',
      },
    },
    onChange: () => checkBlocksLimit(instance.value),
    i18n,
    placeholder: isEditing
      ? `${t('components.profile.about.placeholder')}`
      : '',
    holder: 'editorjs',
    //readOnly: true,
    // logLevel: 'ERROR',
    data: {
      blocks: info.value,
    },
    onReady: () => {
      /* eslint-disable-next-line */
      new DragDrop(instance.value);
      /* eslint-disable-next-line */
      new Undo({ editor: instance.value });
      emit('ready');
    },
  });
};

onMounted(() => {
  if (!isEmptyAndIsNotEditing.value) initialiseEditor();
});

const isEmptyAndIsNotEditing = computed(
  () => info.value.length === 0 && !isEditing.value,
);

const updateAbout = async () => {
  const instanceData = await instance.value.save();

  const promises: Promise<any>[] = [];
  if (info.value.length > 0) {
    info.value.forEach((item, index) => {
      if (instanceData.blocks[index])
        promises.push(
          update(`course-descriptions/${item.id}`, {
            data: instanceData.blocks[index].data,
            type: instanceData.blocks[index].type,
            learningplan: props.courseId,
            order: index,
          }),
        );
    });
  }
  instanceData.blocks.slice(info.value.length).forEach((item, index) => {
    promises.push(
      create('course-descriptions', {
        data: item.data,
        type: item.type,
        learningplan: props.courseId,
        order: info.value.length + index,
      }),
    );
  });
  if (info.value.length > instanceData.blocks.length) {
    info.value.slice(instanceData.blocks.length).forEach((item) => {
      promises.push(_delete(`course-descriptions/${item.id}`));
    });
  }

  await Promise.all(promises);
  isEditing.value = false;

  emit('update');
};

const checkBlocksLimit = async (editor) => {
  const data = await editor.save();
  const maxBlocks = 5; // Set your maximum number of blocks
  if (data.blocks.length > maxBlocks) {
    // Remove the last block if the limit is exceeded
    editor.blocks.delete(data.blocks.length - 1);
  }
};

const toggleIsEditing = () => {
  isEditing.value = !isEditing.value;
};
watch(isEmptyAndIsNotEditing, () => {
  const theresInstance = instance.value
    ? Object.keys(instance.value).length !== 0
    : false;
  if (isEmptyAndIsNotEditing && theresInstance) instance.value.destroy();
  else initialiseEditor();
});
</script>

<style global lang="scss">
#editorjs {
  max-width: 100% !important;
}

@media (min-width: 750px) {
  .ce-toolbar__actions.ce-toolbar__actions--opened {
    left: 0 !important;
    margin-left: -54px;
  }
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

.cdx-block {
  max-width: 100% !important;
  overflow-wrap: break-word;
}
#Card {
  #editorjs {
    .codex-editor__redactor {
      padding-bottom: 24px !important;
    }
    .ce-block__content {
      margin: 0px;
    }
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
}

@media (min-width: 800px) {
  .ce-block__content {
    max-width: 250px !important;
  }
}
@media (min-width: 900px) {
  .ce-block__content {
    max-width: 350px !important;
  }
}

@media (min-width: 1000px) {
  .ce-block__content {
    max-width: 390px !important;
  }
}

@media (min-width: 1100px) {
  .ce-block__content {
    max-width: 500px !important;
  }
}
@media (min-width: 1200px) {
  .ce-block__content {
    max-width: 600px !important;
  }
}
@media (min-width: 1300px) {
  .ce-block__content {
    max-width: 450px !important;
  }
}

@media (min-width: 1400px) {
  .ce-block__content {
    max-width: 500px !important;
  }
}

@media (min-width: 1500px) {
  .ce-block__content {
    max-width: 550px !important;
  }
}

@media (min-width: 1600px) {
  .ce-block__content {
    max-width: 600px !important;
  }
}

@media (min-width: 1700px) {
  .ce-block__content {
    max-width: 650px !important;
  }
}

@media (min-width: 1800px) {
  .ce-block__content {
    max-width: 700px !important;
  }
}

@media (min-width: 1900px) {
  .ce-block__content {
    max-width: 750px !important;
  }
}

@media (min-width: 2000px) {
  .ce-block__content {
    max-width: 800px !important;
  }
}
</style>
