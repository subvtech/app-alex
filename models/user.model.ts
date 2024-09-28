import type { Institution } from './institution.model';
import type { Tag } from './tag.model';

export enum UserRoles {
  PROFESSOR = 'professor',
  AUTHENTICATED = 'authenticated',
}

interface Role {
  id: number;
  description: string;
  name: string;
  type: UserRoles;
}

export interface User {
  id: number;
  username: string;
  email: string;
  fullname: string;
  password: string;
  institutions: Institution[];
  resetPasswordToken: string;
  confirmationToken: string;
  cpf: string;
  info: string;
  phone: string;
  blocked: boolean;
  confirmed: boolean;
  isProfessor: boolean;
  socials: any[];
  tags: Tag[];
  avatar: any;
  cover: any;
  role: Role;
  user_wallet?: Wallet;
}
