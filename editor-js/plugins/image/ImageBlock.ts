import Image from '@editorjs/image';

class CustomImage extends Image {
  constructor(...args) {
    super(...args);
    this.dropEventOccurred = false;
    document.addEventListener('drop', this.handleDragDrop);
  }

  static get pasteConfig() {
    return {
      tags: ['img'],
      patterns: {
        image: /https?:\/\/.+\.(gif|png|jpe?g)/i,
      },
      files: {
        mimeTypes: ['image/*'],
      },
    };
  }

  findBlockIndexById(id: string): number {
    const blocksLength = this.api.blocks.getBlocksCount();
    const currentBlock = this.api.blocks.getCurrentBlockIndex();
    if (this.api.blocks.getBlockByIndex(currentBlock)?.id === id) {
      return currentBlock;
    }
    for (let i = blocksLength - 1; i >= 0; i--) {
      const block = this.api.blocks.getBlockByIndex(i);
      if (block.id === id) {
        return i;
      }
    }
    return -1;
  }

  handleDragDrop = (event: DragEvent) => {
    event.stopPropagation();
    document.removeEventListener('drop', this.handleDragDrop);
    if (this.api.readOnly.isEnabled || this.data.file.url) return;
    this.dropEventOccurred = true;
    if (this.block?.name === 'image' && !(this.data.file instanceof FileList)) {
      if (
        this.block?.name === 'image' &&
        !(this.data.file instanceof FileList)
      ) {
        const index = this.findBlockIndexById(this.block.id);
        if (index !== -1) {
          this.api.blocks.delete(index);
        }
      }
    }
  };

  onPaste(event: CustomEvent) {
    switch (event.type) {
      case 'tag':
        this._createImage(event.detail.data.src);
        break;
      case 'file':
        if (!this.dropEventOccurred) {
          this.uploadFile(event.detail.file);
        }
        break;
      case 'pattern':
        this.uploadUrl(event.detail.data);
        break;
    }
  }

  render() {
    const Image = super.render();

    if (this.data.file instanceof FileList) {
      this.uploadFile(this.data.file[0]);
    }
    if (this.readOnly && !this.data.caption) {
      Image.querySelector('.image-tool__caption').setAttribute(
        'style',
        'display: none',
      );
    }
    return Image;
  }
}

export default CustomImage;
