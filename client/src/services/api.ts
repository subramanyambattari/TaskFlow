import axios from 'axios';
import { Todo, CreateTodoInput, UpdateTodoInput } from '../types';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

export const todoService = {
  getTodos: async (params?: Record<string, string>) => {
    const { data } = await api.get<{ success: boolean; data: Todo[] }>('/todos', { params });
    return data.data;
  },

  getTodoById: async (id: string) => {
    const { data } = await api.get<{ success: boolean; data: Todo }>(`/todos/${id}`);
    return data.data;
  },

  createTodo: async (todo: CreateTodoInput) => {
    const { data } = await api.post<{ success: boolean; data: Todo }>('/todos', todo);
    return data.data;
  },

  updateTodo: async (id: string, todo: UpdateTodoInput) => {
    const { data } = await api.put<{ success: boolean; data: Todo }>(`/todos/${id}`, todo);
    return data.data;
  },

  deleteTodo: async (id: string) => {
    await api.delete(`/todos/${id}`);
  },
};
