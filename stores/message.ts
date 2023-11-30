import { defineStore } from 'pinia';

type Message = {
  message: string;
  color: string;
  show: boolean;
};

export const useMessageStore = defineStore('message', {
  state: (): Message => ({
    message: '',
    color: '',
    show: false,
  }),
  actions: {
    setMessage(message: string, color?: string, show?: boolean) {
      this.message = message;
      this.color = color || this.color;
      this.show = show || this.show;
    },
  },
});


