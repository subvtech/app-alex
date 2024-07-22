import { mergeAttributes, Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';

import FilesetComponent from './FileSet.vue';

interface FileAttributes {
  title: string;
  extension: string;
  size: number;
  id: number;
  url: string;
}

interface FilesetConfig {
  uploadFiles: (files: FileList) => Promise<{
    success: number;
    files?: Array<FileAttributes>;
    error?: string;
  }>;
  handleDeletedFiles: (id: string) => void;
  readOnly: () => boolean;
}

export default Node.create<FilesetConfig>({
  name: 'fileSet',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      files: {
        default: [] as FileAttributes[],
      },
    };
  },

  addOptions() {
    return {
      uploadFiles: () => Promise.resolve({ success: 1 }),
      handleDeletedFiles: () => {},
      readOnly: () => false,
    };
  },
  parseHTML() {
    return [
      {
        tag: 'file-set',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['file-set', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return VueNodeViewRenderer(FilesetComponent);
  },
});
