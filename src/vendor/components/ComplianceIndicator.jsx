import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Circle } from 'lucide-react';

const CONFIG = {
  Compliant: { icon: CheckCircle2, className: 'text-emerald-600', label: 'Compliant' },
  'Partially Compliant': { icon: AlertTriangle, className: 'text-amber-600', label: 'Requires Attention' },
  'Not Compliant': { icon: XCircle, className: 'text-red-600', label: 'Not Compliant' },
  Pending: { icon: Circle, className: 'text-slate-400', label: 'Pending' },
};

export const ComplianceIndicator = ({ status, className = '' }) => {
  const cfg = CONFIG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${cfg.className} ${className}`}>
      <Icon className="w-4 h-4" />
      <span>{cfg.label}</span>
    </span>
  );
};
