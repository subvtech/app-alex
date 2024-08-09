import { defineStore } from 'pinia';

type Message = {
  message: string;
  color: string;
  show: boolean;
  fill: boolean;
  showCountdown: boolean;
};

export const useMessageStore = defineStore('message', {
  state: (): Message => ({
    message: '',
    color: '',
    show: false,
    fill: true,
    showCountdown: false,
  }),
  actions: {
    setMessage(
      message: string,
      color?:
        | 'green'
        | 'success'
        | 'error'
        | 'red'
        | 'warning'
        | 'blue'
        | 'gray'
        | 'info'
        | 'gray'
        | 'custom',
      show?: boolean,
      fill?: boolean,
      showCountdown?: boolean,
    ) {
      this.message = message;
      this.color = color || this.color;
      this.show = show || this.show;
      this.fill = fill !== undefined ? fill : true;
      this.showCountdown = showCountdown !== undefined ? showCountdown : false;
    },
  },
});
