import React from 'react';
import { AlertCircle } from 'lucide-react';


export const ConfirmModal = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-xl border border-slate-200 p-5" onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-3">
          <AlertCircle className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{description}</p>
        <div className="flex items-center gap-2.5 mt-5">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-full shadow-sm shadow-orange-600/20 transition-colors cursor-pointer"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
