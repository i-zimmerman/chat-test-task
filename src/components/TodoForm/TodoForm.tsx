import React from 'react';
import { Button } from '../common/Button/Button';
import { Input } from '../common/Input/Input';
import { Select } from '../common/Select/Select';
import { useTodoForm } from '../../hooks/useTodoForm';
import styles from './TodoForm.module.css';

export const TodoForm = React.memo(() => {
  const {
    title,
    priority,
    error,
    handleTitleChange,
    handlePriorityChange,
    handleFocus,
    handleSubmit
  } = useTodoForm();

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Add todo</h2>
      <div className={styles.inputGroup}>
        <Input
          value={title}
          onChange={handleTitleChange}
          onFocus={handleFocus}
          placeholder="Watch some youtube..."
          error={error}
        />
        <Select 
          value={priority}
          onChange={handlePriorityChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <Button type="submit">Add Todo</Button>
    </form>
  );
});

TodoForm.displayName = 'TodoForm';
