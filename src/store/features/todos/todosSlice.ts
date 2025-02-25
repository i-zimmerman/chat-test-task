import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Todo, Priority, BatchAction } from '../../../types/todo';
import { todoApi } from '../../../api/todoApi';

interface TodosState {
  items: Todo[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: TodosState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  return await todoApi.getTodos();
});

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async ({ title, priority }: { title: string; priority: Priority }) => {
    return await todoApi.createTodo(title, priority);
  }
);

export const toggleTodo = createAsyncThunk(
  'todos/toggleTodo',
  async (todo: Todo) => {
    return await todoApi.updateTodo(todo.id, { completed: !todo.completed });
  }
);

export const batchUpdateTodos = createAsyncThunk(
  'todos/batchUpdateTodos',
  async ({ ids, action, priority }: { ids: string[]; action: BatchAction; priority?: Priority }) => {
    return await todoApi.batchUpdateTodos(ids, action, priority);
  }
);

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodoOptimistically: (state, action: PayloadAction<Todo>) => {
      const index = state.items.findIndex(todo => todo.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload.todos;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch todos';
      })
      .addCase(addTodo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items.push(action.payload);
      })
      .addCase(addTodo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to add todo';
      })
      .addCase(toggleTodo.fulfilled, (state, action) => {
        const index = state.items.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(toggleTodo.rejected, (state) => {
        state.error = 'Failed to toggle todo';
      })
      .addCase(batchUpdateTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(batchUpdateTodos.fulfilled, (state, action) => {
        state.status = 'idle';
        state.items = action.payload.updated
      })
      .addCase(batchUpdateTodos.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { addTodoOptimistically } = todosSlice.actions;
export default todosSlice.reducer;
