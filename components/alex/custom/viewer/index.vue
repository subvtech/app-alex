<template>
  <slot></slot>
</template>

<script setup lang="ts">
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';
import { createApp } from 'vue';
import { AlexCustomViewerControls } from '#components';
import { vuetify } from '~/plugins/vuetify';
type ViewerProps = {
  container: string;
};
const props = defineProps<ViewerProps>();
const viewer = defineModel<Viewer | null>({ required: true });
const createInstance = () => {
  const containerImages = document.querySelector(
    `.${props.container}`,
  ) as HTMLElement;
  const vContainer = document.querySelector(
    '.v-overlay-container',
  ) as HTMLElement;
  if (!vContainer) return;
  if (!containerImages) return;
  const viewerInstance = new Viewer(containerImages, {
    ready() {
      mountAlexControls(viewerInstance, viewerInstance.id);
    },
    play() {
      return true;
    },
    button: true,
    fullscreen: true,
    navbar: false,
    toolbar: false,
    title: [
      4,
      (image: HTMLImageElement) => {
        return image.alt;
      },
    ],
    container: vContainer,
    className: `alex-viewer v-overlay__content`,
    zIndex: 2000,
  }) as Viewer & { id: number };
  viewer.value = viewerInstance;
};
const destroyInstance = () => {
  if (viewer.value) {
    viewer.value.destroy();
    viewer.value = null;
  }
};
const reCreateInstance = () => {
  destroyInstance();
  createInstance();
};
const mountAlexControls = (viewer: Viewer, id: number) => {
  // TODO: check if exist better options to not use createApp.
  const alexViewer = document.querySelector(`#viewer${id} .viewer-footer`);
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
    onFullscreen: () => {
      viewer.play(true);
    },
  });
  app.use(vuetify);
  app.use(i18n);
  app.mount(wrapper);
  alexViewer.append(wrapper);
};
onUnmounted(() => {
  if (viewer.value) {
    viewer.value.destroy();
  }
});
onMounted(() => {
  setTimeout(() => {
    createInstance();
  }, 100);
});
defineExpose({
  createInstance,
  destroyInstance,
  reCreateInstance,
});
</script>

<style lang="scss">
body {
  padding-right: 0 !important;
}

// .v-overlay-scroll-hidden::-webkit-scrollbar {
//   display: none;
// }
// /* Hide scrollbar firefox */
// .v-overlay-scroll-hidden {
//   -ms-overflow-style: none;
//   scrollbar-width: none;
// }
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
