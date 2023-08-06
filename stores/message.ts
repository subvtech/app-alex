import { defineStore } from 'pinia';

export const useMessageStore = defineStore('message', {
  state: () => ({
    message: '',
    color: '',
    show: true,
  }),
});
