import { BlockToolData } from "@editorjs/editorjs";

export type TAITextApi = {
  i18n: {
    t: (_placeholder: any) => string | undefined;
  };
  blocks: {
    clear: () => void;
    render: (config: renderConfig) => void;
    delete: (index?: number) => void;
    swap: (fromIndex: number, toIndex: number) => void;
    move: (fromIndex: number, toIndex: number) => void;
    getBlockByIndex: (index: number) => HTMLElement;
    getCurrentBlockIndex: () => number;
    getBlocksCount: () => number;
    stretchBlock: (index: number) => void;
    insert: (type: string, data: BlockToolData, config?: ToolConfig, index?: number, focus?: boolean) => void;
  };
  selection: {
    findParentTag: (tag: string, className: string) => HTMLElement;
    expandToTag: (tag: string) => void;
  };
  toolbar: {
    open: () => void;
    close: () => void;
  };
  sanitizer: {
    clean: (tainted: string, rules: object) => string;
  };
  caret: {
    setToFirstBlock: () => void;
    setToLastBlock: () => void;
    setToPreviousBlock: () => void;
    setToNextBlock: () => void;
    setToBlock: (index: number, position?: caret) => void;
    focus: () => void;
  };
  listeners: {
    on: (event: string, callback: (event: Event) => void) => void;
    off: (event: string, callback: (event: Event) => void) => void;
  };
  saver: {
    save: () => object;
  };
  styles: {
    block: string;
  };
};
export type TAITextElement = HTMLElement | null;
export type TAITextCallback = (value: any) => any;
export type TAITextCSS = { block: string; wrapper: string };
export type TAITextData = { text: string };
export type TAITextConfig = { callback: TAITextCallback; placeholder: string, openAiKey: string };
export type TAITextReadOnly = boolean;
export type TAITextConstructor = {
  api: TAITextApi;
  block: HTMLElement;
  config: TAITextConfig;
  data: TAITextData;
  readOnly: boolean;
};
export type TBlockApi = {
  name: string;
  config: any;
  holder: HTMLElement;
  isEmpty: boolean;
  selected: boolean;
  stretched(isStretched: boolean): void;
  call(methodName: string, param?: object): void;
  save(): Promise<void | object>;
  validate(data: object): Promise<boolean>;
  dispatchChange(): void;
};
export type Block = {
  type: string;
  data: any
}
type renderConfig = { blocks: Block[] }