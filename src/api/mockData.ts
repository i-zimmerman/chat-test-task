import { BatchAction, Priority, Todo } from '../types/todo';

const generateId = () => Math.random().toString(36).substr(2, 9);

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let todos: Todo[] = [
  {
    id: generateId(),
    title: 'Learn React',
    completed: false,
    priority: 'high' as Priority,
    createdAt: '2024-02-09T10:00:00.000Z',
    updatedAt: '2024-02-09T10:00:00.000Z',
  },
  {
    id: generateId(),
    title: 'Build a todo app',
    completed: true,
    priority: 'medium' as Priority,
    createdAt: '2024-02-09T11:00:00.000Z',
    updatedAt: '2024-02-09T15:00:00.000Z',
  },
];

export const mockApi = {
  async getTodos(
    params: { search?: string; status?: string; sortBy?: string } = {}
  ) {
    await delay(200);

    let filteredTodos = [...todos];

    // Apply search filter
    if (params.search) {
      filteredTodos = filteredTodos.filter((todo) =>
        todo.title.toLowerCase().includes(params.search!.toLowerCase())
      );
    }

    // Apply status filter
    if (params.status === 'completed') {
      filteredTodos = filteredTodos.filter((todo) => todo.completed);
    } else if (params.status === 'active') {
      filteredTodos = filteredTodos.filter((todo) => !todo.completed);
    }

    // Apply sorting
    if (params.sortBy === 'createdAt') {
      filteredTodos.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return {
      todos: filteredTodos,
      total: filteredTodos.length,
    };
  },

  async getTodoById(id: string) {
    await delay(200);
    const todo = todos.find((t) => t.id === id);
    if (!todo) throw new Error('Todo not found');
    return todo;
  },

  async createTodo(title: string, priority: Priority = 'medium') {
    await delay(200);

    if (!title) throw new Error('Title is required');
    if (title.length > 100)
      throw new Error('Title must be less than 100 characters');

    const newTodo = {
      id: generateId(),
      title,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todos = [...todos, newTodo];
    return newTodo;
  },

  async updateTodo(
    id: string,
    updates: Partial<{ title: string; completed: boolean }>
  ) {
    await delay(200);

    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Todo not found');

    if (updates.title && updates.title.length > 100) {
      throw new Error('Title must be less than 100 characters');
    }

    const updatedTodo = {
      ...todos[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    todos = todos.map((t) => (t.id === id ? updatedTodo : t));
    return updatedTodo;
  },

  async deleteTodo(id: string) {
    await delay(200);

    const exists = todos.some((t) => t.id === id);
    if (!exists) throw new Error('Todo not found');

    todos = todos.filter((t) => t.id !== id);
    return { success: true };
  },

  async batchUpdateTodos(ids: string[], action: BatchAction, priority?: Priority): Promise<{ success: boolean, updated: Todo[]}> {
    await delay(300);

    if (action === 'complete') {
      todos = todos.map((todo) =>
        ids.includes(todo.id)
          ? { ...todo, completed: true, updatedAt: new Date().toISOString() }
          : todo
      );
    } 

    if (action === 'delete') {
      todos = todos.filter((todo) => !ids.includes(todo.id));
    } 

    if (action === 'updatePriority' && priority) {
      todos = todos.map((todo) =>
        ids.includes(todo.id)
          ? { ...todo, priority, updatedAt: new Date().toISOString() }
          : todo
      );
    }

    return {
      success: true,
      updated: todos,
    };
  },
};
