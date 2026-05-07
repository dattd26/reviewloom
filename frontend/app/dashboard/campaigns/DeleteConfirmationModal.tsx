'use client';

import { useState } from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  campaignName: string;
}

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, campaignName }: DeleteModalProps) {
  const [confirmName, setConfirmName] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const isValid = confirmName === campaignName;

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsDeleting(true);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-on-surface/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="w-14 h-14 bg-error/10 rounded-2xl flex items-center justify-center text-error mb-6">
            <span className="material-symbols-outlined text-3xl">delete_forever</span>
          </div>
          
          <h3 className="text-2xl font-headline font-black text-on-surface tracking-tight mb-2">
            Delete Campaign?
          </h3>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
            This action is permanent and will delete all scan data associated with <strong className="text-on-surface">{campaignName}</strong>.
          </p>

          <div className="space-y-4">
            <label className="block">
              <span className="text-[11px] font-bold uppercase tracking-widest text-outline mb-2 block">
                Type campaign name to confirm
              </span>
              <input
                type="text"
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                placeholder={campaignName}
                className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant/20 rounded-xl text-sm focus:ring-2 focus:ring-error/20 focus:border-error transition-all outline-none"
                autoFocus
              />
            </label>
          </div>
        </div>

        <div className="px-8 py-6 bg-surface-container-lowest flex items-center gap-3">
          <button
            onClick={() => {
                setConfirmName('');
                onClose();
            }}
            className="flex-1 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid || isDeleting}
            className={`flex-1 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest text-white shadow-lg transition-all ${
              isValid ? 'bg-error shadow-error/20 hover:shadow-error/30 active:scale-95' : 'bg-outline/20 cursor-not-allowed shadow-none'
            }`}
          >
            {isDeleting ? 'Deleting...' : 'Delete Forever'}
          </button>
        </div>
      </div>
    </div>
  );
}
