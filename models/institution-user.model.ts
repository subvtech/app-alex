import type { Institution } from './institution.model';
import type { User } from './user.model';

export interface InstitutionUser {
  id: number;
  role: 'administrator' | 'professor' | 'representative' | 'student';
  institution?: Institution;
  user: User;
}
