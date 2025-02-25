import React from 'react';
import { Todo } from '../../types/todo';
import styles from './TodoItem.module.css';
import CompletedIcon from '../../assets/icons/completedIcon.png';
import IncompleteIcon from '../../assets/icons/incompletedIcon.png';
import { formatDate } from '../../utils/helpers';

type Props = {
  todo: Todo;
}

export const TodoItem = React.memo(({ 
  todo, 
}: Props) => {
  return (
    <li 
      className={`
        ${styles.container} 
        ${todo.completed ? styles.itemCompleted : ''}
      `}
      data-todo-id={todo.id}
    >
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <img 
            src={todo.completed ? CompletedIcon : IncompleteIcon} 
            alt={todo.completed ? "Completed" : "Incomplete"} 
            className={styles.icon} 
          />
        </div>
        <div className={styles.titleWrapper}>
          <div className={`${styles.priorityIndicator} ${styles[todo.priority]}`}></div>
          <span className={styles.title}>{todo.title}</span>
        </div>
      </div>
      <span className={styles.date}>{formatDate(todo.createdAt)}</span>
    </li> 
  );
});

TodoItem.displayName = 'TodoItem';
