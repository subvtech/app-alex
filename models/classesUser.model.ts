import { Class } from './class.model';
import { User } from './user.model';

export interface ClassesUser {
  id: number;
  class: Class;
  user: User;
  confirmed: Boolean;
  join_date: Date;
  confirm_date: Date;
}
