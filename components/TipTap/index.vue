<template>
  <client-only>
    <TipTap-loader v-if="isLoading" />
    <div
      ref="container"
      class="rounded-lg w-100 position-relative tw-transition-opacity"
      :class="{ 'tw-opacity-0': isLoading }"
    >
      <div ref="bubbleMenuWrapper" v-show="showMenuBar" :class="!fixedMenu ? 'bubble-menu-wrapper' : ''">
        <tip-tap-menus-bubble v-if="editor" :editor="editor" :fixed-menu-bar="fixedMenu" @click.stop.prevent />
      </div>
      <editor-content :class="!props.edit || props.noPadding ? 'no-padding' : ''" :editor="editor" />
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { Editor, EditorContent, AnyExtension } from '@tiptap/vue-3';
import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import { Collaboration } from '@tiptap/extension-collaboration';
import { CollaborationCursor } from '@tiptap/extension-collaboration-cursor';
import { TiptapCollabProvider } from '@hocuspocus/provider';
import { StarterKit } from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import { UniqueID } from '@tiptap-pro/extension-unique-id';
import { TaskItem } from '@tiptap/extension-task-item';
import { TaskList } from '@tiptap/extension-task-list';
import { Link } from '@tiptap/extension-link';
import { FontFamily } from '@tiptap/extension-font-family';
import { TextStyle } from '@tiptap/extension-text-style';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';
import { Color } from '@tiptap/extension-color';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { Typography } from '@tiptap/extension-typography';
import { Superscript } from '@tiptap/extension-superscript';
import { Subscript } from '@tiptap/extension-subscript';

import { common, createLowlight } from 'lowlight';

import * as Y from 'yjs';

import CustomMention from './custom-plugins/mentions/Extension';
import SlashMenu from './menus/slash/commands';
import suggestion from './menus/slash/suggestion';
import FileSet from './custom-plugins/file-set/Extension';
import BookMark from './custom-plugins/bookmark/Extension';
import Carousel from './custom-plugins/carousel/Extension';
import MediaUpload from './custom-plugins/media-upload/Extension';
import VueDragHandle from './menus/drag/Extension.js';
import { isTextSelected } from './menus/bubble/isTextSelected';
import mentionSuggestion from './custom-plugins/mentions/Suggestions';

const doc = new Y.Doc();
const strapiClient = useStrapiClient();
const app = useNuxtApp();

const { t } = useI18n();
const { setMessage } = useMessageStore();

interface MentionUserProps {
  username: String;
  fullname: String;
  avatarUrl: String;
}

export type MentionUserPropsArray = MentionUserProps[];

const props = defineProps({
  modelValue: {
    type: [String, Object] as PropType<string | Record<string, any>>,
    default: undefined,
  },
  edit: {
    type: Boolean,
    default: true,
  },
  docName: {
    type: String,
    default: '',
  },
  mentionUsers: {
    type: Array as PropType<MentionUserPropsArray>,
    default: () => [],
  },
  allowedBlocks: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  fixedMenu: {
    type: Boolean,
    default: false,
  },
  collaboration: {
    type: Boolean,
    default: true,
  },
  showLoader: {
    type: Boolean,
    default: false,
  },
  noPadding: {
    type: Boolean,
    default: false,
  },
});

const isLoading = ref(false);

const defaultBlock = computed(() => {
  return props.allowedBlocks.length === 1 ? props.allowedBlocks[0] : '';
});

const normalizeContent = (value: string | Record<string, any> | undefined) => {
  if (!value) return undefined;
  if (typeof value !== 'string') return value;

  try {
    const parsed = JSON.parse(value);
    return parsed;
  } catch {
    console.warn('[TipTap] normalizeContent kept string because JSON.parse failed', { value });
    return value;
  }
};

const showMenuBar = computed(() => {
  return isEditable.value && (props.allowedBlocks.length === 0 || props.allowedBlocks.includes('text'));
});
const temporaryMedia = ref<number[]>([]);

const editor = ref();
const isEditable = ref(props.edit);

