import { UserRoles } from '@/models/user.model';
import { InstitutionsType } from '@/models/institution.model';
import { Upload } from '@/models/upload.model';

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
  cover: Upload | null;
  role: UserRoles;
  wallet: Wallet | null;
  phone: string | null;
  info?: null;
}
