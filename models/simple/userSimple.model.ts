import { UserRoles } from '../user.model';

export interface UserSimple {
  id: number;
  username: string;
  email: string;
  fullname: string;
  password: string;
  institutions: InstitutionsType[];
  resetPasswordToken: string;
  confirmationToken: string;
  cpf: string;
  phone: string;
  info: string;
  blocked: boolean;
  confirmed: boolean;
  isProfessor: boolean;
  tags: any[];
  socials: any[];
  avatar: Upload;
  cover: Upload;
  role: UserRoles;
}
