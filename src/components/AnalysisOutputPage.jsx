import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  Download,
  Plus,
  Share2,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  ClipboardCheck,
  Check,
  X,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { WorkflowShell } from './WorkflowLayout';
import { ProcurementWorkflowBar } from './ProcurementWorkflowBar';
import { useAuth } from '../context/AuthContext';
import { getProcurementById, updateProcurementStage } from '../services/procurementService';

// Function to convert RAG analysis to UI-compatible format
const convertRAGToUIData = (ragAnalysis) => {
  if (!ragAnalysis) {
    return null;
  }

  const primaryStd = ragAnalysis.primary_standard || {};
  
  // Convert aligned standards
  const alignedStandards = (ragAnalysis.aligned_standards || []).map(std => ({
    code: std.standard_number || 'Unknown',
    title: 'Referenced Standard',
    relation: std.relationship || 'related',
    description: `Referenced as ${std.relationship || 'related'} standard`,
    source_url: 'https://www.bis.gov.in/'
  }));

  // Convert technical specifications
  const techSpecs = (ragAnalysis.technical_specifications || []).map(spec => ({
    parameter: spec.requirement || 'Technical requirement',
    value: 'As per standard'
  }));

  // Convert safety measures
  const safetyMeasures = (ragAnalysis.safety_measures || []).map(measure => 
    measure.requirement || 'Safety requirement'
  );

  // Convert implementation measures
  const implMeasures = (ragAnalysis.implementation_measures || []).map(measure => 
    measure.requirement || 'Implementation requirement'
  );

  // Convert certification requirements
  const certReqs = (ragAnalysis.certification_requirements || []).map(cert => ({
    name: cert.requirement || 'Certification requirement',
    mandatory: true,
    note: 'As per standard'
  }));

  return {
    query_summary: 'Procurement requirement analysis',
    primary_standard: {
      code: primaryStd.standard_number || 'No standard identified',
      title: primaryStd.title || 'No title available',
      status: ragAnalysis.applicability === 'Directly Applicable' ? 'latest' : 'unknown',
      last_amendment: 'Information not available'
    },
    confidence_score: ragAnalysis.match_confidence || 0,
    aligned_referenced_standards: alignedStandards,
    safety_measures: safetyMeasures,
    safety_prohibited_measures: [],
    implementation_measures: implMeasures,
    implementation_prohibited_measures: [],
    why_use_this: ragAnalysis.why_this_standard || 'No explanation available',
    technical_specifications: techSpecs,
    certification_requirements: certReqs
  };
};

// Relationship type tag styles
const RELATION_TAG_STYLES = {
  normative: {
    label: 'Normative reference',
    badge: 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
  },
  test_method: {
    label: 'Test method',
    badge: 'bg-emerald-50 text-emerald-700 border-l-2 border-emerald-600'
  },
  installation: {
    label: 'Installation standard',
    badge: 'bg-amber-50 text-amber-800 border-l-2 border-amber-600'
  },
  safety: {
    label: 'Safety standard',
    badge: 'bg-rose-50 text-rose-700 border-l-2 border-rose-600'
  },
  terminology: {
    label: 'Terminology',
    badge: 'bg-slate-100 text-slate-700 border-l-2 border-slate-400'
  },
  related_product: {
    label: 'Related product standard',
    badge: 'bg-purple-50 text-purple-700 border-l-2 border-purple-600'
  }
};

