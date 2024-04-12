<template>
  <slot></slot>
</template>

<script setup lang="ts">
import Viewer from 'viewerjs';
import { createApp } from 'vue';
import { AlexCustomViewerControls } from '#components';
import 'viewerjs/dist/viewer.css';
import { vuetify } from '~/plugins/vuetify';
type ViewerProps = {
  imageId: string;
  images: { caption: string }[];
};
const props = defineProps<ViewerProps>();
const viewerInstances = defineModel<Array<any>>({ required: true });
const createInstances = () => {
  if (props.images.length === 0) return;
  viewerInstances.value = props.images.flatMap((image, i) => {
    const slideImage = document.getElementById(`${props.imageId}-${i}`);
    if (!slideImage) return [];
    const viewer = new Viewer(slideImage, {
      ready() {
        mountAlexControls(i, viewer);
      },
      view() {
        const html = document.querySelector('html');
        if (!html) return;
        html.classList.add('v-overlay-scroll-blocked');
      },
      hide() {
        const html = document.querySelector('html');
        if (!html) return;
        html.classList.remove('v-overlay-scroll-blocked');
      },
      fullscreen: true,
      navbar: false,
      title: [1, () => image.caption],
      className: `alex-viewer alex-viewer-${i}`,
      toolbar: false,
      zIndex: 1999,
    });
    return viewer;
  });
};
const destroyInstances = () => {
  viewerInstances.value.forEach((image) => {
    image.destroy();
  });
};

const mountAlexControls = (index: number, viewer: Viewer) => {
  // TODO: check if exist better options to not use createApp.
  const alexViewer = document.querySelector(
    `.alex-viewer-${index} .viewer-footer`,
  );
  if (!alexViewer) return;
  const wrapper = document.createElement('div');
  wrapper.classList.add('alex-viewer-controls');
  const app = createApp(AlexCustomViewerControls, {
    onPlus: () => {
      viewer.zoom(0.2);
    },
    onMinus: () => {
      viewer.zoom(-0.2);
    },
    onReset: () => {
      viewer.reset();
    },
    onFlipH: () => {
      // @ts-ignore
      const scaleX = viewer?.imageData?.scaleX;
      viewer.scaleX(scaleX === -1 ? 1 : -1);
    },
    onFlipV: () => {
      // @ts-ignore
      const scaleY = viewer?.imageData?.scaleY;
      viewer.scaleY(scaleY === -1 ? 1 : -1);
    },
    onRotate: () => {
      viewer.rotate(90);
    },
  });
  app.use(vuetify);
  app.mount(wrapper);
  alexViewer.append(wrapper);
};

onUnmounted(() => {
  destroyInstances();
});
defineExpose({
  createInstances,
  destroyInstances,
});
</script>

<style lang="scss">
.alex-viewer {
  .viewer-title {
    background-color: rgb(var(--v-theme-gray-800));
    color: rgb(var(--v-theme-white));
    padding: 6.5px 16px;
    border-radius: 4px;
    visibility: hidden;
    animation: 1s fadeIn 1s;
    animation-fill-mode: forwards;
    width: 100px;
    min-height: 24px;
    font-size: 14px;
  }

  &.viewer-in .viewer-title {
    width: auto;
    transition: opacity 0.5s;
  }
  .viewer-button.viewer-close {
    border-radius: 8px;
    gap: 8px;
    width: 36px;
    height: 36px;
    right: 24px;
    top: 24px;
    background-color: rgb(var(--v-theme-white));
  }
  .viewer-button.viewer-close:hover {
    background-color: rgb(var(--v-theme-gray-blue));
  }
  .viewer-button.viewer-close:active {
    background-color: rgb(var(--v-theme-gray-100));
  }
  .viewer-button.viewer-close:focus {
    box-shadow: none;
  }

  .viewer-button.viewer-close::before {
    color: rgb(var(--v-theme-gray-800));
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    filter: brightness(0);
  }
  .alex-viewer-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 36px;
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    visibility: visible;
    opacity: 1;
  }
}
</style>
