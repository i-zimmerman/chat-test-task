import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { TodoItem } from '../TodoItem/TodoItem';
import { useTodoFilters } from '../../hooks/useTodoFilters';
import { useTodoBatchActions } from '../../hooks/useTodoBatchActions';
import styles from './TodoList.module.css';
import { fetchTodos } from '../../store/features/todos/todosSlice';
import { useDispatch } from 'react-redux';
import { TodoFilters } from '../TodoFilters/TodoFilters';
import { TodoListActions } from '../TodoListActions/TodoListActions';

export const TodoList = () => {
  const { items, status } = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch<AppDispatch>();

  const {
    filterStatus,
    sortOrder,
    sortBy,
    priorityFilter,
    searchTerm,
    handleSearchChange,
    handleToggle,
    handleFilterChange,
    handlePriorityFilter,
    handleSortChange,
    filteredAndSortedTodos,
  } = useTodoFilters(items);

  const {
    selectedTodos,
    handleSelectAll,
    handleDeselectAll,
    handleBatchComplete,
    handleBatchDelete,
    handleBatchUpdatePriority
  } = useTodoBatchActions();

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleTodoClick = useCallback((e: React.MouseEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement;
    const todoElement = target.closest('li[data-todo-id]') as HTMLElement;

    if (todoElement) {
      const todoId = todoElement.dataset.todoId as string;
      handleToggle(todoId);
    }
  }, [handleToggle]);

  const hasSelectedAll = selectedTodos.length === filteredAndSortedTodos.length && filteredAndSortedTodos.length > 0;

  return (
    <div className={styles.container}>
      <TodoFilters 
        filterStatus={filterStatus}
        priorityFilter={priorityFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
        searchTerm={searchTerm}
        handleSearchChange={handleSearchChange}
        handleFilterChange={handleFilterChange}
        handlePriorityFilter={handlePriorityFilter}
        handleSortChange={handleSortChange}
      />

      {status === 'loading' && (
        <div className={styles.statusOverlay}>
          <div className={styles.loading}>Loading todos...</div>
        </div>
      )}

      {status === 'failed' && (
        <div className={styles.statusOverlay}>
          <div className={styles.error}>Error loading todos</div>
        </div>
      )}

      {status === 'idle' && (
        <>
          <TodoListActions 
            selectedTodos={selectedTodos}
            onBatchComplete={handleBatchComplete}
            onBatchDelete={handleBatchDelete}
            onBatchUpdatePriority={handleBatchUpdatePriority}
            onDeselectAll={handleDeselectAll}
            onSelectAll={() => handleSelectAll(filteredAndSortedTodos)}
            hasSelectedAll={hasSelectedAll}
            totalTodos={filteredAndSortedTodos.length}
          />

          <ul className={styles.todoList} onClick={handleTodoClick}>
            {filteredAndSortedTodos.map((todo) => (
              <TodoItem 
                key={todo.id} 
                todo={todo}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};
