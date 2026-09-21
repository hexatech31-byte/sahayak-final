import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Edit3, 
  Package, 
  Layers, 
  Hash, 
  Target, 
  Building2, 
  Settings, 
  ShieldCheck, 
  Clock, 
  FileText, 
  FlaskConical, 
  Award, 
  Box, 
  Sliders, 
  Shield, 
  Activity, 
  Grid,
  ShieldAlert
} from 'lucide-react';
import { WorkflowShell } from './WorkflowLayout';
import { ProcurementWorkflowBar } from './ProcurementWorkflowBar';
import { useAuth } from '../context/AuthContext';
import { getProcurementById, updateProcurementStage } from '../services/procurementService';

export function UnderstandRequirementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { user } = useAuth();

  const routeProcId = params.procurementId || location.state?.procurementId || '';
  const [procurement, setProcurement] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(routeProcId));
  const [permissionError, setPermissionError] = useState('');
  const [isProceeding, setIsProceeding] = useState(false);

  // Retrieve input state passed from Define stage or fallback to Firestore
  const inputData = location.state || {};

  useEffect(() => {
    let isMounted = true;
    if (routeProcId && user?.uid) {
      setIsLoading(true);
      setPermissionError('');
      getProcurementById(routeProcId, user.uid)
        .then((doc) => {
          if (isMounted) {
            setProcurement(doc);
            setIsLoading(false);
          }
        })
        .catch((err) => {
          console.error('Error loading procurement:', err);
          if (isMounted) {
            if (err.code === 'PERMISSION_DENIED') {
              setPermissionError('Access Denied: This procurement belongs to another officer.');
            } else {
              setPermissionError('Procurement record not found.');
            }
            setIsLoading(false);
          }
        });
    } else {
      setIsLoading(false);
    }
    return () => { isMounted = false; };
  }, [routeProcId, user?.uid]);

  const activeData = procurement?.inputData || inputData;
  const inputType = procurement?.inputMode || activeData.inputType || 'text';
  
  // Use real AI understanding if available, otherwise fall back to input data
  const understanding = procurement?.understanding || {};
  
  const productTitle = understanding?.product || procurement?.title || activeData.title || activeData.productName || 'Ordinary Portland Cement for Building Construction';
  const category = understanding?.category || procurement?.category || activeData.category || 'Construction Materials';
  const quantity = understanding?.quantity || activeData.quantity || '500 Sets';
  const budget = understanding?.budget || activeData.budget || '₹ 45,00,000';
  const department = understanding?.department || activeData.department || 'Central Public Works Dept (CPWD)';
  const description = procurement?.description || activeData.description || 'Procurement of items for government facility.';
  const intendedPurpose = understanding?.intended_purpose || activeData.purpose || 'government building construction';
  const applicationEnv = understanding?.application_environment || activeData.environment || 'Construction / project site';

  const inputModeRoute = inputType === 'document' 
    ? '/procurement/document' 
    : inputType === 'quotation' 
    ? '/procurement/quotation' 
    : '/procurement/text';

  const handleProceed = async () => {
    if (isProceeding) return;
    setIsProceeding(true);

    if (routeProcId && user?.uid) {
      try {
        // Save confirmed understanding to Firebase
        const confirmedUnderstanding = {
          product: productTitle,
          category: category,
          quantity: quantity,
          budget: budget,
          department: department,
          deadline: activeData.deadline || '',
          intended_purpose: intendedPurpose,
          application_environment: applicationEnv,
          technical_requirements: technicalRequirements.map(req => ({
            name: req.title,
            description: req.desc
          }))
        };

        await updateProcurementStage(routeProcId, {
          currentStage: 'processing',
          status: 'in_progress',
          stageUpdates: {
            'processing.status': 'pending',
            'understanding': confirmedUnderstanding,
            'understandingStatus': 'confirmed'
          }
        }, user.uid);
        
        console.log('[DEBUG] Understanding confirmed, navigation to processing for procurement:', routeProcId);
      } catch (err) {
        console.warn('Could not update stage in Firestore:', err);
      }
    }

    const nextRoute = routeProcId ? `/procurement/processing/${routeProcId}` : '/procurement/processing';

    navigate(nextRoute, { 
      state: { 
        ...activeData, 
        procurementId: routeProcId,
        inputType,
        title: productTitle,
        category,
        quantity,
        budget,
        department,
        description,
        purpose: intendedPurpose,
        environment: applicationEnv
      } 
    });
  };

  // Technical Requirements - use real AI data if available, otherwise show fallback
  const getTechnicalRequirements = () => {
    const aiTechReqs = understanding?.technical_requirements || [];
    
    if (aiTechReqs.length > 0) {
      // Map AI requirements to UI format
      const iconMap = [Shield, ShieldCheck, Grid, Activity, Clock, FileText, Sliders, Building2, FlaskConical, Award, Box];
      
      return aiTechReqs.map((req, index) => {
        const reqName = typeof req === 'string' ? req : (req.name || req.description || 'Technical requirement');
        const reqDesc = typeof req === 'string' ? '' : (req.description || '');
        const icon = iconMap[index % iconMap.length];
        
        return {
          title: reqName,
          desc: reqDesc || 'Technical requirement identified by AI',
          icon: icon
        };
      });
    }
    
    // No fallback to mock data - only return AI results
    return [];
  };

  const technicalRequirements = getTechnicalRequirements();

  if (isLoading) {
    return (
      <WorkflowShell maxWidth="max-w-5xl">
        <ProcurementWorkflowBar currentStage={3} />
        <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center my-6">
          <div className="w-8 h-8 border-3 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-600">Loading procurement specifications from Firestore...</p>
        </div>
      </WorkflowShell>
    );
  }

  if (permissionError) {
    return (
      <WorkflowShell maxWidth="max-w-5xl">
        <ProcurementWorkflowBar currentStage={3} />
        <div className="bg-white border border-red-200 rounded-2xl p-8 text-center my-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-base font-bold text-slate-900">{permissionError}</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Procurement records are strictly isolated. You cannot view or modify procurements belonging to other officers.
          </p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-5 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700 transition-colors cursor-pointer"
          >
            Back to Dashboard
          </button>
        </div>
      </WorkflowShell>
    );
  }

  return (
    <WorkflowShell maxWidth="max-w-5xl">
      
      {/* ── 7-Stage Workflow Bar (Stage 3: Understand Active) ── */}
      <ProcurementWorkflowBar currentStage={3} />

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 text-left">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center shrink-0 text-orange-600 shadow-2xs">
            <FileText size={22} className="stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              We understood your requirement as:
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-normal leading-relaxed">
              Sahayak extracted the following key parameters. Please confirm if this accurately reflects what you need.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(inputModeRoute, { state: inputData })}
          className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-2xs transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Edit3 size={14} />
          <span>Edit Parameters</span>
        </button>
      </div>

      <div className="space-y-6 text-left">
        
        {/* ── Card 1: Key Extracted Parameters ── */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
            
            {/* Product / Requirement */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                <Package size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-slate-500 block mb-0.5">
                  Product / Requirement
                </span>
                <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                  {productTitle}
                </p>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                <Layers size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-slate-500 block mb-0.5">
                  Category
                </span>
                <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                  {category}
                </p>
              </div>
            </div>

            {/* Estimated Quantity */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                <Hash size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-slate-500 block mb-0.5">
                  Estimated Quantity
                </span>
                <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug font-sans">
                  {quantity}
                </p>
              </div>
            </div>

            {/* Intended Purpose */}
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                <Target size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-slate-500 block mb-0.5">
                  Intended Purpose
                </span>
                <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                  {intendedPurpose}
                </p>
              </div>
            </div>

            {/* Application Environment (Full Span on Row 3) */}
            <div className="flex items-start gap-3.5 md:col-span-2">
              <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-slate-700">
                <Building2 size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-medium text-slate-500 block mb-0.5">
                  Application Environment
                </span>
                <p className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                  {applicationEnv}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ── Card 2: Technical Requirements ── */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-2xs space-y-4">
          
          {/* Card Header with Gear Icon */}
          <div className="flex items-center gap-3 pb-3.5 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
              <Settings size={16} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Technical Requirements
              </h2>
              <p className="text-xs text-slate-500 font-normal">
                Sahayak identified the following technical requirements based on your input.
              </p>
            </div>
          </div>

          {/* 2-Column Clean Requirement Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {technicalRequirements.map((req, idx) => {
              const IconComponent = req.icon;
              return (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 transition-colors flex items-start gap-3 shadow-3xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                    <IconComponent size={15} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                      {req.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-normal mt-0.5 leading-relaxed">
                      {req.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* ── Bottom Action Navigation ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => navigate(inputModeRoute, { state: inputData })}
            className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-2xs"
          >
            <ArrowLeft size={16} />
            <span>Back / Re-enter</span>
          </button>

          <button
            type="button"
            onClick={handleProceed}
            disabled={isProceeding}
            className="px-7 py-3 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition-all cursor-pointer disabled:opacity-70"
          >
            <span>Analyze</span>
            <ArrowRight size={16} />
          </button>
        </div>

      </div>

    </WorkflowShell>
  );
}
