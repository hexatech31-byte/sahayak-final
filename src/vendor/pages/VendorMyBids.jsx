import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck, MessageSquare } from 'lucide-react';
import { VendorLayout } from '../components/VendorLayout';
import { getVendorBids, updateVendorBid } from '../data/mockVendorBids';

// New "My Bids" tracking page — adapted from the reference vendor portal
// design (MyBidsView). Tracks bids submitted through the new
// VendorOpportunities -> VendorOpportunityDetail -> VendorBidSubmitModal
// flow. Separate from the existing VendorQuotations.jsx page.

export const VendorMyBids = () => {
  const navigate = useNavigate();
  const [bids, setBids] = useState(() => getVendorBids());
  const [replyDrafts, setReplyDrafts] = useState({});

  const handleSendReply = (bidId, clarificationId) => {
    const text = (replyDrafts[clarificationId] || '').trim();
    if (!text) return;

    const updated = updateVendorBid(bidId, (bid) => ({
      ...bid,
      clarifications: bid.clarifications.map((c) =>
        c.id === clarificationId ? { ...c, vendorReply: text, status: 'Answered' } : c
      ),
    }));
    setBids(updated);
    setReplyDrafts((prev) => ({ ...prev, [clarificationId]: '' }));
  };

  return (
    <VendorLayout title="My Bids" subtitle="Track evaluation status and respond to clarification requests.">
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-wider">
              <span>Supplier Portal</span>
              <span>•</span>
              <span>Bidding Dashboard</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              My Submitted Bids &amp; Compliance Status
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track evaluation status, officer decisions, and respond to technical clarification requests.
            </p>
          </div>
          <button
            onClick={() => navigate('/vendor/opportunities')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer shrink-0"
          >
            Find More Tenders
          </button>
        </div>

        {bids.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <FileCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Bids Submitted Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Explore active tenders under <strong>Bid Opportunities</strong> to submit technical bids
              with standards compliance matrices.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {bids.map((bid) => {
              const isCompliant = bid.status === 'Compliant';
              const isNeedsClarification = bid.status === 'Needs Clarification';

              return (
                <div
                  key={bid.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded">
                          {bid.tenderRefId}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            isCompliant
                              ? 'bg-emerald-100 text-emerald-800'
                              : isNeedsClarification
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          Status: {bid.status}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">Submitted: {bid.submittedAt}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{bid.tenderTitle}</h3>
                      <p className="text-xs text-slate-500">
                        Bidder: <strong>{bid.vendorName}</strong> ({bid.vendorEmail})
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Commercial Bid</span>
                      <div className="text-xl font-mono font-extrabold text-emerald-700">
                        ₹ {bid.commercialBidAmount.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {bid.officerDecision && (
                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                      <div className="flex items-center justify-between font-semibold">
                        <span>
                          Officer Decision: <strong className="text-slate-900">{bid.officerDecision.status}</strong>
                        </span>
                        <span className="text-[11px] text-slate-400">{bid.officerDecision.decidedAt}</span>
                      </div>
                      <p className="text-slate-600">"{bid.officerDecision.officerRemarks}"</p>
                    </div>
                  )}

                  {bid.clarifications && bid.clarifications.length > 0 && (
                    <div className="bg-amber-50/80 p-4 rounded-2xl border border-amber-200 text-xs space-y-3">
                      <div className="flex items-center gap-2 text-amber-900 font-bold">
                        <MessageSquare className="w-4 h-4 text-amber-600" />
                        <span>Formal Clarification Request from Procurement Officer</span>
                      </div>
                      {bid.clarifications.map((c) => (
                        <div key={c.id} className="bg-white p-3 rounded-xl border border-amber-200 space-y-2">
                          <div className="flex items-center justify-between text-slate-500 text-[11px]">
                            <span>Sent: {c.sentAt}</span>
                            <span className="font-bold text-amber-700">Action Required</span>
                          </div>
                          <p className="font-medium text-slate-900">"{c.query}"</p>
                          {c.vendorReply ? (
                            <div className="bg-slate-50 p-2.5 rounded-lg text-slate-700">
                              <strong>Your Reply:</strong> {c.vendorReply}
                            </div>
                          ) : (
                            <div className="pt-2 border-t border-slate-100 space-y-2">
                              <textarea
                                rows={2}
                                value={replyDrafts[c.id] || ''}
                                onChange={(e) =>
                                  setReplyDrafts((prev) => ({ ...prev, [c.id]: e.target.value }))
                                }
                                placeholder="Type your response and reference test report clause..."
                                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                              />
                              <div className="flex justify-end">
                                <button
                                  onClick={() => handleSendReply(bid.id, c.id)}
                                  className="px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold cursor-pointer"
                                >
                                  Send Reply to Officer
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {bid.uploadedDocuments && bid.uploadedDocuments.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500 font-mono">
                      <span className="font-semibold text-slate-600 font-sans">Attached Documents:</span>
                      {bid.uploadedDocuments.map((d) => (
                        <span
                          key={d.docId}
                          className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]"
                        >
                          📄 {d.docName}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </VendorLayout>
  );
};
