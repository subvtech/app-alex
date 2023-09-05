import { UnwrapRef } from 'nuxt/dist/app/compat/capi';
import { defineStore } from 'pinia';
import type { RoutesNamesList } from '@typed-router';

export const useRouteStore = <T>() =>
  defineStore('route', {
    state: (): {
      value: T | undefined;
      previousPage: RoutesNamesList | (string & {});
    } => ({
      value: undefined,
      previousPage: '',
    }),

    actions: {
      setValue(value: UnwrapRef<T>) {
        this.value = value;
      },
      setPreviousPage(previousPage: RoutesNamesList) {
        this.previousPage = previousPage;
      },
    },
  })();
