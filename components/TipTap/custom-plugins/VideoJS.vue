<template>
  <div>
    <video
      ref="videoPlayer"
      class="video-js vjs-lime w-100 fill-height rounded teste"
      :class="customClasses"
      :data-setup="dataSetup"
      controls
      :options="options"
    ></video>
  </div>
</template>

<script setup>
import { ref, onUnmounted, watch, defineProps } from 'vue';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import 'videojs-vimeo-tech';
import 'videojs-youtube';

const props = defineProps({
  options: {
    type: Object,
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
  customClasses: {
    type: String,
    default: '',
  },
});

const videoPlayer = ref(null);
let player;
let captionsPoll;

const CAPTIONS_BUTTON = 'YoutubeCaptionsButton';

const registerCaptionsButton = () => {
  if (videojs.getComponent(CAPTIONS_BUTTON)) return;

  const MenuButton = videojs.getComponent('MenuButton');
  const MenuItem = videojs.getComponent('MenuItem');

  class YoutubeCaptionItem extends MenuItem {
    constructor(parentPlayer, options) {
      super(parentPlayer, { ...options, selectable: true, multiSelectable: false });
    }

    handleClick() {
      this.options_.onSelect(this.options_.languageCode);
    }
  }

  class YoutubeCaptionsButton extends MenuButton {
    constructor(parentPlayer, options) {
      super(parentPlayer, options);
      this.controlText('Legendas');
      this.hide();
    }

    buildCSSClass() {
      return `vjs-subs-caps-button ${super.buildCSSClass()}`;
    }

    buildWrapperCSSClass() {
      return `vjs-subs-caps-button ${super.buildWrapperCSSClass()}`;
    }

    createItems() {
      const tracks = this.options_.getTracks();
      if (!tracks.length) return [];

      const current = this.options_.getCurrent();
      const makeItem = (label, languageCode) =>
        new YoutubeCaptionItem(this.player_, {
          label,
          languageCode,
          selected: current === languageCode,
          onSelect: this.options_.onSelect,
        });

      return [
        makeItem('Desativadas', null),
        ...tracks.map((track) =>
          makeItem(track.displayName || track.languageName || track.languageCode, track.languageCode),
        ),
      ];
    }
  }

  videojs.registerComponent(CAPTIONS_BUTTON, YoutubeCaptionsButton);
};

const setupYoutubeCaptions = (activePlayer) => {
  registerCaptionsButton();

  let tracks = [];
  let current = null;
  let captionsModule = 'captions';

  const getYtPlayer = () => {
    const tech = activePlayer.tech({ IWillNotUseThisInPlugins: true });
    return tech && tech.ytPlayer;
  };

  const readCaptionsState = () => {
    const yt = getYtPlayer();
    if (!yt || typeof yt.getOption !== 'function') return { list: [], active: null };

    for (const name of ['captions', 'cc']) {
      try {
        yt.loadModule(name);
        const list = yt.getOption(name, 'tracklist') || [];
        const active = yt.getOption(name, 'track') || null;
        if (list.length || (active && active.languageCode)) {
          captionsModule = name;
          return { list, active };
        }
      } catch (error) {
        continue;
      }
    }
    return { list: [], active: null };
  };

  const selectTrack = (languageCode) => {
    const yt = getYtPlayer();
    if (!yt || typeof yt.setOption !== 'function') return;

    try {
      yt.setOption(captionsModule, 'track', languageCode ? { languageCode } : {});
      current = languageCode;
    } catch (error) {
      current = null;
    }
    button.update();
  };

  const controlBar = activePlayer.controlBar;
  const fullscreen = controlBar.getChild('fullscreenToggle');
  const position = fullscreen ? controlBar.children().indexOf(fullscreen) : undefined;

  const button = controlBar.addChild(
    CAPTIONS_BUTTON,
    {
      getTracks: () => tracks,
      getCurrent: () => current,
      onSelect: selectTrack,
    },
    position,
  );

  const refresh = () => {
    const { list, active } = readCaptionsState();
    const activeCode = active && active.languageCode;

    let resolved = list;
    if (!resolved.length && activeCode) {
      resolved = [
        {
          languageCode: activeCode,
          displayName: `Automática (${activeCode})`,
        },
      ];
    }

    if (!resolved.length) return false;

    tracks = resolved;
    current = activeCode || null;
    button.update();
    button.show();
    return true;
  };

  const startPolling = () => {
    if (captionsPoll) {
      clearInterval(captionsPoll);
      captionsPoll = null;
    }

    let attempts = 0;
    captionsPoll = setInterval(() => {
      attempts += 1;
      if (refresh() || attempts >= 20) {
        clearInterval(captionsPoll);
        captionsPoll = null;
      }
    }, 1000);
  };

  activePlayer.on(['play', 'playing', 'loadedmetadata'], startPolling);
  startPolling();
};

watch(
  videoPlayer,
  (video) => {
    if (video) {
      const options = props.options;
      player = videojs(video, options);

      player.ready(() => {
        if (player.techName_ === 'Youtube') {
          setupYoutubeCaptions(player);
        }
      });
    }
  },
  { immediate: true },
);

onUnmounted(() => {
  if (captionsPoll) {
    clearInterval(captionsPoll);
    captionsPoll = null;
  }
  if (player) {
    player.dispose();
  }
});

const pause = () => {
  if (player) {
    player.pause();
  }
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
.video-js,
.vjs-poster {
  border-radius: 8px;
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

.video-fluid:not(.vjs-fullscreen).vjs-fluid,
.video-fluid.vjs-16-9,
.video-fluid.vjs-4-3,
video.video-fluid,
video.vjs-tech {
  max-height: 700px;
  position: relative !important;
  width: 100%;
  height: auto !important;
  max-width: 100% !important;
  line-height: 0;
}

.videoFile .video-fluid.vjs-fluid,
.video-fluid.vjs-16-9,
.video-fluid.vjs-4-3,
video.video-fluid,
video.vjs-tech {
  padding-top: 0 !important;
}

.vjs-fullscreen video.vjs-tech {
  max-height: 100vh !important;
}

.vjs-control-bar {
  line-height: 1;
}
</style>
