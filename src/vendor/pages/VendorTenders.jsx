import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { VendorLayout } from '../components/VendorLayout';
import { TenderCard } from '../components/TenderCard';
import { TENDERS } from '../data/mockVendorData';


const FILTERS = ['All', 'New Invitations', 'Active', 'Deadline Soon', 'Submitted', 'Closed'];

function matchesFilter(status, filter) {
  switch (filter) {
    case 'All':
      return true;
    case 'New Invitations':
      return status === 'Invitation Received';
    case 'Active':
      return status === 'Open for Quotation' || status === 'Invitation Received' || status === 'Deadline Approaching';
    case 'Deadline Soon':
      return status === 'Deadline Approaching';
    case 'Submitted':
      return status === 'Quotation Submitted';
    case 'Closed':
      return status === 'Closed';
    default:
      return true;
  }
}

export const VendorTenders = () => {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = useMemo(() => {
    return TENDERS.filter((t) => matchesFilter(t.status, filter)).filter((t) =>
      query.trim() ? (t.title + t.tenderId + t.organization).toLowerCase().includes(query.trim().toLowerCase()) : true
    );
  }, [query, filter]);

  return (
    <VendorLayout title="Tenders" subtitle="Browse and manage tenders assigned to your organization.">
      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tenders..."
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-full border border-slate-300 focus:ring-2 focus:ring-orange-600 focus:outline-none bg-white"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-orange-600 border-orange-600 text-white'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-sm text-slate-400">No tenders match this filter.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((t) => (
            <TenderCard key={t.id} tender={t} />
          ))}
        </div>
      )}
    </VendorLayout>
  );
};
