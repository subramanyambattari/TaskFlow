import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../index';
import mongoose from 'mongoose';
import { Todo } from '../models/Todo';
import { connectDB } from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

// Connect to a test database
beforeAll(async () => {
  const testUri = process.env.MONGODB_URI_TEST || process.env.MONGODB_URI || 'mongodb://localhost:27017/taskflow-test';
  await mongoose.connect(testUri);
});

// Clear DB before each test
beforeEach(async () => {
  await Todo.deleteMany({});
});

// Disconnect after tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Todo API Endpoints', () => {
  let createdTodoId = '';

  it('should create a new todo', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({
        title: 'Test Todo',
        description: 'Test description',
        priority: 'HIGH'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('_id');
    expect(res.body.data.title).toEqual('Test Todo');
    
    createdTodoId = res.body.data._id;
  });

  it('should fail to create a todo without a title', async () => {
    const res = await request(app)
      .post('/api/todos')
      .send({
        description: 'Missing title'
      });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('should get all todos', async () => {
    await Todo.create({ title: 'Another Todo' });
    const res = await request(app).get('/api/todos');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should get a single todo by id', async () => {
    const todo = await Todo.create({ title: 'Single Todo Test' });
    const res = await request(app).get(`/api/todos/${todo._id}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toEqual('Single Todo Test');
  });

  it('should return 404 for invalid todo id', async () => {
    const fakeId = new mongoose.Types.ObjectId().toString();
    const res = await request(app).get(`/api/todos/${fakeId}`);
    
    expect(res.statusCode).toEqual(404);
  });

  it('should update a todo', async () => {
    const todo = await Todo.create({ title: 'Old Title' });
    const res = await request(app)
      .put(`/api/todos/${todo._id}`)
      .send({ title: 'New Title', status: 'IN_PROGRESS' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toEqual('New Title');
    expect(res.body.data.status).toEqual('IN_PROGRESS');
  });

  it('should delete a todo', async () => {
    const todo = await Todo.create({ title: 'To Delete' });
    const res = await request(app).delete(`/api/todos/${todo._id}`);
    
    expect(res.statusCode).toEqual(204);
    
    const checkTodo = await Todo.findById(todo._id);
    expect(checkTodo).toBeNull();
  });
});
