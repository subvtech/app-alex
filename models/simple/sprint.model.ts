export interface SprintSimple {
  id: number;
  title: string;
  start_at: string;
  end_at: string;
  tasks: TaskSimple[];
  project: LearningPlan;
  order: number;
  kanban: Kanban;
  kanban_column_tasks: KanbanColumnTask[];
}
