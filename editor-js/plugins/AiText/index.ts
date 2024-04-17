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
  }

  private convertToParagraph() {
    if (!this._element) return;
    const iaTextGenerated = this._element.querySelector(
      '.ia-text-generated.active',
    )?.textContent;
    const inputWrapper = this._element.querySelector('.ce-ia-wrapper');
    if (!iaTextGenerated || !inputWrapper) return;
    this._data = { text: iaTextGenerated };
    inputWrapper.remove();
    this._element = this.renderParagraph(this._element, iaTextGenerated);
  }

  private renderParagraph(wrapper: HTMLElement, text: string) {
    wrapper.innerHTML = text;
    wrapper.classList.add(this.DEFAULT_PARAGRAPH_CSS);
    wrapper.contentEditable = !this._readOnly ? 'true' : 'false';
    return wrapper;
  }

  private renderIaInput(wrapper: HTMLDivElement) {
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
      title: 'AI Text',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>creation</title><path d="M19,1L17.74,3.75L15,5L17.74,6.26L19,9L20.25,6.26L23,5L20.25,3.75M9,4L6.5,9.5L1,12L6.5,14.5L9,20L11.5,14.5L17,12L11.5,9.5M19,15L17.74,17.74L15,19L17.74,20.25L19,23L20.25,20.25L23,19L20.25,17.74" /></svg>`,
    };
  }
}

export default AIText;
