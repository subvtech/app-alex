import { TaskMemberStatus } from './taskSimple.model';

export interface RecentTask {
  id: number;
  title: string;
  description: string;
  status: TaskMemberStatus;
  finish_at?: string | null;
  parent_name?: string | null;
  tags: { id: number; text: string }[];
}
