import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService } from '../services/api';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import TodoModal from '../components/TodoModal';

export default function Dashboard() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const queryClient = useQueryClient();

  const { data: todos, isLoading, isError } = useQuery({
    queryKey: ['todos', search, statusFilter],
    queryFn: () => todoService.getTodos({ search, status: statusFilter }),
  });

  const deleteMutation = useMutation({
    mutationFn: todoService.deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(id);
    }
  };

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => todoService.updateTodo(id, { status: status as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });

  if (isError) return <div className="text-red-500">Failed to load tasks. Please try again.</div>;

  const total = todos?.length || 0;
  const pending = todos?.filter(t => t.status === 'TODO').length || 0;
  const completed = todos?.filter(t => t.status === 'COMPLETED').length || 0;
  const inProgress = todos?.filter(t => t.status === 'IN_PROGRESS').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} /> Add Task
        </button>
      </div>
      <TodoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-2xl font-semibold">{total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Todo</p>
          <p className="text-2xl font-semibold text-gray-700">{pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-semibold text-blue-600">{inProgress}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-semibold text-green-600">{completed}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-400" />
          <select
            className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="TODO">Todo</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white h-24 rounded-lg border"></div>
          ))}
        </div>
      ) : todos?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border">
          <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
          <p className="text-gray-500 mt-1">Create a new task to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {todos?.map(todo => (
            <div key={todo._id} className="bg-white p-4 rounded-lg border shadow-sm flex flex-col sm:flex-row gap-4 justify-between hover:border-blue-300 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold text-lg ${todo.status === 'COMPLETED' ? 'line-through text-gray-400' : ''}`}>
                    <Link to={`/todo?id=${todo._id}`} className="hover:text-blue-600 hover:underline">
                      {todo.title}
                    </Link>
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium
                    ${todo.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 
                      todo.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-green-100 text-green-700'}`}>
                    {todo.priority}
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-100 text-gray-600">
                    {todo.status.replace('_', ' ')}
                  </span>
                </div>
                {todo.description && (
                  <p className="text-gray-600 text-sm line-clamp-2 mb-2">{todo.description}</p>
                )}
                {todo.dueDate && (
                  <p className="text-xs text-gray-500">Due: {format(new Date(todo.dueDate), 'PPP')}</p>
                )}
              </div>
              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <button
                  onClick={() => toggleStatusMutation.mutate({ 
                    id: todo._id, 
                    status: todo.status === 'COMPLETED' ? 'TODO' : 'COMPLETED' 
                  })}
                  className="text-sm px-3 py-1.5 border rounded hover:bg-gray-50"
                >
                  {todo.status === 'COMPLETED' ? 'Mark Todo' : 'Complete'}
                </button>
                <Link to={`/todo?id=${todo._id}`} className="text-sm px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded">
                  View
                </Link>
                <button 
                  onClick={() => handleDelete(todo._id)}
                  className="text-sm px-3 py-1.5 text-red-600 hover:bg-red-50 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
