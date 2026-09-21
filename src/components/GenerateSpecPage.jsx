import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  FileText, 
  Edit3, 
  Check, 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  ShieldCheck, 
  ShieldAlert,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { WorkflowShell } from './WorkflowLayout';
import { ProcurementWorkflowBar } from './ProcurementWorkflowBar';
import { useAuth } from '../context/AuthContext';
import { getProcurementById, updateProcurementStage } from '../services/procurementService';
import { aiService } from '../services/aiService';

export function GenerateSpecPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { user } = useAuth();

  const routeProcId = params.procurementId || location.state?.procurementId || '';
  const [procurement, setProcurement] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(routeProcId));
  const [permissionError, setPermissionError] = useState('');
  const [isGeneratingTender, setIsGeneratingTender] = useState(false);
  const [generationError, setGenerationError] = useState('');

  const [sections, setSections] = useState([]);
  const [editingSectionNumber, setEditingSectionNumber] = useState(null);
  const [editingClauses, setEditingClauses] = useState([]);
  const [toast, setToast] = useState('');
  
  const tenderGeneratedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    if (routeProcId && user?.uid) {
      setIsLoading(true);
      setPermissionError('');
      getProcurementById(routeProcId, user.uid)
        .then((doc) => {
          if (isMounted) {
            setProcurement(doc);
            
            // Check if tender specification already exists
            if (doc.tenderSpecification && doc.tenderSpecification.sections && doc.tenderSpecification.sections.length > 0 && !tenderGeneratedRef.current) {
              console.log('[DEBUG] Using existing tender specification from Firebase');
              setSections(doc.tenderSpecification.sections);
              tenderGeneratedRef.current = true;
            } else if (!tenderGeneratedRef.current && doc.standardsAnalysis) {
              // Generate tender specification if RAG analysis is complete
              console.log('[DEBUG] RAG analysis complete, generating tender specification');
              generateTenderSpecification(doc);
            }
            
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

  const generateTenderSpecification = async (procDoc) => {
    if (tenderGeneratedRef.current || isGeneratingTender) {
      console.log('[DEBUG] Tender generation already in progress or completed');
      return;
    }

    tenderGeneratedRef.current = true;
    setIsGeneratingTender(true);
    setGenerationError('');

    try {
      console.log('[DEBUG] Starting tender generation for procurement:', routeProcId);
      const requirement = procDoc.understanding || procDoc;
      const standardAnalysis = procDoc.standardsAnalysis;

      if (!standardAnalysis) {
        console.log('[DEBUG] No standards analysis available, skipping tender generation');
        setIsGeneratingTender(false);
        tenderGeneratedRef.current = false;
        return;
      }

      const tenderSpec = await aiService.generateTender(requirement, standardAnalysis);
      console.log('[DEBUG] Tender specification generated:', tenderSpec);

      if (tenderSpec && Array.isArray(tenderSpec.sections) && tenderSpec.sections.length > 0) {
        setSections(tenderSpec.sections);

        // Save to Firebase
        if (routeProcId && user?.uid) {
          await updateProcurementStage(routeProcId, {
            stageUpdates: {
              tenderSpecification: tenderSpec,
              'aiStatus.specification': 'completed'
            }
          }, user.uid);
        }

        // Update local procurement state
        setProcurement(prev => ({
          ...prev,
          tenderSpecification: tenderSpec,
          aiStatus: {
            ...prev?.aiStatus,
            specification: 'completed'
          }
        }));
      } else {
        throw new Error('Received invalid or empty tender specification structure');
      }

    } catch (error) {
      console.error('[DEBUG] Tender generation failed:', error);
      tenderGeneratedRef.current = false; // Allow retry on error
      setGenerationError(error.message || 'Failed to generate tender specifications. Please try again.');
      
      // Update Firebase with error
      if (routeProcId && user?.uid) {
        await updateProcurementStage(routeProcId, {
          stageUpdates: {
            'aiStatus.specification': 'failed',
            'aiErrors': {
              stage: 'specification',
              message: error.message,
              timestamp: new Date().toISOString()
            }
          }
        }, user.uid);
      }
    } finally {
      setIsGeneratingTender(false);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleStartEdit = (section) => {
    setEditingSectionNumber(section.number);
    const existingTexts = (section.clauses || []).map(c => typeof c === 'string' ? c : (c.text || ''));
    setEditingClauses(existingTexts.length > 0 ? existingTexts : ['']);
  };

  const handleSaveSection = async (sectionNumber) => {
    const cleanedClauses = editingClauses
      .map(t => t.trim())
      .filter(t => t.length > 0)
      .map(t => ({
        text: t,
        source_type: 'officer_edited',
        evidence_ids: []
      }));

    const updatedSections = sections.map(s => {
      if (s.number === sectionNumber) {
        return { ...s, clauses: cleanedClauses };
      }
      return s;
    });

    setSections(updatedSections);
    setEditingSectionNumber(null);

    if (routeProcId && user?.uid) {
      try {
        await updateProcurementStage(routeProcId, {
          stageUpdates: {
            'tenderSpecification.sections': updatedSections
          }
        }, user.uid);
      } catch (err) {
        console.warn('Could not update edited section in Firestore:', err);
      }
    }

    showToast(`Section ${sectionNumber} saved successfully`);
  };

  const handleProceed = async () => {
    if (routeProcId && user?.uid) {
      try {
        await updateProcurementStage(routeProcId, {
          currentStage: 'publishing',
          status: 'in_progress',
        }, user.uid);
      } catch (err) {
        console.warn('Could not update stage in Firestore:', err);
      }
    }

    const nextTarget = routeProcId ? `/procurement/publish-tender/${routeProcId}` : '/procurement/publish-tender';
    navigate(nextTarget, { state: { ...location.state, procurementId: routeProcId } });
  };

  const isQuotationMode = location.state?.inputType === 'quotation' || location.state?.workflowMode === 'quotation';

  if (isLoading) {
    return (
      <WorkflowShell maxWidth="max-w-5xl">
        <ProcurementWorkflowBar currentStage={isQuotationMode ? 4 : 6} mode={isQuotationMode ? 'quotation' : 'standard'} />
        <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center my-6">
          <div className="w-8 h-8 border-3 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-600">Loading specification clauses from Firestore...</p>
        </div>
      </WorkflowShell>
    );
  }

  if (permissionError) {
    return (
      <WorkflowShell maxWidth="max-w-5xl">
        <ProcurementWorkflowBar currentStage={isQuotationMode ? 4 : 6} mode={isQuotationMode ? 'quotation' : 'standard'} />
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
      
      {/* ── Workflow Bar (Quotation: Stage 4, Standard: Stage 6) ── */}
      <ProcurementWorkflowBar 
        currentStage={isQuotationMode ? 4 : 6} 
        mode={isQuotationMode ? 'quotation' : 'standard'} 
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg animate-in fade-in">
          {toast}
        </div>
      )}

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 text-left">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tender Specification Review
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            AI-generated procurement specification structured across 7 mandatory tender sections.
          </p>
        </div>

        <button
          type="button"
          onClick={handleProceed}
          disabled={isGeneratingTender || sections.length === 0}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-md shadow-orange-600/20 transition-all cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <span>Proceed to Document Creation</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* ── Generating State ── */}
      {isGeneratingTender && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center my-6 space-y-3 shadow-xs">
          <div className="w-9 h-9 border-3 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <h3 className="text-base font-bold text-slate-900">Generating Formal Tender Specification...</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Structuring Indian Standards compliance clauses, QA criteria, and statutory markings across all 7 mandatory sections.
          </p>
        </div>
      )}

      {/* ── Error State ── */}
      {!isGeneratingTender && generationError && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center my-6 space-y-3">
          <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle size={20} />
          </div>
          <h2 className="text-base font-bold text-slate-900">Tender Specification Generation Failed</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">{generationError}</p>
          <button
            type="button"
            onClick={() => {
              tenderGeneratedRef.current = false;
              if (procurement) {
                generateTenderSpecification(procurement);
              }
            }}
            className="px-5 py-2.5 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700 transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <RefreshCw size={14} />
            <span>Retry Tender Generation</span>
          </button>
        </div>
      )}

      {/* ── Exactly 7 Sections List ── */}
      {!isGeneratingTender && !generationError && sections.length > 0 && (
        <div className="space-y-4 text-left mb-8">
          {sections.map((section) => {
            const isEditing = editingSectionNumber === section.number;

            return (
              <div
                key={section.number}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-slate-300 transition-all"
              >
                {/* Section Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-md border bg-emerald-50 text-emerald-800 border-emerald-200">
                      SECTION {section.number}
                    </span>

                    <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                      {section.number}. {section.title}
                    </h3>

                    {section.reference && (
                      <span className="text-[11px] font-bold text-slate-400">
                        Ref: {section.reference}
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingSectionNumber(null)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveSection(section.number)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        <Check size={13} />
                        <span>Save Section</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(section)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {/* Section Clauses Body (Contained inside its own distinct inner box with #CFECF3 tint) */}
                {isEditing ? (
                  <div className="rounded-xl border border-blue-400 bg-[#CFECF3]/20 p-4 shadow-xs ring-2 ring-blue-500/10 space-y-3">
                    {editingClauses.map((clauseText, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span className="text-xs font-bold text-slate-400 mt-2.5 select-none">•</span>
                        <textarea
                          rows={3}
                          value={clauseText}
                          onChange={(e) => {
                            const updated = [...editingClauses];
                            updated[idx] = e.target.value;
                            setEditingClauses(updated);
                          }}
                          className="flex-1 p-3 rounded-lg bg-white border border-slate-200 text-xs sm:text-sm text-slate-900 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed resize-y"
                        />
                        {editingClauses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setEditingClauses(editingClauses.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-red-500 p-1.5 mt-1 text-sm font-bold cursor-pointer"
                            title="Remove clause"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setEditingClauses([...editingClauses, ''])}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer pt-1"
                    >
                      <Plus size={13} />
                      <span>Add Clause</span>
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#CFECF3] bg-[#CFECF3]/30 p-4 space-y-3">
                    {section.clauses && section.clauses.length > 0 ? (
                      section.clauses.map((clause, cIdx) => (
                        <div key={cIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                          <span className="text-slate-400 font-bold select-none">•</span>
                          <p className="flex-1 text-slate-800">
                            {typeof clause === 'string' ? clause : (clause.text || '')}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-500 italic">No clauses specified for this section.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Empty State ── */}
      {!isGeneratingTender && !generationError && sections.length === 0 && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-10 text-center my-6 space-y-3">
          <FileText size={32} className="text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No Tender Specification Available</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please run standards analysis first to generate standard-aligned tender specifications.
          </p>
          <button
            type="button"
            onClick={() => {
              if (procurement) {
                generateTenderSpecification(procurement);
              }
            }}
            className="px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700 transition-colors cursor-pointer"
          >
            Generate Specification
          </button>
        </div>
      )}

      {/* ── Bottom Action Navigation ── */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => {
            const backTarget = isQuotationMode 
              ? (routeProcId ? `/procurement/processing/${routeProcId}` : '/procurement/processing')
              : (routeProcId ? `/procurement/output/${routeProcId}` : '/procurement/output');
            navigate(backTarget, { state: { ...location.state, procurementId: routeProcId } });
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>{isQuotationMode ? 'Back to Processing' : 'Back to Output'}</span>
        </button>

        <button
          type="button"
          onClick={handleProceed}
          disabled={isGeneratingTender || sections.length === 0}
          className="w-full sm:w-auto px-8 py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition-all cursor-pointer group"
        >
          <span>Preview &amp; Publish</span>
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </WorkflowShell>
  );
}

