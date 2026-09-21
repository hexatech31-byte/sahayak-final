import React from 'react';


const toneMap = {
  orange: 'bg-orange-50 text-orange-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  slate: 'bg-slate-100 text-slate-600',
  amber: 'bg-amber-50 text-amber-600',
};

export const StatCard = ({ label, value, icon: Icon, tone = 'orange' }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3.5 card-hover-effect">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${toneMap[tone]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-extrabold text-slate-900 leading-tight">{value}</div>
        <div className="text-xs font-semibold text-slate-500 truncate">{label}</div>
      </div>
    </div>
  );
};
