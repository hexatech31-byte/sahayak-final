import React, { useState } from 'react';
import { 
  Check, 
  Copy, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Cpu,
  Filter,
  ArrowRight
} from 'lucide-react';
import { SAMPLE_QUERIES } from '../data/mockData';


export const InteractiveSpecFinder = ({ initialQuery = '' }) => {
  const [queryInput, setQueryInput] = useState(
    initialQuery || 'Procurement of 33kV, 1250A, 25kA 3-phase outdoor vacuum circuit breakers (VCB) with motorized spring charge mechanism, porcelain bushings, and IP55 control kiosk for 33/11kV substation under RDSS scheme'
  );
  const [selectedSample, setSelectedSample] = useState('q1');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelectSample = (sampleId) => {
    setSelectedSample(sampleId);
    const sample = SAMPLE_QUERIES.find((s) => s.id === sampleId);
    if (sample) {
      setQueryInput(sample.queryText);
    }
  };

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 400);
  };

  const tenderClauseText = `TECHNICAL SPECIFICATION COMPLIANCE CLAUSE:
1. Primary Equipment: 33kV Outdoor Vacuum Circuit Breaker (VCB) conforming strictly to IS 13118 : 1991 (Reaffirmed 2021) / IEC 62271-100.
2. Statutory Certification: Mandatory Type Test Certificate from NABL/CPRI accredited laboratory as per Ministry of Power Quality Control Order.
3. High Voltage Bushings: Outdoor porcelain/polymer bushings conforming to IS 2099 : 1986 / IS 3347 with creepage distance >= 31 mm/kV.
4. Enclosure & Kiosk: Control cabinet with degree of protection IP55 conforming to IS 12063 : 1987 / IEC 60529.
5. Third-Party Inspection: Factory Acceptance Tests (FAT) covering power frequency withstand, insulation resistance, and timing tests.`;

  const handleCopyClause = () => {
    navigator.clipboard.writeText(tenderClauseText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="spec-finder" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Public Procurement Sandbox</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Live Specification Analyzer & Tender Clause Generator
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Paste unformatted technical tender paragraphs to cross-reference official BIS standards, normative test protocols, and mandatory QCO orders.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" /> Standard Templates:
          </span>
          {SAMPLE_QUERIES.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample.id)}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-all border cursor-pointer ${
                selectedSample === sample.id
                  ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400'
              }`}
            >
              {sample.title}
            </button>
          ))}
        </div>

        {/* Analyzer Frame */}
        <div className="bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
          
          {/* Input Section */}
          <div className="p-6 bg-slate-50/80 border-b border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Technical Specification Scope / Tender Clause Input:
              </label>
              <span className="text-[11px] text-slate-500 font-mono">Format: GFR 2017 Draft Clause</span>
            </div>

            <textarea
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              rows={3}
              className="w-full p-3.5 rounded border border-slate-300 bg-white text-slate-900 text-xs font-mono focus:ring-2 focus:ring-blue-900 focus:outline-none shadow-inner leading-relaxed"
              placeholder="Enter technical specifications, equipment ratings, or tender scope..."
            />

            <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-3 text-xs text-slate-500 font-medium">
                <span className="flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mr-1" /> 25,000+ BIS Records
                </span>
                <span className="flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-900 mr-1" /> DPIIT QCO 2026 Sync
                </span>
              </div>

              <button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded shadow-xs transition-colors cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Cpu className="w-3.5 h-3.5 animate-spin" />
                    <span>Resolving BIS Ontology...</span>
                  </>
                ) : (
                  <>
                    <span>Run Technical Standards Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Standard Specification Resolution Matrix</h3>
                  <p className="text-[11px] text-slate-500">Confidence Score: 99.2% • Complete Normative Tree Verified</p>
                </div>
              </div>

              <button
                onClick={handleCopyClause}
                className="inline-flex items-center space-x-1 px-3 py-1.5 text-xs font-bold bg-slate-100 hover:bg-blue-50 hover:text-blue-900 text-slate-700 border border-slate-300 rounded transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="text-emerald-800 font-bold">Clause Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copy Tender Clause</span>
                  </>
                )}
              </button>
            </div>

            {/* Two Column Output */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Primary Code & Dependencies */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Primary Card */}
                <div className="p-4 rounded-lg border border-blue-300 bg-blue-50/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-900 text-white">
                      PRIMARY MANDATED CODE
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                      Active (Reaffirmed 2021)
                    </span>
                  </div>

                  <div className="text-base font-bold text-slate-900 mb-1">
                    IS 13118 : 1991 (Reaffirmed 2021)
                  </div>
                  <div className="text-xs font-semibold text-blue-900 mb-2">
                    High-Voltage Alternating-Current Circuit-Breakers — Specification & Testing
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Prescribes ratings, dielectric test parameters, temperature-rise limits, and mechanical endurance for high-voltage AC circuit breakers up to 33kV.
                  </p>

                  <div className="p-2.5 bg-white rounded border border-emerald-200 flex items-start space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[11px] font-bold text-emerald-900">Mandatory Quality Control Order (QCO)</div>
                      <div className="text-[10px] text-emerald-800">
                        Mandatory Type Test Certification under Ministry of Power Quality Control Order.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Normative List */}
                <div className="p-4 rounded-lg border border-slate-200 bg-slate-50/70">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center justify-between">
                    <span>Mandatory Allied & Test Standards (Section 2 References)</span>
                    <span className="text-[10px] font-mono text-slate-500">Auto-Integrated</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-900">IS 2099 : 1986</span>
                        <span className="text-slate-600 ml-2 text-[11px]">— Bushings for Alternating Voltages Above 1000V</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">Component Code</span>
                    </div>

                    <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-900">IS 12063 : 1987</span>
                        <span className="text-slate-600 ml-2 text-[11px]">— Degrees of Protection Provided by Enclosures (IP55)</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">Safety Grade</span>
                    </div>

                    <div className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-slate-900">IS 3427 : 1997</span>
                        <span className="text-slate-600 ml-2 text-[11px]">— AC Metal-Enclosed Switchgear and Controlgear</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">Installation Code</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Ready to Paste Technical Clause */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="p-4 rounded-lg border border-slate-800 bg-slate-900 text-slate-100 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-2.5">
                      <div className="flex items-center space-x-1.5">
                        <FileText className="w-3.5 h-3.5 text-sky-400" />
                        <span className="text-xs font-bold text-slate-200">Auto-Formatted Tender Clause</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                        GeM / CPPP Format
                      </span>
                    </div>

                    <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto max-h-[280px] overflow-y-auto">
                      {tenderClauseText}
                    </pre>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">GFR 2017 Rule 144(i) Verified</span>
                    <button
                      onClick={handleCopyClause}
                      className="px-2.5 py-1 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors flex items-center space-x-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
