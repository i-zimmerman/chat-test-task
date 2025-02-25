import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { addTodo } from '../store/features/todos/todosSlice';
import { Priority } from '../types/todo';

export const useTodoForm = () => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch<AppDispatch>();

  const resetForm = useCallback(() => {
    setTitle('');
    setPriority('medium');
    setError('');
  }, []);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (error) setError('');
  }, [error]);

  const handlePriorityChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value as Priority);
  }, []);

  const handleFocus = useCallback(() => {
    if (error) setError('');
  }, [error]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      await dispatch(addTodo({ title, priority })).unwrap();
      resetForm();
    } catch (error) {
      setError('Failed to save todo');
      console.error('Error saving todo:', error);
    }
  }, [title, priority, dispatch, resetForm]);

  const handleCancelEdit = useCallback(() => {
    resetForm();
  }, [resetForm]);

  return {
    title,
    priority,
    error,
    handleTitleChange,
    handlePriorityChange,
    handleFocus,
    handleSubmit,
    handleCancelEdit,
  };
}; 