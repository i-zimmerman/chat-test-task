import { useSearchParams } from 'react-router-dom';
import { Priority, Todo, FilterStatus, SortOrder, SortBy  } from '../types/todo';
import { useMemo, useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { toggleTodo, addTodoOptimistically } from '../store/features/todos/todosSlice';
import { useDebounce } from './useDebounce';

const PRIORITY_ORDER: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};


// We can move filtering and sorting logic to the backend if we predict that the number of todos will be huge
// and it will be a performance issue to filter and sort them on the frontend
export const useTodoFilters = (todos: Todo[]) => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    let updated = false;

    if (!searchParams.has('status')) {
      newParams.set('status', 'all');
      updated = true;
    }

    if (!searchParams.has('sort')) {
      newParams.set('sort', 'desc');
      updated = true;
    }

    if (!searchParams.has('sortBy')) {
      newParams.set('sortBy', 'date');
      updated = true;
    }

    if (updated) {
      setSearchParams(newParams);
    }
  }, [searchParams, setSearchParams]);


  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    
    if (debouncedSearchTerm) {
      newParams.set('search', debouncedSearchTerm);
    } else {
      newParams.delete('search');
    }
    
    setSearchParams(newParams);
  }, [debouncedSearchTerm, searchParams, setSearchParams]);


  const filterStatus = (searchParams.get('status') as FilterStatus) || 'all';
  const sortOrder = (searchParams.get('sort') as SortOrder) || 'desc';
  const sortBy = (searchParams.get('sortBy') as SortBy) || 'date';
  const priorityFilter = searchParams.get('priority') as Priority | null;
  const searchFilter = searchParams.get('search') || '';

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleToggle = useCallback(async (todoId: string) => {
    const todo = todos.find(t => t.id === todoId);
    
    if (todo) {
      try {
        const optimisticTodo = {
          ...todo,
          completed: !todo.completed,
          updatedAt: new Date().toISOString()
        };
        
        dispatch(addTodoOptimistically(optimisticTodo));
        await dispatch(toggleTodo(todo)).unwrap();
      } catch (error) {
        console.error('Failed to toggle todo:', error);
      }
    }
  }, [todos, dispatch]);

  const handleFilterChange = useCallback((status: FilterStatus) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('status', status);
      return newParams;
    });
  }, [setSearchParams]);

  const handlePriorityFilter = useCallback((priority: Priority | null) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (priority) {
        newParams.set('priority', priority);
      } else {
        newParams.delete('priority');
      }
      return newParams;
    });
  }, [setSearchParams]);

  const handleSortChange = useCallback((newSortBy: SortBy) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (newSortBy === sortBy) {
        newParams.set('sort', sortOrder === 'asc' ? 'desc' : 'asc');
      } else {
        newParams.set('sortBy', newSortBy);
        newParams.set('sort', 'desc');
      }
      return newParams;
    });
  }, [setSearchParams, sortBy, sortOrder]);

  const filteredAndSortedTodos = useMemo(() => {
    let result = [...todos];

    if (searchFilter) {
      const searchLower = searchFilter.toLowerCase();
      result = result.filter(todo => 
        todo.title.toLowerCase().includes(searchLower)
      );
    }

    if (filterStatus === 'active') {
      result = result.filter(todo => !todo.completed);
    } else if (filterStatus === 'completed') {
      result = result.filter(todo => todo.completed);
    }

    if (priorityFilter) {
      result = result.filter(todo => todo.priority === priorityFilter);
    }

    result.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityDiff = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
        if (priorityDiff !== 0) return sortOrder === 'asc' ? -priorityDiff : priorityDiff;
      }
      
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [todos, searchFilter, filterStatus, priorityFilter, sortBy, sortOrder]);

  return {
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
  };
}; 