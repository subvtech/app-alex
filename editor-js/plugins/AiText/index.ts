import Paragraph from '@editorjs/paragraph';
import { createApp } from 'vue';
import {
  TAITextCSS,
  TAITextCallback,
  TAITextConstructor,
  TAITextData,
  TAITextApi,
} from './aitext';
import AiText from './AiText.vue';
import { vuetify } from '@/plugins/vuetify';
class AIText extends Paragraph {
  private callback: TAITextCallback;
  private _CSS: TAITextCSS;
  private _placeholder: string = 'Peça para a IA escrever algo...';
  private _element: HTMLElement | null;
  private _data: TAITextData;
  private _readOnly: boolean;
  private _api: TAITextApi;
  private _ceID: string;
  private DEFAULT_PARAGRAPH_CSS: string = 'ce-paragraph';
  constructor({ api, config, data, readOnly }: TAITextConstructor) {
    super({
      data,
      config,
      api,
      readOnly,
    });
    if (!config.callback) {
      throw new Error('Callback function is required!');
    }
    this._CSS = {
      block: api.styles.block,
      wrapper: 'ce-ia-text',
    };
    this._element = null;
    this._placeholder = config.placeholder || this._placeholder;
    this.callback = config.callback;
    this._data = data ?? { text: '' };
    this._readOnly = readOnly;
    this._api = api;
    this._ceID = `ce-ia-text-${api.blocks.getCurrentBlockIndex()}`;
  }

  toggleContentEditable(value: boolean) {
    const element = document.getElementById('ce-ia-text');
    if (!element) return;
    element.contentEditable = value ? 'true' : 'false';
    this._element = element;
  }

  convertToParagraph() {
    const iaTextGenerated = document.querySelector('.ia-text-generated.active')
      ?.textContent;
    if (!iaTextGenerated || !this._element) return;
    const inputWrapper = document.querySelector('.ce-ia-wrapper');
    if (!inputWrapper) return;
    this._data = { text: iaTextGenerated };
    inputWrapper.remove();
    this._element = this.renderParagraph(this._element, iaTextGenerated);
  }

  renderParagraph(wrapper: HTMLElement, text: string) {
    wrapper.innerHTML = text;
    wrapper.classList.add(this.DEFAULT_PARAGRAPH_CSS);
    wrapper.contentEditable = !this._readOnly ? 'true' : 'false';
    return wrapper;
  }

  renderIaInput(wrapper: HTMLDivElement) {
    const app = createApp(AiText, {
      placeholder: this._placeholder,
      onSend: (text: string) => this.getIaCompletition(text),
      onCancel: () => this.convertToParagraph(),
      onSave: () => this.convertToParagraph(),
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

  drawView() {
    const wrapper = document.createElement('div');
    wrapper.id = this._ceID;
    wrapper.classList.add(this._CSS.wrapper, this._CSS.block);
    if (this._data.text) {
      this.renderParagraph(wrapper, this._data.text);
      return wrapper;
    }
    this.renderIaInput(wrapper);
    return wrapper;
  }

  async getIaCompletition(text: string) {
    const response = await this.callback(text);
    if (!response) {
      return;
    }
    this._data = { text: response };
    return response;
  }

  static get isReadOnlySupported() {
    return true;
  }

  static get toolbox() {
    return {
      title: 'AI TEXT',
      icon: `<svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 4V20M17 12V20M6 20H10M15 20H19M13 7V4H3V7M21 14V12H13V14" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`,
    };
  }
}

export default AIText;
