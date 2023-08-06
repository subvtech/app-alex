export interface User {
[x: string]: any;
  id: number;
  username: string;
  email: string;
  fullname: string;
  cpf: string;
  blocked: boolean;
  confirmed: boolean;
  isProfessor: boolean;
}
