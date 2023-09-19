<template>
  <div class="bg-red">
    <video
      ref="videoPlayer"
      class="video-js w-100 fill-height rounded"
      data-setup="{}"
      controls
      :src="videoUrl"
    ></video>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
export default {
  name: 'VideoPlayer',
  props: {
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    videoUrl: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const videoPlayer = ref(null);

    onMounted(() => {
      videoPlayer.value = videojs(videoPlayer.value, props.options, () => {
        videoPlayer.value.log('onPlayerReady', this);
      });
    });

    onBeforeUnmount(() => {
      if (videoPlayer.value) {
        videoPlayer.value.dispose();
      }
    });

    return {
      videoPlayer,
    };
  },
};
</script>
