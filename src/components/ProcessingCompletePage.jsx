import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ClipboardCheck,
  ShieldCheck,
  FileCheck2,
  FileText,
  Check,
  ArrowRight
} from 'lucide-react';
import { WorkflowShell } from './WorkflowLayout';

// ==========================================
// PROCESSING COMPLETE SCREEN
// Focused workflow layout — NO sidebar.
// Frontend-only demo values, no animation.
// ==========================================
export function ProcessingCompletePage() {
  const navigate = useNavigate();

  const summaryCards = [
    { value: '12', label: 'Requirements Extracted', icon: ClipboardCheck, accent: 'border-t-blue-500', tint: 'bg-blue-50 text-blue-600' },
    { value: '5', label: 'Applicable BIS Standards', icon: ShieldCheck, accent: 'border-t-emerald-500', tint: 'bg-emerald-50 text-emerald-600' },
    { value: '4', label: 'Compliance Clauses Added', icon: FileCheck2, accent: 'border-t-orange-500', tint: 'bg-orange-50 text-orange-600' },
    { value: '1', label: 'Tender Draft Generated', icon: FileText, accent: 'border-t-slate-400', tint: 'bg-slate-100 text-slate-600' }
  ];

  const checklist = [
    'Requirements structured',
    'Applicable standards identified',
    'Compliance points included'
  ];

  return (
    <WorkflowShell maxWidth="max-w-3xl">

      {/* ── Success Header ── */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={32} className="text-emerald-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Processing Complete!
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-lg mx-auto leading-relaxed">
          Your input has been successfully analyzed and structured into a procurement-ready draft.
        </p>
      </div>

      {/* ── Result Summary (2 x 2 grid) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {summaryCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              className={`bg-white border border-slate-200/90 border-t-4 ${card.accent} rounded-2xl shadow-xs p-5 text-left`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.tint}`}>
                <Icon size={18} />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900">{card.value}</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 leading-snug">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Tender Ready Section ── */}
      <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-5 sm:p-6 mt-6 text-left">
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <p className="font-extrabold text-slate-900 text-sm sm:text-base">Tender Draft Ready</p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-1">
              Your AI-assisted procurement draft has been generated with extracted requirements, applicable standards, and compliance considerations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pl-0 sm:pl-[3.1rem]">
          {checklist.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs sm:text-[13px] font-semibold text-emerald-800">
              <Check size={14} className="text-emerald-600 stroke-[3] shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Action Buttons ── */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/dashboard/tenders')}
          className="px-6 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-700 font-bold text-sm sm:text-base hover:bg-slate-50 transition-all cursor-pointer"
        >
          View Details
        </button>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 text-sm sm:text-base transition-all cursor-pointer"
        >
          <span>Go to Dashboard</span>
          <ArrowRight size={17} />
        </button>
      </div>
    </WorkflowShell>
  );
}
