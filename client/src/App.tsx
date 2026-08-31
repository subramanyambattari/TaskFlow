import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TodoDetails from './pages/TodoDetails';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="todo" element={<TodoDetails />} />
      </Route>
    </Routes>
  );
}

export default App;
