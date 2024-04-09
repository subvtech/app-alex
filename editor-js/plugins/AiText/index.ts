import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { mdi } from 'vuetify/iconsets/mdi';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { alexIcons } from 'assets/icons';
import {
  TAITextApi,
  TAITextCSS,
  TAITextCallback,
  TAITextConstructor,
  TAITextData,
  TAITextElement,
  TAITextReadOnly,
} from './aitext';
import AiText from './AiText.vue';

const vuetify = createVuetify({
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

class AIText {
  private callback: TAITextCallback;
  private _element: TAITextElement = null;
  private _CSS: TAITextCSS;
  private _data: TAITextData;
  private _placeholder: string = 'Peça para a IA escrever algo...';
  private readOnly: TAITextReadOnly = false;
  private api: TAITextApi;
  static get toolbox() {
    return {
      title: 'AI TEXT',
      icon: `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 4V20M17 12V20M6 20H10M15 20H19M13 7V4H3V7M21 14V12H13V14" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    };
  }

  constructor({ api, config, data, readOnly }: TAITextConstructor) {
    this.api = api;
    this.readOnly = readOnly;
    this._CSS = {
      block: 'block',
      wrapper: 'ce-ia-text',
    };

    this._placeholder = config.placeholder || this._placeholder;
    this._data = data ?? {};
    this._element = null;

    if (!config.callback) {
      throw new Error('Callback function is required!');
    }

    this.callback = config.callback;
  }

  drawView() {
    const wrapper = document.createElement('div');
    const app = createApp(AiText, {
      placeholder: this._placeholder,
      onSend: (text: string) => this.callback(text),
    });
    app.use(vuetify);
    app.use(i18n);
    app.mount(wrapper);
    return wrapper;
  }

  render() {
    this._element = this.drawView();
    return this._element;
  }

  save() {
    return this._data;
  }

  static get isReadOnlySupported() {
    return true;
  }
}

export default AIText;
