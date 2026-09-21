import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Building2,
  Calendar,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { VendorLayout } from '../components/VendorLayout';
import { TENDERS, TENDER_DETAILS } from '../data/mockVendorData';

// New "Opportunities" browse page — adapted from the reference vendor portal
// design. Reads from the project's existing mockVendorData so it reflects
// the same tenders shown on the Dashboard/Tenders pages, just presented in a
// search-and-filter card layout. This page is additive and does not modify
// VendorDashboard.jsx or VendorTenders.jsx.

const QUICK_FILTERS = ['IS 10322', 'IS 8034', 'IS/IEC 61215'];

export const VendorOpportunities = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const availableTenders = TENDERS.filter(
    (t) => t.status !== 'Closed'
  );

  const filtered = availableTenders.filter((t) => {
    const detail = TENDER_DETAILS[t.id];
    const primaryStandard = detail?.applicableStandards?.[0]?.code ?? '';
    const haystack = `${t.title} ${t.organization} ${t.tenderId} ${primaryStandard}`.toLowerCase();
    return haystack.includes(searchQuery.trim().toLowerCase());
  });

  const handleOpenTender = (tenderId) => {
    navigate(`/vendor/opportunities/${tenderId}`);
  };

  return (
    <VendorLayout
      title="Bid Opportunities"
      subtitle="Browse standards-compliant tenders and submit technical bids."
    >
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 rounded-3xl p-8 text-white shadow-xl border border-emerald-800/40 relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Supplier &amp; Vendor Opportunity Gateway</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Find Standards-Compliant Tenders
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Browse public procurement opportunities. Open a tender to see a plain-language
              explanation, run a pre-bid self-check, and submit your technical &amp; commercial bid.
            </p>
          </div>
        </div>

        {/* Search Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tender title, standard (e.g. IS 8034), organization..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
            <span className="font-semibold">Popular Standards:</span>
            {QUICK_FILTERS.map((code) => (
              <button
                key={code}
                onClick={() => setSearchQuery(code)}
                className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-full border border-slate-200 cursor-pointer"
              >
                {code}
              </button>
            ))}
          </div>
        </div>

        {/* Tenders Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Available Tenders ({filtered.length})
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-sm text-slate-400 bg-white rounded-2xl border border-slate-200">
              No tenders match this search.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((t) => {
                const detail = TENDER_DETAILS[t.id];
                const primaryStd = detail?.applicableStandards?.[0];

                return (
                  <div
                    key={t.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                          {t.tenderId}
                        </span>
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Closes: {t.deadline}</span>
                        </span>
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                          {t.title}
                        </h3>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{t.organization}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Applicable Standard:</span>
                          <span className="font-mono font-bold text-indigo-900">
                            {primaryStd?.code ?? 'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Status:</span>
                          <span className="font-semibold text-emerald-800">{t.status}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Quantity:</span>
                          <span className="font-mono font-semibold text-slate-900">
                            {detail?.quantity ?? '—'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="font-mono font-bold text-base text-slate-900">
                        {t.estimatedValue}
                      </div>
                      <button
                        onClick={() => handleOpenTender(t.id)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>View &amp; Bid</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </VendorLayout>
  );
};