const container = ref<HTMLDivElement | null>(null);
const bubbleMenuWrapper = ref<HTMLDivElement | null>(null);

const generateUserColor = (username: string): string => {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00ffffff).toString(16).toUpperCase();
  const color = '#' + '00000'.substring(0, 6 - c.length) + c;
  const rgb = parseInt(color.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (luma < 140) {
    return generateUserColor(username + 'a');
  }

  return color;
};

interface TipTapResponse {
  token: string;
}

const getTipTapToken = async (userID: number | undefined) => {
  try {
    const TipTapToken = await strapiClient<TipTapResponse>(`tiptap/${userID}`, {
      method: 'GET',
    });
    return TipTapToken.token;
  } catch (error) {
    const typedError = error as { error: { status: number } };
    if (typedError.error.status === 400) {
      setMessage(t('components.tiptap.messages.error.userNotLoggedIn'), 'error', true);
    } else {
      setMessage(t('components.tiptap.messages.error.gettingToken'), 'error', true);
    }
    return '';
  }
};

const uploadImageFile = async (file: File) => {
  const formData = new FormData();
  formData.append('files', file, file.name);

  try {
    const res = await strapiClient<Upload[]>('/upload', {
      method: 'POST',
      body: formData,
    });
    const uploadedFile = res[0];
    if (!uploadedFile?.url || uploadedFile.id === undefined) {
      throw new Error('Upload response did not contain a valid file');
    }

    const { url, id } = uploadedFile;
    temporaryMedia.value.push(id);
    return {
      success: 1,
      url,
      id,
      title: file.name?.slice(0, file.name?.lastIndexOf('.')) || 'Untitled',
    };
  } catch (error) {
    setMessage(t('components.tiptap.mediaUpload.errors.upload'), 'error', true);
    return { success: 0 };
  }
};

const updateMediaNode = (uploadKey: string, media) => {
  if (!editor.value) return;

  editor.value.commands.command(({ state, dispatch }) => {
    let updated = false;
    state.doc.descendants((node, pos) => {
      if (node.type.name === 'mediaUpload' && node.attrs.media.uploadKey === uploadKey) {
        dispatch?.(state.tr.setNodeMarkup(pos, undefined, { ...node.attrs, media }));
        updated = true;
        return false;
      }
      return true;
    });
    return updated;
  });
};

const insertImageFile = async (file: File) => {
  if (!isEditable.value || !file.type.startsWith('image/')) {
    return false;
  }

  if (!editor.value) return false;

  const uploadKey = `${Date.now()}-${Math.random()}`;
  const localUrl = URL.createObjectURL(file);

  editor.value
    .chain()
    .focus()
    .insertContent({
      type: 'mediaUpload',
      attrs: {
        media: {
          src: localUrl,
          title: file.name,
          id: null,
          size: 100,
          align: 'center',
          uploadKey,
          uploading: true,
        },
        format: 'image',
      },
    })
    .run();

  const res = await uploadImageFile(file);
  if (res.success) {
    updateMediaNode(uploadKey, {
      src: res.url,
      title: res.title,
      id: res.id,
      size: 100,
      align: 'center',
      uploadKey,
      uploading: false,
    });
  } else {
    updateMediaNode(uploadKey, {
      src: '',
      title: file.name,
      id: null,
      size: 100,
      align: 'center',
      uploadKey,
      uploading: false,
    });
  }
  URL.revokeObjectURL(localUrl);

  return true;
};

