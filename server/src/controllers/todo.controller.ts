import { Request, Response, NextFunction } from 'express';
import { todoService } from '../services/todo.service';

export const getTodos = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todos = await todoService.getTodos(req.query);
    res.status(200).json({ success: true, data: todos });
  } catch (error) {
    next(error);
  }
};

export const getTodoById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todo = await todoService.getTodoById(req.params.id);
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

export const createTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todo = await todoService.createTodo(req.body);
    res.status(201).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

export const updateTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todo = await todoService.updateTodo(req.params.id, req.body);
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.status(200).json({ success: true, data: todo });
  } catch (error) {
    next(error);
  }
};

export const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todo = await todoService.deleteTodo(req.params.id);
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
