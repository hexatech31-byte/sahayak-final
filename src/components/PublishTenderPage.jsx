import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  CheckCircle2, 
  Send, 
  ArrowLeft, 
  ArrowRight, 
  FileText, 
  Building2, 
  Calendar, 
  Coins, 
  ShieldCheck, 
  Globe, 
  ExternalLink,
  Sparkles,
  Download,
  Printer,
  FileCheck,
  Award,
  Check,
  ShieldAlert,
  LayoutDashboard
} from 'lucide-react';
import { WorkflowShell } from './WorkflowLayout';
import { ProcurementWorkflowBar } from './ProcurementWorkflowBar';
import { useProcurement } from '../context/ProcurementContext';
import { useAuth } from '../context/AuthContext';
import { getProcurementById, updateProcurementStage } from '../services/procurementService';

export function PublishTenderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { user } = useAuth();
  const { createTender, addToast } = useProcurement();

  const routeProcId = params.procurementId || location.state?.procurementId || '';
  const [procurement, setProcurement] = useState(null);
  const [isLoading, setIsLoading] = useState(Boolean(routeProcId));
  const [permissionError, setPermissionError] = useState('');

  const [activeTab, setActiveTab] = useState('gazette'); // 'gazette' | 'officer'
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const [tenderRef, setTenderRef] = useState('GEM/2026/B/754983');
  const [toastMessage, setToastMessage] = useState('');
  const [confetti, setConfetti] = useState([]);

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

  const inputData = procurement?.inputData || location.state || {};
  const tenderTitle = procurement?.title || inputData.title || 'Supply of 500 Nos of Industrial Safety Helmet for high-voltage, thermal heat, and heavy machinery operations environment';
  const department = inputData.department || 'Central Public Works Dept (CPWD)';
  const budget = inputData.budget || '₹ 45,00,000';
  const category = procurement?.category || inputData.category || 'PPE & Safety Equipment';
  const quantity = inputData.quantity || '500 Nos';
  const deadline = inputData.deadline || '30 Sep 2026';

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Smooth scroll to top and clean up confetti
  useEffect(() => {
    if (isPublished) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.body.scrollTo?.({ top: 0, left: 0, behavior: 'smooth' });
      document.documentElement.scrollTo?.({ top: 0, left: 0, behavior: 'smooth' });
      const scrollable = document.querySelectorAll('.overflow-y-auto, main');
      scrollable.forEach(el => el.scrollTo?.({ top: 0, left: 0, behavior: 'smooth' }));

      const timer = setTimeout(() => {
        setConfetti([]);
      }, 4800);
      return () => clearTimeout(timer);
    }
  }, [isPublished]);

  const triggerConfetti = () => {
    const palette = [
      '#10b981', // emerald green
      '#059669', // deep teal
      '#f59e0b', // amber gold
      '#fbbf24', // bright gold
      '#3b82f6', // sky blue
      '#6366f1', // indigo
      '#ec4899', // soft pink
      '#f43f5e', // coral rose
      '#8b5cf6', // violet
      '#06b6d4'  // cyan
    ];

    const particles = Array.from({ length: 80 }).map((_, i) => {
      // Evenly distributed across the exact content width (3% to 97%)
      const x = 3 + (i / 80) * 94 + (Math.random() - 0.5) * 6;
      // Staggered starting vertical position above/around top of banner
      const startY = -15 - Math.random() * 50;
      const sway = (Math.random() - 0.5) * 35; // gentle horizontal flutter

      return {
        id: i,
        x: `${Math.max(2, Math.min(98, x))}%`,
        startY: `${startY}px`,
        sway: `${sway}px`,
        isCircle: i % 3 === 0,
        width: i % 3 === 0 ? Math.random() * 5 + 4 : Math.random() * 8 + 5,
        height: i % 3 === 0 ? Math.random() * 5 + 4 : Math.random() * 4 + 3,
        color: palette[Math.floor(Math.random() * palette.length)],
        rotateInit: Math.random() * 360,
        rotateFinal: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 720 + 360),
        duration: Math.random() * 1.5 + 3.2,
        delay: Math.random() * 0.45
      };
    });

    setConfetti(particles);
  };

  useLayoutEffect(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [isPublished]);

  const handlePublish = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (isPublishing || isPublished) return;

    // Immediately reset scroll to top with zero animation
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const generatedRef = `GEM/2026/B/${Math.floor(100000 + Math.random() * 900000)}`;
    setTenderRef(generatedRef);
    setIsPublished(true);
    triggerConfetti();

    createTender({
      title: tenderTitle,
      department: department,
      category: category,
      budget: budget,
      deadline: deadline,
      description: `Published via Sahayak 7-Stage Procurement Workflow with verified BIS standards.`
    });

    if (addToast) {
      addToast({
        type: 'success',
        title: 'Tender Officially Published',
        message: `Tender ID: ${generatedRef} is now active on GeM Portal.`
      });
    }

    if (routeProcId && user?.uid) {
      try {
        await updateProcurementStage(routeProcId, {
          currentStage: 'bidding',
          status: 'published',
          stageUpdates: {
            'tender.status': 'published',
            'tender.tenderId': generatedRef,
            'tender.publishedAt': new Date().toISOString(),
          }
        }, user.uid);
      } catch (err) {
        console.warn('Could not update published status in Firestore:', err);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportText = () => {
    const textContent = `REQUEST FOR PROPOSAL (RFP)
${tenderTitle.toUpperCase()}
${department.toUpperCase()} | PROCUREMENT DIVISION

DRAFT — GENERATED BY SAHAYAK. This document is a demonstration RFP structure. Final procurement terms, statutory references, dates, financial thresholds and authority details shall be validated by the Tender Inviting Authority before issue.
================================================================================

01  TENDER INFORMATION
--------------------------------------------------------------------------------
Particular                    Details
Tender / RFP Reference No.    SAH/BIS/PROC/2026/8892
Tender ID / Portal            ${tenderRef}
Tender Inviting Authority     Procurement & Standards Directorate, Central CFA
Procurement Category          ${category}
Procurement Title             ${tenderTitle}
Estimated Value               ${budget}
Contract / Delivery Period    45 Calendar Days
Bid Security / EMD            2% of Estimated Value (₹ 90,000) / As Applicable
Performance Security          5% of Contract Value (PBG)
Evaluation Method             L1 / Quality & Cost Based Selection (QCBS)

02  CRITICAL DATES
--------------------------------------------------------------------------------
Activity                          Date & Time             Channel / Location
RFP publication / download        01-09-2026, 10:00 IST   GeM Portal / Official Website
Pre-bid conference                08-09-2026, 11:30 IST   Conference Room 402 / Online VC
Last date for queries             12-09-2026, 17:00 IST   GeM Portal / Official Email
Clarifications / corrigendum      15-09-2026, 18:00 IST   GeM Portal / Official Website
Bid submission deadline           ${deadline}, 15:00 IST  GeM E-Procurement Portal
Technical bid opening             ${deadline}, 15:30 IST  Technical Evaluation Committee
Commercial bid opening            To be notified          Qualified Bidders

Official contact: Shri R. K. Verma, Director (Procurement), email: procurement-desk@gov.in, tel: 011-23389000. Only clarifications/corrigenda issued through the designated official channel shall be considered part of the RFP.

03  THE OPPORTUNITY
--------------------------------------------------------------------------------
3.1 Background:
Procurement is undertaken by ${department} to ensure high-grade technical compliance, personnel safety, and operational excellence across regional project sites and facilities. The existing infrastructure requires standardized, certified, and quality-assured equipment meeting national benchmark standards.

3.2 Objectives / Expected Outcomes:
• Supply and deployment of verified, certified goods/services meeting all applicable Bureau of Indian Standards (BIS) and QCO mandates.
• Zero-failure reliability in critical operational and high-voltage / industrial working environments.
• Full compliance with GFR Rule 144(i) and Public Procurement (Preference to Make in India) Order.
• Streamlined lifecycle support, warranty fulfillment, and proactive vendor service level commitments.

04  SCOPE OF WORK / REQUIREMENT
--------------------------------------------------------------------------------
Requirement Area              Requirement / Description
Core Requirement              ${tenderTitle}
Quantity / Capacity           ${quantity}
Functional Requirements       High impact resistance, dielectric insulation, thermal endurance, ergonomic fit.
Technical Requirements        One-piece molded structure, 20,000V AC dielectric test, <5.0kN peak force transmission.
Quality / Safety              Mandatory BIS Standard Mark (Scheme-I ISI) & NABL accredited test verification.
Installation / Implementation Delivery at Central Consignee Stores, site unboxing, and joint acceptance check.
Training / Documentation      OEM manuals, batch test certificates, user safety guidelines (English & Hindi).
Warranty / Maintenance        24 Months Comprehensive On-Site Warranty with replacement within 7 days.

05  APPLICABLE STANDARDS & COMPLIANCE
--------------------------------------------------------------------------------
[AI-ASSISTED SECTION. List only standards and regulations validated for the specific procurement.]

Compliance Area               Requirement
Product / Technical Standards IS 2925:1984 (Specification for Industrial Safety Helmets) & IS 15298 (Part 2):2016
Testing / Inspection          Drop Impact Test (Clause 7.1), Penetration Test (Clause 7.2), Dielectric (Clause 7.4)
Safety / Regulatory           DPIIT Quality Control Order (QCO) S.O. 2254(E) Mandatory Compliance
Certification / Registration  Active BIS License (ISI Mark Scheme-I) with valid CML License Number
Environmental / Safety        Non-hazardous, recyclable polymers, RoHS compliant material composition

AI VALIDATION RULE: Outdated, withdrawn, superseded or incomplete references shall be flagged for review rather than silently inserted into the final RFP.

06  DELIVERABLES & ACCEPTANCE
--------------------------------------------------------------------------------
Deliverable                   Timeline                Acceptance / Evidence
Initial Documentation & MAF   T + 7 Days              Verified OEM Authorization & BIS License submission
Advance Sample / Type Test    T + 15 Days             NABL Lab Certificate review & joint committee approval
Full Batch Supply & Delivery  T + 35 Days             Stores receipt voucher & physical verification check
Final Delivery / Completion   T + 45 Days             Final acceptance / completion certificate issued by CFA

07  IMPLEMENTATION & CONTRACT PERFORMANCE
--------------------------------------------------------------------------------
Milestone / Activity          Timeline                Deliverable / Acceptance
Kick-off / Requirement conf.  T + 5 Days              Approved production plan & technical data sheets
Supply / Development / Impl.  T + 30 Days             Manufactured lot ready for pre-dispatch inspection
Testing / Inspection / UAT    T + 38 Days             Joint Factory Acceptance Test (FAT) / NABL record
Deployment / Handover         T + 45 Days             Consignee Handover & Final Acceptance Certificate

08  PERFORMANCE METRICS / SLA
--------------------------------------------------------------------------------
Metric                        Target / Benchmark      Measurement / Frequency
Delivery Schedule Adherence   100% on-time delivery   Delivery Milestone Tracking / Per Consignment
Quality / Defect Rate         < 0.1% defect rate      Random Sampling per IS 2925 / Acceptance Check
Defect Replacement Time       < 7 calendar days       Vendor SLA Log / Per Incident
Operational Availability      99.5% uptime            Quarterly Performance Review / Annual Audit

09  PROPOSAL SUBMISSION
--------------------------------------------------------------------------------
Submission Component          Indicative Content                                      Mandatory
Eligibility / Pre-Qual        Registration, statutory documents, declarations, CA fin Yes
Technical Proposal            Approach, specifications, methodology, compliance resp. Yes
Experience & Credentials      Relevant assignments, references, certifications        Yes
Implementation Plan           Timeline, resources, milestones, risk management        Yes
Compliance Matrix             Requirement-by-requirement response to all clauses      Yes
Commercial Proposal           BOQ / price schedule / financial offer (GeM format)     Yes
Other Forms                   Undertakings, NDA, authorization, GFR 144(i), Make in India Yes

10  SUBMISSION INSTRUCTIONS
--------------------------------------------------------------------------------
• Submission mode: E-Procurement Portal (GeM / CPPP) only. Physical copies not accepted.
• Proposal validity: 90 days from the date of technical bid opening.
• Permitted file formats / size: PDF / XLSX / ZIP; maximum 25 MB per document packet.
• Language: English / Hindi (Bilingual where statutory).
• Questions and clarifications: Submitted via official portal query window before query deadline.
• Late bids / modification / withdrawal: Governed by GeM GTC / CPPP e-procurement standard operating rules.

11  BID / ENVELOPE CHECKLIST
--------------------------------------------------------------------------------
Section                       Indicative Contents
Eligibility / Pre-Qual        Bid security (EMD/declaration), eligibility evidence, statutory registrations, GFR 144(i)
Technical Bid                 Technical proposal, BIS License, NABL type test reports, MAF, compliance matrix
Commercial Bid                Price schedule / BOQ / commercial form submitted via encrypted financial envelope

12  ELIGIBILITY / PRE-QUALIFICATION
--------------------------------------------------------------------------------
Criterion                     Minimum Requirement                     Evidence
Legal status                  Incorporated entity in India / MSME     Certificate of Incorporation / Udyam Certificate
Financial capability          Min. 30% avg annual turnover (last 3y)  CA Audited Balance Sheets with UDIN
Relevant experience           Min. 3 completed contracts in last 5y   Work Orders / Client Completion Certificates
Technical capability          Direct OEM or OEM Authorized Partner    Manufacturer Authorization Form (MAF)
Licences / registrations      Valid BIS License (ISI Scheme-I)        Valid CML Certificate with Endorsement Schedule
Declarations                  Non-debarment, GFR 144(i), Make in India Signed & Notarized Official Declarations

13  EVALUATION CRITERIA
--------------------------------------------------------------------------------
Criterion                     Weight (%)              Indicative Basis
Eligibility / Responsiveness  15%                     Compliance with mandatory statutory & eligibility requirements
Technical / Solution Quality  40%                     Conformance to IS standards, NABL test parameters & material spec
Experience & Capacity         20%                     Track record in government supplies, past performance & credentials
Delivery / Implementation     15%                     Robustness of supply chain, timeline feasibility and SLA commitment
Presentation / Demonstration  10%                     Sample verification / physical inspection demonstration
TOTAL                         100%

14  SELECTION & AWARD
--------------------------------------------------------------------------------
• Stage 1 — Preliminary responsiveness / eligibility review.
• Stage 2 — Technical evaluation against the published criteria and qualifying threshold (>= 75%).
• Stage 3 — Presentation / demonstration (if applicable).
• Stage 4 — Commercial evaluation using the stated procurement method (L1 / QCBS).
• Stage 5 — Final ranking, approval and issue of Letter of Award / Purchase Order / Contract.
• Clarifications may be sought only in accordance with applicable procurement rules.

15  KEY TERMS & CONDITIONS
--------------------------------------------------------------------------------
• Payment, taxes and duties: 100% payment within 30 days of delivery, inspection, and issuance of Final Consignee Receipt (CRAC).
• Inspection, testing, acceptance, rejection and replacement: Pre-dispatch inspection per IS sampling plan. Rejected lots replaced at vendor cost within 7 days.
• Warranty / maintenance / service levels: 24 Months comprehensive on-site OEM warranty.
• Performance security / penalties / liquidated damages: 5% Performance Bank Guarantee (PBG); Liquidated Damages at 0.5% per week of delay (max 10%).
• Confidentiality, intellectual property and data protection: Standard government non-disclosure obligations apply.
• Subcontracting / assignment: Not permitted without prior written approval of the CFA.
• Force majeure, termination and dispute resolution: Standard GeM / Government of India arbitration clauses.
• Integrity, anti-corruption, conflict of interest and non-collusion: Zero-tolerance Integrity Pact mandatory for all bidders.

16  ANNEXURES
--------------------------------------------------------------------------------
Annexure                      Content
Annexure A                    Detailed Technical / Functional Specification & Standards Schedule
Annexure B                    Bill of Quantities (BOQ) / Price Schedule Format
Annexure C                    Requirement-by-Requirement Compliance / Conformance Matrix
Annexure D                    Bid Forms, Manufacturer Authorization (MAF) & GFR Declarations
Annexure E                    Performance Security (PBG) & Service Level Agreement (SLA) Schedule

================================================================================
FINAL AI CHECK BEFORE GENERATION: Verify that every product-specific quantity, specification, standard, certification, date, eligibility threshold, evaluation weight and contractual value is supported by the input or an authoritative source. Flag missing or ambiguous information for human review.

Procurement & Standards Directorate
Authorized Competent Financial Authority (CFA)
Digitally Signed & Timestamped
================================================================================`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RFP_Document_${tenderRef.replace(/[\/:]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('RFP document text exported successfully');
  };

  const isQuotationMode = location.state?.inputType === 'quotation' || 
    location.state?.workflowMode === 'quotation' || 
    procurement?.inputType === 'quotation' || 
    procurement?.inputData?.inputType === 'quotation' || 
    procurement?.inputData?.workflowMode === 'quotation';

  if (isLoading) {
    return (
      <WorkflowShell maxWidth="max-w-5xl">
        <ProcurementWorkflowBar currentStage={isQuotationMode ? 5 : 7} mode={isQuotationMode ? 'quotation' : 'standard'} />
        <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center my-6">
          <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-slate-600">Loading tender publication details from Firestore...</p>
        </div>
      </WorkflowShell>
    );
  }

  if (permissionError) {
    return (
      <WorkflowShell maxWidth="max-w-5xl">
        <ProcurementWorkflowBar currentStage={isQuotationMode ? 5 : 7} mode={isQuotationMode ? 'quotation' : 'standard'} />
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
      
      {/* ── Workflow Bar (Quotation: Stage 5, Standard: Stage 7) ── */}
      <ProcurementWorkflowBar 
        currentStage={isQuotationMode ? 5 : 7} 
        mode={isQuotationMode ? 'quotation' : 'standard'} 
      />

      {/* Floating Confetti Layer (Aligned Dead Center Over Content) */}
      {confetti.length > 0 && (
        <div className="fixed inset-x-0 top-0 bottom-0 pointer-events-none z-50 overflow-hidden flex justify-center">
          <div className="max-w-5xl w-full h-full relative mx-auto px-4 sm:px-6 pointer-events-none">
            {confetti.map((c) => (
              <div
                key={c.id}
                style={{
                  left: c.x,
                  top: c.startY,
                  width: `${c.width}px`,
                  height: `${c.height}px`,
                  backgroundColor: c.color,
                  borderRadius: c.isCircle ? '50%' : '1px',
                  '--sway': c.sway,
                  '--rot-init': `${c.rotateInit}deg`,
                  '--rot-final': `${c.rotateFinal}deg`,
                  animation: `confettiFloat ${c.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards ${c.delay}s`
                }}
                className="absolute opacity-95"
              />
            ))}
            <style>{`
              @keyframes confettiFloat {
                0% {
                  transform: translateY(0) translateX(0) rotate(var(--rot-init));
                  opacity: 0;
                }
                10% {
                  opacity: 1;
                }
                40% {
                  transform: translateY(350px) translateX(var(--sway)) rotate(calc(var(--rot-init) + 180deg));
                }
                75% {
                  opacity: 0.95;
                }
                100% {
                  transform: translateY(1200px) translateX(calc(var(--sway) * -0.5)) rotate(var(--rot-final));
                  opacity: 0;
                }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 right-8 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-lg animate-in fade-in">
          {toastMessage}
        </div>
      )}

      <div key={isPublished ? 'published-page-view' : 'draft-page-view'} className="space-y-6 text-left">
        
        {/* ── Section A: Green Published Banner (Only after publishing) ── */}
        {isPublished && (
          /* ── Green Success Notification Banner (Smooth Fade & Slide-In) ── */
          <div className="w-full bg-[#00875a] text-white rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-lg animate-in fade-in slide-in-from-top-3 duration-500 relative overflow-hidden">
            
            {/* Left: Checkmark Icon & Title + Tender ID */}
            <div className="flex items-center gap-3.5 z-10">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0 animate-in zoom-in-75 duration-300">
                <Check size={20} className="stroke-[3] text-white" />
              </div>
              <div>
                <h3 className="text-base font-extrabold tracking-tight">
                  Tender Officially Published
                </h3>
                <p className="text-xs text-white/90 font-medium mt-0.5">
                  Tender ID: <span className="font-mono font-bold">{tenderRef}</span> • Visible to vendors for technical and commercial bidding.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ── Section B: View Mode Tabs & Document Actions Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          {/* View Tabs */}
          <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('gazette')}
              className="px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-slate-900 text-white shadow-xs"
            >
              <FileText size={14} />
              <span>Official Gazette / GeM Tender</span>
            </button>
          </div>

          {/* Export & Print */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportText}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Download size={13} />
              <span>Export Text</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <Printer size={13} />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* ── Section C: Official Tender Document Preview ── */}
        <div className="bg-white border border-slate-300 rounded-2xl p-6 sm:p-12 shadow-sm text-slate-900 space-y-8 font-sans">
          
          {/* RFP Header */}
          <div className="pb-6 border-b-2 border-slate-900 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Sahayak Logo */}
              <div className="flex items-center justify-center shrink-0">
                <img 
                  src="/rfp_assets/sahayak_logo.png" 
                  alt="Sahayak Logo" 
                  className="h-20 sm:h-24 md:h-28 w-auto object-contain max-w-[160px] sm:max-w-[200px]"
                />
              </div>

              {/* Header Title Block */}
              <div className="text-center flex-1 space-y-1 px-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#0F2A44] uppercase">
                  REQUEST FOR PROPOSAL (RFP)
                </h2>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-[#C2540A] uppercase tracking-wide">
                  {tenderTitle || '[TITLE OF PROCUREMENT]'}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-600 tracking-wider uppercase">
                  {department.toUpperCase() || '[NAME OF MINISTRY / DEPARTMENT / PSU / GOVERNMENT AUTHORITY]'} | PROCUREMENT DIVISION
                </p>
              </div>

              {/* BIS Logo */}
              <div className="flex items-center justify-center shrink-0">
                <img 
                  src="/rfp_assets/bis_logo.png" 
                  alt="Bureau of Indian Standards Logo" 
                  className="h-20 sm:h-24 md:h-28 w-auto object-contain max-w-[160px] sm:max-w-[200px]"
                />
              </div>
            </div>

            <div className="pt-2">
              <div className="p-3.5 bg-[#FDECE1] border border-[#FBD5BD] rounded-xl text-[#7C2D12] text-xs font-medium leading-relaxed text-left shadow-2xs">
                <strong className="text-[#C2540A] font-bold">DRAFT — GENERATED BY SAHAYAK.</strong> This document is a demonstration RFP structure. Final procurement terms, statutory references, dates, financial thresholds and authority details shall be validated by the Tender Inviting Authority before issue.
              </div>
            </div>
          </div>

          {/* 01 TENDER INFORMATION */}
          <div className="space-y-3">
            <div className="flex items-stretch rounded-lg overflow-hidden shadow-xs">
              <div className="bg-[#C2540A] text-white font-mono font-black text-xs px-3.5 py-2 flex items-center justify-center shrink-0">
                01
              </div>
              <div className="bg-[#0F2A44] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 flex-1 flex items-center">
                TENDER INFORMATION
              </div>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F2A44] text-white font-bold">
                  <tr>
                    <th className="p-3 w-1/3">Particular</th>
                    <th className="p-3 w-2/3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Tender / RFP Reference No.</td>
                    <td className="p-3 font-mono font-bold text-slate-900">SAH/BIS/PROC/2026/8892</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Tender ID / Portal</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{tenderRef}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Tender Inviting Authority</td>
                    <td className="p-3">Procurement &amp; Standards Directorate, Central CFA</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Procurement Category</td>
                    <td className="p-3 font-semibold text-slate-900">{category || 'GOODS / SERVICES / WORKS / IT'}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Procurement Title</td>
                    <td className="p-3 font-bold text-slate-900">{tenderTitle}</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Estimated Value</td>
                    <td className="p-3 font-mono font-black text-slate-900">{budget}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Contract / Delivery Period</td>
                    <td className="p-3 font-semibold text-slate-900">45 Calendar Days</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Bid Security / EMD</td>
                    <td className="p-3">2% of Estimated Value (₹ 90,000) / MSME Exemption Applicable</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Performance Security</td>
                    <td className="p-3">5% of Contract Value (Performance Bank Guarantee)</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Evaluation Method</td>
                    <td className="p-3 font-bold text-slate-900">L1 / Quality &amp; Cost Based Selection (QCBS)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 02 CRITICAL DATES */}
          <div className="space-y-3">
            <div className="flex items-stretch rounded-lg overflow-hidden shadow-xs">
              <div className="bg-[#C2540A] text-white font-mono font-black text-xs px-3.5 py-2 flex items-center justify-center shrink-0">
                02
              </div>
              <div className="bg-[#0F2A44] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 flex-1 flex items-center">
                CRITICAL DATES
              </div>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F2A44] text-white font-bold">
                  <tr>
                    <th className="p-3 w-2/5">Activity</th>
                    <th className="p-3 w-1/4">Date &amp; Time</th>
                    <th className="p-3 w-1/3">Channel / Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-700">RFP publication / download</td>
                    <td className="p-3 font-mono font-bold text-slate-900">01-09-2026, 10:00 IST</td>
                    <td className="p-3">GeM Portal / Official Website</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Pre-bid / pre-proposal conference</td>
                    <td className="p-3 font-mono font-bold text-slate-900">08-09-2026, 11:30 IST</td>
                    <td className="p-3">Conference Room 402 / Online VC</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Last date for queries</td>
                    <td className="p-3 font-mono font-bold text-slate-900">12-09-2026, 17:00 IST</td>
                    <td className="p-3">GeM Portal / Official Email</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Clarifications / corrigendum</td>
                    <td className="p-3 font-mono font-bold text-slate-900">15-09-2026, 18:00 IST</td>
                    <td className="p-3">GeM Portal / Official Website</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Bid submission deadline</td>
                    <td className="p-3 font-mono font-black text-red-600">{deadline}, 15:00 IST</td>
                    <td className="p-3 font-bold text-slate-900">GeM E-Procurement Portal</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Technical bid opening</td>
                    <td className="p-3 font-mono font-bold text-slate-900">{deadline}, 15:30 IST</td>
                    <td className="p-3">Technical Evaluation Committee</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Commercial bid opening</td>
                    <td className="p-3 font-mono font-bold text-slate-900">To be notified</td>
                    <td className="p-3 font-semibold text-emerald-700">Qualified Bidders</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-slate-600 font-medium bg-[#F8FAFC] p-2.5 rounded-lg border border-slate-200">
              <strong>Official contact:</strong> Shri R. K. Verma, Director (Procurement), email: <code className="text-slate-800 font-mono">procurement-desk@gov.in</code>, tel: 011-23389000. Only clarifications/corrigenda issued through the designated official channel shall be considered part of the RFP.
            </p>
          </div>

          {/* 03 THE OPPORTUNITY */}
          <div className="space-y-3">
            <div className="flex items-stretch rounded-lg overflow-hidden shadow-xs">
              <div className="bg-[#C2540A] text-white font-mono font-black text-xs px-3.5 py-2 flex items-center justify-center shrink-0">
                03
              </div>
              <div className="bg-[#0F2A44] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 flex-1 flex items-center">
                THE OPPORTUNITY
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-800 leading-relaxed font-medium">
              <div>
                <strong className="text-slate-900 block font-bold mb-1">3.1 Background:</strong>
                <p className="text-slate-700">
                  Procurement is undertaken by {department} to ensure high-grade technical compliance, personnel safety, and operational excellence across regional project sites and facilities. The existing infrastructure requires standardized, certified, and quality-assured equipment meeting national benchmark standards.
                </p>
              </div>
              <div className="pt-1">
                <strong className="text-slate-900 block font-bold mb-1">3.2 Objectives / Expected Outcomes:</strong>
                <ul className="list-disc pl-5 space-y-1 text-slate-700">
                  <li>Supply and deployment of verified, certified goods/services meeting all applicable Bureau of Indian Standards (BIS) and QCO mandates.</li>
                  <li>Zero-failure reliability in critical operational and high-voltage / industrial working environments.</li>
                  <li>Full compliance with GFR Rule 144(i) and Public Procurement (Preference to Make in India) Order.</li>
                  <li>Streamlined lifecycle support, warranty fulfillment, and proactive vendor service level commitments.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 04 SCOPE OF WORK / REQUIREMENT */}
          <div className="space-y-3">
            <div className="flex items-stretch rounded-lg overflow-hidden shadow-xs">
              <div className="bg-[#C2540A] text-white font-mono font-black text-xs px-3.5 py-2 flex items-center justify-center shrink-0">
                04
              </div>
              <div className="bg-[#0F2A44] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 flex-1 flex items-center">
                SCOPE OF WORK / REQUIREMENT
              </div>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F2A44] text-white font-bold">
                  <tr>
                    <th className="p-3 w-1/3">Requirement Area</th>
                    <th className="p-3 w-2/3">Requirement / Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Core Requirement</td>
                    <td className="p-3 font-bold text-slate-900">{tenderTitle}</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Quantity / Capacity</td>
                    <td className="p-3 font-bold text-slate-900">{quantity}</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Functional Requirements</td>
                    <td className="p-3">High impact resistance, dielectric insulation, thermal endurance, and ergonomic operational fit.</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Technical Requirements</td>
                    <td className="p-3">One-piece molded structure, 20,000V AC dielectric test, &lt;5.0kN peak force transmission.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Quality / Safety</td>
                    <td className="p-3">100% compliant with mandatory BIS Standard Mark (Scheme-I ISI) &amp; NABL accredited lab test verification.</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Installation / Implementation</td>
                    <td className="p-3">Delivery at Central Consignee Stores, unboxing, site verification, and joint acceptance inspection.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Training / Documentation</td>
                    <td className="p-3">OEM user manuals, safety guidelines, batch test certificates, and compliance declarations in English &amp; Hindi.</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Warranty / Maintenance / Support</td>
                    <td className="p-3">24 Months Comprehensive On-Site Warranty with replacement of defective units within 7 calendar days.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 05 APPLICABLE STANDARDS & COMPLIANCE */}
          <div className="space-y-3">
            <div className="flex items-stretch rounded-lg overflow-hidden shadow-xs">
              <div className="bg-[#C2540A] text-white font-mono font-black text-xs px-3.5 py-2 flex items-center justify-center shrink-0">
                05
              </div>
              <div className="bg-[#0F2A44] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 flex-1 flex items-center">
                APPLICABLE STANDARDS &amp; COMPLIANCE
              </div>
            </div>
            <div className="p-3 bg-[#EFF6FF] border border-[#DBEAFE] rounded-xl text-[#1E40AF] text-[11px] font-semibold">
              <strong>AI-ASSISTED SECTION:</strong> List only standards and regulations validated for the specific procurement, including the current applicable edition/amendments and allied/normative references where relevant.
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F2A44] text-white font-bold">
                  <tr>
                    <th className="p-3 w-1/3">Compliance Area</th>
                    <th className="p-3 w-2/3">Requirement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Product / Technical Standards</td>
                    <td className="p-3 font-mono font-bold text-slate-900">IS 2925:1984 (Specification for Industrial Safety Helmets) &amp; IS 15298 (Part 2):2016</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Testing / Inspection Standards</td>
                    <td className="p-3">Drop Impact Test (Clause 7.1), Penetration Test (Clause 7.2), Dielectric Surge (Clause 7.4)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Safety / Regulatory Requirements</td>
                    <td className="p-3 font-bold text-rose-700">DPIIT Quality Control Order (QCO) S.O. 2254(E) Mandatory Compliance</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Certification / Registration</td>
                    <td className="p-3 font-semibold text-emerald-800">Active BIS License (ISI Mark Scheme-I) with valid CML License Number</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Environmental / Accessibility</td>
                    <td className="p-3">Non-hazardous, recyclable polymers, RoHS compliant material composition</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-3 bg-[#FFFBEB] border border-[#FEF3C7] rounded-xl text-[#92400E] text-[11px] font-bold">
              AI VALIDATION RULE: Outdated, withdrawn, superseded or incomplete references shall be flagged for review rather than silently inserted into the final RFP.
            </div>
          </div>

          {/* 06 DELIVERABLES & ACCEPTANCE */}
          <div className="space-y-3">
            <div className="flex items-stretch rounded-lg overflow-hidden shadow-xs">
              <div className="bg-[#C2540A] text-white font-mono font-black text-xs px-3.5 py-2 flex items-center justify-center shrink-0">
                06
              </div>
              <div className="bg-[#0F2A44] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 flex-1 flex items-center">
                DELIVERABLES &amp; ACCEPTANCE
              </div>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F2A44] text-white font-bold">
                  <tr>
                    <th className="p-3 w-1/3">Deliverable</th>
                    <th className="p-3 w-1/4">Timeline</th>
                    <th className="p-3 w-5/12">Acceptance / Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Initial Documentation &amp; MAF</td>
                    <td className="p-3 font-mono font-bold text-slate-900">T + 7 Days</td>
                    <td className="p-3">Verified OEM Authorization &amp; BIS License submission</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Advance Sample / Type Test Approval</td>
                    <td className="p-3 font-mono font-bold text-slate-900">T + 15 Days</td>
                    <td className="p-3">NABL Lab Certificate review &amp; joint committee approval</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Full Batch Supply &amp; Consignee Delivery</td>
                    <td className="p-3 font-mono font-bold text-slate-900">T + 35 Days</td>
                    <td className="p-3">Stores receipt voucher &amp; physical verification check</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Final Delivery / Completion</td>
                    <td className="p-3 font-mono font-bold text-slate-900">T + 45 Days</td>
                    <td className="p-3 font-bold text-emerald-800">Final acceptance / completion certificate issued by CFA</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 07 IMPLEMENTATION & CONTRACT PERFORMANCE */}
          <div className="space-y-3">
            <div className="flex items-stretch rounded-lg overflow-hidden shadow-xs">
              <div className="bg-[#C2540A] text-white font-mono font-black text-xs px-3.5 py-2 flex items-center justify-center shrink-0">
                07
              </div>
              <div className="bg-[#0F2A44] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 flex-1 flex items-center">
                IMPLEMENTATION &amp; CONTRACT PERFORMANCE
              </div>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F2A44] text-white font-bold">
                  <tr>
                    <th className="p-3 w-1/3">Milestone / Activity</th>
                    <th className="p-3 w-1/4">Timeline</th>
                    <th className="p-3 w-5/12">Deliverable / Acceptance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Kick-off / Requirement confirmation</td>
                    <td className="p-3 font-mono font-bold text-slate-900">T + 5 Days</td>
                    <td className="p-3">Approved production plan &amp; technical data sheets</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Supply / Development / Implementation</td>
                    <td className="p-3 font-mono font-bold text-slate-900">T + 30 Days</td>
                    <td className="p-3">Manufactured lot ready for pre-dispatch inspection</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Testing / Inspection / UAT</td>
                    <td className="p-3 font-mono font-bold text-slate-900">T + 38 Days</td>
                    <td className="p-3">Joint Factory Acceptance Test (FAT) / NABL record</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Deployment / Handover / Completion</td>
                    <td className="p-3 font-mono font-bold text-slate-900">T + 45 Days</td>
                    <td className="p-3 font-bold text-emerald-800">Consignee Handover &amp; Final Acceptance Certificate</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 08 PERFORMANCE METRICS / SLA */}
          <div className="space-y-3">
            <div className="flex items-stretch rounded-lg overflow-hidden shadow-xs">
              <div className="bg-[#C2540A] text-white font-mono font-black text-xs px-3.5 py-2 flex items-center justify-center shrink-0">
                08
              </div>
              <div className="bg-[#0F2A44] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 flex-1 flex items-center">
                PERFORMANCE METRICS / SLA
              </div>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F2A44] text-white font-bold">
                  <tr>
                    <th className="p-3 w-1/3">Metric</th>
                    <th className="p-3 w-1/3">Target / Benchmark</th>
                    <th className="p-3 w-1/3">Measurement / Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Delivery Schedule Adherence</td>
                    <td className="p-3 font-bold text-slate-900">100% on-time delivery within 45 days</td>
                    <td className="p-3">Delivery Milestone Tracking / Per Consignment</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Quality / Defect Rate</td>
                    <td className="p-3 font-bold text-emerald-800">&lt; 0.1% defect rate on lot inspection</td>
                    <td className="p-3">Random Sampling per IS 2925 / Acceptance Check</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Defect Replacement Response Time</td>
                    <td className="p-3 font-bold text-slate-900">&lt; 7 calendar days from notification</td>
                    <td className="p-3">Vendor SLA Log / Per Incident</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Operational Availability</td>
                    <td className="p-3 font-bold text-slate-900">99.5% uptime / service availability</td>
                    <td className="p-3">Quarterly Performance Review / Annual Audit</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 09 PROPOSAL SUBMISSION */}
          <div className="space-y-3">
            <div className="flex items-stretch rounded-lg overflow-hidden shadow-xs">
              <div className="bg-[#C2540A] text-white font-mono font-black text-xs px-3.5 py-2 flex items-center justify-center shrink-0">
                09
              </div>
              <div className="bg-[#0F2A44] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 flex-1 flex items-center">
                PROPOSAL SUBMISSION
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Bidders shall submit the following information/documents in the prescribed format. The final RFP should retain only those items applicable to the procurement.
            </p>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F2A44] text-white font-bold">
                  <tr>
                    <th className="p-3 w-1/3">Submission Component</th>
                    <th className="p-3 w-1/2">Indicative Content</th>
                    <th className="p-3 w-1/6 text-center">Mandatory</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Eligibility / Pre-Qualification</td>
                    <td className="p-3">Registration, statutory documents, declarations, financial/experience evidence</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">Yes</span></td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Technical Proposal</td>
                    <td className="p-3">Approach, specifications, methodology, compliance response</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">Yes</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Experience &amp; Credentials</td>
                    <td className="p-3">Relevant assignments, references, certifications</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">Yes</span></td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Implementation / Delivery Plan</td>
                    <td className="p-3">Timeline, resources, milestones, risk management</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">Yes</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Compliance Matrix</td>
                    <td className="p-3">Requirement-by-requirement response</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">Yes</span></td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Commercial Proposal</td>
                    <td className="p-3">BOQ / price schedule / financial offer</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">Yes</span></td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Other Forms</td>
                    <td className="p-3">Undertakings, NDA, authorisation, declarations, etc.</td>
                    <td className="p-3 text-center"><span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">Yes</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 10 SUBMISSION INSTRUCTIONS */}
          <div className="space-y-3">
            <div className="flex items-stretch rounded-lg overflow-hidden shadow-xs">
              <div className="bg-[#C2540A] text-white font-mono font-black text-xs px-3.5 py-2 flex items-center justify-center shrink-0">
                10
              </div>
              <div className="bg-[#0F2A44] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 flex-1 flex items-center">
                SUBMISSION INSTRUCTIONS
              </div>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 font-medium">
              <li><strong>Submission mode:</strong> E-PROCUREMENT PORTAL (GeM / CPPP) only. Physical copies shall not be accepted.</li>
              <li><strong>Proposal validity:</strong> 90 days from the submission deadline date.</li>
              <li><strong>Permitted file formats / size:</strong> PDF / XLSX / ZIP; maximum 25 MB per document file limit.</li>
              <li><strong>Language:</strong> English / Hindi (Bilingual formats allowed).</li>
              <li><strong>Questions and clarifications:</strong> Submitted online via portal query window prior to the query deadline.</li>
              <li><strong>Late bids / modification / withdrawal:</strong> Governed by Standard Operating E-Procurement Rules (GFR 2017 &amp; GeM GTC).</li>
            </ul>
          </div>

          {/* 11 BID / ENVELOPE CHECKLIST */}
          <div className="space-y-3">
            <div className="flex items-stretch rounded-lg overflow-hidden shadow-xs">
              <div className="bg-[#C2540A] text-white font-mono font-black text-xs px-3.5 py-2 flex items-center justify-center shrink-0">
                11
              </div>
              <div className="bg-[#0F2A44] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 flex-1 flex items-center">
                BID / ENVELOPE CHECKLIST
              </div>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F2A44] text-white font-bold">
                  <tr>
                    <th className="p-3 w-1/3">Section</th>
                    <th className="p-3 w-2/3">Indicative Contents</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Eligibility / Pre-Qualification</td>
                    <td className="p-3">Bid security, eligibility evidence, declarations, GFR 144(i) self-declaration</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Technical Bid</td>
                    <td className="p-3">Technical proposal, compliance matrix, experience, delivery plan, BIS license, NABL reports</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Commercial Bid</td>
                    <td className="p-3 font-bold text-slate-900">Price schedule / BOQ / commercial offer submitted via encrypted financial envelope</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 12 ELIGIBILITY / PRE-QUALIFICATION */}
          <div className="space-y-3">
            <div className="flex items-stretch rounded-lg overflow-hidden shadow-xs">
              <div className="bg-[#C2540A] text-white font-mono font-black text-xs px-3.5 py-2 flex items-center justify-center shrink-0">
                12
              </div>
              <div className="bg-[#0F2A44] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 flex-1 flex items-center">
                ELIGIBILITY / PRE-QUALIFICATION
              </div>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F2A44] text-white font-bold">
                  <tr>
                    <th className="p-3 w-1/4">Criterion</th>
                    <th className="p-3 w-5/12">Minimum Requirement</th>
                    <th className="p-3 w-1/3">Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Legal status</td>
                    <td className="p-3">Registered Entity / Incorporated in India / MSME</td>
                    <td className="p-3 font-mono">Certificate of Incorporation / Udyam</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Financial capability</td>
                    <td className="p-3">Minimum 30% average turnover over last 3 years</td>
                    <td className="p-3">Audited Balance Sheets / CA Certificate with UDIN</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Relevant experience</td>
                    <td className="p-3">Minimum 3 completed contracts of similar nature in last 5 years</td>
                    <td className="p-3">Work Orders / Client Completion Certificates</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Technical capability</td>
                    <td className="p-3">Direct OEM or OEM Authorized Partner with valid tooling</td>
                    <td className="p-3">Manufacturer Authorization Form (MAF)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Licences / registrations</td>
                    <td className="p-3">Valid BIS License (ISI Scheme-I) for tendered item</td>
                    <td className="p-3 font-mono">Valid CML Certificate with Schedule</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Declarations</td>
                    <td className="p-3">Non-Debarment / Conflict of Interest / GFR 144(i)</td>
                    <td className="p-3">Signed Official Declarations</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 13 EVALUATION CRITERIA */}
          <div className="space-y-3">
            <div className="flex items-stretch rounded-lg overflow-hidden shadow-xs">
              <div className="bg-[#C2540A] text-white font-mono font-black text-xs px-3.5 py-2 flex items-center justify-center shrink-0">
                13
              </div>
              <div className="bg-[#0F2A44] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 flex-1 flex items-center">
                EVALUATION CRITERIA
              </div>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Weights and thresholds shall be configured for the specific procurement and must total 100%.
            </p>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F2A44] text-white font-bold">
                  <tr>
                    <th className="p-3 w-1/3">Criterion</th>
                    <th className="p-3 w-24 text-center">Weight (%)</th>
                    <th className="p-3">Indicative Basis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Eligibility / Responsiveness</td>
                    <td className="p-3 text-center font-black text-slate-900">15</td>
                    <td className="p-3">Compliance with mandatory statutory &amp; eligibility requirements</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Technical / Solution Quality</td>
                    <td className="p-3 text-center font-black text-slate-900">40</td>
                    <td className="p-3">Technical response, BIS compliance, NABL test parameters &amp; quality</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Experience &amp; Capacity</td>
                    <td className="p-3 text-center font-black text-slate-900">20</td>
                    <td className="p-3">Relevant track record and government supply credentials</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-700">Delivery / Implementation</td>
                    <td className="p-3 text-center font-black text-slate-900">15</td>
                    <td className="p-3">Plan, timeline feasibility, risk management and SLA support</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-700">Presentation / Demonstration, if applicable</td>
                    <td className="p-3 text-center font-black text-slate-900">10</td>
                    <td className="p-3">Demonstrated capability / physical advance sample verification</td>
                  </tr>
                  <tr className="bg-[#0F2A44] text-white font-bold">
                    <td className="p-3 uppercase">TOTAL</td>
                    <td className="p-3 text-center font-black">100</td>
                    <td className="p-3">Commercial / Price evaluated at L1 among technically qualified bidders</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 14 SELECTION & AWARD */}
          <div className="space-y-3">
            <div className="flex items-stretch rounded-lg overflow-hidden shadow-xs">
              <div className="bg-[#C2540A] text-white font-mono font-black text-xs px-3.5 py-2 flex items-center justify-center shrink-0">
                14
              </div>
              <div className="bg-[#0F2A44] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 flex-1 flex items-center">
                SELECTION &amp; AWARD
              </div>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 font-medium">
              <li><strong>Stage 1 — Preliminary responsiveness / eligibility review:</strong> Verification of EMD, legal incorporation, and statutory responsiveness.</li>
              <li><strong>Stage 2 — Technical evaluation:</strong> Scrutiny against published criteria with qualifying threshold (≥ 75%).</li>
              <li><strong>Stage 3 — Presentation / demonstration (if applicable):</strong> Verification of physical sample units and test records.</li>
              <li><strong>Stage 4 — Commercial evaluation:</strong> Opening of financial bids using the stated procurement method [L1 / QCBS].</li>
              <li><strong>Stage 5 — Final ranking, approval and issue:</strong> CFA approval and issue of Letter of Award / Purchase Order / Contract.</li>
              <li className="text-slate-500 italic">Clarifications may be sought only in accordance with applicable procurement rules.</li>
            </ul>
          </div>

          {/* 15 KEY TERMS & CONDITIONS */}
          <div className="space-y-3">
            <div className="flex items-stretch rounded-lg overflow-hidden shadow-xs">
              <div className="bg-[#C2540A] text-white font-mono font-black text-xs px-3.5 py-2 flex items-center justify-center shrink-0">
                15
              </div>
              <div className="bg-[#0F2A44] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 flex-1 flex items-center">
                KEY TERMS &amp; CONDITIONS
              </div>
            </div>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-700 font-medium">
              <li><strong>Payment, taxes and duties:</strong> 100% payment within 30 days of receipt, inspection, and issuance of Final Consignee Receipt (CRAC). All statutory levies included.</li>
              <li><strong>Inspection, testing, acceptance, rejection and replacement:</strong> Pre-dispatch inspection per IS sampling plan. Defective items replaced free of cost within 7 calendar days.</li>
              <li><strong>Warranty / maintenance / service levels:</strong> 24 Months comprehensive on-site OEM warranty.</li>
              <li><strong>Performance security / penalties / liquidated damages:</strong> 5% PBG; Liquidated damages at 0.5% per week of delay (max 10%).</li>
              <li><strong>Confidentiality, intellectual property and data protection:</strong> Standard non-disclosure provisions apply to all technical parameters.</li>
              <li><strong>Subcontracting / assignment:</strong> Prohibited without prior written consent of the CFA.</li>
              <li><strong>Force majeure, termination and dispute resolution:</strong> Standard GeM / Government of India arbitration procedures.</li>
              <li><strong>Integrity, anti-corruption, conflict of interest and non-collusion:</strong> Mandatory compliance with statutory Integrity Pact.</li>
            </ul>
          </div>

          {/* 16 ANNEXURES */}
          <div className="space-y-3">
            <div className="flex items-stretch rounded-lg overflow-hidden shadow-xs">
              <div className="bg-[#C2540A] text-white font-mono font-black text-xs px-3.5 py-2 flex items-center justify-center shrink-0">
                16
              </div>
              <div className="bg-[#0F2A44] text-white font-bold text-xs uppercase tracking-wider px-4 py-2 flex-1 flex items-center">
                ANNEXURES
              </div>
            </div>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0F2A44] text-white font-bold">
                  <tr>
                    <th className="p-3 w-1/4">Annexure</th>
                    <th className="p-3 w-3/4">Content</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Annexure A</td>
                    <td className="p-3">Detailed Technical / Functional Specification &amp; Standards Schedule</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-900">Annexure B</td>
                    <td className="p-3">Bill of Quantities (BOQ) / Price Schedule Format</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Annexure C</td>
                    <td className="p-3">Requirement-by-Requirement Compliance / Conformance Matrix</td>
                  </tr>
                  <tr className="bg-[#F8FAFC]">
                    <td className="p-3 font-bold text-slate-900">Annexure D</td>
                    <td className="p-3">Bid Forms, Manufacturer Authorization Form (MAF) &amp; GFR Declarations</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900">Annexure E</td>
                    <td className="p-3">Performance Security (PBG) &amp; Service Level Agreement (SLA) Schedule</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FINAL AI CHECK BEFORE GENERATION */}
          <div className="p-4 bg-[#FDECE1] border border-[#FBD5BD] rounded-xl text-[#7C2D12] text-xs font-bold leading-relaxed flex items-start gap-3 shadow-2xs">
            <Sparkles size={18} className="text-[#C2540A] shrink-0 mt-0.5" />
            <div>
              <span className="uppercase tracking-wider text-[#C2540A] block font-black">FINAL AI CHECK BEFORE GENERATION</span>
              <p className="text-[11px] text-[#7C2D12] font-medium mt-0.5">
                Verify that every product-specific quantity, specification, standard, certification, date, eligibility threshold, evaluation weight and contractual value is supported by the input or an authoritative source. Flag missing or ambiguous information for human review.
              </p>
            </div>
          </div>

          {/* Signature & Seal Footer */}
          <div className="pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div>
              <p className="font-black text-slate-900 uppercase">Procurement &amp; Standards Directorate</p>
              <p className="text-slate-600 font-medium">Authorized Competent Financial Authority (CFA)</p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">Digitally Signed &amp; Timestamped on 01/09/2026</p>
            </div>

            <div className="p-3 border-2 border-dashed border-emerald-600 rounded-xl bg-emerald-50/50 flex items-center gap-2.5 text-emerald-800">
              <ShieldCheck size={20} className="text-emerald-700" />
              <div className="text-left text-[11px] font-bold leading-tight">
                <span>Official BIS Seal &amp;</span>
                <br />
                <span>Law Compliant</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => {
              const backTarget = routeProcId ? `/procurement/generate-spec/${routeProcId}` : '/procurement/generate-spec';
              navigate(backTarget, { state: { ...location.state, procurementId: routeProcId } });
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Generate Spec</span>
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {isPublished ? (
              <button
                type="button"
                onClick={() => navigate(isQuotationMode ? '/dashboard/tenders' : '/dashboard')}
                className="w-full sm:w-auto px-8 py-3 bg-[#00875a] hover:bg-[#00704a] active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer shrink-0 group"
              >
                {isQuotationMode ? (
                  <>
                    <FileText size={16} className="text-white" />
                    <span>Go to Tenders</span>
                  </>
                ) : (
                  <>
                    <LayoutDashboard size={16} className="text-white" />
                    <span>Go to Dashboard</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="w-full sm:w-auto px-8 py-3 bg-[#00875a] hover:bg-[#00704a] active:scale-98 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-700/20 transition-all cursor-pointer disabled:opacity-80 shrink-0 group"
              >
                {isPublishing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Publishing to Portal...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} className="group-hover:translate-x-0.5 transition-transform" />
                    <span>Publish to Portal</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

      </div>

    </WorkflowShell>
  );
}
