import React from 'react';
import { Check } from 'lucide-react';

const DEFAULT_STAGES = [
  { id: 1, name: 'Home' },
  { id: 2, name: 'Define' },
  { id: 3, name: 'Understand' },
  { id: 4, name: 'Analyze' },
  { id: 5, name: 'Output' },
  { id: 6, name: 'Generate Spec' },
  { id: 7, name: 'Publish' }
];

const QUOTATION_STAGES = [
  { id: 1, name: 'Home' },
  { id: 2, name: 'Define' },
  { id: 3, name: 'Analyze' },
  { id: 4, name: 'Generate Spec' },
  { id: 5, name: 'Publish' }
];

export function ProcurementWorkflowBar({ currentStage = 1, mode = 'standard', stages = null }) {
  const activeStages = stages || (mode === 'quotation' ? QUOTATION_STAGES : DEFAULT_STAGES);

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs mb-8 overflow-x-auto">
      <div className="min-w-[620px] sm:min-w-0 flex items-center justify-between px-2 sm:px-4">
        {activeStages.map((stage, index) => {
          const isCompleted = stage.id < currentStage;
          const isCurrent = stage.id === currentStage;
          const isUpcoming = stage.id > currentStage;

          return (
            <React.Fragment key={stage.id}>
              {/* Step Item */}
              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                {/* Step Circle */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30 ring-4 ring-orange-500/20'
                      : 'bg-slate-100 border border-slate-200 text-slate-400'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={14} className="stroke-[3]" />
                  ) : (
                    <span>{stage.id}</span>
                  )}
                </div>

                {/* Step Title */}
                <span
                  className={`text-xs font-bold whitespace-nowrap transition-colors ${
                    isCurrent
                      ? 'text-slate-900 font-extrabold'
                      : isCompleted
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  {stage.name}
                </span>
              </div>

              {/* Connecting Line between steps */}
              {index < activeStages.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 sm:mx-3 rounded-full transition-colors ${
                    stage.id < currentStage
                      ? 'bg-emerald-500'
                      : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
