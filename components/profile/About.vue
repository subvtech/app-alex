<template>
  <profile-card
    class="mb-6"
    :title="$t('components.profile.about.title')"
    :isEditing="isEditing && canEdit"
    @toogle:isEditing="toggleIsEditing"
    :cancel="cancel"
    :save="updateAbout"
    :full-width="true"
  >
    <template v-slot:content class="pa-6">
      <div>
        <div
          v-if="info.length === 0 && !isEditing"
          class="d-flex flex-column justify-center align-center"
          style="gap: 16px"
        >
          <NuxtImg
            src="/svg/EmptyAbout.svg"
            placeholder
            style="height: 160px; width: 160px"
          />

          <span class="info text-center" style="color: rgb(175, 175, 175)">
            {{ $t('components.profile.about.placeholder') }}
          </span>
        </div>
        <client-only>
          <div
            id="lockedEditor"
            class="lockedEditor w-full p-6 sm:p-16"
            :class="isEditing ? 'd-none' : ''"
          />
        </client-only>
      </div>
      <client-only>
        <div
          id="editorjs"
          class="editorjs w-full p-6 sm:p-16"
          :class="isEditing ? '' : 'd-none'"
        />
      </client-only>
    </template>

    <template v-slot:footer>
      <div v-if="tags.length > 0" class="footer d-flex flex-row pt-6">
        <div
          class="competence d-flex flex-column align-start pa-4"
          v-for="block in [
            {
              title: $t('components.profile.about.general'),
              items: tags,
            },
            {
              title: $t('components.profile.about.technical'),
              items: tags,
            },
          ]"
        >
          <span class="title">{{ block.title }}</span>
          <div class="d-flex flex-wrap justify-center">
            <span
              class="item d-flex justify-center align-center px-4"
              v-for="item in block.items"
              >{{ item }}</span
            >
          </div>
        </div>
      </div>
    </template>
  </profile-card>
</template>

<script setup lang="ts">
import EditorJS, { OutputBlockData } from '@editorjs/editorjs';
import Marker from '@editorjs/marker';

import DragDrop from 'editorjs-drag-drop';

import Undo from 'editorjs-undo';
import { i18n } from '~/assets/editor-i18n';
const { create, update, delete: _delete } = useStrapi();

const props = defineProps({
  info: {
    type: Array as PropType<OutputBlockData<string, any>[]>,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  canEdit: { type: Boolean, required: true },
  tags: {
    type: Array as PropType<{ text: string }[]>,
    default: () => [],
  },
});

const { info, canEdit, id, tags } = toRefs(props);
const isEditing = ref(false);
const cancel = () => {};
const emit = defineEmits(['ready', 'update:user']);
const instance = ref();
const lockedEditor = ref();

onMounted(() => {
  instance.value = new EditorJS({
    tools: {
      marker: {
        class: Marker,
        shortcut: 'CMD+SHIFT+M',
      },
    },
    onChange: () => checkBlocksLimit(instance.value),
    i18n,

    autofocus: true,
    placeholder: 'Clique para iniciar...',
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
  lockedEditor.value = new EditorJS({
    tools: {
      marker: {
        class: Marker,
        shortcut: 'CMD+SHIFT+M',
      },
    },
    onChange: () => checkBlocksLimit(lockedEditor.value),
    i18n,
    holder: 'lockedEditor',
    readOnly: true,
    // logLevel: 'ERROR',
    data: {
      blocks: info.value,
    },
    onReady: () => {
      /* eslint-disable-next-line */
      new DragDrop(lockedEditor.value);
      /* eslint-disable-next-line */
      new Undo({ editor: lockedEditor.value });
      emit('ready');
    },
  });
});
const updateAbout = async () => {
  const instanceData = await instance.value.save();

  const promises: Promise<any>[] = [];
  if (info.value.length > 0) {
    info.value.forEach((item, index) => {
      if (instanceData.blocks[index])
        promises.push(
          update(`user-descriptions/${item.id}`, {
            data: instanceData.blocks[index].data,
            type: instanceData.blocks[index].type,
            users_permissions_user: id.value,
            order: index,
          }),
        );
    });
  }
  instanceData.blocks.slice(info.value.length).forEach((item, index) => {
    promises.push(
      create('user-descriptions', {
        data: item.data,
        type: item.type,
        users_permissions_user: id.value,
        order: info.value.length + index,
      }),
    );
  });
  if (info.value.length > instanceData.blocks.length) {
    info.value.slice(instanceData.blocks.length).forEach((item) => {
      promises.push(_delete(`user-descriptions/${item.id}`));
    });
  }

  await Promise.all(promises);
  isEditing.value = !isEditing.value;

  await lockedEditor.value.render(instanceData);
  emit('update:user');
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
</script>

<style global lang="scss">

#lockedEditor, #editorjs * {
  max-width: 100% !important
}

#lockedEditor, #editorjs {
  max-width: 350px !important;
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
  }
  #lockedEditor {
    .codex-editor__redactor {
      padding-bottom: 24px !important;
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
  .footer {
    gap: 24px;

    .competence {
      gap: 16px;
      border-radius: 8px;
      border: 1px solid #eaeef1;

      .title {
        color: #5d6872;
        font-size: 16px;
        font-weight: bold;
        line-height: 22px;
      }

      div {
        gap: 8px;
        .item {
          font-size: 14px;
          font-weight: 400;
          color: #5d6872;
          padding-block: 10px;
          gap: 4px;
          border-radius: 99px;
          border: 1px solid #5d6872;
        }
      }
    }
  }
}
</style>
