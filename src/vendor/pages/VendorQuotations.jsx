import React, { useMemo, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { VendorLayout } from '../components/VendorLayout';
import { StatusBadge } from '../components/StatusBadge';
import { QUOTATIONS } from '../data/mockVendorData';
import { useNavigate } from 'react-router-dom';


const TABS = ['All', 'Draft', 'Submitted', 'Under Review', 'Clarification Required', 'Closed'];

export const VendorQuotations = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('All');

  const filtered = useMemo(() => (tab === 'All' ? QUOTATIONS : QUOTATIONS.filter((q) => q.status === tab)), [tab]);

  return (
    <VendorLayout title="Quotations" subtitle="Track the status of every quotation you've submitted.">
      <div className="flex items-center gap-1.5 flex-wrap mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
              tab === t ? 'bg-orange-600 border-orange-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-slate-400">No quotations in this status.</div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
          {filtered.map((q) => (
            <div key={q.id} className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{q.tenderTitle}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {q.quotationId} &middot; Submitted {q.submittedDate}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-800">{q.totalValue}</span>
                <StatusBadge status={q.status} />
                <button
                  onClick={() => navigate(`/vendor/quotations/${q.id}`)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer whitespace-nowrap"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </VendorLayout>
  );
};
