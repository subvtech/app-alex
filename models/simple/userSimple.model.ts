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
  blocked: boolean;
  confirmed: boolean;
  isProfessor: boolean;
  tags: any[];
  socials: any[];
  avatar: Upload | null;
  cover: Upload;
  role: UserRoles;
  phone: string | null;
  info: null;
}
