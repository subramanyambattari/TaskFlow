import { Router } from 'express';
import { getTodos, getTodoById, createTodo, updateTodo, deleteTodo } from '../controllers/todo.controller';
import { validate } from '../middleware/error.middleware';
import { createTodoSchema, updateTodoSchema } from '../validators/todo.validator';

const router = Router();

router.get('/', getTodos);
router.get('/:id', getTodoById);
router.post('/', validate(createTodoSchema), createTodo);
router.put('/:id', validate(updateTodoSchema), updateTodo);
router.delete('/:id', deleteTodo);

export default router;
