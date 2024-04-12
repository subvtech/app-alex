import { createApp } from 'vue';
import { BlockToolConstructorOptions } from '@editorjs/editorjs';
import Fileset from './Fileset.vue';
import { vuetify } from '@/plugins/vuetify';

interface FilesetBlockData {
  title: string;
  extension: string;
  size: number;
  id: string;
  url: string;
}

interface FilesetConfig {
  uploadFiles: (
    files: FileList,
  ) => Promise<{ success: number; files?: FilesetBlockData[]; error?: string }>;
  handleDeletedFiles: (
    id: string,
  ) => Promise<{ succes: number; error?: string }>;
  onUpdateFiles: (files: FilesetBlockData[]) => void;
}

class FilesetBlock {
  data: Array<FilesetBlockData>;
  readOnly: boolean;
  config: FilesetConfig;
  wrapper: HTMLDivElement = document.createElement('div');
  // pendingFiles: File[] = [];
  static get toolbox() {
    return {
      title: 'Fileset',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>attachment</title><path d="M7.5,18A5.5,5.5 0 0,1 2,12.5A5.5,5.5 0 0,1 7.5,7H18A4,4 0 0,1 22,11A4,4 0 0,1 18,15H9.5A2.5,2.5 0 0,1 7,12.5A2.5,2.5 0 0,1 9.5,10H17V11.5H9.5A1,1 0 0,0 8.5,12.5A1,1 0 0,0 9.5,13.5H18A2.5,2.5 0 0,0 20.5,11A2.5,2.5 0 0,0 18,8.5H7.5A4,4 0 0,0 3.5,12.5A4,4 0 0,0 7.5,16.5H17V18H7.5Z" /></svg>',
    };
  }

  // static get pasteConfig() {
  //   return {
  //     tags: ['fileset'],
  //     files: {
  //       mimeTypes: ['image/*', 'video/*', 'audio/*', 'application/*'],
  //     },
  //   };
  // }

  constructor({
    data,
    readOnly,
    config,
  }: BlockToolConstructorOptions<FilesetBlockData[], FilesetConfig>) {
    this.data = Array.isArray(data) ? data : [];
    this.readOnly = readOnly;
    this.config = config as FilesetConfig;
  }

  render() {
    this.wrapper = document.createElement('div');
    const app = createApp(Fileset, {
      files: this.data,
      readOnly: this.readOnly,
      onUpdateFiles: (files) => {
        this.data = files;
      },
      onAddFiles: async (files: FileList) => {
        return await this.config.uploadFiles(files);
      },
      onDeletedFile: async (id: string) => {
        const res = await this.config.handleDeletedFiles(id);
        return res;
      },
    });
    app.use(vuetify);
    app.use(i18n);
    app.mount(this.wrapper);

    return this.wrapper;
  }

  static get isReadOnlySupported() {
    return true;
  }

  save() {
    return this.data;
  }

  validate(savedData) {
    if (savedData.length > 0) {
      return true;
    }
    return false;
  }

  // onPaste(event) {
  //   console.log(event);
  //   const { file } = event.detail;

  //   this.pendingFiles.push(file);

  //   setTimeout(() => {
  //     if (this.pendingFiles[this.pendingFiles.length - 1] === file) {
  //       this.config.uploadFiles(new FileList(this.pendingFiles)).then((res) => {
  //         if (res.success) {
  //           this.data = res.files;
  //           this.pendingFiles = [];
  //         }
  //       });
  //     }
  //   }, 100);
  // }
}

export default FilesetBlock;
