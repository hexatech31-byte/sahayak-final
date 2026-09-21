import React from 'react';
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  FolderOpen,
  UserCircle2,
  Shield,
  LogOut,
  HelpCircle,
  X,
  Search,
  Award,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useVendorAuth } from '../context/VendorAuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/vendor/dashboard', icon: LayoutDashboard },
  { label: 'Tenders', path: '/vendor/tenders', icon: FileText },
  { label: 'Quotations', path: '/vendor/quotations', icon: ClipboardList },
  { label: 'Documents', path: '/vendor/documents', icon: FolderOpen },
  { label: 'Profile', path: '/vendor/profile', icon: UserCircle2 },
  // New "Bid Opportunities" suite — additive, existing items above are untouched.
  { label: 'Bid Opportunities', path: '/vendor/opportunities', icon: Search },
  { label: 'My Bids', path: '/vendor/my-bids', icon: Award },
];


export const VendorSidebar = ({ mobileOpen, onCloseMobile }) => {
  const { pathname: path } = useLocation();
  const navigate = useNavigate();
  const { logout } = useVendorAuth();

  const isActive = (itemPath) =>
    path === itemPath || (itemPath !== '/vendor/dashboard' && path.startsWith(itemPath));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const content = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 shrink-0">
        <Link to="/" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
            <Shield className="w-4.5 h-4.5 fill-white/20 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-extrabold tracking-tight text-slate-900">
              Sahayak
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Vendor Workspace</span>
          </div>
        </Link>
        <button onClick={onCloseMobile} className="lg:hidden p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                onCloseMobile();
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                active
                  ? 'bg-orange-50 text-orange-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-4.5 h-4.5 shrink-0 ${active ? 'text-orange-600' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer utility items */}
      <div className="px-3 py-4 border-t border-slate-200 space-y-1 shrink-0">
        <a
          href="mailto:sih2026@sahayak.in"
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <HelpCircle className="w-4.5 h-4.5 text-slate-400" />
          <span>Help &amp; Support</span>
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-slate-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5 text-slate-400" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-slate-200 bg-white h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-xs" onClick={onCloseMobile} />
          <aside className="relative w-72 max-w-[85%] bg-white h-full shadow-xl animate-in slide-in-from-left duration-200">
            {content}
          </aside>
        </div>
      )}
    </>
  );
};
