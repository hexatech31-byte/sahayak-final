import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  FileText, 
  UploadCloud, 
  Receipt, 
  X, 
  Sparkles, 
  CheckCircle2, 
  FileUp, 
  AlertCircle,
  FileCheck,
  Building2,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { ProcurementWorkflowBar } from './ProcurementWorkflowBar';

export function InputModePage() {
  const navigate = useNavigate();
  const { createTender, quotations, addToast } = useProcurement();

  // Active modal state: null | 'text' | 'upload' | 'quotation'
  const [activeModal, setActiveModal] = useState(null);

  // Form states for Text Specification mode
  const [textTitle, setTextTitle] = useState('');
  const [textCategory, setTextCategory] = useState('IT Hardware');
  const [textDept, setTextDept] = useState('Central Bureau of Investigation (CBI)');
  const [textBudget, setTextBudget] = useState('₹ 45,00,000');
  const [textDeadline, setTextDeadline] = useState('25 Sep 2026');
  const [textDescription, setTextDescription] = useState('');

  // Form states for Document Upload mode
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isParsingDoc, setIsParsingDoc] = useState(false);
  const [docParsedData, setDocParsedData] = useState(null);

  // Form states for Quotation to Tender mode
  const [selectedQuoteId, setSelectedQuoteId] = useState(quotations[0]?.id || '');
  const [quoteMultiplier, setQuoteMultiplier] = useState('1');

  // Handle Text Spec Submit
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textTitle) return;
    createTender({
      title: textTitle,
      department: textDept,
      category: textCategory,
      budget: textBudget,
      deadline: textDeadline,
      description: textDescription || `Tender drafted via Text Specification input for ${textTitle}.`
    });
    setActiveModal(null);
    navigate('/dashboard/tenders');
  };

  // Handle Document Upload Simulation
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setIsParsingDoc(true);
    setTimeout(() => {
      setIsParsingDoc(false);
      setDocParsedData({
        title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        category: 'Electrical',
        department: 'Central Public Works Dept (CPWD)',
        extractedCodes: ['IS 13118 : 1991', 'IS 12063 : 1987'],
        estimatedBudget: '₹ 38,50,000',
        deadline: '30 Sep 2026'
      });
    }, 1200);
  };

  const handleDocConfirm = () => {
    if (!docParsedData) return;
    createTender({
      title: docParsedData.title || 'Procurement of Equipment from Uploaded Tender',
      department: docParsedData.department,
      category: docParsedData.category,
      budget: docParsedData.estimatedBudget,
      deadline: docParsedData.deadline,
      description: `Parsed from uploaded document: ${uploadedFile?.name || 'tender_spec.pdf'}`
    });
    setActiveModal(null);
    setUploadedFile(null);
    setDocParsedData(null);
    navigate('/dashboard/tenders');
  };

  // Handle Quotation Conversion
  const handleQuoteConvert = () => {
    const quote = quotations.find(q => q.id === selectedQuoteId) || quotations[0];
    if (!quote) return;
    createTender({
      title: `Procurement based on ${quote.tenderTitle || quote.id}`,
      department: 'Ministry of Commerce & Industry / DPIIT',
      category: 'IT Hardware',
      budget: quote.amount ? `₹ ${(quote.amount * parseFloat(quoteMultiplier || 1)).toLocaleString('en-IN')}` : '₹ 50,00,000',
      deadline: '15 Oct 2026',
      description: `Converted from Vendor Quotation ${quote.id} submitted by ${quote.vendorName || 'Vendor'}.`
    });
    setActiveModal(null);
    navigate('/dashboard/tenders');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in text-left pb-12">
      
      {/* ── 7-Stage Workflow Progress Bar (Stage 1: Home Active) ── */}
      <ProcurementWorkflowBar currentStage={1} />

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          What are you procuring?
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1.5 font-medium leading-relaxed max-w-3xl">
          Provide your procurement requirement in natural language, upload a draft document, fill structured parameters, or audit an existing specification.
        </p>
      </div>

      {/* ── 3 Input Mode Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        
        {/* Card: Text Specification */}
        <div 
          onClick={() => navigate('/procurement/text')}
          className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
        >
          {/* Image Container */}
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
            <img 
              src="/procurement-text-spec.jpg" 
              alt="Text Specification" 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                Text Specification
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Enter requirements manually.
              </p>
            </div>

            {/* Bottom Action */}
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                Start with text →
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs group-hover:bg-blue-600 group-hover:text-white transition-all">
                <ArrowRight size={15} />
              </div>
            </div>
          </div>
        </div>

        {/* Card: Upload Document */}
        <div 
          onClick={() => navigate('/procurement/document')}
          className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
        >
          {/* Image Container */}
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
            <img 
              src="/procurement-upload-doc.jpg" 
              alt="Upload Document" 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Upload Document
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Upload an existing tender file.
              </p>
            </div>

            {/* Bottom Action */}
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-emerald-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                Upload file →
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs group-hover:bg-emerald-600 group-hover:text-white transition-all">
                <ArrowRight size={15} />
              </div>
            </div>
          </div>
        </div>

        {/* Card: Quotation to Tender */}
        <div 
          onClick={() => navigate('/procurement/quotation')}
          className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer group"
        >
          {/* Image Container */}
          <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
            <img 
              src="/procurement-quotation-tender.jpg" 
              alt="Quotation to Tender" 
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Content */}
          <div className="p-5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-orange-600 transition-colors">
                Quotation to Tender
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                Convert a vendor quotation.
              </p>
            </div>

            {/* Bottom Action */}
            <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-orange-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                Convert quotation →
              </span>
              <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shadow-xs group-hover:bg-orange-600 group-hover:text-white transition-all">
                <ArrowRight size={15} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Floating Ask Sahayak AI Button (Matching Exact Reference Image) ── */}
      <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 flex flex-col items-center group">
        {/* Dark Tooltip Bubble on Top with Downward Arrow */}
        <div className="relative mb-2.5 transition-transform group-hover:-translate-y-1 duration-200">
          <div className="bg-slate-900 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg shadow-md whitespace-nowrap tracking-tight">
            Ask Sahayak AI
          </div>
          {/* Downward triangle/pointer */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
        </div>

        {/* Circular Button with soft translucent orange halo & overlapping chat bubble icon */}
        <button
          type="button"
          onClick={() => navigate('/sahayak-ai')}
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-orange-600 hover:bg-orange-700 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-orange-600/30 ring-8 ring-orange-500/20 hover:ring-12 hover:ring-orange-500/30 hover:scale-105 transition-all duration-300 cursor-pointer"
          title="Ask Sahayak AI"
          aria-label="Ask Sahayak AI"
        >
          {/* Overlapping Dual Chat Bubble with 2 Dots (Exact Match to Reference Image) */}
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-7 h-7 sm:w-8 sm:h-8 text-white"
          >
            {/* Front speech bubble */}
            <path d="M14 13a2.5 2.5 0 0 0 2.5-2.5V6A2.5 2.5 0 0 0 14 3.5H5.5A2.5 2.5 0 0 0 3 6v4.5A2.5 2.5 0 0 0 5.5 13H7l-.5 3 3.5-3H14z" />
            <line x1="7.5" y1="8" x2="7.51" y2="8" strokeWidth="3" />
            <line x1="11.5" y1="8" x2="11.51" y2="8" strokeWidth="3" />
            {/* Back speech bubble */}
            <path d="M16.5 7.5h1A2.5 2.5 0 0 1 20 10v4.5a2.5 2.5 0 0 1-2.5 2.5h-1l-2.5 2.5.5-2.5h-3a2.5 2.5 0 0 1-2.4-1.8" />
          </svg>
        </button>
      </div>

      {/* ── MODALS FOR THE 3 OPTIONS ── */}

      {/* Modal 1: Text Specification */}
      {activeModal === 'text' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setActiveModal(null)} 
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <FileText size={18} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Text Specification Input</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Enter your technical specifications. AI will auto-map corresponding IS codes.</p>

            <form onSubmit={handleTextSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Tender Title / Product Spec *</label>
                <input 
                  type="text" 
                  required
                  value={textTitle}
                  onChange={(e) => setTextTitle(e.target.value)}
                  placeholder="e.g. 33kV Outdoor Vacuum Circuit Breaker (VCB) Switchgear Panels" 
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Category *</label>
                  <select 
                    value={textCategory}
                    onChange={(e) => setTextCategory(e.target.value)}
                    className="w-full border border-slate-300 bg-white rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="IT Hardware">IT Hardware (IS 13252, IS 14896)</option>
                    <option value="Solar & Renewable">Solar & Renewable (IS 14286, ALMM)</option>
                    <option value="PPE & Safety">PPE & Safety (IS 2925, IS 3521)</option>
                    <option value="Electrical">Electrical (IS 13118, IS 694, IS 1554)</option>
                    <option value="Construction Materials">Construction (IS 1489, IS 1786)</option>
                    <option value="Machinery">Machinery (IS 8472, IS 9079)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Department *</label>
                  <select 
                    value={textDept}
                    onChange={(e) => setTextDept(e.target.value)}
                    className="w-full border border-slate-300 bg-white rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option>Central Bureau of Investigation (CBI)</option>
                    <option>Central Public Works Dept (CPWD)</option>
                    <option>Ministry of New & Renewable Energy (MNRE)</option>
                    <option>National Highways Authority (NHAI)</option>
                    <option>Power Grid Corporation (PGCIL)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Estimated Budget</label>
                  <input 
                    type="text" 
                    value={textBudget}
                    onChange={(e) => setTextBudget(e.target.value)}
                    placeholder="₹ 45,00,000" 
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Bid Submission Deadline</label>
                  <input 
                    type="text" 
                    value={textDeadline}
                    onChange={(e) => setTextDeadline(e.target.value)}
                    placeholder="25 Sep 2026" 
                    className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Detailed Technical Scope</label>
                <textarea 
                  rows={3} 
                  value={textDescription}
                  onChange={(e) => setTextDescription(e.target.value)}
                  placeholder="Specify operating voltage, breaking capacity, busbar rating, IP enclosure grade, test requirements..." 
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setActiveModal(null)} 
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                >
                  Proceed with Text Spec →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Upload Document */}
      {activeModal === 'upload' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => { setActiveModal(null); setUploadedFile(null); setDocParsedData(null); }} 
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <UploadCloud size={18} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Upload Tender Document</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Upload existing tender documents, NIT notices, or BOQ files (PDF, DOCX, XLSX).</p>

            {!uploadedFile ? (
              <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-50 hover:bg-emerald-50/40">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                  <FileUp size={24} />
                </div>
                <span className="text-sm font-bold text-slate-800">Click to upload or drag & drop</span>
                <span className="text-xs text-slate-400 mt-1">PDF, DOCX, Excel spreadsheets up to 25MB</span>
                <input 
                  type="file" 
                  accept=".pdf,.docx,.doc,.xlsx,.xls" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
              </label>
            ) : isParsingDoc ? (
              <div className="p-8 text-center space-y-3 bg-emerald-50/50 rounded-2xl border border-emerald-200">
                <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-bold text-slate-900">AI Parsing Document...</p>
                <p className="text-xs text-slate-500">Extracting equipment clauses, voltage specs, and BIS standards.</p>
              </div>
            ) : docParsedData ? (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Tender Specifications Extracted Successfully</span>
                  </div>
                  <div className="text-xs space-y-1 text-slate-700 pt-1">
                    <p><span className="font-semibold text-slate-500">Scope:</span> {docParsedData.title}</p>
                    <p><span className="font-semibold text-slate-500">Category:</span> {docParsedData.category}</p>
                    <p><span className="font-semibold text-slate-500">Est. Budget:</span> {docParsedData.estimatedBudget}</p>
                    <p><span className="font-semibold text-slate-500">Identified Standards:</span> {docParsedData.extractedCodes.join(', ')}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2.5">
                  <button 
                    type="button" 
                    onClick={() => { setUploadedFile(null); setDocParsedData(null); }} 
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Upload Another
                  </button>
                  <button 
                    type="button" 
                    onClick={handleDocConfirm} 
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    Generate Tender Draft →
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* Modal 3: Quotation to Tender */}
      {activeModal === 'quotation' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setActiveModal(null)} 
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
                <Receipt size={18} />
              </div>
              <h3 className="text-lg font-black text-slate-900">Convert Quotation to Tender</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">Select an existing quotation to generate a fully compliant government procurement tender draft.</p>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Select Source Quotation</label>
                <select 
                  value={selectedQuoteId}
                  onChange={(e) => setSelectedQuoteId(e.target.value)}
                  className="w-full border border-slate-300 bg-white rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none"
                >
                  {quotations.map(q => (
                    <option key={q.id} value={q.id}>
                      {q.id} — {q.tenderTitle} ({q.vendorName}) — ₹{q.amount?.toLocaleString('en-IN')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Quantity / Scope Multiplier</label>
                <input 
                  type="number" 
                  min="1"
                  max="100"
                  value={quoteMultiplier}
                  onChange={(e) => setQuoteMultiplier(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">Scale commercial budget & requirement line items proportionally.</p>
              </div>

              <div className="p-3.5 bg-orange-50/60 border border-orange-200 rounded-xl text-xs text-orange-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-orange-800">
                  <Sparkles size={14} className="text-orange-600" />
                  <span>Automated Clause Alignment</span>
                </p>
                <p className="text-slate-600 text-[11px]">
                  All product line items from the vendor quotation will be validated against active BIS quality certificates and GFR 144(i) norms.
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setActiveModal(null)} 
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleQuoteConvert} 
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white shadow-md shadow-orange-600/20 transition-all cursor-pointer"
                >
                  Convert to Tender →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