onMounted(async () => {
  const user = useStrapiUser();
  let provider;
  if (props.collaboration) {
    isLoading.value = props.showLoader;
    const TipTapToken = await getTipTapToken(user.value?.id);
    setAvailableBlocks(props.allowedBlocks);
    const hocuspocusUrl = app.$config.public.hocuspocusUrl as string | undefined;

    const providerOptions: any = {
      name: props.docName,
      token: TipTapToken,
      document: doc,
      onSynced() {
        if (!doc.getMap('config').get('initialContentLoaded') && editor) {
          doc.getMap('config').set('initialContentLoaded', true);
        }
        isLoading.value = false;
      },
    };

    if (hocuspocusUrl) {
      providerOptions.baseUrl = hocuspocusUrl;
    } else {
      providerOptions.appId = app.$config.public.tipTapAppId;
    }

    provider = new TiptapCollabProvider(providerOptions);
  }

  await nextTick();

  const setCollaborationExtensions = (): AnyExtension[] => [
    ...(props.collaboration
      ? [
          Collaboration.configure({ document: doc }),
          CollaborationCursor.configure({
            provider,
            user: {
              name: user.value ? user.value.username : 'Usuário Anônimo',
              color: generateUserColor(user.value?.username ? user.value.username : 'Anonymous'),
            },
          }),
        ]
      : []),
  ];

  editor.value = new Editor({
    enableContentCheck: true,
    editable: isEditable.value,
    editorProps: {
      handlePaste: (_view, event, _slice) => {
        const imageFile = Array.from(event.clipboardData?.files || []).find((file) => file.type.startsWith('image/'));

        if (imageFile) {
          event.preventDefault();
          insertImageFile(imageFile);
          return true;
        }

        const text = event.clipboardData?.getData('text/plain');

        if (!text) return false;

        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+/;
        const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com)\/.+/;

        if (youtubeRegex.test(text.trim()) || vimeoRegex.test(text.trim())) {
          event.preventDefault();

          editor.value
            .chain()
            .focus()
            .insertContent({
              type: 'mediaUpload',
              attrs: {
                media: {
                  src: text.trim(),
                  title: 'Video',
                  id: null,
                  size: 100,
                  align: 'center',
                },
                format: 'video',
              },
            })
            .run();

          return true;
        }

        return false;
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (moved) {
          return false;
        }

        const imageFile = Array.from(event.dataTransfer?.files || []).find((file) => file.type.startsWith('image/'));

        if (!imageFile) {
          return false;
        }

        event.preventDefault();
        insertImageFile(imageFile);
        return true;
      },
    },
    extensions: [
      BubbleMenu.configure({
        element: bubbleMenuWrapper.value,
        tippyOptions: {
          duration: 100,
          theme: 'transparent',
          maxWidth: 1500,
          placement: 'top-start',
        },
        updateDelay: 100,
        shouldShow: ({ view }) => {
          if (!view || !editor.value?.isEditable) {
            return false;
          }
          return isTextSelected({ editor: editor.value });
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'paragraph') {
            return t('components.tiptap.menus.placeholder');
          }
          return '';
        },
      }),
      SlashMenu.configure({
        suggestion: suggestion(slashMenuBlocks(props.allowedBlocks)),
      }),
      VueDragHandle.configure({
        editor: () => editor.value,
        showDragHandle: () => isEditable.value && !props.fixedMenu,
        tippyOptions: {
          popperOptions: {
            modifiers: [
              {
                name: 'flip',
                options: {
                  fallbackPlacements: ['bottom-start'],
                },
              },
              {
                name: 'preventOverflow',
              },
            ],
          },
        },
        defaultNodeType: defaultBlock.value,
      }),
      UniqueID.configure({
        types: [
          'heading',
          'paragraph',
          'FileList',
          'CustomMention',
          'Carousel',
          'TaskList',
          'Table',
          'MediaUpload',
          'Link',
          'blockquote',
          'CodeBlockLowlight',
        ],
      }),
      ...setCollaborationExtensions(),
      ...getSelectedBlockTools(),
    ],
    content: normalizeContent(props.modelValue),
    onUpdate: ({ editor }) => {
      emits('update:modelValue', editor.getJSON());
    },
    onContentError({ editor, disableCollaboration }) {
      console.error('[TipTap] onContentError', {
        currentJson: editor.getJSON(),
        currentHtml: editor.getHTML(),
      });
      disableCollaboration();
      const emitUpdate = false;
      editor.setEditable(false, emitUpdate);
      setMessage(t('components.tiptap.messages.error.contentError'), 'error', true);
    },
  });

  setTimeout(() => {
    emitHeight();
  }, 300);
});
const blockToolsMap = {
  starterKit: StarterKit.configure({
    codeBlock: false,
  }),
  CustomMention: CustomMention.configure({
    suggestion: {
      items: (editor) => mentionSuggestion.items(editor, props.mentionUsers),
      render: mentionSuggestion.render,
    },
  }),
  FileSet: FileSet.configure({
    uploadFiles: async (files: FileList) => {
      const formData = new FormData();
      const filesArray: File[] = Array.from(files);
      filesArray.forEach((file: File) => {
        formData.append('files', file, file.name);
      });
      try {
        const res = await strapiClient<Upload[]>('/upload', {
          method: 'POST',
          body: formData,
        });

        return {
          success: 1,
          files: res.map((file) => {
            temporaryMedia.value.push(file.id);
            return {
              title: file.name?.slice(0, file.name?.lastIndexOf('.')) || 'Untitled',
              extension: file.ext?.slice(1) || 'file',
              size: file.size || 0,
              id: file.id,
              url: file.url,
            };
          }),
        };
      } catch (error) {
        return {
          success: 0,
          error: error instanceof Error ? error.message : String(error),
        };
      }
    },
    handleDeletedFiles: (id: string) => {
      strapiClient(`/upload/files/${id}`, {
        method: 'DELETE',
      });
    },
    readOnly: () => !isEditable.value,
  }),
  TaskList,
  TaskItem: TaskItem.configure({ nested: true }),
  TextStyle,
  FontFamily,
  CodeBlockLowlight: CodeBlockLowlight.configure({
    lowlight: createLowlight(common),
  }),
  Underline,
  TextAlign: TextAlign.configure({ types: ['heading', 'paragraph'] }),
  Color,
  Highlight: Highlight.configure({ multicolor: true }),
  Link: Link.configure({ openOnClick: true }),
  Table: Table.configure({ resizable: true }),
  TableRow,
  TableHeader,
  TableCell,
  Typography,
  Superscript,
  Subscript,
  Carousel: Carousel.configure({
    handleFileSelected: async (slides) => {
      const formData = new FormData();
      slides.forEach((slide) => {
        if (slide.url instanceof File) {
          formData.append('files', slide.url, slide.title);
        } else if (typeof slide.url === 'string' && slide.url.startsWith('data:')) {
          const base64Data = slide.url.split(',')[1];
          const binaryString = window.atob(base64Data);
          const byteArray = new Uint8Array(binaryString.length);

          for (let i = 0; i < binaryString.length; i++) {
            byteArray[i] = binaryString.charCodeAt(i);
          }

          let mimeType = 'image/png';
          if (slide.url.startsWith('data:image/jpeg')) {
            mimeType = 'image/jpeg';
          }

          const blob = new Blob([byteArray], { type: mimeType });
          const imageFile = new File([blob], slide.title, {
            type: mimeType,
          });
          formData.append('files', imageFile, imageFile.name);
        }
      });
      const res = await strapiClient<Upload[]>('/upload', {
        method: 'POST',
        body: formData,
      });
      if (slides.length > 1) {
        const url = res[0].url;
        const videoId = res[0].id;
        const thumbnail = res[1].url;
        const imgId = res[1].id;
        temporaryMedia.value.push(videoId);
        temporaryMedia.value.push(imgId);
        return { success: 1, url, thumbnail, videoId, imgId };
      } else {
        const { url, id } = res[0];
        temporaryMedia.value.push(id);
        return { success: 1, url, imgId: id };
      }
    },
    handleDeletedFiles: (id: string) => {
      strapiClient(`/upload/files/${id}`, {
        method: 'DELETE',
      });
    },
    readOnly: () => !isEditable.value,
  }),
  MediaUpload: MediaUpload.configure({
    readOnly: () => !isEditable.value,
    defaultFormat: defaultBlock.value === 'image' ? 'image' : 'video',
    uploadMedia: uploadImageFile,
    deleteMedia: (id: string) => {
      strapiClient(`/upload/files/${id}`, {
        method: 'DELETE',
      });
    },
  }),
  Bookmark: BookMark.configure({
    readOnly: () => !isEditable.value,
    endpoint: '/api/fetch-url',
  }),
};

