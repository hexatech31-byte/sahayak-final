import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  ChevronDown, 
  Plus, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck 
} from 'lucide-react';
import { useProcurement } from '../context/ProcurementContext';
import { useAuth } from '../context/AuthContext';
import { createProcurement, updateProcurement } from '../services/procurementService';
import { aiService } from '../services/aiService';
import { ProcurementWorkflowBar } from './ProcurementWorkflowBar';

export function TextSpecificationPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useProcurement();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('IT Hardware');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('Units');
  const [department, setDepartment] = useState('Central Public Works Department (CPWD)');
  const [budget, setBudget] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isProcessing) return;
    if (!user) {
      setErrorMessage('Please log in as an officer to create a procurement.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const inputData = {
        rawRequirement: description,
        title: title || 'Requirement Specification',
        category,
        quantity: quantity ? `${quantity} ${unit}` : '',
        quantityNumber: quantity,
        unit,
        department,
        budget,
        deadline,
        description,
      };

      // Create procurement record in Firebase
      const newProc = await createProcurement({
        user,
        title: title || 'Requirement Specification',
        category,
        description,
        inputMode: 'text',
        inputData,
        currentStage: 'understand',
        status: 'in_progress',
      });

      if (addToast) {
        addToast('Procurement Initialized', `Created record #${newProc.id.slice(0, 8)} in Firestore.`, 'info');
      }

      // Call AI service for requirement understanding
      try {
        console.log('[AI] Calling requirement understanding...');
        const understanding = await aiService.understandRequirement({
          title: title || 'Requirement Specification',
          description: description,
          category: category,
          quantity: quantity ? `${quantity} ${unit}` : '',
          budget: budget,
          department: department,
          deadline: deadline
        });

        // Store understanding in Firebase
        await updateProcurement(newProc.id, {
          understanding: understanding,
          understandingStatus: 'pending',
          aiStatus: {
            understanding: 'completed',
            standards: 'pending',
            specification: 'pending'
          }
        }, user.uid);

        console.log('[AI] Understanding stored in Firebase');
      } catch (aiError) {
        console.error('[AI] Understanding failed:', aiError);
        // Continue without AI understanding - user can still proceed
        await updateProcurement(newProc.id, {
          aiStatus: {
            understanding: 'failed',
            standards: 'pending',
            specification: 'pending'
          },
          aiErrors: {
            stage: 'understanding',
            message: aiError.message || 'AI understanding failed',
            timestamp: new Date().toISOString()
          }
        }, user.uid);
      }

      navigate(`/procurement/understand/${newProc.id}`, { 
        state: { 
          procurementId: newProc.id,
          inputType: 'text',
          ...inputData
        } 
      });
    } catch (err) {
      console.error('Error creating procurement:', err);
      setErrorMessage(err.message || 'Failed to initialize procurement record.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col antialiased selection:bg-orange-600 selection:text-white">
      
      {/* ── Global Top Header (No Sidebar Shell) ── */}
      <header className="h-16 border-b border-slate-200 bg-white px-6 sm:px-10 flex items-center justify-end shrink-0 shadow-xs" />

      {/* ── Main Content Area ── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-start">
        
        {/* ── 7-Stage Workflow Progress Bar (Stage 2: Define Active) ── */}
        <ProcurementWorkflowBar currentStage={2} />

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
          
          {/* Card Header with Blue Document Icon */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <FileText size={28} className="stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Text Specification
              </h1>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                Enter your product / requirement details
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-semibold text-red-700">
                {errorMessage}
              </div>
            )}
            
            {/* Requirement Title */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-2">
                Requirement Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Desktop Computers and Workstations"
                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>

            {/* Description (Highlighted) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-bold text-slate-900">
                  Description <span className="text-red-500">*</span>
                </label>
                {/* <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-full">
                  Primary requirement input
                </span> */}
              </div>
              <div className="rounded-2xl border-2 border-blue-400/90 bg-blue-50/20 p-1 shadow-xs focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/15 focus-within:bg-white transition-all">
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed technical specifications, RAM, processor, storage, standards compliance..."
                  className="w-full p-3.5 bg-transparent rounded-xl text-sm text-slate-900 placeholder-slate-400 font-medium focus:outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Category & Estimated Quantity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              
              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-12 px-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 appearance-none cursor-pointer transition-all"
                  >
                    <option value="IT Hardware">IT Hardware</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Solar & Renewable">Solar & Renewable</option>
                    <option value="Public Safety">Public Safety</option>
                    <option value="PPE & Safety">PPE & Safety</option>
                    <option value="Food Safety">Food Safety</option>
                    <option value="Construction Materials">Construction Materials</option>
                    <option value="Machinery">Machinery</option>
                    <option value="Medical & Healthcare">Medical & Healthcare</option>
                    <option value="Chemicals & Petrochemicals">Chemicals & Petrochemicals</option>
                    <option value="Automotive & Transport">Automotive & Transport</option>
                    <option value="Textiles & Uniforms">Textiles & Uniforms</option>
                    <option value="Office Equipment & Furniture">Office Equipment & Furniture</option>
                    <option value="Water Supply & Sanitation">Water Supply & Sanitation</option>
                    <option value="Telecommunications">Telecommunications</option>
                    <option value="Other / General">Other / General</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Estimated Quantity */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Estimated Quantity
                </label>
                <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all">
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full h-12 px-4 text-sm text-slate-800 font-medium focus:outline-none"
                    placeholder="e.g. 85"
                  />
                  <div className="bg-slate-50 border-l border-slate-200 px-4 flex items-center text-sm font-bold text-slate-600 shrink-0">
                    {unit}
                  </div>
                </div>
              </div>

            </div>

            {/* Department, Estimated Budget & Submission Deadline (Main Fields) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-2">
              {/* Department */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Department
                </label>
                <div className="relative">
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full h-12 px-4 pr-10 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 appearance-none cursor-pointer transition-all"
                  >
                    <option value="Central Public Works Department (CPWD)">Central Public Works Department (CPWD)</option>
                    <option value="Central Bureau of Investigation (CBI)">Central Bureau of Investigation (CBI)</option>
                    <option value="Ministry of New and Renewable Energy (MNRE)">Ministry of New and Renewable Energy (MNRE)</option>
                    <option value="National Highways Authority of India (NHAI)">National Highways Authority of India (NHAI)</option>
                    <option value="Department of Information Technology (MeitY)">Department of Information Technology (MeitY)</option>
                    <option value="Power Grid Corporation of India (PGCIL)">Power Grid Corporation of India (PGCIL)</option>
                    <option value="Ministry of Defence (DGQA)">Ministry of Defence (DGQA)</option>
                    <option value="Ministry of Commerce & Industry / DPIIT">Ministry of Commerce & Industry / DPIIT</option>
                    <option value="Ministry of Health & Family Welfare (MoHFW)">Ministry of Health & Family Welfare (MoHFW)</option>
                    <option value="Ministry of Railways (RDSO)">Ministry of Railways (RDSO)</option>
                    <option value="Ministry of Consumer Affairs, Food & Public Distribution (FSSAI)">Ministry of Consumer Affairs, Food & Public Distribution (FSSAI)</option>
                    <option value="Ministry of Jal Shakti / Central Water Commission">Ministry of Jal Shakti / Central Water Commission</option>
                    <option value="Other / General Authority">Other / General Authority</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Estimated Budget */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Estimated Budget
                </label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="e.g. ₹ 45,00,000"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              {/* Submission Deadline */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Submission Deadline
                </label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="e.g. 30 Sep 2026"
                  className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>

            {/* Submit Button (Understand Requirements) */}
            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={isProcessing}
                className="bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 text-sm sm:text-base transition-all cursor-pointer disabled:opacity-70 group"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Understand Requirements</span>
                    <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </main>

    </div>
  );
}
