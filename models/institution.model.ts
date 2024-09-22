export interface Institution {
  acronym: string;
  address: string;
  cnpj: string;
  cover?: Upload | null;
  email: string;
  id: number;
  name: string;
  phone: string;
  sector: string;
  socialName: string;
  users?: User[];
}
