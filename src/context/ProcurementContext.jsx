import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_TENDERS,
  INITIAL_STANDARDS,
  INITIAL_VENDORS,
  INITIAL_QUOTATIONS,
  INITIAL_EVALUATIONS,
  INITIAL_APPROVALS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS
} from '../data/mockProcurementData';


const ProcurementContext = createContext(undefined);

const STORAGE_KEYS = {
  TENDERS: 'standardai_procurement_tenders_v3',
  STANDARDS: 'standardai_procurement_standards_v3',
  VENDORS: 'standardai_procurement_vendors_v3',
  QUOTATIONS: 'standardai_procurement_quotations_v3',
  EVALUATIONS: 'standardai_procurement_evaluations_v3',
  APPROVALS: 'standardai_procurement_approvals_v3',
  NOTIFICATIONS: 'standardai_procurement_notifications_v3',
  SETTINGS: 'standardai_procurement_settings_v3'
};

export const ProcurementProvider = ({ children }) => {
  // Load Initial or Persisted State from LocalStorage
  const [tenders, setTenders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TENDERS);
      return saved ? JSON.parse(saved) : INITIAL_TENDERS;
    } catch {
      return INITIAL_TENDERS;
    }
  });

  const [standards, setStandards] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STANDARDS);
      return saved ? JSON.parse(saved) : INITIAL_STANDARDS;
    } catch {
      return INITIAL_STANDARDS;
    }
  });

  const [vendors, setVendors] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.VENDORS);
      return saved ? JSON.parse(saved) : INITIAL_VENDORS;
    } catch {
      return INITIAL_VENDORS;
    }
  });

  const [quotations, setQuotations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUOTATIONS);
      return saved ? JSON.parse(saved) : INITIAL_QUOTATIONS;
    } catch {
      return INITIAL_QUOTATIONS;
    }
  });

  const [evaluations, setEvaluations] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVALUATIONS);
      return saved ? JSON.parse(saved) : INITIAL_EVALUATIONS;
    } catch {
      return INITIAL_EVALUATIONS;
    }
  });

  const [approvals, setApprovals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPROVALS);
      return saved ? JSON.parse(saved) : INITIAL_APPROVALS;
    } catch {
      return INITIAL_APPROVALS;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const [toasts, setToasts] = useState([]);

  // LocalStorage Synchronization Effects
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.TENDERS, JSON.stringify(tenders)); } catch {}
  }, [tenders]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.STANDARDS, JSON.stringify(standards)); } catch {}
  }, [standards]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors)); } catch {}
  }, [vendors]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.QUOTATIONS, JSON.stringify(quotations)); } catch {}
  }, [quotations]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.EVALUATIONS, JSON.stringify(evaluations)); } catch {}
  }, [evaluations]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.APPROVALS, JSON.stringify(approvals)); } catch {}
  }, [approvals]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)); } catch {}
  }, [notifications]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings)); } catch {}
  }, [settings]);

  // Toast System
  const addToast = (title, message, type = 'success') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Helper Category-to-Standards Mapper
  const getStandardsForCategory = (category) => {
    switch (category) {
      case 'IT Hardware':
        return {
          codes: ['IS 13252 (Part 1) : 2010', 'IS 14896 : 2000'],
          primary: 'IS 13252 (Part 1) : 2010',
          recommendations: [
            {
              code: 'IS 13252 (Part 1) : 2010',
              title: 'Information Technology Equipment — Safety Requirements',
              score: 99.4,
              reason: 'Mandatory under MeitY Compulsory Registration Scheme (CRS Schedule II).',
              qcoStatus: 'Mandatory QCO in Force',
              testMethod: 'Dielectric Voltage Withstand & Heat Resistance Test'
            },
            {
              code: 'IS 14896 : 2000',
              title: 'Electronic Computing Equipment & Terminals',
              score: 96.8,
              reason: 'Recommended for government office compute reliability and emissions standard.',
              qcoStatus: 'BIS Recommended',
              testMethod: 'EMI/EMC Radiation Limits per CISPR 22'
            }
          ]
        };
      case 'Solar & Renewable':
        return {
          codes: ['IS 14286 : 2010', 'IS/IEC 61730-1/2 : 2004'],
          primary: 'IS 14286 : 2010',
          recommendations: [
            {
              code: 'IS 14286 : 2010',
              title: 'Crystalline Silicon Terrestrial Photovoltaic (PV) Modules',
              score: 99.8,
              reason: 'Mandatory under MNRE ALMM List-I and Solar PV Quality Control Order.',
              qcoStatus: 'Mandatory MNRE Order',
              testMethod: 'Thermal Cycling, Damp Heat & Mechanical Load Testing'
            }
          ]
        };
      case 'PPE & Safety':
        return {
          codes: ['IS 2925 : 1984', 'IS 3521 : 2021'],
          primary: 'IS 2925 : 1984',
          recommendations: [
            {
              code: 'IS 2925 : 1984',
              title: 'Specification for Industrial Safety Helmets',
              score: 100,
              reason: 'Mandatory ISI mark required under Protective Equipment Quality Control Order.',
              qcoStatus: 'Mandatory ISI Mark',
              testMethod: 'Shock Absorption & Penetration Resistance Test'
            }
          ]
        };
      case 'Food Safety':
        return {
          codes: ['IS 2491 : 2013', 'IS 16067 : 2013'],
          primary: 'IS 2491 : 2013',
          recommendations: [
            {
              code: 'IS 2491 : 2013',
              title: 'Food Hygiene — General Principles — Code of Practice',
              score: 99.4,
              reason: 'Mandatory BIS / FSSAI standard for food hygiene, safety and quality assurance.',
              qcoStatus: 'Mandatory QCO in Force',
              testMethod: 'Microbiological Analysis & HACCP Quality Certification'
            }
          ]
        };
      case 'Electrical':
        return {
          codes: ['IS 13118 : 1991', 'IS 694 : 2010', 'IS 1554 (Part 1) : 1988'],
          primary: 'IS 13118 : 1991',
          recommendations: [
            {
              code: 'IS 13118 : 1991',
              title: 'High-Voltage Alternating-Current Circuit-Breakers',
              score: 99.6,
              reason: 'Ministry of Power mandatory specification for high voltage distribution panels.',
              qcoStatus: 'Mandatory Central Order',
              testMethod: 'CPRI / ERDA Short-time Current & Dielectric Type Test'
            }
          ]
        };
      case 'Construction Materials':
        return {
          codes: ['IS 1489 (Part 1) : 2015', 'IS 1786 : 2008'],
          primary: 'IS 1489 (Part 1) : 2015',
          recommendations: [
            {
              code: 'IS 1489 (Part 1) : 2015',
              title: 'Portland Pozzolana Cement — Specification (Fly Ash Based)',
              score: 100,
              reason: 'Mandatory BIS Quality Control Order under Ministry of Commerce & Industry.',
              qcoStatus: 'Mandatory ISI Mark',
              testMethod: '28-Day Compressive Strength & Fineness Test'
            }
          ]
        };
      default:
        return {
          codes: ['IS 8472 : 2019'],
          primary: 'IS 8472 : 2019',
          recommendations: [
            {
              code: 'IS 8472 : 2019',
              title: 'Pumps — Regenerative Pumpsets for Clear, Cold Water',
              score: 98.4,
              reason: 'Mandatory Bureau of Energy Efficiency (BEE) & BIS certification.',
              qcoStatus: 'BEE Star & BIS Mandatory',
              testMethod: 'Hydrostatic Pressure & Pump Efficiency Benchmark'
            }
          ]
        };
    }
  };

  // 1. Create Tender Action
  const createTender = (data) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `GEM/2026/B/${randomSuffix}`;
    const budgetRaw = parseFloat(data.budget.replace(/[^0-9.]/g, '')) || 5000000;
    const stdInfo = getStandardsForCategory(data.category);

    const newTender = {
      id: newId,
      title: data.title,
      department: data.department,
      category: data.category,
      standardCodes: stdInfo.codes,
      primaryStandard: stdInfo.primary,
      budget: data.budget.startsWith('₹') ? data.budget : `₹ ${data.budget}`,
      budgetValue: budgetRaw,
      status: 'Tender Published',
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      deadline: data.deadline || '25 Sep 2026',
      quotesCount: 0,
      complianceScore: 99,
      description: data.description || `Procurement of ${data.title} conforming to mandatory Indian Standards and GFR Rule 144(i).`,
      aiRecommendations: stdInfo.recommendations,
      checklist: [
        { item: 'BIS Standard identified & validated', checked: true },
        { item: 'Applicable QCO regulation identified', checked: true },
        { item: 'NABL Accredited Lab Testing Method attached', checked: true },
        { item: 'GFR 144(i) Land Border Declaration clause included', checked: true }
      ],
      clauses: [
        `Mandatory compliance to ${stdInfo.primary} with valid BIS License / CRS Registration.`,
        'GFR Rule 144(i) Compliance: Bidders from sharing land border countries must possess valid DPIIT approval.',
        'OEM Direct Authorization with dedicated local support center warranty.'
      ]
    };

    setTenders(prev => [newTender, ...prev]);

    // Add Notification
    setNotifications(prev => [
      {
        id: `NOTIF-${Date.now()}`,
        title: 'New Tender Published',
        desc: `Tender ${newId} (${data.title}) was drafted and set to AI Ready.`,
        time: 'Just now',
        type: 'info',
        read: false,
        route: `/tenders/${newId.replace(/\//g, '-')}`
      },
      ...prev
    ]);

    addToast('Tender Created Successfully!', `Generated ${newId} with auto-assigned standards (${stdInfo.primary}).`, 'success');
    return newId;
  };

  // 2. Update Tender
  const updateTender = (id, updates) => {
    setTenders(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    addToast('Tender Updated', `Changes to ${id} have been saved successfully.`, 'info');
  };

  // 3. Duplicate Tender
  const duplicateTender = (id) => {
    const orig = tenders.find(t => t.id === id);
    if (!orig) return;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newId = `GEM/2026/B/${randomSuffix}`;
    const duplicated = {
      ...orig,
      id: newId,
      title: `${orig.title} (Copy)`,
      createdDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Draft',
      quotesCount: 0
    };
    setTenders(prev => [duplicated, ...prev]);
    addToast('Tender Duplicated', `Created duplicate copy ${newId} in Draft status.`, 'success');
  };

  // 4. Delete Tender
  const deleteTender = (id) => {
    setTenders(prev => prev.filter(t => t.id !== id));
    addToast('Tender Deleted', `Tender ${id} was removed from the active registry.`, 'warning');
  };

  // 5. Select L1 Quotation
  const selectL1Quotation = (tenderId, quotationId) => {
    setQuotations(prev =>
      prev.map(q => {
        if (q.tenderId === tenderId) {
          return q.id === quotationId ? { ...q, status: 'Selected L1' } : { ...q, status: 'Submitted' };
        }
        return q;
      })
    );

    const selectedQ = quotations.find(q => q.id === quotationId);
    setTenders(prev =>
      prev.map(t => (t.id === tenderId ? { ...t, status: 'Awaiting Approval' } : t))
    );

    // Add or update Approval Queue
    if (selectedQ) {
      const existingApp = approvals.find(a => a.tenderId === tenderId);
      if (!existingApp) {
        setApprovals(prev => [
          {
            id: `APP-${Date.now().toString().slice(-4)}`,
            ref: `SANCTION/${tenderId.split('/').pop()}`,
            tenderId: tenderId,
            tenderName: `Award of ${selectedQ.tenderTitle} to ${selectedQ.vendorName}`,
            department: tenders.find(t => t.id === tenderId)?.department || 'Central Procurement',
            budget: selectedQ.bidAmount,
            evaluationScore: selectedQ.overallScore,
            recommendedVendor: selectedQ.vendorName,
            status: 'Pending',
            submittedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            priority: 'HIGH',
            remarks: `L1 quotation approved by evaluation committee (${selectedQ.bidAmount}).`
          },
          ...prev
        ]);
      }
    }

    addToast('L1 Bidder Selected!', `Tender ${tenderId} has been forwarded to the Approvals queue.`, 'success');
  };

  // 6. Reject Quotation
  const rejectQuotation = (quotationId) => {
    setQuotations(prev => prev.map(q => (q.id === quotationId ? { ...q, status: 'Rejected' } : q)));
    addToast('Quotation Disqualified', 'Bid was rejected for non-compliance with specifications.', 'warning');
  };

  // 7. Verify / Suspend Vendor
  const verifyVendor = (vendorId) => {
    setVendors(prev => prev.map(v => (v.id === vendorId ? { ...v, status: 'Verified' } : v)));
    addToast('Vendor Verified', 'BIS license and GSTIN verified against National Portal.', 'success');
  };

  const suspendVendor = (vendorId) => {
    setVendors(prev => prev.map(v => (v.id === vendorId ? { ...v, status: 'Suspended' } : v)));
    addToast('Vendor Suspended', 'Vendor has been restricted from participating in active bids.', 'error');
  };

  // 8. Evaluation Actions
  const approveEvaluation = (evalId) => {
    setEvaluations(prev => prev.map(e => (e.id === evalId ? { ...e, status: 'Evaluated' } : e)));
    const ev = evaluations.find(e => e.id === evalId);
    if (ev) {
      setTenders(prev => prev.map(t => (t.id === ev.tenderId ? { ...t, status: 'Awaiting Approval' } : t)));
    }
    addToast('Evaluation Approved', 'Technical scorecards confirmed; tender pushed to final sanction.', 'success');
  };

  const requestEvaluationClarification = (evalId) => {
    setEvaluations(prev => prev.map(e => (e.id === evalId ? { ...e, status: 'Clarification Requested' } : e)));
    addToast('Clarification Requested', 'Notification dispatched to bidders for compliance documentation.', 'info');
  };

  // 9. Approval Actions
  const approveApproval = (approvalId) => {
    setApprovals(prev => prev.map(a => (a.id === approvalId ? { ...a, status: 'Approved' } : a)));
    const app = approvals.find(a => a.id === approvalId);
    if (app) {
      setTenders(prev => prev.map(t => (t.id === app.tenderId ? { ...t, status: 'Approved' } : t)));
    }
    addToast('Sanction Approved with DSC!', 'Digitally signed with NIC e-Sign certificate. Work order ready.', 'success');
  };

  const rejectApproval = (approvalId) => {
    setApprovals(prev => prev.map(a => (a.id === approvalId ? { ...a, status: 'Rejected' } : a)));
    addToast('Sanction Rejected', 'Tender recommendation sent back for committee re-audit.', 'error');
  };

  const requestApprovalClarification = (approvalId) => {
    setApprovals(prev => prev.map(a => (a.id === approvalId ? { ...a, status: 'Clarification Required' } : a)));
    addToast('Clarification Sent', 'Officer query logged in audit trail.', 'info');
  };

  // 10. Standards & Notifications
  const attachStandardInTender = (standardCode, tenderId) => {
    if (tenderId) {
      setTenders(prev =>
        prev.map(t => {
          if (t.id === tenderId && !t.standardCodes.includes(standardCode)) {
            return { ...t, standardCodes: [...t.standardCodes, standardCode] };
          }
          return t;
        })
      );
      addToast('Standard Attached', `Attached ${standardCode} to tender ${tenderId}.`, 'success');
    } else {
      addToast('Standard Selected', `${standardCode} copied to active clipboard for tender attachment.`, 'info');
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    addToast('Alerts Cleared', 'All unread notifications marked as read.', 'info');
  };

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    addToast('Settings Saved', 'Workspace configurations and security credentials updated.', 'success');
  };

  const resetAllData = () => {
    setTenders(INITIAL_TENDERS);
    setStandards(INITIAL_STANDARDS);
    setVendors(INITIAL_VENDORS);
    setQuotations(INITIAL_QUOTATIONS);
    setEvaluations(INITIAL_EVALUATIONS);
    setApprovals(INITIAL_APPROVALS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);
    try { localStorage.clear(); } catch {}
    addToast('Prototype Reset', 'Reloaded default government procurement mock database.', 'info');
  };

  return (
    <ProcurementContext.Provider
      value={{
        tenders,
        standards,
        vendors,
        quotations,
        evaluations,
        approvals,
        notifications,
        settings,
        toasts,
        addToast,
        removeToast,
        createTender,
        updateTender,
        duplicateTender,
        deleteTender,
        selectL1Quotation,
        rejectQuotation,
        verifyVendor,
        suspendVendor,
        approveEvaluation,
        requestEvaluationClarification,
        approveApproval,
        rejectApproval,
        requestApprovalClarification,
        attachStandardInTender,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        updateSettings,
        resetAllData
      }}
    >
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurement = () => {
  const context = useContext(ProcurementContext);
  if (!context) {
    throw new Error('useProcurement must be used within a ProcurementProvider');
  }
  return context;
};
