declare module 'vue-prism-component';
declare module 'is-object-id';
declare module 'editorjs-drag-drop';
declare module 'editorjs-undo';
declare module '@editorjs/image';
declare module '@editorjs/inline-code';
declare module '@editorjs/link';
declare module '@editorjs/marker';

// Google Identity Services
interface GoogleAccountsId {
  initialize(config: {
    client_id: string;
    callback: (response: { credential: string }) => void;
    error_callback?: (error: unknown) => void;
    use_fedcm_for_prompt?: boolean;
  }): void;
  prompt(momentListener?: (notification: { isNotDisplayed(): boolean; isSkippedMoment(): boolean }) => void): void;
}

interface Window {
  google?: { accounts?: { id: GoogleAccountsId } };
}
