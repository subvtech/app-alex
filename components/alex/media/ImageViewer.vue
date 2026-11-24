<template>
  <v-overlay v-model="model" class="d-flex align-center justify-center">
    <div class="position-relative tw-w-[90vw] tw-h-[90vh] d-flex align-center justify-center overflow-hidden">
      <alex-custom-button
        icon="mdi-close"
        class="position-absolute"
        style="top: 16px; right: 16px; z-index: 10"
        color="white"
        @click="close"
      />
      <div class="position-absolute d-flex flex-column ga-2" style="top: 16px; left: 16px; z-index: 10">
        <alex-custom-button
          icon="mdi-plus"
          color="white"
          size="small"
          :disabled="zoomLevel >= maxZoom"
          @click="zoomIn"
        />
        <alex-custom-button
          icon="mdi-minus"
          color="white"
          size="small"
          :disabled="zoomLevel <= minZoom"
          @click="zoomOut"
        />
        <alex-custom-button icon="mdi-backup-restore" color="white" size="small" @click="resetZoom" />
      </div>
      <div
        class="position-absolute text-white bg-black bg-opacity-50 px-2 py-1 rounded"
        style="bottom: 16px; left: 16px; z-index: 10"
      >
        {{ Math.round(zoomLevel * 100) }}%
      </div>
      <div
        class="d-flex align-center justify-center w-100 h-100"
        style="cursor: grab"
        :style="{ cursor: isPanning ? 'grabbing' : zoomLevel > 1 ? 'grab' : 'default' }"
        @mousedown="startPan"
        @mousemove="handlePan"
        @mouseup="endPan"
        @mouseleave="endPan"
        @wheel.prevent="handleWheel"
      >
        <img
          :src="src"
          :alt="alt"
          class="tw-transition-transform tw-duration-200"
          style="max-height: 90vh; max-width: 90vw; user-select: none"
          :style="{
            transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
            transformOrigin: 'center center',
          }"
          draggable="false"
        />
      </div>
    </div>
  </v-overlay>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ src?: string; alt?: string }>(), { src: undefined, alt: undefined });
const model = defineModel<boolean>({ default: false });

const zoomLevel = ref(1);
const minZoom = 0.5;
const maxZoom = 5;
const panX = ref(0);
const panY = ref(0);
const isPanning = ref(false);
const lastPanPoint = ref({ x: 0, y: 0 });

const resetZoom = () => {
  zoomLevel.value = 1;
  panX.value = 0;
  panY.value = 0;
};

const close = () => {
  model.value = false;
};

const zoomIn = () => {
  if (zoomLevel.value < maxZoom) {
    zoomLevel.value = Math.min(zoomLevel.value + 0.25, maxZoom);
  }
};

const zoomOut = () => {
  if (zoomLevel.value > minZoom) {
    zoomLevel.value = Math.max(zoomLevel.value - 0.25, minZoom);
    if (zoomLevel.value <= 1) {
      panX.value = 0;
      panY.value = 0;
    }
  }
};

const handleWheel = (event: WheelEvent) => {
  const delta = event.deltaY > 0 ? -0.1 : 0.1;
  const newZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel.value + delta));
  zoomLevel.value = newZoom;

  if (newZoom <= 1) {
    panX.value = 0;
    panY.value = 0;
  }
};

const startPan = (event: MouseEvent) => {
  if (zoomLevel.value > 1) {
    isPanning.value = true;
    lastPanPoint.value = { x: event.clientX, y: event.clientY };
  }
};

const handlePan = (event: MouseEvent) => {
  if (isPanning.value && zoomLevel.value > 1) {
    const deltaX = event.clientX - lastPanPoint.value.x;
    const deltaY = event.clientY - lastPanPoint.value.y;

    panX.value += deltaX / zoomLevel.value;
    panY.value += deltaY / zoomLevel.value;

    lastPanPoint.value = { x: event.clientX, y: event.clientY };
  }
};

const endPan = () => {
  isPanning.value = false;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (model.value) {
    switch (event.key) {
      case 'Escape':
        close();
        break;
      case '+':
      case '=':
        zoomIn();
        break;
      case '-':
        zoomOut();
        break;
      case '0':
        resetZoom();
        break;
    }
  }
};

watch(model, () => resetZoom());

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>
