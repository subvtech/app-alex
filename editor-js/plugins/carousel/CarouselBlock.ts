import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { alexIcons } from 'assets/icons';
import Carousel from './Carousel.vue';

const vuetify = createVuetify({
  aliases,
  components,
  directives,
  defaults,
  theme: {
    defaultTheme: MAIN_THEME,
    themes: {
      mainTheme,
      mainDarkTheme,
    },
  },
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi,
      alex: alexIcons,
    },
  },
});

class CarouselBlock {
  static get toolbox() {
    return {
      title: 'Playlist',
      icon: '<svg class="svg-icon" style="width: 5em; height: 5em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M781.312 386.048h-27.648v275.456h27.648a38.912 38.912 0 0 0 37.888-37.888V423.936a38.912 38.912 0 0 0-37.888-37.888zM204.8 423.936v199.68a38.912 38.912 0 0 0 37.888 37.888h27.648V386.048h-27.648a38.912 38.912 0 0 0-37.888 37.888z m476.16-72.704h-337.92a38.912 38.912 0 0 0-37.888 38.912v268.288a38.912 38.912 0 0 0 37.888 37.888h337.92a38.912 38.912 0 0 0 37.888-37.888V390.144a38.912 38.912 0 0 0-37.888-38.912z m-57.344 276.48H387.072a12.288 12.288 0 0 1-10.24-19.456l71.68-123.904a8.192 8.192 0 0 1 13.312 0l44.032 73.728a8.192 8.192 0 0 0 13.312 1.024l34.816-51.2a8.192 8.192 0 0 1 14.336 0l64.512 102.4a10.24 10.24 0 0 1-9.216 17.408z m-6.144-147.456a32.768 32.768 0 1 1 32.768-32.768 32.768 32.768 0 0 1-32.768 32.768z"  /></svg>',
    };
  }

  constructor({ data, readOnly, config }) {
    this.data = data;
    this.readOnly = readOnly;
    this.config = config;
  }

  render() {
    this.wrapper = document.createElement('div');
    const app = createApp(Carousel, {
      slides: this.data.slides,
      readOnly: this.readOnly,
      uploadBaseUrl: this.config.uploadBaseUrl,
      onUpdateSlides: (slides) => {
        this.data.slides = slides;
      },
      onSelectFile: async (file) => {
        return await this.config.handleFileSelected(file);
      },
      onDeletedSlide: (id) => {
        this.config.handleDeletedFiles(id);
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
    if (savedData.slides) {
      return true;
    }
    return false;
  }
}

export default CarouselBlock;
