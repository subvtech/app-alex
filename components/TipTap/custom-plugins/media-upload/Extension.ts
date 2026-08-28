import { mergeAttributes, Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';

import Component from './Component.vue';

interface MediaType {
  src: string;
  title: string;
  id: string | null;
}

interface MediaConfig {
  uploadMedia: (file: File) => Promise<{
    success: number;
    media?: {
      src: string;
      title: string;
      id: string;
    };
  }>;
  deleteMedia: (src: string) => void;
  readOnly: () => boolean;
  defaultFormat?: 'image' | 'video';
}

export default Node.create<MediaConfig>({
  name: 'mediaUpload',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      media: {
        default: {
          src: '',
          title: '',
          size: 100,
          align: 'center',
          id: null,
          uploadKey: null,
          uploading: false,
        } as MediaType,
      },
      format: {
        default: this.options.defaultFormat as 'image' | 'video',
      },
    };
  },

  addOptions() {
    return {
      readOnly: () => false,
      deleteMedia: () => {},
      uploadMedia: () => Promise.resolve({ success: 1 }),
      defaultFormat: 'image' as 'image' | 'video',
    };
  },

  parseHTML() {
    return [
      {
        tag: 'media-upload',
        getAttrs: (element) => {
          const media = element.getAttribute('data-media');

          if (!media) {
            return {};
          }

          try {
            return {
              media: JSON.parse(media),
              format: element.getAttribute('data-format') || undefined,
            };
          } catch {
            return {};
          }
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'media-upload',
      mergeAttributes({
        'data-media': JSON.stringify(HTMLAttributes.media),
        'data-format': HTMLAttributes.format,
      }),
    ];
  },

  addNodeView() {
    return VueNodeViewRenderer(Component);
  },
});