export function AnalysisOutputPage({ customData }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { user } = useAuth();

  const routeProcId = params.procurementId || location.state?.procurementId || '';
  const [procurement, setProcurement] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(routeProcId));
  const [permissionError, setPermissionError] = useState('');

  useEffect(() => {
    let isMounted = true;
    let unsubscribe = null;
    let ragTriggeredRef = { current: false };
    
    console.log('[DEBUG] AnalysisOutputPage mounted for procurement:', routeProcId);
    
    if (routeProcId && user?.uid) {
      setIsLoading(true);
      setPermissionError('');
      
      // Use real-time listener instead of one-time fetch
      const loadProcurement = async () => {
        try {
          const doc = await getProcurementById(routeProcId, user.uid);
          if (isMounted) {
            setProcurement(doc);
            setIsLoading(false);
            console.log('[DEBUG] Initial procurement data loaded:', {
              procurementId: routeProcId,
              standardsAnalysis: !!doc.standardsAnalysis,
              aiStatus: doc.aiStatus,
              currentStage: doc.currentStage
            });
            
            // Trigger RAG analysis if not already done
            const status = doc.aiStatus?.standards;
            const hasAnalysis = !!doc.standardsAnalysis;
            
            if (!ragTriggeredRef.current && status !== 'completed' && status !== 'failed' && !hasAnalysis) {
              console.log('[DEBUG] RAG analysis not completed, triggering it now...');
              ragTriggeredRef.current = true;
              triggerRAGAnalysis(doc);
            }
          }
        } catch (err) {
          console.error('Error loading procurement:', err);
          if (isMounted) {
            if (err.code === 'PERMISSION_DENIED') {
              setPermissionError('Access Denied: This procurement belongs to another officer.');
            } else {
              setPermissionError('Procurement record not found.');
            }
            setIsLoading(false);
          }
        }
      };
      
      const triggerRAGAnalysis = async (procDoc) => {
        try {
          const { aiService } = await import('../services/aiService');
          const { updateProcurementStage } = await import('../services/procurementService');
          
          console.log('[DEBUG] Current Firebase state before RAG from Output page:', {
            currentStatus: procDoc.aiStatus?.standards,
            existingAnalysis: !!procDoc.standardsAnalysis,
            procurementId: routeProcId
          });
          
          // Check if RAG analysis is already completed or in progress
          const currentStatus = procDoc.aiStatus?.standards;
          const existingAnalysis = procDoc.standardsAnalysis;
          
          if (currentStatus === 'completed' || existingAnalysis) {
            console.log('[DEBUG] RAG analysis already completed, skipping duplicate request from Output page');
            return;
          }
          
          if (currentStatus === 'processing') {
            console.log('[DEBUG] RAG analysis already in progress, skipping duplicate request from Output page');
            return;
          }
          
          const confirmedUnderstanding = procDoc.understanding || procDoc.inputData || {};
          
          // Build requirement object for RAG
          const requirement = {
            title: confirmedUnderstanding.product || procDoc.title || '',
            description: procDoc.description || '',
            category: confirmedUnderstanding.category || procDoc.category || '',
            quantity: confirmedUnderstanding.quantity || '',
            budget: confirmedUnderstanding.budget || '',
            department: confirmedUnderstanding.department || '',
            deadline: confirmedUnderstanding.deadline || '',
            intended_purpose: confirmedUnderstanding.intended_purpose || '',
            application_environment: confirmedUnderstanding.application_environment || '',
            technical_requirements: confirmedUnderstanding.technical_requirements || []
          };
          
          console.log('[DEBUG] Triggering RAG analysis from Output page:', requirement);
          
          // Set status to processing to prevent duplicate calls
          await updateProcurementStage(routeProcId, {
            stageUpdates: {
              'aiStatus.standards': 'processing'
            }
          }, user.uid);
          
          // Call RAG API
          const analysis = await aiService.analyzeStandards(requirement);
          console.log('[DEBUG] RAG analysis completed from Output page:', analysis);
          
          // Store analysis in Firebase
          await updateProcurementStage(routeProcId, {
            stageUpdates: {
              'standardsAnalysis': analysis,
              'aiStatus.standards': 'completed'
            }
          }, user.uid);
          
          console.log('[DEBUG] RAG analysis stored in Firebase from Output page');
          
          // Verify the write
          const verifyDoc = await getProcurementById(routeProcId, user.uid);
          console.log('[DEBUG] FIREBASE AFTER RAG WRITE from Output page:', {
            standardsAnalysis: !!verifyDoc.standardsAnalysis,
            aiStatus: verifyDoc.aiStatus
          });
          
        } catch (error) {
          console.error('[DEBUG] RAG analysis failed from Output page:', error);
          await updateProcurementStage(routeProcId, {
            stageUpdates: {
              'aiStatus.standards': 'failed',
              'aiErrors': {
                stage: 'standards',
                message: error.message,
                timestamp: new Date().toISOString()
              }
            }
          }, user.uid);
        }
      };
      
      loadProcurement();
      
      // Poll for updates every 2 seconds to catch RAG completion
      const pollInterval = setInterval(async () => {
        if (isMounted && routeProcId && user?.uid) {
          try {
            const doc = await getProcurementById(routeProcId, user.uid);
            if (isMounted) {
              setProcurement(doc);
              console.log('[DEBUG] Polled procurement data:', {
                procurementId: routeProcId,
                standardsAnalysis: !!doc.standardsAnalysis,
                aiStatus: doc.aiStatus
              });
              
              // Stop polling if analysis is completed or failed
              const status = doc.aiStatus?.standards;
              if (status === 'completed' || status === 'failed' || doc.standardsAnalysis) {
                clearInterval(pollInterval);
                console.log('[DEBUG] Stopping poll, analysis status:', status);
              }
            }
          } catch (err) {
            console.error('Error polling procurement:', err);
          }
        }
      }, 2000);
      
      unsubscribe = () => clearInterval(pollInterval);
    } else {
      setIsLoading(false);
    }
    
    return () => { 
      isMounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, [routeProcId, user?.uid]);

  // Use real RAG data from Firebase only - no fallback to mock data
  const ragAnalysis = procurement?.standardsAnalysis;
  const realData = ragAnalysis ? convertRAGToUIData(ragAnalysis) : null;
  const data = customData || realData;

  // DEBUG LOGS
  console.log('[DEBUG] AnalysisOutputPage procurement:', procurement);
  console.log('[DEBUG] standardsAnalysis:', ragAnalysis);
  console.log('[DEBUG] aiStatus:', procurement?.aiStatus);
  console.log('[DEBUG] realData:', realData);
  console.log('[DEBUG] data:', data);
  console.log('[DEBUG] routeProcId:', routeProcId);

  // Correct state classification based on API response
  const hasValidAnalysis = ragAnalysis && typeof ragAnalysis === 'object';
  
  const ragFailed = 
    procurement?.aiStatus?.standards === 'failed' ||
    procurement?.aiErrors?.stage === 'standards';
  
  const ragError = procurement?.aiErrors?.stage === 'standards' 
    ? procurement.aiErrors.message 
    : null;
  
  const ragPending = 
    procurement?.aiStatus?.standards === 'pending' ||
    procurement?.aiStatus?.standards === 'processing';
  
  const noData = !ragPending && !ragFailed && !hasValidAnalysis;

  console.log('[DEBUG] hasValidAnalysis:', hasValidAnalysis);
  console.log('[DEBUG] ragFailed:', ragFailed);
  console.log('[DEBUG] ragError:', ragError);
  console.log('[DEBUG] ragPending:', ragPending);
  console.log('[DEBUG] noData:', noData);

  // Determine original input mode
  const inputType = procurement?.inputMode || location.state?.inputType || 'text';
  const inputModeRoute = inputType === 'document' 
    ? '/procurement/document' 
    : inputType === 'quotation' 
    ? '/procurement/quotation' 
    : '/procurement/text';

  const inputModeLabel = inputType === 'document'
    ? 'Modify Uploaded Document'
    : inputType === 'quotation'
    ? 'Modify Quotation Details'
    : 'Edit Input Specifications';

  // State for expanded aligned standard rows
  const [expandedRows, setExpandedRows] = useState({});
  const [toastMessage, setToastMessage] = useState('');

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Download simulation
  const handleDownload = () => {
    const reportContent = `STANDARD RECOMMENDATION REPORT
==================================================
Primary Standard: ${primaryStandard.code || 'N/A'}
Title: ${primaryStandard.title || 'N/A'}
Match Confidence: ${confidenceScore}%
Query Analysed: "${data?.query_summary || 'N/A'}"
Last Amendment: ${primaryStandard.last_amendment || 'N/A'}

Why This Standard:
${whyUseThis}

Safety Measures:
${safetyMeasures.map(m => `• ${m}`).join('\n')}

Implementation Measures:
${implementationMeasures.map(m => `• ${m}`).join('\n')}

Technical Specifications:
${technicalSpecs.map(s => `${s.parameter}: ${s.value}`).join('\n')}
==================================================`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Standard_Recommendation_${(primaryStandard.code || 'standard').replace(/[: ]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Report downloaded successfully');
  };

  const handleAddToTender = () => {
    showToast('Standard added to tender draft');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard');
    } else {
      showToast('Sharing ready');
    }
  };

  // Calculate circular gauge offset (circumference = 2 * PI * 32 ≈ 201)
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const confidenceScore = data?.confidence_score || 0;
  const strokeDashoffset = circumference - (confidenceScore / 100) * circumference;

  // Safely access nested properties - use ragAnalysis directly for raw data
  const primaryStandard = data?.primary_standard || {};
  const alignedStandards = data?.aligned_referenced_standards || [];
  const technicalSpecs = data?.technical_specifications || [];
  const safetyMeasures = data?.safety_measures || [];
  const implementationMeasures = data?.implementation_measures || [];
  const whyUseThis = data?.why_use_this || ragAnalysis?.why_this_standard || '';
  const certificationReqs = data?.certification_requirements || [];
  
  // Check if this is a "Not Established" result
  const isNotEstablished = ragAnalysis?.applicability === 'Not Established';

  const handleNextStage = async () => {
    if (routeProcId && user?.uid) {
      try {
        await updateProcurementStage(routeProcId, {
          currentStage: 'specification',
          status: 'in_progress',
          stageUpdates: {
            'technicalSpecification.status': 'pending',
          }
        }, user.uid);
      } catch (err) {
        console.warn('Could not update stage in Firestore:', err);
      }
    }

    const nextTarget = routeProcId ? `/procurement/generate-spec/${routeProcId}` : '/procurement/generate-spec';
    navigate(nextTarget, { state: { ...location.state, procurementId: routeProcId, inputType } });
  };

  if (isLoading) {
    return (
      <WorkflowShell maxWidth="max-w-6xl">
        <ProcurementWorkflowBar currentStage={5} />
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center my-6">
          <div className="w-8 h-8 border-3 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-600">Loading analysis overview from Firestore...</p>
        </div>
      </WorkflowShell>
    );
  }

  if (permissionError) {
    return (
      <WorkflowShell maxWidth="max-w-6xl">
        <ProcurementWorkflowBar currentStage={5} />
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

  if (noData) {
    return (
      <WorkflowShell maxWidth="max-w-6xl">
        <ProcurementWorkflowBar currentStage={5} />
        <div className="bg-white border border-amber-200 rounded-2xl p-8 text-center my-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            {ragFailed ? 'AI Analysis Failed' : 'No Analysis Available'}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {ragError || 'The standards analysis is not available. Please try again or contact support.'}
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

  if (ragFailed) {
    return (
      <WorkflowShell maxWidth="max-w-6xl">
        <ProcurementWorkflowBar currentStage={5} />
        <div className="bg-white border border-amber-200 rounded-2xl p-8 text-center my-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-base font-bold text-slate-900">Standards Analysis Failed</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {ragError || 'Unable to analyze standards at this time. Please try again.'}
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate(`/procurement/processing/${routeProcId}`, { state: { ...location.state, procurementId: routeProcId } })}
              className="px-5 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700 transition-colors cursor-pointer"
            >
              Retry Analysis
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-300 transition-colors cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </WorkflowShell>
    );
  }

  if (ragPending) {
    return (
      <WorkflowShell maxWidth="max-w-6xl">
        <ProcurementWorkflowBar currentStage={5} />
        <div className="bg-white border border-blue-200 rounded-2xl p-8 text-center my-6 space-y-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-900">Standards Analysis in Progress</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Please wait while we analyze applicable Indian Standards...
          </p>
          <button
            type="button"
            onClick={() => navigate(`/procurement/processing/${routeProcId}`, { state: { ...location.state, procurementId: routeProcId } })}
            className="px-5 py-2.5 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-300 transition-colors cursor-pointer mt-4"
          >
            Back to Processing
          </button>
        </div>
      </WorkflowShell>
    );
  }

  return (
    <WorkflowShell maxWidth="max-w-6xl">
      
      {/* ── 7-Stage Workflow Progress Bar (Stage 5: Output Active) ── */}
      <ProcurementWorkflowBar currentStage={5} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* ── Main Container (White Paper Card with Subtly Structured Borders) ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs p-6 sm:p-10 text-left">
        
        {/* ── Two-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_1fr] gap-x-12 lg:gap-x-14 items-start">
          
          {/* ════════════════════ LEFT COLUMN ════════════════════ */}
          <div className="lg:border-r lg:border-slate-200 lg:pr-12 pb-8 lg:pb-0">
            
            {/* 1. HERO BLOCK */}
            <div className="pb-6 border-b border-slate-200">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 min-w-0">
                  {isNotEstablished ? (
                    <>
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                        Standard Not Established
                      </h1>
                      <p className="text-sm sm:text-base text-slate-700 font-medium mt-1 mb-3.5 leading-snug max-w-lg">
                        No specific Indian Standard could be reliably identified for this requirement based on the available evidence.
                      </p>
                      <div className="flex flex-wrap items-center gap-2.5 text-xs">
                        <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 font-bold px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          Analysis Complete
                        </span>
                        <span className="text-slate-500 font-medium">
                          Confidence: {confidenceScore}%
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                        {primaryStandard.code || 'N/A'}
                      </h1>
                      <p className="text-sm sm:text-base text-slate-700 font-medium mt-1 mb-3.5 leading-snug max-w-lg">
                        {primaryStandard.title || 'N/A'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2.5 text-xs">
                        {primaryStandard.status === 'latest' ? (
                          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-bold px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            Latest edition
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 font-bold px-2.5 py-1 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                            Superseded — newer version available
                          </span>
                        )}
                        <span className="text-slate-500 font-medium">
                          {primaryStandard.last_amendment || 'N/A'}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Match Confidence Circular Gauge */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <svg width="76" height="76" viewBox="0 0 76 76" className="transform -rotate-90">
                    <circle
                      cx="38"
                      cy="38"
                      r={radius}
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="7"
                    />
                    <circle
                      cx="38"
                      cy="38"
                      r={radius}
                      fill="none"
                      stroke="#059669"
                      strokeWidth="7"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                    <text
                      x="38"
                      y="43"
                      textAnchor="middle"
                      className="transform rotate-90 origin-center text-sm font-black fill-slate-900"
                    >
                      {confidenceScore}%
                    </text>
                  </svg>
                  <span className="text-[11px] font-semibold text-slate-500 text-center">
                    Match confidence
                  </span>
                </div>
              </div>
            </div>

            {/* 2. ACTION BAR */}
            <div className="flex flex-wrap items-center gap-2.5 py-5 border-b border-slate-200">
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <Download size={15} />
                <span>Download report</span>
              </button>

              <button
                type="button"
                onClick={handleAddToTender}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <Plus size={15} />
                <span>Add to tender draft</span>
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
              >
                <Share2 size={15} />
                <span>Share with team</span>
              </button>
            </div>

            {/* 3. ALIGNED & REFERENCED STANDARDS */}
            <section className="pt-6">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-4">
                Aligned &amp; referenced standards
              </h2>

              <div className="divide-y divide-slate-200/80 border-y border-slate-200/80">
                {alignedStandards.map((std, idx) => {
                  const tagConfig = RELATION_TAG_STYLES[std.relation] || RELATION_TAG_STYLES.normative;
                  const isExpanded = !!expandedRows[idx];

                  return (
                    <div
                      key={std.code}
                      onClick={() => toggleRow(idx)}
                      className="py-3.5 hover:bg-slate-50/70 transition-colors cursor-pointer group rounded-lg px-1.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                            {std.code}
                          </div>
                          <div className="text-xs sm:text-sm text-slate-600 mt-0.5 font-medium leading-snug">
                            {std.title}
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0 mt-0.5">
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-sm ${tagConfig.badge}`}>
                            {tagConfig.label}
                          </span>
                          <ChevronRight
                            size={16}
                            className={`text-slate-400 transition-transform duration-200 ${
                              isExpanded ? 'rotate-90 text-slate-700' : ''
                            }`}
                          />
                        </div>
                      </div>

                      {/* Expandable row content */}
                      {isExpanded && (
                        <div className="pt-2.5 pb-1 text-xs sm:text-sm text-slate-600 pl-1 border-l-2 border-blue-400 mt-2 ml-1 animate-in fade-in duration-200">
                          <p className="leading-relaxed font-normal">
                            {std.description}
                          </p>
                          <a
                            href={std.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-bold text-xs mt-2 hover:underline"
                          >
                            <span>View standard</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4. TECHNICAL SPECIFICATIONS (Shifted to Left Column below Aligned Standards) */}
            <section className="pt-6 mt-6 border-t border-slate-200/80">
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-2.5">
                Technical specifications
              </h2>
              <div className="divide-y divide-slate-200/80 border-y border-slate-200/80">
                {technicalSpecs.map((spec, idx) => (
                  <div key={idx} className="py-2.5 flex items-start gap-4 text-xs sm:text-sm">
                    <span className="text-slate-500 font-medium w-[44%] shrink-0">
                      {spec.parameter}
                    </span>
                    <span className="text-slate-900 font-semibold flex-1">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* ════════════════════ RIGHT COLUMN ════════════════════ */}
          <div className="space-y-8 pt-6 lg:pt-0">
            
            {/* 5. SAFETY & IMPLEMENTATION MEASURES */}
            <section className="space-y-4">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Safety &amp; implementation measures
                </h2>
              </div>

              {/* Stacked Vertically */}
              <div className="space-y-5">
                {/* Safety Measures */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 sm:p-5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <ShieldCheck size={17} className="text-emerald-600 stroke-[2.2]" />
                    <span>Safety measures</span>
                  </h3>
                  <ul className="space-y-2">
                    {/* Positive Safety Measures (Green Check) */}
                    {safetyMeasures.map((item, idx) => (
                      <li key={`safety-pos-${idx}`} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <Check size={14} className="text-emerald-600 stroke-[3] shrink-0 mt-0.5" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                    {/* Prohibited Safety Measures (Red Cross) */}
                    {(data?.safety_prohibited_measures || [
                      'Do not approve mounting frames without verified earthing continuity.',
                      'Do not accept installations above 12 m without a valid wind-uplift certificate.',
                      'Do not allow standard or non-fire-retardant cables near rooftop plant rooms.'
                    ]).map((item, idx) => (
                      <li key={`safety-neg-${idx}`} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <X size={14} className="text-rose-600 stroke-[3] shrink-0 mt-0.5" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Implementation Measures */}
                <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-4 sm:p-5">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <ClipboardCheck size={17} className="text-emerald-600 stroke-[2.2]" />
                    <span>Implementation measures</span>
                  </h3>
                  <ul className="space-y-2">
                    {/* Positive Implementation Measures (Green Check) */}
                    {implementationMeasures.map((item, idx) => (
                      <li key={`impl-pos-${idx}`} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <Check size={14} className="text-emerald-600 stroke-[3] shrink-0 mt-0.5" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                    {/* Prohibited Implementation Measures (Red Cross) */}
                    {(data?.implementation_prohibited_measures || [
                      'Do not proceed beyond foundation or frame erection without the required third-party inspection.',
                      'Do not accept galvanised components without batch-wise coating thickness test certificates.',
                      'Do not release final payment without approved as-built drawings.'
                    ]).map((item, idx) => (
                      <li key={`impl-neg-${idx}`} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 leading-snug">
                        <X size={14} className="text-rose-600 stroke-[3] shrink-0 mt-0.5" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* 6. WHY THIS STANDARD */}
            <section>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-2.5">
                {isNotEstablished ? 'Why standard not established' : 'Why this standard'}
              </h2>
              <div className="bg-blue-50/70 border-l-3 border-blue-600 p-4 sm:p-5 rounded-r-xl text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                {whyUseThis || 'No explanation provided.'}
              </div>
            </section>

          </div>

        </div>

        {/* ════════════════════ FULL WIDTH (BELOW BOTH COLUMNS) ════════════════════ */}
        {/* 7. CERTIFICATION REQUIREMENTS */}
        <section className="pt-8 mt-8 border-t border-slate-200">
          <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mb-3">
            Certification requirements
          </h2>
          <div className="flex flex-wrap gap-2.5">
            {certificationReqs.map((cert, idx) => (
              <div
                key={idx}
                title={cert.mandatory ? 'Mandatory under BIS Compulsory Registration Scheme' : 'Applicable to specified components only'}
                className={`bg-white border rounded-xl px-3.5 py-2 text-xs sm:text-sm flex items-center gap-2 shadow-2xs ${
                  cert.mandatory ? 'border-rose-300 bg-rose-50/30' : 'border-slate-200'
                }`}
              >
                {cert.mandatory && (
                  <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                )}
                <span className="font-bold text-slate-900">{cert.name}</span>
                {cert.note && (
                  <span className="text-slate-500 font-medium text-xs">
                    {cert.note}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ── Bottom Action Navigation ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
        <button
          type="button"
          onClick={() => {
            const backRoute = routeProcId ? `/procurement/understand/${routeProcId}` : '/procurement/understand';
            navigate(backRoute, { state: { ...location.state, procurementId: routeProcId } });
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Understand</span>
        </button>

        <button
          type="button"
          onClick={handleNextStage}
          className="w-full sm:w-auto px-8 py-3 bg-orange-600 hover:bg-orange-700 active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition-all cursor-pointer group"
        >
          <span>Generate Technical Specification</span>
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </WorkflowShell>
  );
}
