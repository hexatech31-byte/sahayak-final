import React, { useState } from 'react';
import { X, FileCheck, ShieldCheck, CheckCircle2, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { addVendorBid } from '../data/mockVendorBids';
import { VENDOR_PROFILE } from '../data/mockVendorData';

// New bid submission modal — adapted from the reference vendor portal design.
// Used only by VendorOpportunityDetail.jsx (the new "opportunities" flow) and
// does not touch the existing VendorQuotationSubmit flow.

export const VendorBidSubmitModal = ({ tender, tenderDetail, onClose, onSubmitted }) => {
  const [companyName, setCompanyName] = useState(VENDOR_PROFILE.companyName);
  const [vendorEmail, setVendorEmail] = useState(VENDOR_PROFILE.email);
  const [commercialQuote, setCommercialQuote] = useState('');

  const parameters = tenderDetail.technicalParameters ?? [];
  const primaryStandard = tenderDetail.applicableStandards?.[0];

  const [complianceEntries, setComplianceEntries] = useState(
    parameters.map((p) => ({
      paramId: p.id,
      paramLabel: p.label,
      requiredValue: p.required,
      vendorResponse: 'Compliant',
      vendorRemarks: `Meets or exceeds the specified requirement (${p.required}).`,
    }))
  );

  const requiredDocs = tenderDetail.requiredDocuments ?? [];
  const [attachedDocs, setAttachedDocs] = useState(
    Object.fromEntries(requiredDocs.map((d) => [d.id, true]))
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const uploadedDocuments = requiredDocs
      .filter((d) => attachedDocs[d.id])
      .map((d) => ({ docId: d.id, docName: d.name }));

    const newBid = {
      tenderId: tender.id,
      tenderRefId: tender.tenderId,
      tenderTitle: tender.title,
      vendorName: companyName,
      vendorEmail,
      commercialBidAmount: Number(commercialQuote) || 0,
      status: 'Compliant',
      submittedAt: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      complianceEntries,
      officerDecision: null,
      clarifications: [],
      uploadedDocuments,
    };

    addVendorBid(newBid);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch {
      // ignore if confetti fails (e.g. reduced-motion environments)
    }

    onClose();
    onSubmitted?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-950 px-6 py-5 text-white flex items-start justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Bid Submission Portal
              </span>
              <span className="font-mono text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                {tender.tenderId}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Submit Technical &amp; Commercial Bid</h2>
            <p className="text-xs text-slate-300 mt-0.5">{tender.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Vendor Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label className="block font-bold text-slate-900 mb-1">Company / Bidder Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-900 mb-1">Registered Official Email</label>
              <input
                type="email"
                value={vendorEmail}
                onChange={(e) => setVendorEmail(e.target.value)}
                required
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-900 mb-1">Commercial Bid Amount (INR ₹)</label>
              <input
                type="number"
                value={commercialQuote}
                onChange={(e) => setCommercialQuote(e.target.value)}
                required
                placeholder="e.g. 1650000"
                className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                Est. Tender Value: {tender.estimatedValue}
              </span>
            </div>
          </div>

          {/* Technical Compliance Matrix */}
          {parameters.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Technical Compliance Statement (Parameter by Parameter)</span>
              </h3>
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-800 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3 w-48">Parameter</th>
                      <th className="p-3 w-36">Response</th>
                      <th className="p-3">Vendor Compliance Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {complianceEntries.map((entry, idx) => (
                      <tr key={entry.paramId} className="hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-900">
                          {entry.paramLabel}
                          <div className="text-[10px] font-mono text-slate-400 font-normal">
                            Required: {entry.requiredValue}
                          </div>
                        </td>
                        <td className="p-3">
                          <select
                            value={entry.vendorResponse}
                            onChange={(e) => {
                              const val = e.target.value;
                              setComplianceEntries((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, vendorResponse: val } : item))
                              );
                            }}
                            className="w-full p-1.5 bg-white border border-slate-300 rounded-lg font-bold text-emerald-800 focus:ring-2 focus:ring-emerald-500"
                          >
                            <option value="Compliant">✓ Compliant</option>
                            <option value="Deviation">⚠ Deviation</option>
                            <option value="Non-Compliant">✕ Non-Compliant</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <input
                            type="text"
                            value={entry.vendorRemarks}
                            onChange={(e) => {
                              const val = e.target.value;
                              setComplianceEntries((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, vendorRemarks: val } : item))
                              );
                            }}
                            className="w-full p-1.5 bg-white border border-slate-300 rounded-lg text-slate-700"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Required Documents */}
          {requiredDocs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-indigo-600" />
                <span>Proof Documents Attached</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {requiredDocs.map((doc) => (
                  <label
                    key={doc.id}
                    className={`p-3.5 rounded-2xl border space-y-1 cursor-pointer transition-colors ${
                      attachedDocs[doc.id]
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate max-w-[160px]">{doc.name}</span>
                      <input
                        type="checkbox"
                        checked={!!attachedDocs[doc.id]}
                        onChange={(e) =>
                          setAttachedDocs((prev) => ({ ...prev, [doc.id]: e.target.checked }))
                        }
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      {attachedDocs[doc.id] ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Attached</span>
                        </>
                      ) : (
                        <span>Not attached</span>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Legal Undertaking */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" required defaultChecked className="w-4 h-4 text-emerald-600 rounded mt-0.5" />
              <span>
                I hereby declare that all supplied products strictly comply with{' '}
                <strong>{primaryStandard?.code ?? 'the applicable standard'}</strong> and all statements and
                test certificates submitted are genuine.
              </span>
            </label>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Formal Technical Bid</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
