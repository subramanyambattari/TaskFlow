import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todoService } from '../services/api';
import { X } from 'lucide-react';

export default function TodoModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [status, setStatus] = useState('TODO');
  const [dueDate, setDueDate] = useState('');

  const mutation = useMutation({
    mutationFn: todoService.createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      onClose();
      setTitle('');
      setDescription('');
      setDueDate('');
    },
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert('Title is required');
    
    let formattedDate = undefined;
    if (dueDate) {
      formattedDate = new Date(dueDate).toISOString();
    }
    
    mutation.mutate({ 
      title, 
      description: description || undefined, 
      priority: priority as any, 
      status: status as any, 
      dueDate: formattedDate 
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white shadow-lg max-w-lg w-full p-8 border border-gray-200" style={{ borderRadius: '4px' }}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-[10px] font-bold text-blue-600 tracking-widest uppercase mb-2">New Record</p>
            <h2 className="text-3xl font-medium text-gray-900">Add a todo</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 border-b border-gray-400 text-sm pb-0.5 mt-2">Close</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="What needs your attention?" />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Description <span className="font-normal text-gray-400 normal-case">(optional)</span>
            </label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" rows={4} placeholder="Add useful context, links, or the next step"></textarea>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Priority</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2.5 bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none">
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Due Date</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full border border-gray-300 rounded px-4 py-2.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Tags <span className="font-normal text-gray-400 normal-case">(comma separated)</span>
            </label>
            <input type="text" className="w-full border border-gray-300 rounded px-4 py-2.5 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="project, focus, follow-up" />
          </div>
          
          <div className="border-t border-gray-100 pt-6 mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={mutation.isPending} className="px-6 py-2.5 bg-[#0033a0] text-white rounded font-medium hover:bg-[#002277] transition-colors disabled:opacity-50">
              {mutation.isPending ? 'Saving...' : 'Create todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
