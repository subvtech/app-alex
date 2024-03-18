import { Tag } from './tag.model';

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
  institute: string;
  resetPasswordToken: string;
  confirmationToken: string;
  cpf: string;
  blocked: boolean;
  confirmed: boolean;
  isProfessor: boolean;
  tags: Tag[];
  avatar: any;
  role: Role;
}
