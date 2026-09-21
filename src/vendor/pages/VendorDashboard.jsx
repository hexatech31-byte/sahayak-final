import React from 'react';
import { Inbox, FileText, ClipboardCheck, AlertTriangle, ArrowRight, UploadCloud, MessageSquare } from 'lucide-react';
import { VendorLayout } from '../components/VendorLayout';
import { StatCard } from '../components/StatCard';
import { TenderCard } from '../components/TenderCard';
import { useVendorAuth } from '../context/VendorAuthContext';
import { useNavigate } from 'react-router-dom';
import { TENDERS, ACTION_REQUIRED_ITEMS, RECENT_ACTIVITY } from '../data/mockVendorData';

const ACTION_ICON = {
  ar1: FileText,
  ar2: UploadCloud,
  ar3: MessageSquare,
};

export const VendorDashboard = () => {
  const { session } = useVendorAuth();
  const navigate = useNavigate();

  const newInvitations = TENDERS.filter((t) => t.status === 'Invitation Received').length;
  const activeTenders = TENDERS.filter((t) => t.status !== 'Closed').length + 3; // demo padding to match spec numbers
  const quotationsSubmitted = 4;
  const actionRequiredCount = ACTION_REQUIRED_ITEMS.length;

  return (
    <VendorLayout
      title={`Welcome back, ${session?.companyName ?? 'Vendor'}`}
      subtitle="Manage your tender invitations, compliance responses and quotations."
    >
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8">
        <StatCard label="New Invitations" value={newInvitations || 3} icon={Inbox} tone="orange" />
        <StatCard label="Active Tenders" value={activeTenders} icon={FileText} tone="emerald" />
        <StatCard label="Quotation Submitted" value={quotationsSubmitted} icon={ClipboardCheck} tone="slate" />
        <StatCard label="Action Required" value={actionRequiredCount} icon={AlertTriangle} tone="amber" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* New Tender Invitations */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">New Tender Invitations</h2>
            <button
              onClick={() => navigate('/vendor/tenders')}
              className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-4">
            {TENDERS.map((t) => (
              <TenderCard key={t.id} tender={t} />
            ))}
          </div>
        </div>

        {/* Right column: Action Required + Recent Activity */}
        <div className="space-y-6">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-4">Action Required</h2>
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              {ACTION_REQUIRED_ITEMS.map((item) => {
                const Icon = ACTION_ICON[item.id] ?? ClipboardCheck;
                return (
                  <div key={item.id} className="p-4 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-800">{item.action}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate">{item.context}</p>
                      <button
                        onClick={() =>
                          navigate(
                            item.tenderId
                              ? `/vendor/tenders/${item.tenderId}`
                              : item.quotationId
                              ? `/vendor/quotations/${item.quotationId}`
                              : '/vendor/tenders'
                          )
                        }
                        className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                      >
                        <span>{item.cta}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-4">Recent Activity</h2>
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              {RECENT_ACTIVITY.map((a) => (
                <div key={a.id} className="p-4">
                  <p className="text-xs text-slate-700">{a.text}</p>
                  <p className="text-[10px] text-slate-400 mt-1">{a.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
};
