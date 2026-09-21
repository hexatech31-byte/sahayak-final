import React, { useState } from 'react';
import { 
  BrainCircuit, 
  Network, 
  History, 
  Languages, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { CORE_FEATURES } from '../data/mockData';

export const FeatureShowcase = () => {
  const [activeTab, setActiveTab] = useState('semantic-search');

  const currentFeature = CORE_FEATURES.find((f) => f.id === activeTab) || CORE_FEATURES[0];

  const getFeatureIcon = (iconName) => {
    switch (iconName) {
      case 'BrainCircuit':
        return <BrainCircuit className="w-5 h-5" />;
      case 'Network':
        return <Network className="w-5 h-5" />;
      case 'History':
        return <History className="w-5 h-5" />;
      case 'Languages':
        return <Languages className="w-5 h-5" />;
      default:
        return <ShieldCheck className="w-5 h-5" />;
    }
  };

  return (
    <section id="features" className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Enterprise Technical Capabilities</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Core Capability Deep Dive
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Engineered specifically to handle the structural complexity, normative hierarchies, and statutory mandates of Indian Public Procurement.
          </p>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-8">
          {CORE_FEATURES.map((feature) => {
            const isActive = activeTab === feature.id;
            return (
              <button
                key={feature.id}
                onClick={() => setActiveTab(feature.id)}
                className={`p-3.5 rounded-lg text-left border transition-all flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                    : 'bg-slate-50 border-slate-300 hover:bg-slate-100 hover:border-slate-400 text-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5 mb-1.5">
                  <div
                    className={`w-7 h-7 rounded flex items-center justify-center ${
                      isActive ? 'bg-blue-800 text-white' : 'bg-white border border-slate-200 text-blue-900'
                    }`}
                  >
                    {getFeatureIcon(feature.iconName)}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>
                    {feature.badge}
                  </span>
                </div>
                <div className="text-xs font-bold">
                  {feature.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Two-Column Feature Showcase Frame */}
        <div className="gov-card p-6 sm:p-8 bg-slate-50/50 border border-slate-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Feature Narrative */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-300 mb-2.5">
                {currentFeature.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                {currentFeature.title}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-blue-900 mb-3">
                {currentFeature.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 font-normal">
                {currentFeature.description}
              </p>

              {/* Bullet Points */}
              <div className="space-y-2.5 w-full mb-6">
                {currentFeature.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5">
                    <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                    </div>
                    <span className="text-xs text-slate-700 font-medium leading-normal">
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 w-full flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Aligned with GeM Category Taxonomies</span>
                <a href="#spec-finder" className="text-blue-900 font-bold hover:underline flex items-center">
                  Try live query <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </a>
              </div>
            </div>

            {/* Right Column: Realistic Dashboard Card Snippet */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-lg border border-slate-300 shadow-xs p-4.5 overflow-hidden">
                
                {/* Visual 1: Semantic Search */}
                {activeTab === 'semantic-search' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs">
                      <div className="text-slate-500 font-bold uppercase text-[10px] mb-1">Tender Scope Input:</div>
                      <div className="font-mono text-slate-800 bg-white p-2 rounded border border-slate-200 text-[11px]">
                        "Procurement of 33kV, 1250A outdoor vacuum circuit breakers for substation with IP55 control kiosk"
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-blue-900 bg-blue-50/70 p-2 rounded border border-blue-200">
                      <div className="flex items-center space-x-1.5">
                        <BrainCircuit className="w-3.5 h-3.5 text-blue-900" />
                        <span>Semantic Context Resolution (0.18s)</span>
                      </div>
                      <span className="text-emerald-700">99.2% Match</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-emerald-50/60 border border-emerald-300 rounded flex items-center justify-between">
                        <div>
                          <div className="font-mono font-bold text-emerald-950">IS 13118 : 1991 (Reaffirmed 2021)</div>
                          <div className="text-[10px] text-emerald-800">Primary Product Code • High-Voltage AC Circuit-Breakers</div>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-bold rounded">Active Code</span>
                      </div>

                      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                        <div>
                          <div className="font-mono font-bold text-slate-800">IS 2099 : 1986 & IS 12063 : 1987</div>
                          <div className="text-[10px] text-slate-600">Normative Bushing & IP55 Enclosure Protection Standards</div>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-bold rounded">Allied Linked</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Visual 2: Normative Reference Graph */}
                {activeTab === 'normative-engine' && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-800 flex items-center justify-between pb-2 border-b border-slate-200">
                      <span>Normative Dependency Constellation</span>
                      <span className="text-[10px] bg-blue-50 text-blue-900 font-mono px-2 py-0.5 rounded border border-blue-200">IS 1786 Anchor</span>
                    </div>

                    <div className="relative pl-5 space-y-2.5 border-l-2 border-blue-900 ml-2">
                      <div className="relative">
                        <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-900 border-2 border-white"></div>
                        <div className="p-2 bg-slate-50 rounded border border-slate-200 text-xs">
                          <div className="font-mono font-bold text-slate-900">IS 1608 : 2018 — Tensile Testing Method</div>
                          <div className="text-[10px] text-slate-500">Mandatory yield stress & 16% elongation verification</div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-emerald-700 border-2 border-white"></div>
                        <div className="p-2 bg-slate-50 rounded border border-slate-200 text-xs">
                          <div className="font-mono font-bold text-slate-900">IS 228 (Part 1-24) — Chemical Spectrometry</div>
                          <div className="text-[10px] text-slate-500">Carbon &lt;= 0.25%, Sulfur &lt;= 0.040%, Phosphorus &lt;= 0.040%</div>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-700 border-2 border-white"></div>
                        <div className="p-2 bg-slate-50 rounded border border-slate-200 text-xs">
                          <div className="font-mono font-bold text-slate-900">IS 13620 : 1993 — Fusion Bonded Epoxy Coating</div>
                          <div className="text-[10px] text-slate-500">Corrosion protection standards for marine/coastal structures</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Visual 3: Multilingual Query Support */}
                {activeTab === 'multilingual-query' && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-800 flex items-center justify-between pb-2 border-b border-slate-200">
                      <span>Cross-Lingual Technical Query Resolution</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">Indic NLP Engine</span>
                    </div>

                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-xs">
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Hindi (हिंदी) Field Input:</div>
                      <div className="font-medium text-slate-800">
                        "ग्रामीण पेयजल आपूर्ति के लिए 110mm एचडीपीई पाइप और आईएस 10500 शुद्धता परीक्षण"
                      </div>
                    </div>

                    <div className="flex items-center justify-center text-xs font-bold text-blue-900 bg-blue-50 py-1 rounded border border-blue-200">
                      <Languages className="w-3.5 h-3.5 mr-1" />
                      <span>Unified BIS Standard Terminology Mapping</span>
                    </div>

                    <div className="p-2.5 bg-white border border-slate-200 rounded text-xs">
                      <div className="text-[10px] text-slate-500 font-bold uppercase mb-1">Resolved Standard Clause:</div>
                      <div className="font-mono text-slate-900 text-[11px]">
                        HDPE Pipes for Water Supply conforming to <strong>IS 4984 : 2016</strong> (PE-100, PN-10) with drinking water purity per <strong>IS 10500 : 2012</strong>.
                      </div>
                    </div>
                  </div>
                )}

                {/* Visual 4: Revision Tracker */}
                {activeTab === 'revision-tracker' && (
                  <div className="space-y-2.5">
                    <div className="text-xs font-bold text-slate-800 flex items-center justify-between pb-1.5 border-b border-slate-200">
                      <span>Standard Revision Audit Trail</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">IS 1786 Timeline</span>
                    </div>

                    <div className="p-2 bg-rose-50 border border-rose-200 rounded flex items-center justify-between text-xs opacity-75">
                      <div>
                        <span className="font-mono line-through text-rose-900">IS 1786 : 1985 (3rd Rev)</span>
                        <div className="text-[10px] text-rose-700">WITHDRAWN • Superseded standard</div>
                      </div>
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded">Obsolete</span>
                    </div>

                    <div className="p-2.5 bg-emerald-50 border border-emerald-400 rounded flex items-center justify-between text-xs">
                      <div>
                        <div className="font-mono font-bold text-emerald-950">IS 1786 : 2008 (4th Revision)</div>
                        <div className="text-[10px] text-emerald-800">CURRENT ACTIVE • Reaffirmed 2023 with Amd 1, 2, 3</div>
                      </div>
                      <span className="text-[10px] font-bold text-white bg-emerald-700 px-2 py-0.5 rounded">Valid BIS</span>
                    </div>

                    <div className="p-2 bg-amber-50 border border-amber-200 rounded flex items-center justify-between text-xs">
                      <div>
                        <div className="font-mono font-bold text-amber-950">Draft Revision (Doc: CED 54)</div>
                        <div className="text-[10px] text-amber-800">Wide Circulation Stage • Projected 2027</div>
                      </div>
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">Draft</span>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
