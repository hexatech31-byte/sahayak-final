import React, { useRef } from 'react';
import { UploadCloud, FileCheck2, X, RefreshCw } from 'lucide-react';


export const DocumentUploadCard = ({ label, fileName, onFileSelected, onRemove }) => {
  const inputRef = useRef(null);

  return (
    <div className="border border-slate-200 rounded-lg p-3.5 bg-white">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-800">{label}</p>
          {fileName ? (
            <p className="text-[11px] text-emerald-700 mt-0.5 flex items-center gap-1 truncate">
              <FileCheck2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{fileName}</span>
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 mt-0.5">No file uploaded</p>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileSelected(file);
              e.target.value = '';
            }}
          />
          {fileName ? (
            <>
              <button
                onClick={() => inputRef.current?.click()}
                className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors cursor-pointer"
                title="Replace"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onRemove}
                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                title="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-full transition-colors cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
