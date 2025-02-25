import { mockApi } from './mockData';
import { Priority, BatchAction } from '../types/todo';

export const todoApi = {
  async getTodos(params = {}) {
    try {
      return await mockApi.getTodos(params);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Failed to fetch todos');
    }
  },

  async createTodo(title: string, priority: Priority) {
    try {
      const todo = await mockApi.createTodo(title, priority);
      return todo;
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Failed to create todo');
    }
  },

  async updateTodo(
    id: string,
    updates: Partial<{ title: string; completed: boolean }>
  ) {
    try {
      return await mockApi.updateTodo(id, updates);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Failed to update todo');
    }
  },


  async batchUpdateTodos(ids: string[], action: BatchAction, priority?: Priority) {
    try {
      return await mockApi.batchUpdateTodos(ids, action, priority);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error('Failed to perform batch update');
    }
  },
};
