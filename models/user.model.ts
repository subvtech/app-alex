import { Tag } from './tag.model';

export enum UserRoles {
  PROFESSOR = 'professor',
  AUTHENTICATED = 'Authenticated',
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
  role: UserRoles;
}
