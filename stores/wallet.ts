import { defineStore } from 'pinia';

export const useWalletStore = defineStore(
  'wallet',
  {
    state: () => ({
      address:  undefined as string | undefined,
    }),
  },
);
