<template>
  <div class="bg-red">
    <video
      ref="videoPlayer"
      class="video-js vjs-lime w-100 fill-height rounded"
      :data-setup="dataSetup"
      controls
      :options="options"
    ></video>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-vimeo-tech';
import 'videojs-youtube';

const props = defineProps({
  options: {
    type: String,
    default() {
      return {};
    },
  },
  dataSetup: {
    type: String,
    default: '{}',
  },
  active: {
    type: Boolean,
    default: false,
  },
});
const videoPlayer = ref(null);
onMounted(() => {
  const options = JSON.parse(props.options);
  videoPlayer.value = videojs(videoPlayer.value, options);
});

const pause = () => {
  videoPlayer.value.pause();
};

defineExpose({
  pause,
});
</script>

<style>
@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
.video-js.vjs-lime {
  border-radius: 0.5em;
}
.video-js.vjs-lime .vjs-big-play-button {
  width: 2em;
  height: 2em;
  line-height: 1.9em;
  border-radius: 1em;
  left: calc(50% - 1em);
  top: calc(50% - 1em);
  backdrop-filter: blur(4px);
  background-color: #001529;
  border: 2px solid #0abbce;
  color: #0abbce;
  transition: all 0.3s linear;
}
.video-js.vjs-lime:hover .vjs-big-play-button,
.video-js.vjs-lime:focus .vjs-big-play-button {
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.6);
  border: 2px solid #0abbce;
  color: #0abbce;
  transform: scale(1.1);
}
.video-js.vjs-lime .vjs-loading-spinner {
  border: 3px solid rgba(0, 0, 0, 0.6);
  width: 45px;
  height: 45px;
}
.video-js.vjs-lime .vjs-loading-spinner:before,
.video-js.vjs-lime .vjs-loading-spinner:after {
  margin: -3px;
  animation: rotate 0.8s linear infinite;
  border-top-color: #0abbce;
}
.video-js.vjs-lime .vjs-loading-spinner:after {
  display: none;
  border-top-color: #2315ff;
}

.video-js.vjs-lime button,
.video-js.vjs-lime .vjs-menu-item {
  transition: all 0.3s linear;
}

.video-js.vjs-lime button:hover,
.video-js.vjs-lime .vjs-menu-item:hover {
  outline: none;
  color: #0abbce;
}
.video-js.vjs-lime .vjs-control-bar {
  height: 5em;
  padding-top: 2em;
  background: linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.4) 35%,
    rgba(0, 0, 0, 0) 100%
  );
  border-bottom-left-radius: 0.5em;
  border-bottom-right-radius: 0.5em;
}
.video-js.vjs-lime button.vjs-icon-cog {
  font-size: 1.3em;
}
.video-js.vjs-lime .vjs-menu-button-popup .vjs-menu .vjs-menu-content {
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 0.5em;
  backdrop-filter: blur(4px);
}
.video-js.vjs-lime video {
  border-radius: 0.5em;
}
.video-js.vjs-lime video:focus {
  outline: none;
}
.video-js.vjs-lime .vjs-slider {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}
.video-js.vjs-lime .vjs-progress-holder .vjs-load-progress {
  background-color: #0abbce;
  transition: width 0.15s linear;
}
.video-js.vjs-lime .vjs-progress-holder .vjs-play-progress,
.video-js.vjs-lime .vjs-progress-holder .vjs-load-progress,
.video-js.vjs-lime .vjs-progress-holder .vjs-load-progress > div {
  border-radius: 10px;
}
.video-js.vjs-lime .vjs-menu li.vjs-menu-item:focus:not(.vjs-selected),
.video-js.vjs-lime .vjs-menu li.vjs-menu-item:hover:not(.vjs-selected),
.video-js.vjs-lime
  .js-focus-visible
  .vjs-menu
  li.vjs-menu-item:hover:not(.vjs-selected) {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
