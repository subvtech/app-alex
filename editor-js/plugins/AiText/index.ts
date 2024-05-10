import Paragraph from '@editorjs/paragraph';
import { OpenAI, OpenAIError } from 'openai';
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
  private callback: TAITextCallback | null = null;
  private _CSS: TAITextCSS;
  private _placeholder: string = 'Peça para a IA escrever algo...';
  private _element: HTMLElement | null;
  private _data: TAITextData;
  private _api: TAITextApi;
  private openAI: OpenAI;
  private controller: AbortController;
  constructor({ api, config, data, readOnly }: TAITextConstructor) {
    super({
      data,
      config,
      api,
      readOnly,
    });
    this._CSS = {
      block: api.styles.block,
      wrapper: 'ce-ia-text',
    };
    this._element = null;
    this._placeholder = config.placeholder || this._placeholder;
    this.callback = config.callback;
    this._data = data ?? { text: '' };
    this._api = api;
    this.controller = new AbortController();
    this.openAI = new OpenAI({
      apiKey: config.openAiKey,
      dangerouslyAllowBrowser: true,
    });
    if (!this.openAI) {
      throw new OpenAIError('failed to initialize openai connection');
    }
    if (!this.controller) {
      throw new Error('Error to start AbortController');
    }
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
    this._element = this.renderParagraphs(this._element, iaTextGenerated);
  }

  private renderParagraphs(wrapper: HTMLElement, text: string) {
    this._api.blocks.delete();
    const paragraphs = this.getParagraphs(text);
    paragraphs.forEach((text) => {
      this._api.blocks.insert(
        'paragraph',
        {
          text,
        },
        {},
        undefined,
        true,
      );
    });

    this._api.caret.setToBlock(this._api.blocks.getCurrentBlockIndex(), 'end');
    return wrapper;
  }

  private getParagraphs(text: string) {
    return text.split('\n\n');
  }

  private renderIaInput(wrapper: HTMLDivElement) {
    const app = createApp(AiText, {
      placeholder: this._placeholder,
      getAICompletion: (text: string) => this.getAICompletion(text),
      onCancel: () => this.convertToParagraph(),
      onSave: () => this.convertToParagraph(),
      onStop: () => {
        this.controller.abort();
      },
    });
    app.use(vuetify);
    app.use(i18n);
    app.mount(wrapper);
    return wrapper;
  }

  render() {
    this._api.blocks.insert(
      'paragraph',
      {
        text: '',
      },
      {},
      this._api.blocks.getCurrentBlockIndex() + 1,
      false,
    );
    this._element = this.drawView();
    return this._element;
  }

  drawView() {
    const wrapper = document.createElement('div');
    wrapper.classList.add(this._CSS.wrapper, this._CSS.block);
    this.renderIaInput(wrapper);
    return wrapper;
  }

  async getAICompletion(text: string) {
    const response = await this.openAI.chat.completions.create(
      {
        messages: [{ role: 'user', content: text }],
        model: 'gpt-3.5-turbo',
        stream: true,
      },
      { signal: this.controller.signal },
    );
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
