import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  UploadCloud, 
  FileText, 
  ChevronDown, 
  Info,
  CheckCircle2,
  X
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { useAuth } from '../context/AuthContext';
import { createProcurement } from '../services/procurementService';
import { ProcurementWorkflowBar } from './ProcurementWorkflowBar';

export function QuotationTenderPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useProcurement();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setErrorMessage('');
    }
  };

  const handleAnalyze = async () => {
    if (isAnalyzing) return;
    if (!user) {
      setErrorMessage('Please log in as an officer to proceed.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage('');

    const tenderTitle = selectedFile 
      ? `Procurement based on ${selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')}`
      : 'Supply and Delivery of IT Hardware & Peripherals (Quotation Conversion)';

    try {
      const inputData = {
        fileName: selectedFile ? selectedFile.name : 'vendor_quotation_spec.pdf',
        fileSize: selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : '1.8 MB',
        fileType: selectedFile ? selectedFile.type || 'application/pdf' : 'application/pdf',
        title: tenderTitle,
        department: 'Ministry of Commerce & Industry / DPIIT',
        category: 'IT Hardware',
        budget: '₹ 52,00,000',
        deadline: '15 Oct 2026',
        description: `Generated from converted vendor quotation/product catalogue: ${selectedFile?.name || 'vendor_quotation_spec.pdf'}`,
        quantity: '500 Sets',
        workflowMode: 'quotation',
      };

      const newProc = await createProcurement({
        user,
        title: tenderTitle,
        category: 'IT Hardware',
        description: inputData.description,
        inputMode: 'quotation',
        inputData,
        currentStage: 'processing',
        status: 'in_progress',
      });

      if (addToast) {
        addToast('Quotation Registered', `Procurement #${newProc.id.slice(0, 8)} initialized in Firestore.`, 'info');
      }

      navigate(`/procurement/processing/${newProc.id}`, { 
        state: { 
          procurementId: newProc.id,
          inputType: 'quotation',
          workflowMode: 'quotation',
          ...inputData
        } 
      });
    } catch (err) {
      console.error('Error creating procurement:', err);
      setErrorMessage(err.message || 'Failed to initialize procurement record.');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col antialiased selection:bg-orange-600 selection:text-white">
      
      {/* ── Global Top Header (Workflow Shell - No Sidebar) ── */}
      <header className="h-16 border-b border-slate-200 bg-white px-6 sm:px-10 flex items-center justify-end shrink-0 shadow-xs" />

      {/* ── Main Content Area ── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-start">
        
        {/* ── 5-Stage Workflow Progress Bar for Quotation mode (Stage 2: Define Active) ── */}
        <ProcurementWorkflowBar currentStage={2} mode="quotation" />

        {/* Back Link */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => navigate('/procurement')}
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-orange-600 transition-colors cursor-pointer group"
          >
            <ArrowLeft size={17} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Input Mode</span>
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 text-left">
          
          {/* Card Header with Purple Document Icon */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <FileText size={28} className="stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Quotation to Tender
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                Upload vendor quotation, catalogue or product data sheet.
              </p>
            </div>
          </div>

          {/* Upload Section */}
          <div className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
                {errorMessage}
              </div>
            )}
            
            {/* Section Label */}
            <h3 className="text-sm font-bold text-slate-900">
              Upload File <span className="text-slate-500 font-medium">(Supported formats: CSV, OMR, PDF)</span>
            </h3>

            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                isDragging 
                  ? 'border-indigo-500 bg-indigo-50/40 scale-[0.99]' 
                  : 'border-indigo-300/90 bg-white hover:bg-indigo-50/20 hover:border-indigo-500'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.omr,.pdf,.docx,.xlsx"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload Cloud Icon */}
              <div className="w-14 h-14 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <UploadCloud size={32} className="stroke-[1.8]" />
              </div>

              {/* Upload Prompts */}
              <p className="text-base font-bold text-slate-800">
                Drag & drop file here
              </p>
              <span className="text-xs text-slate-400 my-1.5 font-medium">or</span>
              
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-6 py-2 rounded-xl border border-indigo-500 text-indigo-600 font-bold text-sm hover:bg-indigo-50 transition-colors shadow-xs cursor-pointer"
              >
                Choose File
              </button>

              {/* Selected File Feedback */}
              {selectedFile && (
                <div 
                  onClick={(e) => e.stopPropagation()} 
                  className="mt-4 px-4 py-2 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2 text-xs font-bold text-indigo-900"
                >
                  <CheckCircle2 size={16} className="text-indigo-600" />
                  <span>{selectedFile.name}</span>
                  <span className="text-slate-400 font-normal">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                  <button 
                    type="button" 
                    onClick={() => setSelectedFile(null)} 
                    className="p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            {/* File Info Bar */}
            <p className="text-xs text-slate-500 font-medium text-center pt-1">
              Supported formats: CSV, OMR, PDF <span className="mx-2 text-slate-300">|</span> Max file size: 25 MB
            </p>

            {/* Information Panel */}
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 sm:p-4.5 flex items-start gap-3.5 text-slate-700 mt-6">
              <div className="w-5 h-5 rounded-full text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <Info size={20} />
              </div>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>You can upload any vendor quotation, catalogue or product data sheet.</p>
                <p>Our AI model will extract the items, specifications and other relevant details.</p>
              </div>
            </div>

            {/* Action Button (Aligned Right in Orange) */}
            <div className="pt-6 flex justify-end">
              <button
                type="button"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 text-sm sm:text-base transition-all cursor-pointer disabled:opacity-70"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Quotation...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze Quotation</span>
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
