import { defineStore } from 'pinia';
import { SocialItemType } from '@/models/social.model';

export type UserStoreType = {
  avatar: { url: string; id: number } | undefined;
  cover: any | undefined;
  username: string | undefined;
  fullname: string | undefined;
  tags: any[];
  socials: SocialItemType[];
  institutions: any[];
  learningplans: number;
  email: string | undefined;
  phone: string | undefined;
  info: string | undefined;
  cpf: string | undefined;
  tasks: number;
  isProfessor: false;
  id: number | undefined;
  canEdit: boolean;
};

export const useUserStore = defineStore('user', {
  state: (): UserStoreType => ({
    avatar: undefined,
    fullname: undefined,
    username: undefined,
    id: undefined,
    cpf: undefined,
    info: undefined,
    email: undefined,
    phone: undefined,
    institutions: [],
    socials: [],
    tags: [],
    learningplans: 0,
    tasks: 0,
    cover: undefined,
    isProfessor: false,
    canEdit: false
  }),
});
