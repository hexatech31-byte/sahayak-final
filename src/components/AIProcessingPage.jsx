import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Check, ArrowRight, ShieldAlert } from 'lucide-react';
import { WorkflowShell } from './WorkflowLayout';
import { ProcurementWorkflowBar } from './ProcurementWorkflowBar';
import { useAuth } from '../context/AuthContext';
import { getProcurementById, updateProcurementStage } from '../services/procurementService';
import { aiService } from '../services/aiService';

// ─── Stage configuration ──────────────────────────────────────────────────────
// Fast & responsive durations (~7.5s total) with subtle variance
const STAGE_CONFIG = [
  {
    label: 'Processing input document',
    durationMs: 1200,
    progressStart: 0,
    progressEnd: 20,
    subtitleDefault: 'Reading your submitted input...',
    subtitleText: 'Reading your requirement details...',
    subtitleDocument: 'Reading your uploaded tender document...',
    subtitleQuotation: 'Reading your uploaded vendor quotation...',
    message: 'Reading the submitted procurement input...',
  },
  {
    label: 'Extracting key requirements',
    durationMs: 1600,
    progressStart: 20,
    progressEnd: 40,
    subtitleDefault: 'Extracting key requirements...',
    subtitleText: 'Extracting key requirements...',
    subtitleDocument: 'Extracting key requirements...',
    subtitleQuotation: 'Extracting key requirements...',
    message: 'Extracting product, quantity and specification details...',
  },
  {
    label: 'Identifying applicable BIS / Indian Standards',
    durationMs: 2000,
    progressStart: 40,
    progressEnd: 65,
    subtitleDefault: 'Matching applicable standards...',
    subtitleText: 'Matching applicable standards...',
    subtitleDocument: 'Matching applicable standards...',
    subtitleQuotation: 'Matching applicable standards...',
    message: 'Checking requirements against applicable BIS standards...',
  },
  {
    label: 'Generating tender draft',
    durationMs: 1600,
    progressStart: 65,
    progressEnd: 85,
    subtitleDefault: 'Preparing your tender draft...',
    subtitleText: 'Preparing your tender draft...',
    subtitleDocument: 'Preparing your tender draft...',
    subtitleQuotation: 'Preparing your tender draft...',
    message: 'Preparing structured tender clauses...',
  },
  {
    label: 'Finalizing results',
    durationMs: 1100,
    progressStart: 85,
    progressEnd: 100,
    subtitleDefault: 'Finalizing results...',
    subtitleText: 'Finalizing results...',
    subtitleDocument: 'Finalizing results...',
    subtitleQuotation: 'Finalizing results...',
    message: 'Finalizing the procurement-ready result...',
  },
];

// Randomise stage duration ± 15% so it feels natural
function randomisedDuration(base) {
  const factor = 0.85 + Math.random() * 0.3; // 0.85 – 1.15
  return Math.round(base * factor);
}

// Detect input type from previous route stored in sessionStorage (or location.state)
function detectInputType(locationState) {
  const prev = locationState?.from || sessionStorage.getItem('procInputType') || 'text';
  if (prev.includes('document')) return 'document';
  if (prev.includes('quotation')) return 'quotation';
  return 'text';
}

