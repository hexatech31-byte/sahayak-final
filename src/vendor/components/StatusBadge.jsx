import React from 'react';


const toneClasses = {
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  slate: 'bg-slate-100 text-slate-600 border-slate-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
};

const STATUS_TONE = {
  'Invitation Received': 'orange',
  'Deadline Approaching': 'amber',
  'Open for Quotation': 'orange',
  'Quotation Submitted': 'emerald',
  Closed: 'slate',
  Draft: 'slate',
  Submitted: 'orange',
  'Under Review': 'amber',
  'Clarification Required': 'red',
  Accepted: 'emerald',
  Selected: 'emerald',
  'Not Selected': 'slate',
  Compliant: 'emerald',
  'Partially Compliant': 'amber',
  'Not Compliant': 'red',
  Pending: 'slate',
  'Not Uploaded': 'slate',
  Uploaded: 'orange',
  Verified: 'emerald',
  Expiring: 'amber',
  Missing: 'red',
};

export const StatusBadge = ({ status, className = '' }) => {
  const tone = STATUS_TONE[status] ?? 'slate';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border whitespace-nowrap ${toneClasses[tone]} ${className}`}
    >
      {status}
    </span>
  );
};
