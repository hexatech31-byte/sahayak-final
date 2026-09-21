import { 
  PipelineProgressStepper,
  BudgetGaugeBar,
  HorizontalPriceMatrix, 
  SpendDonutChart, 
  MonthlyBarChart, 
  ProcessingTimeLineChart, 
  AuditTimelineTree, 
  VendorRatingScorecard 
} from './components/DashboardVisuals';
import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useNavigate, useLocation, useParams, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Bookmark, 
  Users, 
  Receipt, 
  FileSpreadsheet, 
  CheckCircle, 
  BarChart3, 
  Settings, 
  Plus, 
  Bell, 
  ChevronRight, 
  X, 
  ShieldCheck, 
  Search, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Shield, 
  AlertCircle, 
  Check, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  RefreshCw, 
  Layers, 
  ArrowLeft,
  LogOut,
  Home,
  ChevronDown,
  ChevronLeft,
  MessageSquare,
  Monitor,
  ExternalLink,
  MousePointerClick,
  HelpCircle
} from 'lucide-react';
import { ProcurementProvider, useProcurement } from './context/ProcurementContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OfficerProtectedRoute } from './components/OfficerProtectedRoute';
import { LandingPage } from './components/LandingPage';
import { InputModePage } from './components/InputModePage';
import { SahayakAIPage } from './components/SahayakAIPage';
import { TextSpecificationPage } from './components/TextSpecificationPage';
import { UploadDocumentPage } from './components/UploadDocumentPage';
import { QuotationTenderPage } from './components/QuotationTenderPage';
import { AIProcessingPage } from './components/AIProcessingPage';
import { ProcessingCompletePage } from './components/ProcessingCompletePage';
import { AnalysisOutputPage } from './components/AnalysisOutputPage';
import { UnderstandRequirementPage } from './components/UnderstandRequirementPage';
import { GenerateSpecPage } from './components/GenerateSpecPage';
import { PublishTenderPage } from './components/PublishTenderPage';
import { getOfficerProcurements } from './services/procurementService';
import { VendorAuthProvider } from './vendor/context/VendorAuthContext';
import { VendorProtectedRoute } from './vendor/VendorProtectedRoute';
import { VendorDashboard } from './vendor/pages/VendorDashboard';
import { VendorTenders } from './vendor/pages/VendorTenders';
import { VendorTenderDetails } from './vendor/pages/VendorTenderDetails';
import { VendorQuotations } from './vendor/pages/VendorQuotations';
import { VendorQuotationDetails } from './vendor/pages/VendorQuotationDetails';
import { VendorQuotationSubmit } from './vendor/pages/VendorQuotationSubmit';
import { VendorDocuments } from './vendor/pages/VendorDocuments';
import { VendorProfile } from './vendor/pages/VendorProfile';
import { VendorNotifications } from './vendor/pages/VendorNotifications';
import { VendorComplianceResponse } from './vendor/pages/VendorComplianceResponse';
import { VendorOpportunities } from './vendor/pages/VendorOpportunities';
import { VendorOpportunityDetail } from './vendor/pages/VendorOpportunityDetail';
import { VendorMyBids } from './vendor/pages/VendorMyBids';

// ==========================================
// 1. MAIN LAYOUT & NAVIGATION WRAPPER
// ==========================================
export function DashboardLayout() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile, logout } = useAuth();
  const isProcurementRoute = location.pathname === '/' || location.pathname.startsWith('/procurement');

  const { notifications, markAllNotificationsAsRead, markNotificationAsRead, toasts, removeToast } = useProcurement();

  const [officerProcurements, setOfficerProcurements] = useState([]);

  useEffect(() => {
    let isMounted = true;
    if (user?.uid) {
      getOfficerProcurements(user.uid)
        .then((docs) => {
          if (isMounted) setOfficerProcurements(docs);
        })
        .catch((err) => console.warn('Could not load procurements for sidebar badge:', err));
    }
    return () => { isMounted = false; };
  }, [user?.uid, location.pathname]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  const activeTendersBadge = officerProcurements.length > 0 ? String(officerProcurements.length) : undefined;
  const pendingApprovalsBadge = officerProcurements.filter(p => p.status === 'awaiting_review' || p.status === 'in_progress').length > 0 
    ? String(officerProcurements.filter(p => p.status === 'awaiting_review' || p.status === 'in_progress').length)
    : undefined;

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-orange-600 selection:text-white overflow-hidden">
      
      {/* Toast Notification Container (Top-Right Floating) */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl shadow-xl border flex items-start gap-3 transform transition-all duration-300 animate-in slide-in-from-top-4 ${
              toast.type === 'success' ? 'bg-white border-emerald-200 text-slate-800 border-l-4 border-l-emerald-600' :
              toast.type === 'warning' ? 'bg-white border-amber-200 text-slate-800 border-l-4 border-l-amber-500' :
              toast.type === 'error' ? 'bg-white border-red-200 text-slate-800 border-l-4 border-l-red-600' :
              'bg-white border-blue-200 text-slate-800 border-l-4 border-l-blue-600'
            }`}
          >
            <div className="mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
              {toast.type === 'info' && <Sparkles className="w-5 h-5 text-blue-600" />}
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-xs font-bold text-slate-900 leading-snug">{toast.title}</h4>
              {toast.message && <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* ── Top Header (Full Width: Edge-to-Edge from Extreme Left to Extreme Right) ── */}
      <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-8 flex items-center justify-between relative shrink-0 shadow-xs z-30">
        {/* Left: Sidebar Toggle + Sahayak Logo & Workspace Tag */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Collapse/Expand Toggle Button */}
          <button
            type="button"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isSidebarCollapsed ? (
              <ChevronRight size={20} className="stroke-[2.2]" />
            ) : (
              <ChevronLeft size={20} className="stroke-[2.2]" />
            )}
          </button>

          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-orange-600/20 group-hover:scale-105 transition-transform shrink-0">
              <Shield className="w-5 h-5 fill-white/20 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 leading-tight tracking-tight text-base group-hover:text-orange-600 transition-colors">
                Sahayak
              </h1>
              <span className="text-[10px] tracking-wider text-slate-400 font-bold uppercase block">
                GOVERNMENT WORKSPACE
              </span>
            </div>
          </div>
        </div>

        {/* Right: Officer Profile & Notifications */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Officer Profile Badge */}
          <div 
            onClick={() => navigate('/dashboard/settings')}
            className="hidden sm:flex items-center gap-2.5 pl-2.5 pr-3 py-1 rounded-xl bg-slate-50 border border-slate-200/90 hover:bg-slate-100 transition-colors cursor-pointer group"
            title="View Officer Profile & Settings"
          >
            <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
              {(userProfile?.name || user?.email || 'O').charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col text-left min-w-0 max-w-[160px]">
              <span className="text-xs font-bold text-slate-900 leading-tight truncate group-hover:text-orange-600 transition-colors">
                {userProfile?.name || user?.email?.split('@')[0] || 'Officer'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium leading-none truncate">
                {userProfile?.ministry || 'Government Officer'}
              </span>
            </div>
          </div>

          {/* Notifications Toggle */}
          <div className="relative">
            <button 
              type="button"
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} 
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-orange-600 border-2 border-white rounded-full"></span>
              )}
            </button>

            {/* Notification Overlay Menu */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 text-left">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-slate-900 text-sm">System Alerts</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">
                      {unreadCount} new
                    </span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => markAllNotificationsAsRead()}
                    className="text-[11px] font-bold text-orange-600 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="space-y-2.5 max-h-80 overflow-y-auto">
                  {notifications.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => {
                        markNotificationAsRead(item.id);
                        if (item.route) navigate(item.route);
                        setIsNotificationsOpen(false);
                      }}
                      className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                        item.read ? 'bg-white border-slate-100 hover:bg-slate-50' : 'bg-orange-50/50 border-orange-100 hover:bg-orange-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-xs text-slate-900">{item.title}</p>
                        <span className="text-[10px] text-slate-400 font-medium">{item.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-snug">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Content Area: Sidebar on Left, Main View on Right (Below Header) ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar (Below Top Header) - Fully Collapsible with Smooth Animation */}
        <aside 
          className={`bg-white border-slate-200 flex flex-col justify-between shrink-0 shadow-xs z-20 overflow-y-auto transition-all duration-300 ease-in-out ${
            isSidebarCollapsed 
              ? 'w-0 p-0 border-r-0 opacity-0 pointer-events-none' 
              : 'w-64 border-r p-4 opacity-100'
          }`}
        >
          <div className="w-56">
            <div className="flex items-center justify-between px-2 mb-3 pt-1">
              <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                NAVIGATION
              </span>
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft size={16} />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              <SidebarItem to="/home" icon={<Home size={18} />} label="Home" end />
              <SidebarItem to="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" end />
              <SidebarItem to="/sahayak-ai" icon={<MessageSquare size={18} />} label="Sahayak AI" end />
              <SidebarItem to="/dashboard/tenders" icon={<FileText size={18} />} label="Tenders" badge={activeTendersBadge} />
              <SidebarItem to="/dashboard/standards" icon={<Bookmark size={18} />} label="Standards" />
              <SidebarItem to="/dashboard/vendors" icon={<Users size={18} />} label="Vendors" />
              <SidebarItem to="/dashboard/quotations" icon={<Receipt size={18} />} label="Quotations" />
              <SidebarItem to="/dashboard/evaluation" icon={<FileSpreadsheet size={18} />} label="Evaluation" />
              <SidebarItem to="/dashboard/approvals" icon={<CheckCircle size={18} />} label="Approvals" badge={pendingApprovalsBadge} />
              <SidebarItem to="/dashboard/analytics" icon={<BarChart3 size={18} />} label="Analytics" />
              <SidebarItem to="/dashboard/settings" icon={<Settings size={18} />} label="Settings" />
            </nav>
          </div>

          {/* Sidebar Footer — Help & Support + Logout */}
          <div className="w-56 rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden mt-auto pt-0">
            {/* Help & Support row */}
            <button
              type="button"
              onClick={() => navigate('/dashboard/help')}
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-left"
            >
              <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <span className="text-orange-500 font-black text-base leading-none">?</span>
              </div>
              <span className="flex-1 text-sm font-bold text-slate-800">Help &amp; Support</span>
              <ChevronRight size={16} className="text-slate-400 shrink-0" />
            </button>

            {/* Divider */}
            <div className="h-px bg-slate-100 mx-0" />

            {/* Logout button */}
            <div className="p-3">
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="w-full py-2.5 px-4 bg-orange-50 hover:bg-orange-100 text-orange-600 hover:text-orange-700 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Dynamic Route Content (Swaps Out via <Outlet />) - Automatically expands to 100% width */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-50 transition-all duration-300 ease-in-out">
          <Outlet />
        </main>
      </div>

      {/* Modal Overlay Component */}
      {isCreateModalOpen && <CreateTenderModal onClose={() => setIsCreateModalOpen(false)} />}
    </div>
  );
}

// Sidebar NavLink Helper
function SidebarItem({ to, icon, label, badge, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
          isActive
            ? 'bg-orange-50 text-orange-600 font-bold border-l-4 border-orange-500 shadow-xs'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-700'
        }`
      }
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      {badge && (
        <span className="ml-auto bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">
          {badge}
        </span>
      )}
    </NavLink>
  );
}

