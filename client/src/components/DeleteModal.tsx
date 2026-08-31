import React from 'react';
import { createPortal } from 'react-dom';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  todoTitle: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, todoTitle }: DeleteModalProps) {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-[10000] backdrop-blur-sm">
      <div className="bg-white shadow-2xl max-w-sm w-full p-8 border border-gray-100" style={{ borderRadius: '4px' }}>
        <p className="text-[10px] font-bold text-red-600 tracking-widest uppercase mb-2">Destructive Action</p>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delete this todo?</h2>
        
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          "{todoTitle}" will be permanently removed from your list.
        </p>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-5 py-2 border border-gray-300 rounded text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Keep todo
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className="px-5 py-2 bg-[#b91c1c] text-white rounded font-medium hover:bg-[#991b1b] transition-colors text-sm"
          >
            Delete todo
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
}
