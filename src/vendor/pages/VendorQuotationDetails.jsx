import React from 'react';
import { ChevronLeft, AlertTriangle, MessageSquareReply } from 'lucide-react';
import { VendorLayout } from '../components/VendorLayout';
import { StatusBadge } from '../components/StatusBadge';
import { QUOTATION_DETAILS } from '../data/mockVendorData';
import { useNavigate, useParams } from 'react-router-dom';

function formatINR(n) {
  return '\u20b9' + n.toLocaleString('en-IN');
}

const TIMELINE_STEPS = ['Draft', 'Submitted', 'Under Review', 'Clarification Required', 'Accepted'];

function timelineState(status, step) {
  const order = ['Draft', 'Submitted', 'Under Review', 'Clarification Required', 'Accepted'];
  // "Not Selected" / "Closed" render as a completed alternate end-state
  const effectiveStatus = status === 'Not Selected' || status === 'Closed' ? 'Accepted' : status;
  const statusIdx = order.indexOf(effectiveStatus);
  const stepIdx = order.indexOf(step);
  if (stepIdx < statusIdx) return 'done';
  if (stepIdx === statusIdx) return 'current';
  return 'upcoming';
}

export const VendorQuotationDetails = () => {
  const navigate = useNavigate();
  const { id: quotationId = '' } = useParams();
  const q = QUOTATION_DETAILS[quotationId];

  if (!q) {
    return (
      <VendorLayout title="Quotation Details">
        <div className="text-center py-16 text-sm text-slate-400">Quotation not found.</div>
      </VendorLayout>
    );
  }

  const total = q.commercials.productPrice + q.commercials.gst + q.commercials.deliveryCharges + q.commercials.installationCharges;

  return (
    <VendorLayout title="Quotation Details" subtitle={q.quotationId}>
      <button
        onClick={() => navigate('/vendor/quotations')}
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-orange-600 mb-4 cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        <span>Back to Quotations</span>
      </button>

      {/* Summary */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">{q.tenderTitle}</h2>
            <p className="text-xs text-slate-500 mt-1">
              {q.quotationId} &middot; Submitted {q.submittedDate}
            </p>
          </div>
          <StatusBadge status={q.status} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100">
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Total Value</p>
            <p className="text-sm font-bold text-slate-800">{formatINR(total)}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Delivery Time</p>
            <p className="text-sm font-bold text-slate-800">{q.deliveryTime}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase">Warranty</p>
            <p className="text-sm font-bold text-slate-800">{q.warranty}</p>
          </div>
        </div>
      </div>

      {q.status === 'Clarification Required' && q.clarificationMessage && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-red-800">Clarification Required</p>
            <p className="text-xs text-red-700 mt-1">{q.clarificationMessage}</p>
            <button
              onClick={() => alert('Clarification response flow will be connected once backend messaging is available.')}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors cursor-pointer"
            >
              <MessageSquareReply className="w-3.5 h-3.5" />
              <span>Respond to Clarification</span>
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commercial Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-4">Commercial Summary</h3>
          <div className="space-y-2.5 text-sm">
            <Row label="Product Price" value={formatINR(q.commercials.productPrice)} />
            <Row label="GST" value={formatINR(q.commercials.gst)} />
            <Row label="Delivery" value={formatINR(q.commercials.deliveryCharges)} />
            <Row label="Installation" value={formatINR(q.commercials.installationCharges)} />
            <div className="pt-2.5 mt-1 border-t border-slate-100">
              <Row label="Total" value={formatINR(total)} bold />
            </div>
          </div>
        </div>

        {/* Technical Response Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-4">Technical Response Summary</h3>
          <div className="space-y-2.5 text-sm">
            <Row label="Requirements Responded" value={`${q.requirementsResponded} / ${q.requirementsTotal}`} />
            <Row label="Standards Declared" value={String(q.standardsDeclared)} />
            <Row label="Documents Uploaded" value={String(q.documentsUploaded)} />
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 mt-6">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-5">Status Timeline</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0">
          {TIMELINE_STEPS.map((step, idx) => {
            const state = timelineState(q.status, step);
            return (
              <React.Fragment key={step}>
                <div className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2 sm:flex-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      state === 'done'
                        ? 'bg-emerald-600 text-white'
                        : state === 'current'
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {state === 'done' ? '\u2713' : state === 'current' ? '\u25cf' : '\u25cb'}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      state === 'upcoming' ? 'text-slate-400' : state === 'current' ? 'text-orange-700' : 'text-slate-700'
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {idx < TIMELINE_STEPS.length - 1 && (
                  <div className={`hidden sm:block flex-1 h-0.5 ${state === 'done' ? 'bg-emerald-600' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </VendorLayout>
  );
};

const Row = ({ label, value, bold }) => (
  <div className="flex items-center justify-between">
    <span className={bold ? 'font-bold text-slate-800' : 'text-slate-500'}>{label}</span>
    <span className={bold ? 'font-extrabold text-orange-600' : 'font-semibold text-slate-800'}>{value}</span>
  </div>
);
