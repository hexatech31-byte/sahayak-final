import React, { useState } from 'react';
import { Bell, Menu, ChevronDown, UserCircle2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useVendorAuth } from '../context/VendorAuthContext';
import { useAuth } from '../../context/AuthContext';
import { VENDOR_NOTIFICATIONS } from '../data/mockVendorData';

export const VendorHeader = ({ title, subtitle, onOpenMobileSidebar }) => {
  const navigate = useNavigate();
  const { session, logout } = useVendorAuth();
  const { user, userProfile } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unreadCount = VENDOR_NOTIFICATIONS.filter((n) => !n.read).length;

  const vendorDisplayName = userProfile?.companyName || userProfile?.name || session?.companyName || user?.email?.split('@')[0] || 'Vendor';

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 truncate">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500 hidden sm:block truncate">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen((v) => !v);
                setProfileOpen(false);
              }}
              className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden text-left">
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Notifications</span>
                  <button
                    onClick={() => {
                      navigate('/vendor/notifications');
                      setNotifOpen(false);
                    }}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 cursor-pointer"
                  >
                    View all
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {VENDOR_NOTIFICATIONS.slice(0, 4).map((n) => (
                    <button
                      key={n.id}
                      onClick={() => {
                        if (n.linkPath) navigate(n.linkPath);
                        setNotifOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer flex gap-2.5"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-transparent' : 'bg-orange-600'}`} />
                      <div className="min-w-0">
                        <p className={`text-xs leading-snug ${n.read ? 'text-slate-500' : 'text-slate-800 font-semibold'}`}>{n.title}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{n.timestamp}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile menu */}
          <div className="relative">
            <button
              onClick={() => {
                setProfileOpen((v) => !v);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                {vendorDisplayName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-xs font-semibold text-slate-700 max-w-[140px] truncate">
                {vendorDisplayName}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden py-1.5 text-left">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{vendorDisplayName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    navigate('/vendor/profile');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <UserCircle2 className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
