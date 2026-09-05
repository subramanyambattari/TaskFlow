import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService } from '../services/api';
import { format } from 'date-fns';
import { ArrowLeft, Trash2, Edit2, CheckCircle, Clock } from 'lucide-react';
import TodoModal from '../components/TodoModal';
import DeleteModal from '../components/DeleteModal';
import toast from 'react-hot-toast';

export default function TodoDetails() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: todo, isLoading, isError } = useQuery({
    queryKey: ['todo', id],
    queryFn: () => id ? todoService.getTodoById(id) : Promise.reject('No ID'),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: todoService.deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      toast.success('Todo deleted');
      navigate('/');
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) => todoService.updateTodo(id!, { status: status as any }),
    onSuccess: (_, status) => {
      queryClient.invalidateQueries({ queryKey: ['todo', id] });
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      if (status === 'COMPLETED') {
        toast.success('Marked complete');
      } else {
        toast.success('Todo updated');
      }
    },
  });

  if (!id) return <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg">Error: No Todo ID provided in the URL query parameter. Example: /todo?id=...</div>;
  if (isLoading) return <div className="animate-pulse bg-white h-64 rounded-lg border p-6"></div>;
  if (isError || !todo) return <div className="p-8 text-center bg-white rounded-lg border">Todo not found or an error occurred.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="border-b p-6 bg-gray-50/50">
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{todo.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap
              ${todo.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 
                todo.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 
                'bg-green-100 text-green-700'}`}>
              {todo.priority} Priority
            </span>
          </div>
        </div>

        <div className="p-6 space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
            <p className="text-gray-800 whitespace-pre-wrap">{todo.description || 'No description provided.'}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 pt-6 border-t">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
              <p className="font-medium text-gray-900 flex items-center gap-2">
                {todo.status === 'COMPLETED' ? <CheckCircle size={16} className="text-green-500" /> : <Clock size={16} className="text-blue-500" />}
                {todo.status.replace('_', ' ')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Category</p>
              <p className="font-medium text-gray-900">
                {todo.category || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Due Date</p>
              <p className="font-medium text-gray-900">
                {todo.dueDate ? format(new Date(todo.dueDate), 'MMM d, yyyy') : 'No due date'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Created</p>
              <p className="font-medium text-gray-900">
                {format(new Date(todo.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Updated</p>
              <p className="font-medium text-gray-900">
                {format(new Date(todo.updatedAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 border-t flex flex-wrap gap-4">
          <button 
            onClick={() => statusMutation.mutate(todo.status === 'COMPLETED' ? 'TODO' : 'COMPLETED')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors
              ${todo.status === 'COMPLETED' 
                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                : 'bg-green-600 text-white hover:bg-green-700'}`}
          >
            <CheckCircle size={18} />
            {todo.status === 'COMPLETED' ? 'Mark as Pending' : 'Mark as Completed'}
          </button>
          
          <div className="flex-1"></div>

          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            <Edit2 size={18} /> Edit Task
          </button>
          
          <button 
            onClick={() => setIsDeleteModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors"
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>
      {todo && <TodoModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} todo={todo} />}
      {todo && (
        <DeleteModal 
          isOpen={isDeleteModalOpen} 
          onClose={() => setIsDeleteModalOpen(false)} 
          onConfirm={() => deleteMutation.mutate(todo._id)} 
          todoTitle={todo.title} 
        />
      )}
    </div>
  );
}
