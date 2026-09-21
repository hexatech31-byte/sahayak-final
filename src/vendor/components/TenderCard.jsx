import React from 'react';
import { FileText, Calendar, IndianRupee, ListChecks, ArrowRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { useNavigate } from 'react-router-dom';


export const TenderCard = ({ tender, compact = false }) => {
  const navigate = useNavigate();
  const canSubmit = tender.status === 'Open for Quotation' || tender.status === 'Invitation Received' || tender.status === 'Deadline Approaching';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 card-hover-effect">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-900 leading-snug">{tender.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {tender.tenderId} &middot; {tender.organization}
          </p>
        </div>
        <StatusBadge status={tender.status} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 mb-4">
        <div className="flex items-center gap-1.5">
          <IndianRupee className="w-3.5 h-3.5 text-orange-600 shrink-0" />
          <span className="font-semibold text-slate-800">{tender.estimatedValue}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-orange-600 shrink-0" />
          <span>{tender.deadline}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ListChecks className="w-3.5 h-3.5 text-orange-600 shrink-0" />
          <span>{tender.technicalRequirementsCount} Requirements</span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-orange-600 shrink-0" />
          <span>{tender.documentsRequiredCount} Documents</span>
        </div>
      </div>

      {!compact && (
        <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
          <button
            onClick={() => navigate(`/vendor/tenders/${tender.id}`)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
          >
            View Tender
          </button>
          {canSubmit && (
            <button
              onClick={() => navigate(`/vendor/tenders/${tender.id}/quotation`)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-full shadow-sm shadow-orange-600/20 transition-colors cursor-pointer"
            >
              <span>Submit Quotation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
