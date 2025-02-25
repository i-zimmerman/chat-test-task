import React from 'react';
import { Priority } from '../../types/todo';
import styles from './TodoListActions.module.css';
import { Button } from '../common/Button/Button';

interface TodoListActionsProps {
  selectedTodos: string[];
  onBatchComplete: () => void;
  onBatchDelete: () => void;
  onBatchUpdatePriority: (priority: Priority) => void;
  onDeselectAll: () => void;
  onSelectAll: () => void;
  hasSelectedAll: boolean;
  totalTodos: number;
}

export const TodoListActions: React.FC<TodoListActionsProps> = ({
  selectedTodos,
  onBatchComplete,
  onBatchDelete,
  onBatchUpdatePriority,
  onDeselectAll,
  onSelectAll,
  hasSelectedAll,
  totalTodos
}) => {
  const selectedCount = selectedTodos.length;
  
  if (selectedCount === 0) {
    return (
      <div className={styles.container}>
        <Button 
          type="button" 
          onClick={onSelectAll}
          className={styles.selectAllButton}
          size="small"
        >
          Select All ({totalTodos})
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.info}>
        <span className={styles.selectedCount}>Selected: {selectedCount}</span>
        {hasSelectedAll ? (
          <Button 
            type="button" 
            onClick={onDeselectAll}
            className={styles.deselectButton}
            size="small"
          >
            Deselect All
          </Button>
        ) : (
          <Button 
            type="button" 
            onClick={onSelectAll}
            className={styles.selectAllButton}
            size="small"
          >
            Select All
          </Button>
        )}
      </div>
      
      <div className={styles.actions}>
        <Button 
          type="button" 
          onClick={onBatchComplete}
          className={styles.completeButton}
          size="small"
        >
          Complete All
        </Button>
        
        <div className={styles.priorityActions}>
          <span className={styles.priorityLabel}>Change priority to:</span>
          <div className={styles.priorityButtons}>
            <Button 
              type="button" 
              onClick={() => onBatchUpdatePriority('high')}
              className={`${styles.priorityButton} ${styles.highPriority}`}
              size="small"
            >
              High
            </Button>
            <Button 
              type="button" 
              onClick={() => onBatchUpdatePriority('medium')}
              className={`${styles.priorityButton} ${styles.mediumPriority}`}
              size="small"
            >
              Medium
            </Button>
            <Button 
              type="button" 
              onClick={() => onBatchUpdatePriority('low')}
              className={`${styles.priorityButton} ${styles.lowPriority}`}
              size="small"
            >
              Low
            </Button>
          </div>
        </div>
        
        <Button 
          type="button" 
          onClick={onBatchDelete}
          className={styles.deleteButton}
          size="small"
        >
          Delete All
        </Button>
      </div>
    </div>
  );
}; 