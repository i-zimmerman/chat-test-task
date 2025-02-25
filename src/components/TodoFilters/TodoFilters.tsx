import { Button } from "../common/Button/Button";
import { Priority } from '../../types/todo';
import styles from './TodoFilters.module.css';
import { Input } from "../common/Input/Input";

type FilterStatus = 'all' | 'active' | 'completed';
type SortOrder = 'asc' | 'desc';
type SortBy = 'date' | 'priority';

type Props = {
  filterStatus: FilterStatus;
  priorityFilter: Priority | null;
  sortBy: SortBy;
  sortOrder: SortOrder;
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFilterChange: (status: FilterStatus) => void;
  handlePriorityFilter: (priority: Priority | null) => void;
  handleSortChange: (sortBy: SortBy) => void;
}

export function TodoFilters({ 
  filterStatus, 
  priorityFilter, 
  sortBy, 
  sortOrder,
  searchTerm,
  handleSearchChange,
  handleFilterChange, 
  handlePriorityFilter, 
  handleSortChange 
}: Props) {
  return (
  <div className={styles.controls}>
    <div className={styles.searchContainer}>
      <Input
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search todos..."
        className={styles.searchInput}
      />
    </div>
    <div className={styles.filterGroup}>
      <p>Status</p>
      <div className={styles.filters}>
        <Button 
          size="small"
          onClick={() => handleFilterChange('all')}
          className={filterStatus === 'all' ? styles.active : ''}
        >
          All
        </Button>
        <Button 
          size="small"
          onClick={() => handleFilterChange('active')}
          className={filterStatus === 'active' ? styles.active : ''}
        >
          Active
        </Button>
        <Button 
          size="small"
          onClick={() => handleFilterChange('completed')}
          className={filterStatus === 'completed' ? styles.active : ''}
        >
          Completed
        </Button>
      </div>
      <p>Priority</p>
      <div className={styles.priorityFilters}>
        <Button 
          size="small"
          onClick={() => handlePriorityFilter(null)}
          className={priorityFilter === null ? styles.active : ''}
        >
          All
        </Button>
        <Button 
          size="small"
          onClick={() => handlePriorityFilter('high')}
          className={priorityFilter === 'high' ? styles.active : ''}
        >
          High
        </Button>
        <Button 
          size="small"
          onClick={() => handlePriorityFilter('medium')}
          className={priorityFilter === 'medium' ? styles.active : ''}
        >
          Medium
        </Button>
        <Button 
          size="small"
          onClick={() => handlePriorityFilter('low')}
          className={priorityFilter === 'low' ? styles.active : ''}
        >
          Low
        </Button>
      </div>
      <p>Sort by</p>
      <div className={styles.sortButtons}>
        <Button 
          onClick={() => handleSortChange('date')}
          className={`${styles.sortButton} ${sortBy === 'date' ? styles.active : ''}`}
          size="small"
        >
          Date {sortBy === 'date' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
        </Button>
        <Button 
          onClick={() => handleSortChange('priority')}
          className={`${styles.sortButton} ${sortBy === 'priority' ? styles.active : ''}`}
          size="small"
        >
          Priority {sortBy === 'priority' ? (sortOrder === 'asc' ? '↑' : '↓') : ''}
        </Button>
      </div>
    </div>
  </div>
);
}