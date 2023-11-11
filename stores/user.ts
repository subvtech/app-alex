import { defineStore } from 'pinia';

type User = {
  profilePicture: { url: string; id: number } | null;
};

export const useUserStore = defineStore('user', {
  state: (): User => ({
    profilePicture: null,
  }),
});