const setAvailableBlocks = (blocks: string[]) => {
  const availableBlocks: string[] = [];
  blocks.forEach((block) => {
    switch (block) {
      case 'text':
        availableBlocks.push(
          'starterKit',
          'TaskList',
          'TaskItem',
          'ListItem',
          'FontFamily',
          'CodeBlockLowlight',
          'Underline',
          'TextAlign',
          'Color',
          'Highlight',
          'Link',
          'Typography',
          'Superscript',
          'Subscript',
          'Table',
          'TableRow',
          'TableHeader',
          'TableCell',
          'CustomMention',
          'TextStyle',
        );
        break;
      case 'image':
        availableBlocks.push('MediaUpload');
        break;
      case 'video':
        availableBlocks.push('MediaUpload');
        break;
      case 'gallery':
        availableBlocks.push('Carousel');
        break;
      case 'document':
        availableBlocks.push('FileSet');
        break;
      case 'link':
        availableBlocks.push('Bookmark');
        break;
      default:
        availableBlocks.push(block);
        break;
    }
  });
  if (blocks.length > 1 && !availableBlocks.includes('starterKit')) {
    availableBlocks.push('Paragraph');
  }
  return availableBlocks;
};

const slashMenuBlocks = (blocks: string[]): string[] => {
  return blocks
    .map((block) => {
      switch (block) {
        case 'text':
          return [
            'format',
            'heading1',
            'heading2',
            'heading3',
            'quote',
            'bulletList',
            'orderedList',
            'todoList',
            'codeBlock',
          ];
        case 'image':
          return ['insert', 'image'];
        case 'video':
          return ['insert', 'video'];
        case 'gallery':
          return ['insert', 'carousel'];
        case 'document':
          return ['insert', 'attaches'];
        case 'link':
          return ['insert', 'bookmark'];
        default:
          return [];
      }
    })
    .flat();
};

