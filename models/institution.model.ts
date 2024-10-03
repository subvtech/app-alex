import type { InstitutionUser } from './institution-user.model';

export interface Institution {
  acronym: string;
  address: string;
  cnpj: string;
  cover?: Upload | null;
  email: string;
  id: number;
  institution_users: InstitutionUser[];
  name: string;
  phone: string;
  sector: string;
  socialName: string;
  users?: User[];
}