// ==========================================
// 2. FEATURE-SPECIFIC PAGE COMPONENTS
// ==========================================

// DASHBOARD HOME VIEW (/)
export function DashboardHome() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();

  const [realProcurements, setRealProcurements] = useState([]);
  const [loadingProcurements, setLoadingProcurements] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (user?.uid) {
      setLoadingProcurements(true);
      getOfficerProcurements(user.uid)
        .then((docs) => {
          if (isMounted) {
            setRealProcurements(docs);
            setLoadingProcurements(false);
          }
        })
        .catch((err) => {
          console.error("Error fetching officer procurements:", err);
          if (isMounted) setLoadingProcurements(false);
        });
    } else {
      setLoadingProcurements(false);
    }
    return () => { isMounted = false; };
  }, [user?.uid]);

  const activeProcurementsCount = useMemo(() => realProcurements.filter(p => p.status !== 'closed').length, [realProcurements]);
  const inProgressCount = useMemo(() => realProcurements.filter(p => p.status === 'in_progress' || p.status === 'awaiting_review').length, [realProcurements]);
  const publishedCount = useMemo(() => realProcurements.filter(p => p.status === 'published' || p.currentStage === 'bidding').length, [realProcurements]);

  const officerDisplayName = userProfile?.name || user?.displayName || user?.email?.split('@')[0] || 'Officer';
  const officerMinistryDisplay = userProfile?.ministry || 'National Procurement & Standards Division';

  const getStageRoute = (proc) => {
    const stage = proc.currentStage || 'input';
    if (stage === 'understand') return `/procurement/understand/${proc.id}`;
    if (stage === 'processing') return `/procurement/processing/${proc.id}`;
    if (stage === 'analysis') return `/procurement/output/${proc.id}`;
    if (stage === 'specification') return `/procurement/generate-spec/${proc.id}`;
    if (stage === 'publishing' || stage === 'bidding') return `/procurement/publish-tender/${proc.id}`;
    return `/procurement/understand/${proc.id}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in text-left">
      {/* Welcome Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Good Morning, {officerDisplayName}
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            <span className="font-semibold text-slate-700">{officerMinistryDisplay}</span>
            {' · '}
            <span className="text-slate-500">{user?.email}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/procurement')}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-md shadow-orange-600/20 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Procurement</span>
        </button>
      </div>

      {/* 3 Top Operational Metric Cards (Calculated directly from Firestore) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          onClick={() => navigate('/dashboard/tenders')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">{activeProcurementsCount}</span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
          </div>
          <p className="text-slate-500 text-xs font-semibold mt-2">Active Procurements</p>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-flex items-center gap-1">
            <ArrowUpRight size={13} /> View all officer procurements →
          </span>
        </div>

        <div 
          onClick={() => navigate('/dashboard/tenders')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">{inProgressCount}</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock size={20} />
            </div>
          </div>
          <p className="text-slate-500 text-xs font-semibold mt-2">In Progress / Review</p>
          <span className="text-[11px] font-bold text-amber-600 mt-1 inline-flex items-center gap-1">
            <AlertCircle size={13} /> Active workflow pipelines →
          </span>
        </div>

        <div 
          onClick={() => navigate('/dashboard/tenders')}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xl sm:text-4xl font-black text-slate-900">{publishedCount}</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
          </div>
          <p className="text-slate-500 text-xs font-semibold mt-2">Published Tenders</p>
          <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-flex items-center gap-1">
            <CheckCircle2 size={13} /> Live tenders on GeM register →
          </span>
        </div>
      </div>

      {/* Recent Officer Procurements Section (Connected Exclusively to Firestore) */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base">
              My Procurements (Firestore)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Persistent procurement lifecycle records in your officer workspace.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => navigate('/dashboard/tenders')}
            className="text-orange-600 hover:text-orange-700 text-xs font-bold flex items-center gap-1 cursor-pointer hover:underline"
          >
            <span>View All</span>
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          {loadingProcurements ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-3 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-bold text-slate-600">Loading your procurements from Firestore...</p>
            </div>
          ) : realProcurements.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6 w-[32%]">Procurement Title</th>
                  <th className="py-3.5 px-4 w-[18%]">Input Mode</th>
                  <th className="py-3.5 px-4 w-[16%]">Current Stage</th>
                  <th className="py-3.5 px-4 w-[14%]">Status</th>
                  <th className="py-3.5 px-4 w-[10%] text-center">Created</th>
                  <th className="py-3.5 px-6 w-[10%] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {realProcurements.map((proc) => (
                  <tr key={proc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6">
                      <p 
                        onClick={() => navigate(getStageRoute(proc))}
                        className="font-bold text-slate-900 text-sm hover:text-orange-600 cursor-pointer transition-colors"
                      >
                        {proc.title || 'Untitled Procurement'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-mono">{proc.id}</p>
                    </td>

                    <td className="py-4 px-4 text-slate-700">
                      <span className="capitalize font-semibold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {proc.inputMode || 'text'} Mode
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/80 text-[11px] capitalize">
                        {proc.currentStage || 'input'}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-block font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 text-[11px] capitalize">
                        {proc.status || 'in_progress'}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-center font-mono text-slate-600">
                      {proc.createdAt?.toDate ? proc.createdAt.toDate().toLocaleDateString('en-GB') : 'Just now'}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button 
                        type="button"
                        onClick={() => navigate(getStageRoute(proc))}
                        className="text-orange-600 hover:text-orange-700 font-bold hover:underline cursor-pointer whitespace-nowrap"
                      >
                        Resume →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
              <p className="text-sm font-semibold text-slate-700">No procurements found</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">You have not created any procurement records in Firestore yet.</p>
              <button
                type="button"
                onClick={() => navigate('/procurement')}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2 cursor-pointer transition-all"
              >
                <Plus size={15} />
                <span>Start New Procurement</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 1. TENDERS VIEW (/dashboard/tenders)
export function TendersPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [realProcurements, setRealProcurements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (user?.uid) {
      setLoading(true);
      getOfficerProcurements(user.uid)
        .then((docs) => {
          if (isMounted) {
            setRealProcurements(docs);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Error fetching procurements for TendersPage:", err);
          if (isMounted) setLoading(false);
        });
    } else {
      setLoading(false);
    }
    return () => { isMounted = false; };
  }, [user?.uid]);

  const getStageRoute = (proc) => {
    const stage = proc.currentStage || 'input';
    if (stage === 'understand') return `/procurement/understand/${proc.id}`;
    if (stage === 'processing') return `/procurement/processing/${proc.id}`;
    if (stage === 'analysis') return `/procurement/output/${proc.id}`;
    if (stage === 'specification') return `/procurement/generate-spec/${proc.id}`;
    if (stage === 'publishing' || stage === 'bidding') return `/procurement/publish-tender/${proc.id}`;
    return `/procurement/understand/${proc.id}`;
  };

  const filtered = useMemo(() => {
    return realProcurements.filter(t => {
      const matchSearch = (t.title || '').toLowerCase().includes(search.toLowerCase()) || 
                          (t.id || '').toLowerCase().includes(search.toLowerCase()) ||
                          (t.category || '').toLowerCase().includes(search.toLowerCase()) ||
                          (t.inputMode || '').toLowerCase().includes(search.toLowerCase()) ||
                          (t.description || '').toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
      if (filter === 'In Progress') return t.status === 'in_progress' || t.currentStage === 'processing';
      if (filter === 'Awaiting Review') return t.status === 'awaiting_review' || t.currentStage === 'analysis' || t.currentStage === 'specification';
      if (filter === 'Published') return t.status === 'published' || t.currentStage === 'bidding';
      return true;
    });
  }, [realProcurements, filter, search]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Officer Procurements &amp; Tenders</h2>
          <p className="text-slate-500 text-sm">Real-time Firestore registry of your procurement workflows.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/procurement')}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center gap-2 shadow-md shadow-orange-600/20 cursor-pointer transition-all self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Procurement</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'In Progress', 'Awaiting Review', 'Published'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                filter === tab ? 'bg-orange-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search procurement ID, title, or category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Clean Uncluttered Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-3 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-600">Loading officer procurements from Firestore...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300 stroke-[1.5]" />
            <p className="text-sm font-semibold text-slate-700">No matching procurements found</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">Create your first procurement to see it appear here.</p>
            <button
              type="button"
              onClick={() => navigate('/procurement')}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2 cursor-pointer transition-all"
            >
              <Plus size={15} />
              <span>Start New Procurement</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-6 w-[35%]">Procurement &amp; Title</th>
                  <th className="py-3.5 px-4 w-[15%]">Input Mode</th>
                  <th className="py-3.5 px-4 w-[15%]">Category</th>
                  <th className="py-3.5 px-4 w-[15%]">Current Stage</th>
                  <th className="py-3.5 px-4 w-[10%]">Status</th>
                  <th className="py-3.5 px-6 w-[10%] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Column 1: Title + Dept & Reference */}
                    <td className="py-4 px-6">
                      <p 
                        onClick={() => navigate(getStageRoute(item))}
                        className="font-bold text-slate-900 text-sm hover:text-orange-600 cursor-pointer transition-colors"
                      >
                        {item.title || 'Untitled Procurement'}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-mono">{item.id}</p>
                    </td>

                    {/* Column 2: Input Mode */}
                    <td className="py-4 px-4 text-slate-700">
                      <span className="capitalize font-semibold text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.inputMode || 'text'} Mode
                      </span>
                    </td>

                    {/* Column 3: Category */}
                    <td className="py-4 px-4 text-slate-700 font-medium">
                      {item.category || 'General'}
                    </td>

                    {/* Column 4: Current Stage */}
                    <td className="py-4 px-4">
                      <span className="inline-block font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/80 text-[11px] capitalize">
                        {item.currentStage || 'input'}
                      </span>
                    </td>

                    {/* Column 5: Status */}
                    <td className="py-4 px-4">
                      <span className="inline-block font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 text-[11px] capitalize">
                        {item.status || 'in_progress'}
                      </span>
                    </td>

                    {/* Column 6: Actions */}
                    <td className="py-4 px-6 text-right">
                      <button 
                        type="button"
                        onClick={() => navigate(getStageRoute(item))}
                        className="text-orange-600 hover:text-orange-700 font-bold hover:underline cursor-pointer whitespace-nowrap"
                      >
                        Resume →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// 2. TENDER DETAIL PAGE (/tenders/:id)
export function TenderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const formattedId = id ? id.replace(/-/g, '/') : '';
  const [procurement, setProcurement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (formattedId && user?.uid) {
      setLoading(true);
      getProcurementById(formattedId, user.uid)
        .then((doc) => {
          if (isMounted) {
            setProcurement(doc);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.error("Error fetching procurement detail:", err);
          if (isMounted) {
            setError(err.message || 'Procurement not found.');
            setLoading(false);
          }
        });
    } else {
      setLoading(false);
    }
    return () => { isMounted = false; };
  }, [formattedId, user?.uid]);

  const getStageRoute = (proc) => {
    const stage = proc?.currentStage || 'input';
    if (stage === 'understand') return `/procurement/understand/${proc.id}`;
    if (stage === 'processing') return `/procurement/processing/${proc.id}`;
    if (stage === 'analysis') return `/procurement/output/${proc.id}`;
    if (stage === 'specification') return `/procurement/generate-spec/${proc.id}`;
    if (stage === 'publishing' || stage === 'bidding') return `/procurement/publish-tender/${proc.id}`;
    return `/procurement/understand/${proc.id}`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-12 text-center">
        <div className="w-8 h-8 border-3 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-600">Loading procurement details from Firestore...</p>
      </div>
    );
  }

  if (error || !procurement) {
    return (
      <div className="max-w-6xl mx-auto space-y-6 text-left">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs text-center space-y-3">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">{error || 'Procurement Record Not Found'}</h2>
          <p className="text-xs text-slate-500">The requested procurement ID does not exist in your officer workspace.</p>
          <button
            onClick={() => navigate('/dashboard/tenders')}
            className="px-4 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl hover:bg-orange-700 transition-colors cursor-pointer"
          >
            Back to Tenders
          </button>
        </div>
      </div>
    );
  }

  const inputData = procurement.inputData || {};

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in text-left">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
        <span onClick={() => navigate('/dashboard/tenders')} className="hover:text-orange-600 cursor-pointer">Tenders</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-bold">{procurement.id}</span>
      </div>

      {/* Header Container */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-orange-100 text-orange-800 text-[11px] font-bold mb-2">
              <span className="font-mono">{procurement.id}</span>
              <span>•</span>
              <span>{procurement.category || 'General'}</span>
              <span>•</span>
              <span className="capitalize">{procurement.inputMode || 'text'} Mode</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{procurement.title || 'Untitled Procurement'}</h1>
            <p className="text-xs text-slate-500 mt-1">
              {inputData.department || 'CPWD'} • Budget: {inputData.budget || '₹ 45,00,000'} • Deadline: {inputData.deadline || '30 Sep 2026'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={() => navigate(getStageRoute(procurement))}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>Resume Workflow Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Estimated Budget</span>
            <span className="text-base font-black text-slate-900 mt-1 block">{inputData.budget || '₹ 45,00,000'}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Current Stage</span>
            <span className="text-xs font-mono font-bold text-blue-600 mt-1 block capitalize">{procurement.currentStage || 'input'}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Status</span>
            <span className="text-xs font-bold text-emerald-700 mt-1 block capitalize">{procurement.status || 'in_progress'}</span>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Created On</span>
            <span className="text-sm font-black text-slate-800 mt-1 block">
              {procurement.createdAt?.toDate ? procurement.createdAt.toDate().toLocaleDateString('en-GB') : 'Recently'}
            </span>
          </div>
        </div>

        {/* Description & Requirement Clause */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-2">Requirement Description</h3>
          <p className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {procurement.description || inputData.description || 'No description provided.'}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard/tenders')}
            className="text-slate-600 hover:text-slate-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tenders</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. STANDARDS VIEW (/standards)
export function StandardsPage() {
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');
  const [selectedStandard, setSelectedStandard] = useState(null);

  const { standards, attachStandardInTender } = useProcurement();

  const filtered = useMemo(() => {
    return standards.filter(s => {
      const matchSearch = s.code.toLowerCase().includes(search.toLowerCase()) || 
                          s.title.toLowerCase().includes(search.toLowerCase()) ||
                          s.description.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;
      if (sectorFilter !== 'All' && s.sector !== sectorFilter) return false;
      return true;
    });
  }, [standards, search, sectorFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">BIS Standards & QCO Registry</h2>
          <p className="text-slate-500 text-sm">Bureau of Indian Standards technical verification rules for government procurement.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search IS code or keywords..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Sector Filter Pills */}
      <div className="flex flex-wrap items-center gap-1.5">
        {['All', 'IT', 'Electrical', 'Solar', 'Construction', 'Safety', 'Mechanical'].map(sec => (
          <button
            key={sec}
            onClick={() => setSectorFilter(sec)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              sectorFilter === sec ? 'bg-orange-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {sec}
          </button>
        ))}
      </div>

      {/* Standards Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(std => (
          <div 
            key={std.code} 
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-orange-300 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-bold bg-orange-100 text-orange-800 px-2.5 py-1 rounded-md border border-orange-200">
                  {std.code}
                </span>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                  {std.status}
                </span>
              </div>
              <h3 
                onClick={() => setSelectedStandard(std)}
                className="font-bold text-slate-900 text-sm hover:text-orange-600 cursor-pointer"
              >
                {std.title}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{std.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-600">QCO: <strong className="text-slate-900">{std.qcoStatus}</strong></span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedStandard(std)}
                  className="text-slate-600 hover:text-slate-900 font-bold px-2 py-1 rounded hover:bg-slate-100 cursor-pointer"
                >
                  View Details
                </button>
                <button
                  onClick={() => attachStandardInTender(std.code)}
                  className="text-orange-600 hover:text-orange-700 font-bold bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-200 cursor-pointer"
                >
                  Use in Tender
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Standard Detail Modal */}
      {selectedStandard && (
        <StandardDetailModal
          standard={selectedStandard}
          onClose={() => setSelectedStandard(null)}
          onUseInTender={() => {
            attachStandardInTender(selectedStandard.code);
            setSelectedStandard(null);
          }}
        />
      )}
    </div>
  );
}

// 4. VENDORS VIEW (/dashboard/vendors)
export function VendorsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedVendor, setSelectedVendor] = useState(null);

  const { vendors, verifyVendor, suspendVendor } = useProcurement();

  const filtered = useMemo(() => {
    return vendors.filter(v => {
      const match = v.name.toLowerCase().includes(search.toLowerCase()) || 
                    v.gstin.toLowerCase().includes(search.toLowerCase()) ||
                    v.location.toLowerCase().includes(search.toLowerCase());
      if (!match) return false;
      if (statusFilter === 'Verified') return v.status === 'Verified';
      return true;
    });
  }, [vendors, search, statusFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Registered Suppliers</h2>
          <p className="text-slate-500 text-sm">Verified government suppliers, Class-I MII status, and valid BIS licenses.</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search supplier, GSTIN, or city..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5">
        {['All', 'Verified'].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              statusFilter === st ? 'bg-orange-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Clean Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(v => (
          <VendorRatingScorecard
            key={v.id}
            vendor={v}
            onProfile={() => setSelectedVendor(v)}
            onVerify={() => verifyVendor(v.id)}
            onSuspend={() => suspendVendor(v.id)}
          />
        ))}
      </div>

      {selectedVendor && (
        <VendorProfileModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onVerify={() => {
            verifyVendor(selectedVendor.id);
            setSelectedVendor(prev => prev ? { ...prev, status: 'Verified' } : null);
          }}
          onSuspend={() => {
            suspendVendor(selectedVendor.id);
            setSelectedVendor(prev => prev ? { ...prev, status: 'Suspended' } : null);
          }}
        />
      )}
    </div>
  );
}

// 5. QUOTATIONS VIEW (/dashboard/quotations)
export function QuotationsPage() {
  const [selectedTenderId, setSelectedTenderId] = useState('GEM/2026/B/1049281');
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const { tenders, quotations, selectL1Quotation } = useProcurement();

  const activeTender = useMemo(() => {
    return tenders.find(t => t.id === selectedTenderId) || tenders[0];
  }, [tenders, selectedTenderId]);

  const activeTenderQuotes = useMemo(() => {
    const list = quotations.filter(q => q.tenderId === selectedTenderId);
    return [...list].sort((a, b) => a.bidValue - b.bidValue);
  }, [quotations, selectedTenderId]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quotations & Financial Bids</h2>
          <p className="text-slate-500 text-sm">Competitive quotation comparison, automatic L1 ranking, and bid verification.</p>
        </div>

        {/* Project Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Project:</span>
          <select 
            value={selectedTenderId} 
            onChange={(e) => setSelectedTenderId(e.target.value)}
            className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-600 focus:outline-none"
          >
            {tenders.map(t => (
              <option key={t.id} value={t.id}>{t.id} - {t.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Sanctioned Budget</span>
          <p className="text-xl font-bold text-slate-900 mt-0.5 font-mono">{activeTender.budget}</p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Lowest Bid (L1)</span>
          <p className="text-xl font-bold text-emerald-700 mt-0.5 font-mono">
            {activeTenderQuotes[0]?.bidAmount || 'N/A'}
          </p>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400">Quotations Evaluated</span>
          <p className="text-xl font-bold text-orange-600 mt-0.5 font-mono">{activeTenderQuotes.length} Received</p>
        </div>
      </div>

      {/* Comparison List Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Bid Comparison — {activeTender.id}</h3>
            <p className="text-xs text-slate-500">{activeTender.title}</p>
          </div>
          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Full Comparison</span>
          </button>
        </div>

        <HorizontalPriceMatrix 
          quotes={activeTenderQuotes} 
          estimatedBudget={activeTender.budgetValue}
          onSelectL1={(quotId) => selectL1Quotation(selectedTenderId, quotId)}
        />
      </div>

      {isCompareOpen && (
        <CompareQuotesModal
          quotes={activeTenderQuotes}
          tenderId={selectedTenderId}
          onClose={() => setIsCompareOpen(false)}
        />
      )}
    </div>
  );
}

// 6. EVALUATION VIEW (/dashboard/evaluation)
export function EvaluationPage() {
  const { evaluations, approveEvaluation, requestEvaluationClarification } = useProcurement();
  const [selectedEvalId, setSelectedEvalId] = useState(() => evaluations[0]?.id || 'EVAL-1049281');
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [evidenceModal, setEvidenceModal] = useState(null);
  const [notification, setNotification] = useState(null);

  const currentEval = evaluations.find(e => e.id === selectedEvalId) || evaluations[0];

  // Derive clean criteria steps for journey
  const steps = useMemo(() => {
    if (!currentEval || !currentEval.criteria || currentEval.criteria.length === 0) {
      return [
        { shortTitle: 'CRS Registration', name: 'MeitY CRS Registration under IS 13252:2010', score: 25, maxScore: 25, status: 'PASS', notes: 'R-Number verified on MeitY CRS portal.' },
        { shortTitle: 'OEM Authorization', name: 'OEM Manufacturer Authorization & Local Service SLA', score: 25, maxScore: 25, status: 'PASS', notes: 'Direct OEM authorization and local Delhi-NCR support verified.' },
        { shortTitle: 'GFR 144(i) Declaration', name: 'GFR Rule 144(i) Land Border Declaration', score: 25, maxScore: 25, status: 'PASS', notes: 'Self-declaration with audited supply chain origin submitted.' },
        { shortTitle: 'BEE Energy Efficiency', name: 'BEE 5-Star Energy Efficiency Benchmark', score: 23, maxScore: 25, status: 'PASS', notes: 'BEE energy test report compliant with 85% active power factor.' },
      ];
    }
    return currentEval.criteria.map((c) => {
      let short = c.name;
      if (c.name.includes('CRS Registration') || c.name.includes('IS 13252')) short = 'CRS Registration';
      else if (c.name.includes('OEM') || c.name.includes('Manufacturer')) short = 'OEM Authorization';
      else if (c.name.includes('144(i)') || c.name.includes('Border')) short = 'GFR 144(i) Declaration';
      else if (c.name.includes('BEE') || c.name.includes('Energy')) short = 'BEE Energy Efficiency';
      else if (c.name.includes('IS 1489') || c.name.includes('ISI')) short = 'ISI Mark Verification';
      else if (c.name.includes('Strength Test')) short = 'Compressive Strength';
      else if (c.name.includes('Expansion') || c.name.includes('Soundness')) short = 'Soundness Expansion';
      return {
        ...c,
        shortTitle: short
      };
    });
  }, [currentEval]);

  const currentStep = steps[activeStepIndex] || steps[0];

  // Extract display values
  const displayTitle = currentEval?.tenderTitle
    ? currentEval.tenderTitle.replace(/\s*\(\d+\s*Units\)/i, '').replace(/\s*—.*$/, '')
    : 'Desktop Computers and Workstations';
    
  const displayUnits = currentEval?.tenderTitle?.match(/\(\d+\s*Units\)/i)?.[0]?.replace(/[()]/g, '') 
    || currentEval?.units 
    || '85 Units';

  const displayVendor = currentEval?.recommendedVendor
    ? currentEval.recommendedVendor.replace(/\s*\(L1.*?\)/i, '')
    : 'Dell International Services';

  const displayL1 = currentEval?.recommendedVendor?.match(/₹[\d,]+/)?.[0] 
    || currentEval?.budget 
    || '₹ 39,80,000';

  const handleApprove = (id) => {
    approveEvaluation(id);
    setNotification({ type: 'success', message: 'Tender evaluation approved successfully! Sent for sanction DSC signing.' });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleClarification = (id) => {
    requestEvaluationClarification(id);
    setNotification({ type: 'info', message: 'Clarification query issued to the recommended vendor.' });
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Technical Compliance Evaluation</h2>
          <p className="text-slate-500 text-sm">Specification verification, NABL lab compliance checks, and GFR 144(i) declarations.</p>
        </div>

        {/* Multi-tender selector if multiple */}
        {evaluations.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Select Tender:</span>
            <select
              value={selectedEvalId}
              onChange={(e) => {
                setSelectedEvalId(e.target.value);
                setActiveStepIndex(0);
              }}
              className="text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-2xs"
            >
              {evaluations.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.tenderId} — {ev.tenderTitle.substring(0, 30)}...
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {notification && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in ${
          notification.type === 'success' ? 'bg-emerald-50 border border-emerald-300 text-emerald-800' : 'bg-blue-50 border border-blue-300 text-blue-800'
        }`}>
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Tender Overview Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left info column */}
          <div className="flex items-start gap-4 flex-1">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 border border-sky-100/80 flex items-center justify-center text-sky-600 shrink-0 shadow-2xs">
              <Monitor size={28} />
            </div>

            <div className="space-y-1 flex-1 min-w-0">
              <span className="text-[11px] font-mono font-bold text-orange-700 bg-orange-100/90 px-2.5 py-0.5 rounded border border-orange-200/80 inline-block">
                {currentEval?.tenderId || 'GEM/2026/B/1049281'}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
                {displayTitle}
              </h3>
              <p className="text-xs font-semibold text-slate-500 pb-2">{displayUnits}</p>

              {/* 3-column stats with dividers */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 border-t border-slate-100 text-left">
                <div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Department</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">{currentEval?.department || 'Department of Information Technology (MeitY)'}</span>
                </div>

                <div className="hidden sm:block w-px h-7 bg-slate-200" />

                <div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">Recommended Vendor</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">{displayVendor}</span>
                </div>

                <div className="hidden sm:block w-px h-7 bg-slate-200" />

                <div>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider block">L1 Value</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">{displayL1}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side: Circular Score & 4/4 Verified Box */}
          <div className="flex items-center gap-5 shrink-0 self-start lg:self-center">
            {/* Circular Gauge */}
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-24 h-24 -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#f1f5f9"
                  strokeWidth="7.5"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke="#10b981"
                  strokeWidth="7.5"
                  strokeDasharray={2 * Math.PI * 38}
                  strokeDashoffset={2 * Math.PI * 38 * (1 - (currentEval?.overallScore || 98) / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-extrabold text-slate-900 leading-none">{currentEval?.overallScore || 98}%</span>
                <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider block mt-1 leading-tight">
                  COMPLIANCE<br />SCORE
                </span>
              </div>
            </div>

            {/* 4/4 Verified Card */}
            <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 min-w-[170px] flex flex-col justify-center shadow-2xs">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Check size={13} strokeWidth={3} />
                </div>
                <span className="text-base font-extrabold text-slate-900">
                  {steps.filter(s => s.status === 'PASS').length} / {steps.length}
                </span>
                <span className="text-[11px] font-extrabold text-emerald-800 tracking-wider">VERIFIED</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium mt-2 leading-tight">
                All key technical requirements met.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Verification Journey Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-7">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Compliance Verification Journey</h3>
            <p className="text-xs text-slate-500 mt-0.5">Four key technical compliance checks completed.</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <MousePointerClick size={14} className="text-slate-400" />
            <span>Click on any step to view details</span>
          </div>
        </div>

        {/* Stepper with Horizontal Green Connecting Line */}
        <div className="relative py-3">
          <div className="absolute top-8 left-12 right-12 h-0.5 bg-emerald-500 -z-0" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10">
            {steps.map((step, idx) => {
              const isSelected = activeStepIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveStepIndex(idx)}
                  className="flex flex-col items-center text-center cursor-pointer group focus:outline-none"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white bg-emerald-500 shadow-sm transition-all duration-200 ${
                    isSelected ? 'ring-4 ring-emerald-200 ring-offset-2 scale-110' : 'group-hover:scale-105'
                  }`}>
                    <Check size={18} strokeWidth={2.5} />
                  </div>
                  <span className={`text-xs font-bold mt-2.5 block transition-colors ${isSelected ? 'text-slate-900 font-extrabold' : 'text-slate-700'}`}>
                    {step.shortTitle}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                    {step.score} / {step.maxScore} pts
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded mt-1 inline-block">
                    {step.status}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Step Evidence Detail Banner */}
        {currentStep && (
          <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{currentStep.shortTitle}</h4>
                <div className="text-xs font-semibold text-emerald-700 mt-0.5">
                  {currentStep.score} / {currentStep.maxScore} pts • <span className="font-bold">{currentStep.status}</span>
                </div>
              </div>
            </div>

            <div className="hidden md:block w-px h-9 bg-emerald-200/70" />

            <p className="text-xs text-slate-600 flex-1 px-1">
              {currentStep.notes}
            </p>

            <button
              type="button"
              onClick={() => setEvidenceModal(currentStep)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center gap-1.5 shadow-2xs cursor-pointer shrink-0 transition-colors"
            >
              <span>View Evidence</span>
              <ExternalLink size={13} className="text-slate-400" />
            </button>
          </div>
        )}

        {/* Bottom Right Action Buttons */}
        <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => handleApprove(currentEval?.id)}
            className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-sm font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-all"
          >
            <Check size={16} strokeWidth={3} />
            <span>Approve</span>
          </button>
          <button
            type="button"
            onClick={() => handleClarification(currentEval?.id)}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-all"
          >
            <MessageSquare size={16} className="text-slate-500" />
            <span>Clarification</span>
          </button>
        </div>
      </div>

      {/* Evidence Modal */}
      {evidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                  Technical Compliance Certificate
                </h3>
              </div>
              <button
                onClick={() => setEvidenceModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/70">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Verification Parameter</span>
                <span className="text-sm font-bold text-emerald-950 mt-0.5 block">{evidenceModal.name || evidenceModal.shortTitle}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Score &amp; Status</span>
                  <span className="text-xs font-bold text-emerald-700 mt-0.5 block">{evidenceModal.score} / {evidenceModal.maxScore} pts ({evidenceModal.status})</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Validation Node</span>
                  <span className="text-xs font-bold text-slate-800 mt-0.5 block">NIC DEL-04 Verified</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Audited Evidence &amp; Notes</span>
                <p className="text-xs text-slate-700 leading-relaxed">{evidenceModal.notes}</p>
              </div>

              <div className="p-3 bg-slate-100/70 rounded-xl text-[11px] text-slate-500 font-mono">
                SHA-256 Hash: 9f8a7c2b3e41d560fa89e120bc764d21e09
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setEvidenceModal(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Evidence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 7. APPROVALS VIEW (/dashboard/approvals)
export function ApprovalsPage() {
  const [rejectingId, setRejectingId] = useState(null);

  const { approvals, approveApproval, rejectApproval } = useProcurement();

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in text-left">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sanctions & Approvals Queue</h2>
        <p className="text-slate-500 text-sm">Review evaluated procurement proposals, verify budget allocation, and authorize DSC signatures.</p>
      </div>

      <div className="space-y-4">
        {approvals.map(app => (
          <AuditTimelineTree
            key={app.id}
            approval={app}
            onApprove={() => approveApproval(app.id)}
            onReject={() => setRejectingId(app.id)}
          />
        ))}
      </div>

      {rejectingId && (
        <ConfirmRejectModal
          approvalId={rejectingId}
          onConfirm={() => {
            rejectApproval(rejectingId);
            setRejectingId(null);
          }}
          onClose={() => setRejectingId(null)}
        />
      )}
    </div>
  );
}

// 8. ANALYTICS VIEW (/dashboard/analytics)
export function AnalyticsPage() {
  const { tenders } = useProcurement();

  const totalValueCr = useMemo(() => {
    const sum = tenders.reduce((acc, t) => acc + t.budgetValue, 0);
    return (sum / 10000000).toFixed(2);
  }, [tenders]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in text-left">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Procurement Analytics & Spend Intelligence</h2>
        <p className="text-slate-500 text-sm">Interactive spend distributions, monthly procurement volume, and processing velocity trends.</p>
      </div>

      {/* 3 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Total Active Spend</span>
          <span className="text-3xl font-black text-slate-900 mt-1 block">₹ {totalValueCr} Cr</span>
          <span className="text-[11px] font-bold text-emerald-600 mt-2 block">↑ 14.2% GeM benchmark savings</span>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Mandatory QCO Compliance</span>
          <span className="text-3xl font-black text-emerald-600 mt-1 block">100%</span>
          <span className="text-[11px] font-bold text-slate-500 mt-2 block">Zero uncertified item tenders</span>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase">Avg Sanction Velocity</span>
          <span className="text-3xl font-black text-orange-600 mt-1 block">8.0 Days</span>
          <span className="text-[11px] font-bold text-emerald-600 mt-2 block">↓ 71% faster than manual audit</span>
        </div>
      </div>

      {/* Visual Chart Row 1: Donut & Grouped Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Spend Allocation Donut */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-slate-900">Procurement Budget Allocation by Department</h3>
          <p className="text-xs text-slate-500 mb-2">Interactive department share across active contracts.</p>
          <SpendDonutChart />
        </div>

        {/* Monthly Volume Bar Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <h3 className="text-sm font-bold text-slate-900">Monthly Tender Activity (Active vs Awarded)</h3>
          <p className="text-xs text-slate-500 mb-2">Month-over-month volume progression.</p>
          <MonthlyBarChart />
        </div>
      </div>

      {/* Visual Chart Row 2: Processing Time Trend */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <h3 className="text-sm font-bold text-slate-900">Procurement Velocity Trend (Days to Award)</h3>
        <p className="text-xs text-slate-500">Historical cycle time reduction from draft creation to digital signature.</p>
        <ProcessingTimeLineChart />
      </div>
    </div>
  );
}

// 9. SETTINGS VIEW (/settings)
export function SettingsPage() {
  const { user, userProfile, updateProfile } = useAuth();
  const { settings, updateSettings, resetAllData } = useProcurement();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [formData, setFormData] = useState({
    ...settings,
    officerName: userProfile?.name || settings.officerName,
    department: userProfile?.ministry || settings.department,
    email: user?.email || userProfile?.email || settings.email,
  });

  useEffect(() => {
    if (userProfile || user) {
      setFormData(prev => ({
        ...prev,
        officerName: userProfile?.name || prev.officerName,
        department: userProfile?.ministry || prev.department,
        email: user?.email || userProfile?.email || prev.email,
      }));
    }
  }, [userProfile, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateSettings(formData);
    if (updateProfile) {
      try {
        await updateProfile({
          name: formData.officerName,
          ministry: formData.department,
          designation: formData.designation,
        });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        console.error('Failed to update officer profile in Firestore:', err);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in text-left">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Workspace & System Settings</h2>
        <p className="text-slate-500 text-sm">Configure NIC server connections, Digital Signature Certificates (DSC), and officer credentials.</p>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully to your cloud account!</span>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Officer Name</label>
              <input 
                type="text"
                value={formData.officerName}
                onChange={(e) => setFormData({ ...formData, officerName: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Designation & Cadre</label>
              <input 
                type="text"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Department</label>
              <input 
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Official NIC Email</label>
              <input disabled value={formData.email} className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-50 text-slate-500 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Digital Signature Certificate (DSC)</label>
              <input disabled defaultValue={formData.dscSerial} className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-50 text-slate-600 font-mono rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Default Standard Verification Engine</label>
              <select 
                value={formData.verificationEngine}
                onChange={(e) => setFormData({ ...formData, verificationEngine: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 bg-white rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
              >
                <option>BIS Standard Verification Engine v3.2 (Auto-Fetch)</option>
                <option>MeitY & DPIIT Quality Control Gateway</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={resetAllData}
              className="text-xs font-bold text-slate-500 hover:text-rose-600 cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Prototype Database</span>
            </button>

            <button type="submit" className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer">
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 9. HELP & SUPPORT VIEW (/dashboard/help)
export function HelpSupportPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How does Sahayak AI automate tender technical specification drafting?',
      a: 'Sahayak AI analyzes unstructured requirement text, BOQ documents, or past GeM bids. It matches required items with BIS standards (IS codes), CRS mandatory requirements, and creates structured clauses adhering to the Manual for Procurement of Goods.'
    },
    {
      q: 'What is GFR Rule 144(i) and how is compliance validated?',
      a: 'GFR Rule 144(i) restricts procurement from countries sharing a land border with India without prior competent authority registration. Sahayak AI cross-verifies vendor self-declarations, DPIIT registrations, and OEM supply chain origins automatically.'
    },
    {
      q: 'How do I approve and sanction tenders using Digital Signature Certificate (DSC)?',
      a: 'Navigate to the Approvals tab, verify the budget allocation and evaluation summary, insert your Class 3 DSC token, and click "Approve Tender & Sign DSC". The cryptographic hash is logged into the audit timeline.'
    },
    {
      q: 'How can I export or publish directly to the GeM portal?',
      a: 'Once a tender passes AI specification verification and officer approval, click "Publish Tender to Portal" on the Publish step. You can also download the Gazette PDF or export raw text formatted for GeM custom bid creation.'
    },
    {
      q: 'What should I do if a vendor fails technical compliance checks?',
      a: 'In the Evaluation tab, you can click "Clarification" to request additional documentation from the vendor, or reject non-compliant bids with an automated non-compliance notice specifying the failed clause.'
    }
  ];

  const filteredFaqs = searchQuery
    ? faqs.filter(f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase()))
    : faqs;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in text-left">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Help &amp; Support Center</h2>
        <p className="text-slate-500 text-sm">Find answers, learn procurement workflows, check compliance guidelines, and contact support.</p>
      </div>

      {/* Hero Search */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-6 sm:p-8 text-white shadow-sm space-y-4">
        <h3 className="text-xl sm:text-2xl font-black">How can we assist you today?</h3>
        <p className="text-orange-100 text-xs sm:text-sm max-w-xl">
          Search GeM guidelines, BIS/CRS standards, GFR rules, tender drafting procedures, or DSC signing tutorials.
        </p>
        <div className="relative max-w-2xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search help articles, GeM guidelines, GFR 144(i), DSC..."
            className="w-full pl-11 pr-4 py-3 bg-white text-slate-900 text-sm rounded-xl font-medium placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-md"
          />
        </div>
      </div>

      {/* Quick Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => navigate('/sahayak-ai')}
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Sparkles size={20} />
          </div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors">AI Tender Assistant</h4>
          <p className="text-xs text-slate-500 mt-1">Ask questions and generate specs using Sahayak AI directly.</p>
        </div>

        <div 
          onClick={() => navigate('/dashboard/standards')}
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Bookmark size={20} />
          </div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">BIS Standards Directory</h4>
          <p className="text-xs text-slate-500 mt-1">Browse mandatory IS/ISO codes, CRS requirements, and test specs.</p>
        </div>

        <div 
          onClick={() => navigate('/dashboard/evaluation')}
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ShieldCheck size={20} />
          </div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">Technical Evaluations</h4>
          <p className="text-xs text-slate-500 mt-1">Learn how 4-step compliance verification and scoring operates.</p>
        </div>

        <div 
          onClick={() => navigate('/dashboard/settings')}
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Settings size={20} />
          </div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">DSC &amp; NIC Settings</h4>
          <p className="text-xs text-slate-500 mt-1">Configure officer credentials, DSC e-Sign tokens, and NIC nodes.</p>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900">Frequently Asked Questions</h3>
        <div className="divide-y divide-slate-100">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="py-3.5">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between gap-4 text-left font-bold text-sm text-slate-800 hover:text-orange-600 cursor-pointer transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown size={18} className={`text-slate-400 shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-orange-600' : ''}`} />
              </button>
              {openFaq === idx && (
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Direct Contact & Support Helplines */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg font-extrabold text-slate-900">National Procurement Helpdesk &amp; Support</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Toll-Free Helpline</span>
            <span className="text-sm font-extrabold text-slate-900 block">1800-115-9900</span>
            <span className="text-[11px] text-slate-500 block">Mon - Sat, 09:00 AM - 06:00 PM IST</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Official Email Desk</span>
            <span className="text-sm font-extrabold text-slate-900 block">support@sahayak.gov.in</span>
            <span className="text-[11px] text-slate-500 block">Priority response for NIC officers</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">GeM Technical Support</span>
            <span className="text-sm font-extrabold text-slate-900 block">helpdesk-gem@gov.in</span>
            <span className="text-[11px] text-slate-500 block">GeM portal sync and bid integrations</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. OVERLAY MODALS & FORMS
// ==========================================

// Create Tender Modal
export function CreateTenderModal({ onClose }) {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Central Bureau of Investigation (CBI)');
  const [category, setCategory] = useState('IT Hardware');
  const [budget, setBudget] = useState('₹ 45,00,000');
  const [deadline, setDeadline] = useState('25 Sep 2026');
  const [description, setDescription] = useState('');

  const { createTender } = useProcurement();

  const handleSubmit = (e) => {
    e.preventDefault();
    createTender({
      title,
      department,
      category,
      budget,
      deadline,
      description
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in text-left">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative border border-slate-200 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <h3 className="text-lg font-black text-slate-900">Create AI-Compliant Tender</h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">Auto-matches active BIS standard codes and GFR 144(i) validation clauses.</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Tender Title / Product Spec *</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 33kV Vacuum Circuit Breaker Switchgear Panels" 
              className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Category *</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-300 bg-white rounded-lg p-2 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none"
              >
                <option value="IT Hardware">IT Hardware (IS 13252, IS 14896)</option>
                <option value="Solar & Renewable">Solar & Renewable (IS 14286, ALMM)</option>
                <option value="PPE & Safety">PPE & Safety (IS 2925, IS 3521)</option>
                <option value="Electrical">Electrical (IS 13118, IS 694, IS 1554)</option>
                <option value="Construction Materials">Construction (IS 1489, IS 1786)</option>
                <option value="Machinery">Machinery (IS 8472, IS 9079)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Department *</label>
              <select 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full border border-slate-300 bg-white rounded-lg p-2 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none"
              >
                <option>Central Bureau of Investigation (CBI)</option>
                <option>Central Public Works Dept (CPWD)</option>
                <option>Ministry of New & Renewable Energy (MNRE)</option>
                <option>National Highways Authority (NHAI)</option>
                <option>Power Grid Corporation (PGCIL)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Estimated Budget (INR) *</label>
              <input 
                type="text" 
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. ₹ 50,00,000" 
                className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Submission Deadline *</label>
              <input 
                type="text" 
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g. 25 Sep 2026" 
                className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Procurement Description & Scope *</label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide technical specifications, voltage/capacity ratings, or scope of supply..."
              className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-orange-50 border border-orange-200 rounded-xl text-xs text-orange-950 font-medium">
            <span className="font-bold block">✓ Automated Standard Injection:</span>
            Mandatory BIS specifications and GFR Rule 144(i) clauses will be dynamically attached based on category.
          </div>

          <button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-orange-600/20 transition-all cursor-pointer"
          >
            Publish Tender to GeM
          </button>
        </form>
      </div>
    </div>
  );
}

// Edit Tender Modal
export function EditTenderModal({ tender, onClose }) {
  const [title, setTitle] = useState(tender.title);
  const [budget, setBudget] = useState(tender.budget);
  const [deadline, setDeadline] = useState(tender.deadline);
  const [status, setStatus] = useState(tender.status);

  const { updateTender } = useProcurement();

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTender(tender.id, {
      title,
      budget,
      deadline,
      status
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in text-left">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 sm:p-8 relative border border-slate-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700">
          <X size={20} />
        </button>

        <h3 className="text-lg font-black text-slate-900 mb-1">Edit Tender: {tender.id}</h3>
        <p className="text-xs text-slate-500 mb-4">Modify procurement parameters or update lifecycle status.</p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Tender Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Budget</label>
              <input 
                type="text" 
                required
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Deadline</label>
              <input 
                type="text" 
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">Status</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-slate-300 bg-white rounded-lg p-2 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none"
            >
              <option value="AI Ready">AI Ready</option>
              <option value="Quotes Received">Quotes Received</option>
              <option value="Under Evaluation">Under Evaluation</option>
              <option value="Pending Approval">Pending Approval</option>
              <option value="Approved">Approved</option>
              <option value="Draft">Draft</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg shadow-xs">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
export function ConfirmDeleteModal({ tenderId, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in text-left">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Trash2 size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Delete Tender Notice</h3>
            <p className="text-xs text-slate-500">Are you sure you want to remove <strong className="text-slate-800">{tenderId}</strong>?</p>
          </div>
        </div>
        <p className="text-xs text-slate-600 mb-5 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
          This action will delete the tender specifications and un-link all received bids from the active workspace.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs">Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

// Reject Approval Confirmation Modal
export function ConfirmRejectModal({ approvalId, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in text-left">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative border border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Reject Tender Sanction</h3>
            <p className="text-xs text-slate-500">Record: <strong className="text-slate-800">{approvalId}</strong></p>
          </div>
        </div>
        <p className="text-xs text-slate-600 mb-5 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
          Rejecting will return the tender recommendation to the technical evaluation committee with a non-compliance notice.
        </p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs">Confirm Rejection</button>
        </div>
      </div>
    </div>
  );
}

// Standard Detail Modal (Structured Technical View)
export function StandardDetailModal({ standard, onClose, onUseInTender }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in text-left">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 relative border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer">
          <X size={20} />
        </button>

        {/* Top Header */}
        <div className="pb-4 border-b border-slate-100 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold bg-orange-100 text-orange-800 px-2.5 py-1 rounded-md border border-orange-200">
              {standard.code}
            </span>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
              {standard.status}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">{standard.title}</h3>
          <p className="text-xs text-slate-500 font-medium">
            Sector: <strong>{standard.sector}</strong> • QCO Regulation: <strong className="text-slate-800">{standard.qcoStatus}</strong>
          </p>
        </div>

        {/* Scope & Applicability */}
        <div className="space-y-3 text-xs">
          <div>
            <h4 className="font-bold text-slate-900 mb-1">Scope & Technical Description</h4>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              {standard.description}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1">Applicability to Government Tenders</h4>
            <p className="text-slate-600 leading-relaxed">
              {standard.applicability}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-2">Mandatory Testing & Verification Method</h4>
            <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
              {standard.testingRequirements.map((req, i) => (
                <div key={i} className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-1.5">Applicable Procurement Categories</h4>
            <div className="flex flex-wrap gap-1.5">
              {standard.exampleCategories.map((cat, i) => (
                <span key={i} className="px-2.5 py-1 bg-slate-100 rounded-md text-slate-700 font-medium text-[11px]">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button 
            type="button" 
            onClick={onClose} 
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
          >
            ← Back to Registry
          </button>
          <button 
            type="button" 
            onClick={onUseInTender} 
            className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors"
          >
            Use in Tender →
          </button>
        </div>
      </div>
    </div>
  );
}

// Vendor Profile Modal
export function VendorProfileModal({ vendor, onClose, onVerify, onSuspend }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in text-left">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 sm:p-8 relative border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700">
          <X size={20} />
        </button>

        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-slate-900">{vendor.name}</h3>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                vendor.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700'
              }`}>
                {vendor.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{vendor.location} • {vendor.supplierClass}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-orange-600">★ {vendor.rating} / 5.0</span>
            <span className="text-[11px] text-slate-400 block">{vendor.previousContracts} Contracts Fulfilled</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase">GSTIN Number</span>
            <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">{vendor.gstin}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase">BIS License No.</span>
            <p className="text-xs font-mono font-bold text-emerald-700 mt-0.5">{vendor.bisLicense}</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Compliance Rating</span>
            <p className="text-xs font-bold text-emerald-600 mt-0.5">{vendor.complianceScore}% GFR Match</p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-slate-900 mb-2">Recent Tender Bids</h4>
          <div className="space-y-2">
            {vendor.recentBids.map((b, i) => (
              <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">{b.tenderTitle}</span>
                <span className="font-mono font-bold text-slate-900">{b.bidAmount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="text-xs text-slate-500">
            Email: <strong className="text-slate-800">{vendor.contactEmail}</strong>
          </div>
          <div className="flex gap-2">
            {vendor.status !== 'Verified' && (
              <button onClick={onVerify} className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs">
                Verify Vendor
              </button>
            )}
            {vendor.status !== 'Suspended' && (
              <button onClick={onSuspend} className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl shadow-xs">
                Suspend Vendor
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Compare Quotes Modal
export function CompareQuotesModal({ quotes, tenderId, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in text-left">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 sm:p-8 relative border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-700">
          <X size={20} />
        </button>

        <div>
          <h3 className="text-lg font-black text-slate-900">Side-by-Side Quotation Comparison</h3>
          <p className="text-xs text-slate-500">Tender: {tenderId} • Sorted by GFR 144 L1 Qualified Benchmark</p>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b">
              <tr>
                <th className="p-3.5">Bidder</th>
                <th className="p-3.5">Quoted Total</th>
                <th className="p-3.5">Lead Time</th>
                <th className="p-3.5">Technical Score</th>
                <th className="p-3.5">Financial Score</th>
                <th className="p-3.5">Overall Rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {quotes.map((q, i) => (
                <tr key={q.id} className={i === 0 ? 'bg-emerald-50/40 font-bold' : ''}>
                  <td className="p-3.5 text-slate-900">{q.vendorName}</td>
                  <td className="p-3.5 font-mono text-sm font-black text-slate-900">{q.bidAmount}</td>
                  <td className="p-3.5 text-slate-600">{q.deliveryTime}</td>
                  <td className="p-3.5 text-emerald-700 font-semibold">{q.technicalScore}%</td>
                  <td className="p-3.5 text-slate-700">{q.financialScore}%</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded font-bold ${i === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      L{i + 1}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-orange-600 text-white font-bold text-xs rounded-xl shadow-xs">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. ROUTER APPLICATION ROOT
// ==========================================
export function App() {
  return (
    <AuthProvider>
      <VendorAuthProvider>
        <ProcurementProvider>
          <BrowserRouter>
            <Routes>
              {/* Public landing page — default entry point */}
              <Route path="/" element={<LandingPage />} />

              {/* Officer Protected Routes */}
              <Route element={<OfficerProtectedRoute />}>
                {/* Input Mode / Start Procurement — dedicated officer home route */}
                <Route path="/procurement" element={<DashboardLayout />}>
                  <Route index element={<InputModePage />} />
                </Route>

                {/* /home — Home page (same content as /procurement, genuinely separate route) */}
                <Route path="/home" element={<DashboardLayout />}>
                  <Route index element={<InputModePage />} />
                </Route>

                {/* /sahayak-ai — Dedicated Sahayak AI Procurement Assistant Workspace */}
                <Route path="/sahayak-ai" element={<SahayakAIPage />} />

                {/* Standalone 7-Stage Procurement Workflow Routes */}
                <Route path="/procurement/text" element={<TextSpecificationPage />} />
                <Route path="/procurement/document" element={<UploadDocumentPage />} />
                <Route path="/procurement/quotation" element={<QuotationTenderPage />} />
                
                {/* ID-based and Legacy Stage Routes */}
                <Route path="/procurement/understand" element={<UnderstandRequirementPage />} />
                <Route path="/procurement/understand/:procurementId" element={<UnderstandRequirementPage />} />

                <Route path="/procurement/processing" element={<AIProcessingPage />} />
                <Route path="/procurement/processing/:procurementId" element={<AIProcessingPage />} />

                <Route path="/procurement/output" element={<AnalysisOutputPage />} />
                <Route path="/procurement/output/:procurementId" element={<AnalysisOutputPage />} />
                <Route path="/procurement/analysis" element={<AnalysisOutputPage />} />
                <Route path="/procurement/analysis/:procurementId" element={<AnalysisOutputPage />} />

                <Route path="/procurement/generate-spec" element={<GenerateSpecPage />} />
                <Route path="/procurement/generate-spec/:procurementId" element={<GenerateSpecPage />} />
                <Route path="/procurement/spec" element={<GenerateSpecPage />} />
                <Route path="/procurement/spec/:procurementId" element={<GenerateSpecPage />} />

                <Route path="/procurement/publish-tender" element={<PublishTenderPage />} />
                <Route path="/procurement/publish-tender/:procurementId" element={<PublishTenderPage />} />
                <Route path="/procurement/publish" element={<PublishTenderPage />} />
                <Route path="/procurement/publish/:procurementId" element={<PublishTenderPage />} />

                <Route path="/procurement/complete" element={<AnalysisOutputPage />} />
                <Route path="/procurement/complete/:procurementId" element={<AnalysisOutputPage />} />

                {/* Backwards compatibility aliases */}
                <Route path="/input-mode" element={<DashboardLayout />}>
                  <Route index element={<InputModePage />} />
                </Route>
                <Route path="/input-mode/text" element={<TextSpecificationPage />} />
                <Route path="/input-mode/document" element={<UploadDocumentPage />} />
                <Route path="/input-mode/quotation" element={<QuotationTenderPage />} />

                {/* Officer dashboard suite — all under /dashboard */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<DashboardHome />} />
                  <Route path="tenders" element={<TendersPage />} />
                  <Route path="tenders/:id" element={<TenderDetailPage />} />
                  <Route path="standards" element={<StandardsPage />} />
                  <Route path="vendors" element={<VendorsPage />} />
                  <Route path="quotations" element={<QuotationsPage />} />
                  <Route path="evaluation" element={<EvaluationPage />} />
                  <Route path="approvals" element={<ApprovalsPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="help" element={<HelpSupportPage />} />
                  <Route path="support" element={<HelpSupportPage />} />
                </Route>

                {/* Alias /officer routes */}
                <Route path="/officer" element={<DashboardLayout />}>
                  <Route index element={<InputModePage />} />
                  <Route path="input-mode" element={<InputModePage />} />
                  <Route path="dashboard" element={<DashboardHome />} />
                  <Route path="tenders" element={<TendersPage />} />
                  <Route path="tenders/:id" element={<TenderDetailPage />} />
                  <Route path="standards" element={<StandardsPage />} />
                  <Route path="vendors" element={<VendorsPage />} />
                  <Route path="quotations" element={<QuotationsPage />} />
                  <Route path="evaluation" element={<EvaluationPage />} />
                  <Route path="approvals" element={<ApprovalsPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="help" element={<HelpSupportPage />} />
                  <Route path="support" element={<HelpSupportPage />} />
                </Route>
              </Route>

              {/* Vendor dashboard suite — all under /vendor */}
              <Route path="/vendor" element={<VendorProtectedRoute />}>
                <Route index element={<VendorDashboard />} />
                <Route path="dashboard" element={<VendorDashboard />} />
                <Route path="tenders" element={<VendorTenders />} />
                <Route path="tenders/:id" element={<VendorTenderDetails />} />
                <Route path="quotations" element={<VendorQuotations />} />
                <Route path="quotations/:id" element={<VendorQuotationDetails />} />
                <Route path="quotations/:id/submit" element={<VendorQuotationSubmit />} />
                <Route path="documents" element={<VendorDocuments />} />
                <Route path="profile" element={<VendorProfile />} />
                <Route path="notifications" element={<VendorNotifications />} />
                <Route path="compliance" element={<VendorComplianceResponse />} />
                {/* New "Bid Opportunities" vendor suite — additive, does not
                    replace the existing VendorDashboard/VendorTenders pages above. */}
                <Route path="opportunities" element={<VendorOpportunities />} />
                <Route path="opportunities/:id" element={<VendorOpportunityDetail />} />
                <Route path="my-bids" element={<VendorMyBids />} /> 
              </Route>
            </Routes>
          </BrowserRouter>
        </ProcurementProvider>
      </VendorAuthProvider>
    </AuthProvider>
  );
}

export default App;