const getSelectedBlockTools = (): AnyExtension[] => {
  const blocks = setAvailableBlocks(props.allowedBlocks);
  const selectedBlocks = blocks.length ? blocks : Object.keys(blockToolsMap);
  return selectedBlocks.map((block) => blockToolsMap[block]);
};

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});

const emits = defineEmits(['update:modelValue', 'change:height']);

const emitHeight = () => {
  emits('change:height', container.value?.clientHeight);
};

const setContent = (content) => {
  if (editor.value) {
    editor.value.commands.setContent(content, false);
  }
};

defineExpose({ emitHeight, setContent, container: container.value });

watch(
  () => props.edit,
  (val) => {
    editor.value.setEditable(val);
    isEditable.value = val;
  },
);

watch(
  () => props.modelValue,
  (value) => {
    setTimeout(() => {
      emitHeight();
    }, 300);
    if (!editor.value) {
      console.warn('[TipTap] modelValue watcher skipped because editor is not ready');
      return;
    }
    const isSame = JSON.stringify(editor.value.getJSON()) === JSON.stringify(value);

    if (!isSame) {
      editor.value.commands.setContent(normalizeContent(value), false);
    }
  },
);
</script>

<style lang="scss">
.no-padding {
  .tiptap.ProseMirror {
    padding: 4px 0px;
  }
}

