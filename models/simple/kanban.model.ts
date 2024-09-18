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
