import { Tag } from './tag.model';
import { InstitutionsType } from './institution.model';

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
  institutions: InstitutionsType[];
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
  wallet?: Wallet;
}
