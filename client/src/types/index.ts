export type Status = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type Category = 'WORK' | 'PERSONAL' | 'HEALTH' | 'EDUCATION';

export interface Todo {
  _id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  category?: Category;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  category?: Category;
  dueDate?: string | null;
}

export type UpdateTodoInput = Partial<CreateTodoInput>;
