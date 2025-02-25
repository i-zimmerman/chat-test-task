import { InputHTMLAttributes } from 'react';
import styles from './Input.module.css';

type Props = {
  error?: string;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ error, className, ...props }: Props) => (
  <input 
    className={`${styles.input} ${error ? styles.inputError : ''} ${className || ''}`}
    {...props} 
  />
);
