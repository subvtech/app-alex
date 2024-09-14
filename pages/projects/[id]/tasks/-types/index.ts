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
  delivered?: Deliverable;
  finish_at?: string | null;
  position: number;
  start_at?: string | null;
  status: TaskStatus;
  students?: Student[];
  title: string;
  type?: TaskType | null;
  organization?: 'epic' | 'standard' | 'story';
}

export interface Droppable<T extends { id: number }> {
  expanded?: 0 | 1;
  group: string;
  raw: T;
}

export const KanbanStatusType = {
  TO_DO: 'to_do',
  DOING: 'doing',
  DONE: 'done',
} as const;

export interface KanbanColumnTask {
  id: number;
  task: TaskSimple;
  vertical_position: number;
  // eslint-disable-next-line no-use-before-define
  kanban_column: KanbanColumn;
}

export interface KanbanColumn {
  id: number;
  position: number;
  status_type: ValueOf<typeof KanbanStatusType>;
  title: string;
  tasks: KanbanColumnTask[];
}
export interface Kanban {
  id: number;
  isDefault: boolean;
  version: number;
  kanban_columns: KanbanColumn[];
}
