import { defineStore } from 'pinia';

type User = {
  profilePicture: { url: string; id: number } | null;
  fullname: string | null;
};

export const useUserStore = defineStore('user', {
  state: (): User => ({
    profilePicture: null,
    fullname: null,
  }),
});
