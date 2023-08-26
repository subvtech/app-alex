import { UnwrapRef } from 'nuxt/dist/app/compat/capi';
import { defineStore } from 'pinia';

export const useRouteStore = <T>() =>
  defineStore('route', {
    state: (): {
      value: T | undefined;
      successPage: boolean;
    } => ({
      value: undefined,
      successPage: false,
    }),

    actions: {
      setValue(value: UnwrapRef<T>, successPage?: boolean) {
        this.value = value;
        this.successPage = successPage ?? false;
      },
    },
  })();
