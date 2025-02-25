import { SelectHTMLAttributes } from 'react';
import styles from './Select.module.css';

type Props = {
  error?: string;
  className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({ error, className, ...props }: Props) => (
  <select 
    className={`${styles.select} ${className || ''}`}
    {...props} 
  />
); 