import { TaskStatus, TaskType } from '@/models/simple/taskSimple.model';

interface Deliverable {
  completed: number;
  doing: number;
  toDo: number;
  underReview: number;
}

interface Student {
  name: string;
  image?: {
    url: string;
  };
}

export interface SprintTask {
  id: number;
  archived_at?: string | null;
  children?: SprintTask[];
  delivered: Deliverable;
  finish_at?: string | null;
  position: number;
  start_at?: string | null;
  status: TaskStatus;
  students?: Student[];
  title: string;
  type?: TaskType | null;
}

export interface Droppable<T extends { id: number }> {
  expanded?: 0 | 1;
  group: string;
  raw: T;
}