.tiptap {
  outline: none !important;
  :first-child {
    margin-top: 0;
  }

  ul,
  ol {
    padding: 0 1rem;
    margin: 1.25rem 1rem 1.25rem 0.4rem;

    li p {
      margin-top: 0.25em;
      margin-bottom: 0.25em;
    }
  }

  ul {
    list-style-type: disc;
  }

  ol {
    list-style-type: decimal;
  }

  ul[data-type='taskList'] {
    list-style: none;
    margin-left: 0;
    padding: 0;

    li {
      align-items: flex-start;
      display: flex;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }

      > div {
        flex: 1 1 auto;
      }
    }

    input[type='checkbox'] {
      cursor: pointer;
    }

    ul[data-type='taskList'] {
      margin: 0;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
    margin-top: 2.5rem;
    text-wrap: pretty;
  }

  h1,
  h2 {
    margin-top: 3.5rem;
    margin-bottom: 1.5rem;
  }

  h1 {
    font-size: 1.4rem;
  }

  h2 {
    font-size: 1.2rem;
  }

  h3 {
    font-size: 1.1rem;
  }

  h4,
  h5,
  h6 {
    font-size: 1rem;
  }

  a {
    color: #99c3ff;
    cursor: pointer;

    &:visited {
      color: #c58af9;
    }
    &:hover {
      text-decoration: underline;
    }
  }

  code {
    background-color: #212121;
    border-radius: 0.4rem;
    color: #fff;
    font-size: 0.85rem;
    padding: 0.25em 0.3em;
  }

  pre {
    background: rgb(var(--v-theme-gray-900));
    border-radius: 4px;
    color: #fff;
    font-family: 'JetBrainsMono', monospace;
    margin: 1.5rem 0;
    padding: 1rem;

    code {
      background: none;
      color: inherit;
      font-size: 0.8rem;
      padding: 0;
    }

    .hljs-comment,
    .hljs-quote {
      color: #616161;
    }

    .hljs-variable,
    .hljs-template-variable,
    .hljs-attribute,
    .hljs-tag,
    .hljs-name,
    .hljs-regexp,
    .hljs-link,
    .hljs-name,
    .hljs-selector-id,
    .hljs-selector-class {
      color: #f98181;
    }

    .hljs-number,
    .hljs-meta,
    .hljs-built_in,
    .hljs-builtin-name,
    .hljs-literal,
    .hljs-type,
    .hljs-params {
      color: #fbbc88;
    }

    .hljs-string,
    .hljs-symbol,
    .hljs-bullet {
      color: #b9f18d;
    }

    .hljs-title,
    .hljs-section {
      color: #faf594;
    }

    .hljs-keyword,
    .hljs-selector-tag {
      color: #70cff8;
    }

    .hljs-emphasis {
      font-style: italic;
    }

    .hljs-strong {
      font-weight: 700;
    }
  }

  blockquote {
    border-left: 3px solid rgb(var(--v-theme-secondary--1));
    margin: 1.5rem 0;
    padding-left: 1rem;
    color: rgb(var(--v-theme-gray-600)) !important;
  }

  hr {
    border: none;
    border-top: 1px solid rgb(var(--v-theme-gray-200));
    margin: 2rem 0;
  }
  background-color: #fff;
  padding: 18px;
  border-radius: 8px;

  /* Table-specific styling */
  table {
    border-collapse: collapse;
    margin: 0;
    overflow: hidden;
    table-layout: fixed;
    width: 100%;

    td,
    th {
      border: 1px solid rgb(var(--v-theme-gray-300));
      box-sizing: border-box;
      min-width: 1em;
      padding: 6px 8px;
      position: relative;
      vertical-align: top;

      > * {
        margin-bottom: 0;
      }
    }

    th {
      background-color: var(--gray-1);
      font-weight: bold;
      text-align: left;
    }

    .selectedCell:after {
      background: var(--gray-2);
      content: '';
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      pointer-events: none;
      position: absolute;
      z-index: 2;
    }

    .column-resize-handle {
      background-color: var(--purple);
      bottom: -2px;
      pointer-events: none;
      position: absolute;
      right: -2px;
      top: 0;
      width: 4px;
    }
  }

  .tableWrapper {
    margin: 1.5rem 0;
    overflow-x: auto;
  }

  &.resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
  }
}

.collaboration-cursor__caret {
  border-left: 1px solid #0d0d0d;
  border-right: 1px solid #0d0d0d;
  margin-left: -1px;
  margin-right: -1px;
  pointer-events: none;
  position: relative;
  word-break: normal;
}

.collaboration-cursor__label {
  border-radius: 3px 3px 3px 0;
  color: #0d0d0d;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  left: -1px;
  line-height: normal;
  padding: 0.1rem 0.3rem;
  position: absolute;
  top: -1.4em;
  user-select: none;
  white-space: nowrap;
}

.is-empty::before {
  color: rgb(var(--v-theme-gray-300));
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
