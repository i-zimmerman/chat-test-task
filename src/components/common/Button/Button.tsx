import { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

type Props = {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'small';
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ 
  children, 
  className,
  size = 'default',
  ...props 
}: Props) {
  return (
    <button 
      className={`
        ${styles.button} 
        ${styles[size]} 
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
