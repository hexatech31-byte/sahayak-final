import React, { useMemo, useState } from 'react';
import { ChevronLeft, ArrowRight, Save } from 'lucide-react';
import { VendorLayout } from '../components/VendorLayout';
import { ComplianceIndicator } from '../components/ComplianceIndicator';
import { DocumentUploadCard } from '../components/DocumentUploadCard';
import { TENDER_DETAILS, PRIMARY_STANDARD_RESPONSES, PRIMARY_PARAMETER_RESPONSES } from '../data/mockVendorData';
import { useNavigate, useParams } from 'react-router-dom';

const STATUS_OPTIONS = ['Compliant', 'Partially Compliant', 'Not Compliant'];

export const VendorComplianceResponse = () => {
  const navigate = useNavigate();
  const { id: tenderId = '' } = useParams();
  const tender = TENDER_DETAILS[tenderId];

  const [responses, setResponses] = useState(() => {
    const initial = {};
    (tender?.applicableStandards ?? []).forEach((s, idx) => {
      initial[s.id] = PRIMARY_STANDARD_RESPONSES[idx] ?? { standardId: s.id, status: 'Pending' };
    });
    return initial;
  });

  const [paramValues] = useState(() => {
    const map = {};
    (tender?.technicalParameters ?? []).forEach((p, idx) => {
      const resp = PRIMARY_PARAMETER_RESPONSES[idx];
      map[p.id] = resp ? { value: resp.value, meetsRequirement: resp.meetsRequirement } : { value: p.required, meetsRequirement: true };
    });
    return map;
  });

  const completedCount = useMemo(
    () => Object.values(responses).filter((r) => r.status === 'Compliant' || r.status === 'Partially Compliant' || r.status === 'Not Compliant').length,
    [responses]
  );
  const totalCount = (tender?.applicableStandards.length ?? 0) + (tender?.technicalParameters.length ?? 0);
  const completedTotal = completedCount + Object.keys(paramValues).length;

  if (!tender) {
    return (
      <VendorLayout title="Compliance Response">
        <div className="text-center py-16 text-sm text-slate-400">Tender not found.</div>
      </VendorLayout>
    );
  }

  const setStatus = (standardId, status) => {
    setResponses((prev) => ({ ...prev, [standardId]: { ...prev[standardId], standardId, status } }));
  };

  const setEvidence = (standardId, fileName) => {
    setResponses((prev) => ({ ...prev, [standardId]: { ...prev[standardId], standardId, evidenceFileName: fileName ?? undefined } }));
  };

  return (
    <VendorLayout title="Compliance Response" subtitle={tender.title}>
      <button
        onClick={() => navigate(`/vendor/tenders/${tender.id}`)}
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-orange-600 mb-4 cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        <span>Back to Tender Details</span>
      </button>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-extrabold text-slate-900">Compliance Completion</h2>
          <span className="text-sm font-bold text-orange-600">
            {completedTotal} / {totalCount} Requirements Completed
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-orange-600 rounded-full transition-all"
            style={{ width: `${totalCount ? (completedTotal / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Required Standards */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 mb-6">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-4">Required Standards</h3>
        <div className="space-y-4">
          {tender.applicableStandards.map((s) => {
            const resp = responses[s.id];
            return (
              <div key={s.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{s.code}</p>
                    <p className="text-[11px] text-slate-500">{s.category}</p>
                  </div>
                  {resp?.status && resp.status !== 'Pending' && <ComplianceIndicator status={resp.status} />}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setStatus(s.id, opt)}
                      className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                        resp?.status === opt
                          ? 'bg-orange-600 border-orange-600 text-white'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
                <DocumentUploadCard
                  label="Supporting Evidence"
                  fileName={resp?.evidenceFileName ?? null}
                  onFileSelected={(file) => setEvidence(s.id, file.name)}
                  onRemove={() => setEvidence(s.id, null)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Parameters */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 mb-6">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-4">Technical Parameters</h3>
        <div className="space-y-3">
          {tender.technicalParameters.map((p) => {
            const resp = paramValues[p.id];
            return (
              <div key={p.id} className="grid sm:grid-cols-3 gap-3 items-center border border-slate-200 rounded-lg p-4">
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">{p.label}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Required: {p.required}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase mb-1">Vendor Response</p>
                  <div className="px-3 py-1.5 rounded border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 inline-block">
                    {resp.value}
                  </div>
                </div>
                <div className="sm:text-right">
                  <ComplianceIndicator status={resp.meetsRequirement ? 'Compliant' : 'Partially Compliant'} />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-400 mt-4">
          Note: automatic requirement matching shown above is frontend demo validation only, not a verified AI check.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => alert('Draft saved locally for this prototype.')}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Draft</span>
        </button>
        <button
          onClick={() => navigate(`/vendor/tenders/${tender.id}/quotation`)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-full shadow-md shadow-orange-600/20 transition-colors cursor-pointer"
        >
          <span>Continue to Quotation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </VendorLayout>
  );
};
