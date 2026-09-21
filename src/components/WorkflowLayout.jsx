import React from 'react';

// ==========================================
// SHARED FOCUSED WORKFLOW SHELL
// Used by the procurement workflow screens
// (Text Specification, Upload Document,
// Upload Vendor Quotation, AI Processing,
// Processing Complete) — deliberately WITHOUT
// the permanent dashboard sidebar.
// ==========================================
export function WorkflowHeader() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 sm:px-10 flex items-center justify-end shrink-0 shadow-xs" />
  );
}

export function WorkflowShell({ children, maxWidth = 'max-w-4xl' }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col antialiased selection:bg-orange-600 selection:text-white">
      <WorkflowHeader />
      <main className={`flex-1 ${maxWidth} w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-start`}>
        {children}
      </main>
    </div>
  );
}
