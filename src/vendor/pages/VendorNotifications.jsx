import React, { useState } from 'react';
import { Bell, FileText, MessageSquareWarning, Clock, FileCheck2, ClipboardCheck, Trophy } from 'lucide-react';
import { VendorLayout } from '../components/VendorLayout';
import { VENDOR_NOTIFICATIONS } from '../data/mockVendorData';
import { useNavigate } from 'react-router-dom';

function iconFor(title) {
  if (title.toLowerCase().includes('invitation')) return FileText;
  if (title.toLowerCase().includes('clarification')) return MessageSquareWarning;
  if (title.toLowerCase().includes('deadline')) return Clock;
  if (title.toLowerCase().includes('verif')) return FileCheck2;
  if (title.toLowerCase().includes('submitted')) return ClipboardCheck;
  if (title.toLowerCase().includes('result')) return Trophy;
  return Bell;
}

export const VendorNotifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(VENDOR_NOTIFICATIONS);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const handleClick = (n) => {
    setNotifications((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    if (n.linkPath) navigate(n.linkPath);
  };

  return (
    <VendorLayout title="Notifications" subtitle="Stay updated on tenders, clarifications and quotation status.">
      <div className="flex items-center justify-end mb-4">
        <button onClick={markAllRead} className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer">
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {notifications.map((n) => {
          const Icon = iconFor(n.title);
          return (
            <button
              key={n.id}
              onClick={() => handleClick(n)}
              className={`w-full text-left p-4 sm:p-5 flex items-start gap-3.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                !n.read ? 'bg-orange-50/40' : ''
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${n.read ? 'bg-slate-100 text-slate-400' : 'bg-orange-100 text-orange-600'}`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-sm ${n.read ? 'text-slate-600' : 'text-slate-900 font-bold'}`}>{n.title}</p>
                <p className="text-[11px] text-slate-400 mt-1">{n.timestamp}</p>
              </div>
              {!n.read && <span className="w-2 h-2 rounded-full bg-orange-600 mt-1.5 shrink-0" />}
            </button>
          );
        })}
      </div>
    </VendorLayout>
  );
};
