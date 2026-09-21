import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

// ─── 1. CIRCULAR SCORE RING (Simple & Compact) ──────────────────────────────
export const CircularScoreRing = ({ score, size = 80, strokeWidth = 7, color = '#059669', label = 'Score' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center text-center select-none">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold text-slate-900 font-mono tracking-tight">{score}%</span>
          {label && <span className="text-[8px] font-bold text-slate-400 uppercase">{label}</span>}
        </div>
      </div>
    </div>
  );
};

// ─── 2. SIMPLE VENDOR DIRECTORY CARD ────────────────────────────────────────
export const VendorRatingScorecard = ({ vendor, onVerify, onSuspend, onProfile }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between">
      <div className="space-y-3">
        {/* Title & Status */}
        <div className="flex justify-between items-start gap-2">
          <h3 onClick={onProfile} className="font-bold text-slate-900 text-base hover:text-orange-600 cursor-pointer">
            {vendor.name}
          </h3>
          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 border ${
            vendor.status === 'Verified' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
            vendor.status === 'Pending Verification' ? 'text-amber-700 bg-amber-50 border-amber-200' :
            'text-rose-700 bg-rose-50 border-rose-200'
          }`}>
            {vendor.status === 'Verified' ? '✓ Verified' : vendor.status}
          </span>
        </div>

        {/* Location & Supplier Category */}
        <p className="text-xs text-slate-500 font-medium">
          {vendor.location} · {vendor.supplierClass.split('(')[0].trim()}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-sm font-bold text-amber-500 font-mono">★ {vendor.rating}</span>
          <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
        </div>

        {/* BIS Standard Mark Status */}
        <p className="text-xs text-slate-600 font-semibold pt-0.5">
          BIS Standard Mark: <span className="text-emerald-700 font-bold">Valid</span>
        </p>
      </div>

      {/* Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 text-xs">
        {onProfile && (
          <button
            type="button"
            onClick={onProfile}
            className="text-orange-600 hover:text-orange-700 font-bold px-3 py-1.5 hover:bg-orange-50 rounded-lg cursor-pointer transition-colors"
          >
            Profile
          </button>
        )}
        {vendor.status !== 'Verified' && onVerify && (
          <button
            type="button"
            onClick={onVerify}
            className="text-emerald-700 font-semibold px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 cursor-pointer transition-colors"
          >
            Verify
          </button>
        )}
        {vendor.status !== 'Suspended' && onSuspend && (
          <button
            type="button"
            onClick={onSuspend}
            className="text-rose-600 hover:text-rose-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-rose-50 cursor-pointer transition-colors"
          >
            Suspend
          </button>
        )}
      </div>
    </div>
  );
};

// ─── 3. SIMPLE QUOTATION COMPARISON LIST ────────────────────────────────────
export const HorizontalPriceMatrix = ({ quotes, onSelectL1 }) => {
  return (
    <div className="space-y-3 pt-1">
      {quotes.map((q, idx) => {
        const isL1 = idx === 0;

        return (
          <div 
            key={q.id}
            className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
              isL1 
                ? 'bg-emerald-50/70 border-emerald-300' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  isL1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  L{idx + 1}
                </span>
                <span className="font-bold text-slate-900 text-sm">{q.vendorName}</span>
                {isL1 && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                    <Sparkles className="w-3 h-3 text-emerald-600" /> Lowest Qualified (L1)
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Delivery: <strong>{q.deliveryTime}</strong> • Technical Score: <strong>{q.technicalScore}%</strong> • BIS Compliance: <strong>✓ Verified</strong>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-black font-mono text-sm text-slate-900">{q.bidAmount}</span>
              <button
                type="button"
                onClick={() => onSelectL1(q.id)}
                className={`text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer transition-colors ${
                  q.status === 'Selected L1'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {q.status === 'Selected L1' ? 'Selected for Award' : 'Select L1'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── 4. RESTRAINED SPEND DONUT CHART (Analytics Only) ───────────────────────
export const SpendDonutChart = () => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const data = [
    { label: 'CPWD (Civil Works)', value: 82.4, color: '#ea580c', pct: 31 },
    { label: 'MNRE (Solar Systems)', value: 118.0, color: '#059669', pct: 45 },
    { label: 'MeitY (IT Compute)', value: 42.5, color: '#0284c7', pct: 16 },
    { label: 'NHAI & CBI (Safety)', value: 30.4, color: '#8b5cf6', pct: 8 }
  ];

  const total = data.reduce((acc, d) => acc + d.value, 0);
  const size = 170;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPct = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-2">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, idx) => {
            const strokeDasharray = `${(item.pct / 100) * circumference} ${circumference}`;
            const strokeDashoffset = - (accumulatedPct / 100) * circumference;
            accumulatedPct += item.pct;

            return (
              <circle
                key={item.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.color}
                strokeWidth={hoveredIdx === idx ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                fill="transparent"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Sanctioned Total</span>
          <span className="text-lg font-black text-slate-900 font-mono">₹ {(total / 100).toFixed(2)} Cr</span>
        </div>
      </div>

      <div className="flex-1 space-y-2 w-full">
        {data.map((item, idx) => (
          <div 
            key={item.label}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            className={`p-1.5 rounded-lg transition-colors flex items-center justify-between text-xs cursor-pointer ${
              hoveredIdx === idx ? 'bg-slate-100' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="font-semibold text-slate-800">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-900">₹ {item.value} L</span>
              <span className="text-[10px] font-bold text-slate-400">({item.pct}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── 5. RESTRAINED MONTHLY BAR CHART (Analytics Only) ───────────────────────
export const MonthlyBarChart = () => {
  const months = [
    { month: 'Apr', active: 3, awarded: 2 },
    { month: 'May', active: 5, awarded: 4 },
    { month: 'Jun', active: 6, awarded: 5 },
    { month: 'Jul', active: 4, awarded: 4 },
    { month: 'Aug', active: 7, awarded: 6 },
    { month: 'Sep', active: 4, awarded: 2 }
  ];

  const maxVal = 8;
  const height = 120;

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-orange-600" /> Published Tenders
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-emerald-600" /> Sanctioned Contracts
        </span>
      </div>

      <div className="h-32 flex items-end justify-between gap-3 pt-3 border-b border-slate-200">
        {months.map((m) => {
          const activeH = (m.active / maxVal) * height;
          const awardedH = (m.awarded / maxVal) * height;

          return (
            <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
              <div className="flex items-end gap-1 w-full justify-center">
                <div 
                  className="w-3 bg-orange-500 rounded-t"
                  style={{ height: `${activeH}px` }}
                />
                <div 
                  className="w-3 bg-emerald-500 rounded-t"
                  style={{ height: `${awardedH}px` }}
                />
              </div>
              <span className="text-[10px] font-bold text-slate-500 mt-1">{m.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── 6. RESTRAINED PROCESSING TIME LINE CHART (Analytics Only) ──────────────
export const ProcessingTimeLineChart = () => {
  const points = [
    { month: 'Apr', days: 28 },
    { month: 'May', days: 22 },
    { month: 'Jun', days: 19 },
    { month: 'Jul', days: 17 },
    { month: 'Aug', days: 14 },
    { month: 'Sep', days: 11 }
  ];

  const width = 360;
  const height = 100;
  const maxDays = 30;

  const coords = points.map((p, idx) => {
    const x = (idx / (points.length - 1)) * (width - 40) + 20;
    const y = height - (p.days / maxDays) * (height - 20) - 10;
    return { x, y, ...p };
  });

  const pathD = coords.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  return (
    <div className="space-y-2 pt-2">
      <div className="flex justify-between items-center text-xs">
        <span className="font-bold text-slate-700">Days from Draft to GeM Sanction Order</span>
        <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
          ↓ 11 Days (Reduced from 28 Days)
        </span>
      </div>

      <div className="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height + 25}`} className="w-full h-auto">
          <line x1="20" y1="20" x2={width - 20} y2="20" stroke="#f1f5f9" strokeDasharray="3,3" />
          <line x1="20" y1="60" x2={width - 20} y2="60" stroke="#f1f5f9" strokeDasharray="3,3" />

          <path
            d={`${pathD} L ${coords[coords.length - 1].x},${height} L ${coords[0].x},${height} Z`}
            fill="rgba(234, 88, 12, 0.08)"
          />

          <path
            d={pathD}
            fill="none"
            stroke="#ea580c"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {coords.map((pt) => (
            <g key={pt.month}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r="4"
                fill="#ffffff"
                stroke="#ea580c"
                strokeWidth="2"
              />
              <text
                x={pt.x}
                y={pt.y - 8}
                textAnchor="middle"
                fontSize="9"
                fontWeight="bold"
                fill="#0f172a"
              >
                {pt.days}d
              </text>
              <text
                x={pt.x}
                y={height + 15}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#64748b"
              >
                {pt.month}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

// ─── 7. SIMPLE APPROVAL QUEUE CARD ──────────────────────────────────────────
export const AuditTimelineTree = ({ approval, onApprove, onReject }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4 hover:border-slate-300 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-400">{approval.ref}</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              approval.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'
            }`}>
              {approval.priority} Priority
            </span>
          </div>
          <h3 className="text-base font-bold text-slate-900 mt-1">{approval.tenderName}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Department: <strong>{approval.department}</strong> • Sanction Budget: <strong className="text-slate-900 font-mono">{approval.budget}</strong> • Recommended: <strong className="text-slate-800">{approval.recommendedVendor}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {approval.status === 'Pending' ? (
            <>
              <button
                type="button"
                onClick={onReject}
                className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 cursor-pointer transition-colors"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={onApprove}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 size={14} /> Authorize with DSC
              </button>
            </>
          ) : (
            <span className="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14} /> Digitally Signed (DSC)
            </span>
          )}
        </div>
      </div>

      {/* Simple 4-Step Milestone Chain */}
      <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 overflow-x-auto">
        <span className="font-bold text-emerald-700">✓ Submitted</span>
        <span className="text-slate-300">→</span>
        <span className="font-bold text-emerald-700">✓ Technical Evaluation</span>
        <span className="text-slate-300">→</span>
        <span className="font-bold text-emerald-700">✓ Financial Review</span>
        <span className="text-slate-300">→</span>
        <span className={`font-bold ${approval.status === 'Approved' ? 'text-emerald-700' : 'text-orange-600'}`}>
          {approval.status === 'Approved' ? '✓ DSC Sanction Approved' : '• Pending DSC Sanction'}
        </span>
      </div>
    </div>
  );
};


// ─── PIPELINE PROGRESS TRACKER (CLEAN 5-SEGMENT STEPPER) ──────────────────
export const PipelineProgressStepper = ({ status }) => {
  const stages = [
    { key: 'Draft', label: 'Draft' },
    { key: 'Published', label: 'Published' },
    { key: 'Tech Bid', label: 'Tech Bid' },
    { key: 'Financial Bid', label: 'Financial Bid' },
    { key: 'Awarded', label: 'Awarded' }
  ];

  const getActiveIndex = () => {
    switch (status) {
      case 'Draft': return 0;
      case 'Specification Review': return 0;
      case 'BIS Verification': return 0;
      case 'Tender Published': return 1;
      case 'Bid Submission': return 1;
      case 'Technical Evaluation': return 2;
      case 'Financial Evaluation': return 3;
      case 'Awaiting Approval': return 3;
      case 'Approved': return 4;
      case 'Awarded': return 4;
      case 'Closed': return 4;
      default: return 1;
    }
  };

  const activeIndex = getActiveIndex();
  const currentStage = stages[activeIndex];

  return (
    <div className="space-y-1.5 w-full max-w-[190px]">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-bold text-slate-800">{currentStage.label}</span>
        <span className="text-[10px] font-semibold text-slate-400 font-mono">Stage {activeIndex + 1}/5</span>
      </div>
      {/* 5 clean progress segments */}
      <div className="grid grid-cols-5 gap-1">
        {stages.map((st, idx) => {
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          return (
            <div
              key={st.key}
              title={st.label}
              className={`h-1.5 rounded-full transition-all ${
                isDone ? 'bg-emerald-500' :
                isCurrent ? 'bg-orange-500' :
                'bg-slate-200'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

// ─── BUDGET VS ACTUAL GAUGE BAR (CLEAN & COMPACT) ──────────────────────────
export const BudgetGaugeBar = ({ budgetStr, budgetValue, spentValue }) => {
  const spent = spentValue || Math.round(budgetValue * 0.92);
  const percentage = Math.min(Math.round((spent / budgetValue) * 100), 100);
  const savingsLakhs = ((budgetValue - spent) / 100000).toFixed(1);

  return (
    <div className="space-y-1 w-full max-w-[160px]">
      <div className="flex items-baseline justify-between gap-1">
        <span className="font-bold text-slate-900 font-mono text-xs whitespace-nowrap">{budgetStr}</span>
        <span className="text-[10px] font-semibold text-emerald-700 font-mono whitespace-nowrap">↓ ₹{savingsLakhs}L</span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-slate-400 font-medium">
        <span>Committed: {percentage}%</span>
        <span>Sanction: 100%</span>
      </div>
    </div>
  );
};