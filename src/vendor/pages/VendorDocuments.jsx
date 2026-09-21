import React, { useState } from 'react';
import { UploadCloud, Eye, RefreshCw, Trash2 } from 'lucide-react';
import { VendorLayout } from '../components/VendorLayout';
import { StatusBadge } from '../components/StatusBadge';
import { VENDOR_DOCUMENTS } from '../data/mockVendorData';

export const VendorDocuments = () => {
  const [documents, setDocuments] = useState(VENDOR_DOCUMENTS);

  const handleDelete = (id) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const handleUpload = () => {
    const name = window.prompt('Document name (demo upload — no backend storage connected yet):');
    if (!name) return;
    setDocuments((prev) => [
      { id: `vd-${Date.now()}`, name, uploadDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }), status: 'Uploaded' },
      ...prev,
    ]);
  };

  return (
    <VendorLayout title="Documents" subtitle="Manage reusable and tender-specific documents for your organization.">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">My Organization Documents</h2>
        <button
          onClick={handleUpload}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-full shadow-sm shadow-orange-600/20 transition-colors cursor-pointer"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload Document</span>
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-16 text-sm text-slate-400">No documents uploaded yet.</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {documents.map((d) => (
            <div key={d.id} className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{d.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">Uploaded {d.uploadDate}</p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={d.status} />
                <div className="flex items-center gap-1">
                  <button className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors cursor-pointer" title="View">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors cursor-pointer" title="Replace">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </VendorLayout>
  );
};
