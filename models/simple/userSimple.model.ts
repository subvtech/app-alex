import { UserRoles } from '../user.model';

export interface UserSimple {
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
  tags: any[];
  avatar: Upload | null;
  role: UserRoles;
  phone: string | null;
  info: null;
  cover: string | null;
}
