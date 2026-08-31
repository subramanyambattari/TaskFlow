import { Todo, ITodo } from '../models/Todo';
import { FilterQuery } from 'mongoose';

export class TodoService {
  async getTodos(filters: any) {
    const query: FilterQuery<ITodo> = {};

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }
    if (filters.status) query.status = filters.status;
    if (filters.priority) query.priority = filters.priority;

    let sort: any = { createdAt: -1 };
    if (filters.sortBy) {
      sort = { [filters.sortBy]: filters.sortOrder === 'asc' ? 1 : -1 };
    }

    return Todo.find(query).sort(sort);
  }

  async getTodoById(id: string) {
    return Todo.findById(id);
  }

  async createTodo(data: Partial<ITodo>) {
    const todo = new Todo(data);
    return todo.save();
  }

  async updateTodo(id: string, data: Partial<ITodo>) {
    return Todo.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteTodo(id: string) {
    return Todo.findByIdAndDelete(id);
  }
}

export const todoService = new TodoService();