// ─── Three-dot animated indicator ─────────────────────────────────────────────
function DotIndicator() {
  return (
    <span className="inline-flex items-center gap-[3px] ml-1">
      <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce [animation-delay:0ms]" />
      <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce [animation-delay:150ms]" />
      <span className="w-1 h-1 rounded-full bg-blue-500 animate-bounce [animation-delay:300ms]" />
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AIProcessingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { user } = useAuth();

  const routeProcId = params.procurementId || location.state?.procurementId || '';
  const [procurement, setProcurement] = useState(null);
  const [permissionError, setPermissionError] = useState('');
  const ragCalledRef = useRef(false);

  const inputType = procurement?.inputMode || detectInputType(location.state);

  useEffect(() => {
    let isMounted = true;
    if (routeProcId && user?.uid) {
      getProcurementById(routeProcId, user.uid)
        .then((doc) => {
          if (isMounted) {
            setProcurement(doc);
            // Update stage to processing in progress
            updateProcurementStage(routeProcId, {
              currentStage: 'processing',
              status: 'in_progress',
              stageUpdates: {
                'processing.status': 'pending',
              }
            }, user.uid).catch(err => console.warn('Could not update stage:', err));
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
          }
        });
    }
    return () => { isMounted = false; };
  }, [routeProcId, user?.uid]);

  // Build a randomised duration list once on mount
  const durations = useRef(STAGE_CONFIG.map((s) => randomisedDuration(s.durationMs)));

  // State
  const [activeStage, setActiveStage] = useState(0);          // 0–4, or 5 = done
  const [progress, setProgress] = useState(0);                 // 0–100 float
  const [stageElapsed, setStageElapsed] = useState('0.0');     // seconds string for active stage
  const [completedTimes, setCompletedTimes] = useState([]);   // elapsed seconds when each stage completed
  const [isDone, setIsDone] = useState(false);

  // Progress interpolation tick (runs every 40 ms while processing for 60fps smoothness)
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const runStage = useCallback(
    (stageIndex) => {
      const cfg = STAGE_CONFIG[stageIndex];
      const dur = durations.current[stageIndex];
      const startProgress = cfg.progressStart;
      const endProgress = cfg.progressEnd;
      const tickMs = 40;
      let elapsed = 0;

      // Reset stage elapsed timer
      setStageElapsed('0.0');

      const interval = setInterval(() => {
        elapsed += tickMs;

        // Smooth progress interpolation
        const fraction = Math.min(elapsed / dur, 1);
        const eased = fraction < 0.5
          ? 2 * fraction * fraction
          : 1 - Math.pow(-2 * fraction + 2, 2) / 2; // ease-in-out quad
        const newProgress = startProgress + (endProgress - startProgress) * eased;
        setProgress(newProgress);

        // Live elapsed seconds (e.g. "1.2")
        setStageElapsed((elapsed / 1000).toFixed(1));

        if (elapsed >= dur) {
          clearInterval(interval);
          const elapsedSec = (dur / 1000).toFixed(1);

          setCompletedTimes((prev) => {
            const next = [...prev];
            next[stageIndex] = elapsedSec;
            return next;
          });
          setProgress(endProgress);

          const nextStage = stageIndex + 1;
          if (nextStage < STAGE_CONFIG.length) {
            setActiveStage(nextStage);
            runStage(nextStage);
          } else {
            setActiveStage(5); // All done
            setIsDone(true);
          }
        }
      }, tickMs);

      return () => clearInterval(interval);
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Real RAG API call
  const callRagAPI = useCallback(async () => {
    if (!routeProcId || !user?.uid) return;

    // Prevent duplicate calls with ref
    if (ragCalledRef.current) {
      console.log('[AI] RAG already called in this session, skipping duplicate');
      return;
    }
    ragCalledRef.current = true;

    try {
      console.log('[AI] Starting RAG analysis for procurement:', routeProcId);
      
      // Get the confirmed understanding from procurement
      const procDoc = await getProcurementById(routeProcId, user.uid);
      const confirmedUnderstanding = procDoc.understanding || procDoc.inputData || {};
      
      console.log('[DEBUG] Current Firebase state before RAG:', {
        currentStatus: procDoc.aiStatus?.standards,
        existingAnalysis: !!procDoc.standardsAnalysis,
        procurementId: routeProcId
      });
      
      // Check if RAG analysis is already completed or in progress
      const currentStatus = procDoc.aiStatus?.standards;
      const existingAnalysis = procDoc.standardsAnalysis;
      
      if (currentStatus === 'completed' || existingAnalysis) {
        console.log('[AI] RAG analysis already completed, skipping duplicate request');
        return;
      }
      
      if (currentStatus === 'processing') {
        console.log('[AI] RAG analysis already in progress, skipping duplicate request');
        return;
      }
      
      // Set status to processing to prevent duplicate calls
      await updateProcurementStage(routeProcId, {
        stageUpdates: {
          'aiStatus.standards': 'processing'
        }
      }, user.uid);
      
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

      console.log('[AI] Calling RAG analysis with requirement:', requirement);
      
      // Call RAG API
      const analysis = await aiService.analyzeStandards(requirement);
      
      console.log('[AI] RAG analysis completed:', analysis);
      
      // Store analysis in Firebase
      console.log('[DEBUG] Storing RAG result to Firebase for procurement:', routeProcId);
      await updateProcurementStage(routeProcId, {
        stageUpdates: {
          'standardsAnalysis': analysis,
          'aiStatus.standards': 'completed'
        }
      }, user.uid);
      
      // Verify the write
      console.log('[DEBUG] Verifying Firebase write...');
      const verifyDoc = await getProcurementById(routeProcId, user.uid);
      console.log('[DEBUG] FIREBASE AFTER RAG WRITE:', {
        standardsAnalysis: verifyDoc.standardsAnalysis,
        aiStatus: verifyDoc.aiStatus,
        procurementId: routeProcId
      });
      
      console.log('[AI] RAG analysis stored in Firebase');
      
    } catch (error) {
      console.error('[AI] RAG analysis failed:', error);
      // Store error in Firebase
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
  }, [routeProcId, user?.uid]);

  useEffect(() => {
    const cleanup = runStage(0);
    
    // Call real RAG API when processing starts
    callRagAPI();
    
    return cleanup;
  }, [callRagAPI]); // eslint-disable-line react-hooks/exhaustive-deps

  // Dynamic texts
  const currentCfg = isDone ? STAGE_CONFIG[4] : STAGE_CONFIG[Math.min(activeStage, 4)];
  const subtitleKey = inputType === 'document'
    ? 'subtitleDocument'
    : inputType === 'quotation'
    ? 'subtitleQuotation'
    : 'subtitleText';
  const subtitle = isDone
    ? 'Your procurement input has been successfully analyzed.'
    : currentCfg[subtitleKey];
  const statusMessage = isDone ? '' : currentCfg.message;
  const mainTitle = isDone ? 'Processing Complete' : 'Analyzing Your Input';
  const stepCounter = isDone
    ? `${STAGE_CONFIG.length} of ${STAGE_CONFIG.length}`
    : `${activeStage + 1} of ${STAGE_CONFIG.length}`;

  const isQuotationMode = inputType === 'quotation' || location.state?.workflowMode === 'quotation';
  const progressDisplay = Math.min(Math.round(progress), 100);

  if (permissionError) {
    return (
      <WorkflowShell maxWidth="max-w-3xl">
        <ProcurementWorkflowBar currentStage={isQuotationMode ? 3 : 4} mode={isQuotationMode ? 'quotation' : 'standard'} />
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

  const handleNextStage = async () => {
    if (!isDone) return;

    if (routeProcId && user?.uid) {
      try {
        console.log('[DEBUG] Navigation to output page for procurement:', routeProcId);
        
        // Verify RAG status before navigation
        const verifyDoc = await getProcurementById(routeProcId, user.uid);
        console.log('[DEBUG] Firebase state before navigation:', {
          standardsAnalysis: !!verifyDoc.standardsAnalysis,
          aiStatus: verifyDoc.aiStatus,
          currentStage: verifyDoc.currentStage
        });
        
        const nextStageName = isQuotationMode ? 'specification' : 'analysis';
        await updateProcurementStage(routeProcId, {
          currentStage: nextStageName,
          status: 'awaiting_review',
          stageUpdates: {
            'processing.status': 'completed',
          }
        }, user.uid);
      } catch (err) {
        console.warn('Could not update stage in Firestore:', err);
      }
    }

    if (isQuotationMode) {
      const target = routeProcId ? `/procurement/generate-spec/${routeProcId}` : '/procurement/generate-spec';
      navigate(target, { state: { ...(location.state || {}), procurementId: routeProcId, inputType, workflowMode: 'quotation' } });
    } else {
      const target = routeProcId ? `/procurement/output/${routeProcId}` : '/procurement/output';
      navigate(target, { state: { ...(location.state || {}), procurementId: routeProcId, inputType } });
    }
  };

  return (
    <WorkflowShell maxWidth="max-w-3xl">

      {/* ── Workflow Progress Bar (Quotation: Stage 3, Standard: Stage 4) ── */}
      <ProcurementWorkflowBar 
        currentStage={isQuotationMode ? 3 : 4} 
        mode={isQuotationMode ? 'quotation' : 'standard'} 
      />

      {/* ── Heading & Dynamic Subtitle ── */}
      <div className="text-center mb-8">
        <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors duration-500 ${
          isDone ? 'text-emerald-700' : 'text-slate-900'
        }`}>
          {mainTitle}
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-lg mx-auto leading-relaxed min-h-[1.5rem] transition-all duration-300">
          {subtitle}
        </p>
      </div>

      {/* ── Processing Status Card ── */}
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-sm p-6 sm:p-8 text-left">

        {/* Card header: label + step counter */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            Processing Status
          </h2>
          <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
            Step {stepCounter}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              {isDone ? 'Completed' : 'In Progress'}
            </span>
            <span className={`text-sm font-black tabular-nums transition-colors duration-300 ${
              isDone ? 'text-emerald-600' : 'text-blue-600'
            }`}>
              {progressDisplay}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-150 ease-linear ${
                isDone ? 'bg-emerald-500' : 'bg-blue-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Dynamic status message */}
        {!isDone && statusMessage && (
          <p className="text-xs text-slate-500 italic mb-5 min-h-[1rem] transition-all duration-300">
            {statusMessage}
          </p>
        )}

        {/* Stage list */}
        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-[15px] top-2 bottom-2 w-px bg-slate-100" />

          <div className="space-y-2">
            {STAGE_CONFIG.map((stage, i) => {
              const status = isDone
                ? 'done'
                : i < activeStage
                ? 'done'
                : i === activeStage
                ? 'active'
                : 'pending';

              const elapsedForStage = completedTimes[i];

              return (
                <div
                  key={i}
                  className={`flex items-start gap-4 rounded-2xl px-3 py-3 transition-all duration-500 ${
                    status === 'active'
                      ? 'bg-blue-50/70 border border-blue-100'
                      : 'bg-transparent border border-transparent'
                  }`}
                >
                  {/* Indicator dot */}
                  <div className="relative shrink-0 mt-0.5">
                    {status === 'done' && (
                      <div className="w-8 h-8 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center z-10 relative">
                        <Check size={14} className="text-emerald-600 stroke-[3]" />
                      </div>
                    )}
                    {status === 'active' && (
                      <div className="relative z-10">
                        <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-blue-600 flex items-center justify-center shadow-md shadow-blue-600/25">
                          <div className="w-2.5 h-2.5 rounded-full bg-white" />
                        </div>
                        {/* Subtle pulse ring */}
                        <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-blue-500" />
                      </div>
                    )}
                    {status === 'pending' && (
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10 relative">
                        <div className="w-2 h-2 rounded-full bg-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <span className={`text-sm font-semibold leading-snug block transition-colors duration-300 ${
                      status === 'pending'
                        ? 'text-slate-400'
                        : status === 'active'
                        ? 'text-slate-900'
                        : 'text-slate-700'
                    }`}>
                      {stage.label}
                    </span>

                    {/* Sub-label */}
                    {status === 'done' && (
                      <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
                        Completed · {elapsedForStage ?? '—'}s
                      </span>
                    )}
                    {status === 'active' && (
                      <span className="text-[11px] text-blue-600 font-semibold mt-0.5 flex items-center gap-1">
                        In progress · {String(stageElapsed).padStart(2, '0')}s
                        <DotIndicator />
                      </span>
                    )}
                    {status === 'pending' && (
                      <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
                        Waiting
                      </span>
                    )}
                  </div>

                  {/* Right badge for active */}
                  {status === 'active' && (
                    <span className="text-[10px] font-bold text-blue-600 bg-white px-2 py-0.5 rounded-full border border-blue-200 shrink-0 mt-1">
                      In Progress
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom Action Button ── */}
      <div className="mt-8 flex justify-center">
        <button
          type="button"
          disabled={!isDone}
          onClick={handleNextStage}
          className={`font-bold px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base transition-all ${
            isDone
              ? 'bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white shadow-lg shadow-orange-600/30 cursor-pointer'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
          }`}
        >
          {isDone ? (
            <>
              <span>{isQuotationMode ? 'Generate Technical Specification' : 'View Analysis Output'}</span>
              <ArrowRight size={17} />
            </>
          ) : (
            <span className="flex items-center gap-2">
              Processing
              <DotIndicator />
            </span>
          )}
        </button>
      </div>
    </WorkflowShell>
  );
}
