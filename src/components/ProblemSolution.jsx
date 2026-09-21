import React from 'react';
import { 
  FileClock, 
  GitFork, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Scale
} from 'lucide-react';
import { PROBLEM_SOLUTIONS } from '../data/mockData';

export const ProblemSolution = () => {
  const getIcon = (name) => {
    switch (name) {
      case 'FileClock':
        return <FileClock className="w-5 h-5 text-amber-700" />;
      case 'GitFork':
        return <GitFork className="w-5 h-5 text-blue-900" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-700" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-900" />;
    }
  };

  return (
    <section id="problem-solution" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-slate-100 border border-slate-300 text-slate-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Scale className="w-3.5 h-3.5 text-slate-700" />
            <span>Operational Tender Audit & Compliance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Resolving Core Technical Procurement Vulnerabilities
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Manual standard lookup in technical bid documentation is error-prone, fragmented, and exposes procurement officers to severe legal and audit vulnerabilities.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {PROBLEM_SOLUTIONS.map((item, index) => (
            <div
              key={item.id}
              className="gov-card p-6 flex flex-col justify-between relative overflow-hidden group hover:border-blue-900 transition-colors"
            >
              {/* Top Accent Line */}
              <div 
                className={`absolute top-0 left-0 right-0 h-1 ${
                  index === 0 ? 'bg-amber-600' : index === 1 ? 'bg-blue-900' : 'bg-emerald-700'
                }`} 
              />

              <div>
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                    {getIcon(item.iconName)}
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-2.5 py-1 rounded border border-slate-200">
                    {item.category}
                  </span>
                </div>

                {/* Challenge Card */}
                <div className="mb-4 p-3.5 rounded-lg bg-rose-50/60 border border-rose-200">
                  <div className="flex items-center space-x-1.5 text-rose-900 text-xs font-bold uppercase tracking-wide mb-1">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
                    <span>Operational Challenge</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">
                    {item.problem.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    {item.problem.description}
                  </p>
                  <div className="text-[11px] font-semibold text-rose-800 bg-rose-100/90 px-2 py-1 rounded border border-rose-200">
                    Impact: {item.problem.impact}
                  </div>
                </div>

                {/* Solution Card */}
                <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200">
                  <div className="flex items-center space-x-1.5 text-blue-900 text-xs font-bold uppercase tracking-wide mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
                    <span>Sahayak Capability</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1">
                    {item.solution.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    {item.solution.description}
                  </p>
                  <div className="text-[11px] font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>{item.solution.benefit}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Subtle Indicator */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>BIS Gazette Verification</span>
                <span className="text-blue-900 font-bold flex items-center">
                  Statutory Rule 144(i) <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
