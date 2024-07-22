import { mergeAttributes, Node } from '@tiptap/core';
import { VueNodeViewRenderer } from '@tiptap/vue-3';
import Carousel from './Carousel.vue';

interface CarouselBlockData {
  title: string;
  image: string;
  type: string;
  icon: string;
  imgId?: string;
  videoId?: string;
  video?: string;
  url?: string;
}

interface CarouselItem {
  icon: string;
  id: string;
  title: string;
  url: File | string;
  type: string;
}

interface CarouselConfig {
  handleFileSelected: (files: CarouselItem[]) => Promise<{
    success: number;
    id?: string;
    url?: string;
  }>;
  handleDeletedFiles: (id: string) => void;
  onUpdateSlides: (slides: CarouselBlockData[]) => void;
  readOnly: () => boolean;
}

export default Node.create<CarouselConfig>({
  name: 'carousel',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      slides: {
        default: [] as CarouselBlockData[],
      },
    };
  },

  addOptions() {
    return {
      handleFileSelected: () => Promise.resolve({ success: 1 }),
      handleDeletedFiles: () => {},
      onUpdateSlides: () => {},
      readOnly: () => false,
    };
  },

  parseHTML() {
    return [
      {
        tag: 'carousel',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['carousel', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return VueNodeViewRenderer(Carousel);
  },
});
