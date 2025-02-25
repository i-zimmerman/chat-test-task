import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { batchUpdateTodos } from '../store/features/todos/todosSlice';
import { BatchAction, Priority, Todo } from '../types/todo';

export const useTodoBatchActions = () => {
  const [selectedTodos, setSelectedTodos] = useState<string[]>([]);
  const [batchUpdateError, setBatchUpdateError] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleToggleSelect = useCallback((todoId: string) => {
    setSelectedTodos(prev => {
      if (prev.includes(todoId)) {
        return prev.filter(id => id !== todoId);
      } else {
        return [...prev, todoId];
      }
    });
  }, []);

  const handleSelectAll = useCallback((todos: Todo[]) => {
    const allIds = todos.map(todo => todo.id);
    setSelectedTodos(allIds);
  }, []);

  const handleDeselectAll = useCallback(() => {
    setSelectedTodos([]);
  }, []);

  const handleBatchAction = useCallback(
    async (action: BatchAction, { priority }: { priority?: Priority } = {}) => {
      if (selectedTodos.length === 0) return;

      try {
        await dispatch(
          batchUpdateTodos({
            ids: selectedTodos,
            action,
            priority
          })
        ).unwrap();
        setSelectedTodos([]);
        setBatchUpdateError('');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setBatchUpdateError(`Failed to ${action} todos: ${errorMessage}`);
        console.error(`Failed to ${action} todos:`, error);
      }
    },
    [dispatch, selectedTodos]
  );

  const handleBatchComplete = useCallback(() => {
    handleBatchAction('complete');
  }, [handleBatchAction]);

  const handleBatchDelete = useCallback(() => {
    handleBatchAction('delete');
  }, [handleBatchAction]);

  const handleBatchUpdatePriority = useCallback((priority: Priority) => {
    console.log(`Update priority to ${priority} for todos:`, selectedTodos);
    handleBatchAction('updatePriority', { priority });
  }, [selectedTodos]);

  return {
    selectedTodos,
    batchUpdateError,
    handleToggleSelect,
    handleSelectAll,
    handleDeselectAll,
    handleBatchComplete,
    handleBatchDelete,
    handleBatchUpdatePriority
  };
}; 