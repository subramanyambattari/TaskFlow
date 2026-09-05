import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService } from '../services/api';
import type { Todo } from '../types';
import toast from 'react-hot-toast';

interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  todo?: Todo;
}

export default function TodoModal({ isOpen, onClose, todo }: TodoModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('TODO');
  const [category, setCategory] = useState('WORK');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      setTitle(todo?.title || '');
      setDescription(todo?.description || '');
      setPriority(todo?.priority || 'MEDIUM');
      setStatus(todo?.status || 'TODO');
      setCategory(todo?.category || 'WORK');
      setDueDate(todo?.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
    }
  }, [isOpen, todo]);

  const createMutation = useMutation({
    mutationFn: todoService.createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      onClose();
      toast.success('Todo created');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => todoService.updateTodo(todo!._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo', todo?._id] });
      onClose();
      toast.success('Todo updated');
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert('Title is required');
    
    let formattedDate = undefined;
    if (dueDate) {
      formattedDate = new Date(dueDate).toISOString();
    }
    
    const payload = { 
      title, 
      description: description || undefined, 
      priority: priority as any, 
      status: status as any, 
      category: category as any,
      dueDate: formattedDate 
    };

    if (todo) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm">
      <div className="bg-white shadow-2xl rounded-2xl max-w-lg w-full p-8 border border-gray-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-bold text-blue-600 tracking-widest uppercase mb-2">{todo ? 'Edit Record' : 'New Record'}</p>
            <h2 className="text-3xl font-bold text-gray-900">{todo ? 'Edit todo' : 'Add a todo'}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 hover:border-gray-700 transition-colors border-b border-gray-300 text-sm pb-0.5 mt-2">Close</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" placeholder="What needs your attention?" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">
              Description <span className="font-normal text-gray-400 normal-case">(optional)</span>
            </label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow resize-none" rows={3} placeholder="Add useful context, links, or the next step"></textarea>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow">
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow">
                <option value="TODO">Todo</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-2.5 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow">
                <option value="WORK">Work</option>
                <option value="PERSONAL">Personal</option>
                <option value="HEALTH">Health</option>
                <option value="EDUCATION">Education</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 mt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
              {isPending ? 'Saving...' : todo ? 'Save changes' : 'Create todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
