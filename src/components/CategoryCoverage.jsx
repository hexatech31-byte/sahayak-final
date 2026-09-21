import React, { useState } from 'react';
import { 
  Zap, 
  Building2, 
  Cpu, 
  Wrench, 
  ShieldAlert, 
  FlaskConical, 
  Layers, 
  ShieldCheck, 
  ArrowUpRight
} from 'lucide-react';
import { CATEGORIES, STANDARDS_DATABASE } from '../data/mockData';

export const CategoryCoverage = ({ onSelectStandard }) => {
  const [activeCategory, setActiveCategory] = useState('electrical');

  const getCategoryIcon = (iconName, isSelected) => {
    const className = `w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-900'}`;
    switch (iconName) {
      case 'Zap':
        return <Zap className={className} />;
      case 'Building2':
        return <Building2 className={className} />;
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Wrench':
        return <Wrench className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'FlaskConical':
        return <FlaskConical className={className} />;
      default:
        return <Layers className={className} />;
    }
  };

  const currentCategory = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];
  const standardsForCategory = STANDARDS_DATABASE[activeCategory] || STANDARDS_DATABASE['electrical'];

  return (
    <section id="categories" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Official Bureau of Indian Standards (BIS) Divisions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Standards Coverage by Sector
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Categorized directories aligned with Central & State Public Procurement divisions and GeM catalog taxonomies.
          </p>
        </div>

        {/* Category Tiles Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8">
          {CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-7 h-7 rounded flex items-center justify-center ${isSelected ? 'bg-blue-800' : 'bg-slate-100'}`}>
                    {getCategoryIcon(cat.iconName, isSelected)}
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {cat.count.toLocaleString()}
                  </span>
                </div>
                <div className="text-xs font-bold line-clamp-2 leading-tight">
                  {cat.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Category Details & Standards Table */}
        <div className="gov-card p-6 bg-white border border-slate-300">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  BIS Division Overview
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {currentCategory.count.toLocaleString()} Standards Indexed
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {currentCategory.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                {currentCategory.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 mr-1">Frequent IS Codes:</span>
              {currentCategory.popularCodes.map((code) => (
                <span
                  key={code}
                  className="px-2 py-1 text-xs font-mono font-bold bg-slate-100 text-slate-800 rounded border border-slate-300"
                >
                  {code}
                </span>
              ))}
            </div>
          </div>

          {/* Standard Cards Grid */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {standardsForCategory.map((standard) => (
              <div
                key={standard.id}
                className="p-4 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {standard.code}
                    </span>
                    {standard.qcoMandatory ? (
                      <span className="inline-flex items-center text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-300">
                        <ShieldCheck className="w-3 h-3 mr-1 text-emerald-700" />
                        Mandatory QCO
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-200 px-1.5 py-0.5 rounded">
                        Voluntary Code
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 mb-1.5">
                    {standard.title}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-3 mb-3 leading-relaxed">
                    {standard.description}
                  </p>
                </div>

                <div>
                  {/* Normative References Preview */}
                  <div className="mb-3 pt-2.5 border-t border-slate-200">
                    <div className="text-[10px] font-bold text-slate-500 mb-1 flex items-center justify-between uppercase">
                      <span>Normative Test Links ({standard.normativeReferences.length})</span>
                      <span className="text-emerald-700 font-mono text-[9px]">Verified</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {standard.normativeReferences.slice(0, 2).map((ref) => (
                        <span
                          key={ref.code}
                          className="text-[10px] font-mono px-1.5 py-0.5 bg-white border border-slate-200 text-slate-700 rounded"
                        >
                          {ref.code}
                        </span>
                      ))}
                      {standard.normativeReferences.length > 2 && (
                        <span className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded">
                          +{standard.normativeReferences.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectStandard && onSelectStandard(standard.code)}
                    className="w-full text-xs font-bold py-1.5 px-2.5 rounded bg-white border border-slate-300 text-slate-800 hover:text-blue-900 hover:border-blue-900 flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                  >
                    <span>Inspect Specification Clause</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
