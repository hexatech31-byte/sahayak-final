import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Sparkles,
  AlertTriangle,
  Calendar,
  Building2,
  ArrowLeft,
  FileCheck,
} from 'lucide-react';
import { VendorLayout } from '../components/VendorLayout';
import { VendorBidSubmitModal } from '../components/VendorBidSubmitModal';
import { TENDERS, TENDER_DETAILS } from '../data/mockVendorData';

// New tender detail + pre-bid self-check page — adapted from the reference
// vendor portal design (plain-language explainer + compliance self-check).
// Reads from the existing mockVendorData; does not touch VendorTenderDetails.jsx.

export const VendorOpportunityDetail = () => {
  const navigate = useNavigate();
  const { id: tenderId = '' } = useParams();

  const tender = TENDERS.find((t) => t.id === tenderId);
  const detail = TENDER_DETAILS[tenderId];

  const [isExplainOpen, setIsExplainOpen] = useState(true);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);

  const [checklist, setChecklist] = useState({
    standardMatch: true,
    bisLicenseValid: true,
    testReportReady: true,
    oemAuth: true,
    financialTurnover: true,
  });

  if (!tender || !detail) {
    return (
      <VendorLayout title="Tender Not Found">
        <div className="text-center py-16 text-sm text-slate-400">
          This tender could not be found.
          <div className="mt-4">
            <button
              onClick={() => navigate('/vendor/opportunities')}
              className="text-orange-600 font-bold text-sm cursor-pointer"
            >
              Back to Opportunities
            </button>
          </div>
        </div>
      </VendorLayout>
    );
  }

  const primaryStd = detail.applicableStandards?.[0];
  const checksPassed = Object.values(checklist).filter(Boolean).length;
  const totalChecks = Object.keys(checklist).length;
  const isFullyEligible = checksPassed === totalChecks;

  return (
    <VendorLayout title="Bid Opportunity" subtitle={tender.tenderId}>
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/vendor/opportunities')}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Opportunities</span>
          </button>
          <span className="font-mono text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Tender ID: {tender.tenderId}
          </span>
        </div>

        {/* Header Summary Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  {tender.status}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{tender.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{tender.organization}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-rose-700 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Closing Date: {tender.deadline}</span>
                </span>
                <span>•</span>
                <span className="font-mono font-bold text-slate-900">Quantity: {detail.quantity}</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400">Est. Tender Value</span>
              <div className="text-2xl font-extrabold font-mono text-emerald-700 mt-0.5">
                {tender.estimatedValue}
              </div>
              <button
                onClick={() => setIsBidModalOpen(true)}
                className="mt-3 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 w-full justify-center cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>Submit Technical Bid</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Applicable Standard</span>
              <span className="font-mono font-bold text-indigo-900 mt-0.5 block">
                {primaryStd?.code ?? 'N/A'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">BIS Certification</span>
              <span className="font-bold text-emerald-800 mt-0.5 block">
                {detail.certifications?.some((c) => c.name === 'BIS Certification' && c.required)
                  ? 'Mandatory'
                  : 'Not Mandatory'}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Test Report</span>
              <span className="font-bold text-slate-800 mt-0.5 block">NABL Accredited Lab</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Delivery Period</span>
              <span className="font-bold text-slate-800 mt-0.5 block">{detail.deliveryPeriod}</span>
            </div>
          </div>
        </div>

        {/* Plain Language Explainer */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4 border border-indigo-800/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl border border-amber-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>✨ Explain Tender in Plain Language</span>
                  <span className="text-[10px] bg-amber-500 text-slate-950 px-2 py-0.2 rounded-full font-bold">
                    AI Summary
                  </span>
                </h2>
                <p className="text-xs text-slate-300">
                  Simplifying complex procurement clauses into plain English for suppliers
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsExplainOpen(!isExplainOpen)}
              className="text-xs text-slate-400 hover:text-white underline font-medium cursor-pointer"
            >
              {isExplainOpen ? 'Hide' : 'Expand'}
            </button>
          </div>

          {isExplainOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm pt-2">
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-1">
                <div className="text-amber-400 font-bold flex items-center gap-1.5">
                  <span>📦 What are they asking for?</span>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  Supply of <strong>{detail.quantity}</strong> of {detail.product} for{' '}
                  {tender.organization}.
                </p>
              </div>
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span>📜 What standard must your product meet?</span>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  Your product must strictly comply with <strong>{primaryStd?.code ?? 'the applicable standard'}</strong>{' '}
                  and hold active BIS certification.
                </p>
              </div>
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-1">
                <div className="text-blue-400 font-bold flex items-center gap-1.5">
                  <span>🛡️ What certification is mandatory?</span>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  Bids without active BIS certification will be rejected during technical evaluation.
                </p>
              </div>
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 space-y-1">
                <div className="text-purple-400 font-bold flex items-center gap-1.5">
                  <span>📄 What documents must you submit?</span>
                </div>
                <p className="text-slate-200 leading-relaxed">
                  {(detail.requiredDocuments ?? []).map((d) => d.name).join(' • ')}.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pre-Bid Self-Check */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Can your product meet this tender? (Pre-Bid Self-Check)
              </h3>
              <p className="text-xs text-slate-500">
                Quickly verify whether your product satisfies mandatory requirements before preparing bid documents.
              </p>
            </div>
            <div className="text-right">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  isFullyEligible
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {checksPassed} / {totalChecks} Criteria Satisfied
              </span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs text-slate-800 pt-2">
            {[
              { key: 'standardMatch', label: <>My product is designed and manufactured in accordance with <strong>{primaryStd?.code ?? 'the applicable standard'}</strong>.</> },
              { key: 'bisLicenseValid', label: <>I hold a valid, active <strong>BIS License / CRS Registration</strong> for the tendered model (not expired).</> },
              { key: 'testReportReady', label: <>I have complete <strong>Type Test Reports from a NABL-accredited laboratory</strong> covering all parameters.</> },
              { key: 'oemAuth', label: <>I am either the direct OEM or have a valid <strong>Manufacturer Authorization Form (MAF)</strong>.</> },
              { key: 'financialTurnover', label: <>My firm meets the minimum average annual financial turnover requirement.</> },
            ].map((item) => (
              <label
                key={item.key}
                className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100/80 rounded-xl border border-slate-200 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={checklist[item.key]}
                  onChange={(e) =>
                    setChecklist((prev) => ({ ...prev, [item.key]: e.target.checked }))
                  }
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="flex-1">{item.label}</span>
              </label>
            ))}
          </div>

          {!isFullyEligible && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Your product may not meet all mandatory requirements. Please verify compliance before bidding.</span>
            </div>
          )}
        </div>

        {/* Technical Parameters */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Technical Specifications &amp; Requirements</h3>
          <div className="space-y-3 text-xs">
            {(detail.technicalParameters ?? []).map((p) => (
              <div key={p.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>{p.label}</span>
                  {primaryStd && (
                    <span className="font-mono text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                      IS: {primaryStd.code}
                    </span>
                  )}
                </div>
                <p className="text-slate-700 leading-relaxed">Required: {p.required}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Submission Modal */}
        {isBidModalOpen && (
          <VendorBidSubmitModal
            tender={tender}
            tenderDetail={detail}
            onClose={() => setIsBidModalOpen(false)}
            onSubmitted={() => navigate('/vendor/my-bids')}
          />
        )}
      </div>
    </VendorLayout>
  );
};
