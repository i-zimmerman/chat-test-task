import { BrowserRouter as Router } from 'react-router-dom';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/TodoList/TodoList';
import styles from './App.module.css';

function App() {
  return (
    <Router>
      <div className={styles.container}>
        <main>
          <TodoForm />
          <TodoList />
        </main>
      </div>
    </Router>
  );
}

export default App;