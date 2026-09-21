import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Bell, 
  ChevronDown, 
  LayoutDashboard, 
  FileText, 
  BookmarkCheck, 
  Users, 
  Receipt, 
  Scale, 
  ShieldCheck, 
  BarChart3, 
  Settings, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Plus, 
  Search, 
  ExternalLink, 
  Filter, 
  ArrowUpRight, 
  Sparkles, 
  LogOut, 
  Clock, 
  X, 
  Download, 
  ChevronRight
} from 'lucide-react';

export const OfficerDashboard = ({ onBackToLanding }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedTenderId, setSelectedTenderId] = useState('GEM/2026/B/8921');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(4);
  const [searchQuery, setSearchQuery] = useState('');
  const [tenderFilterTab, setTenderFilterTab] = useState('all');
  const [standardsCategory, setStandardsCategory] = useState('all');
  const [quotationsTenderId, setQuotationsTenderId] = useState('GEM/2026/B/8921');
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Sample procurement database
  const allTenders = [
    {
      id: 'GEM/2026/B/8921',
      title: 'Laptop & Computing Infrastructure',
      department: 'Central Bureau of Investigation (CBI)',
      category: 'IT Hardware & Compute',
      standardCode: 'IS 14896 / IS 13252 (Part 1)',
      testMethod: 'IS 13252 Safety & Radiation Compliance Test',
      budget: '₹ 42.50 Lakh',
      status: 'AI Ready',
      statusType: 'success',
      date: '28 Aug 2026',
      deadline: '10 Sep 2026',
      quotesCount: 5,
      description: 'Supply of 85 units enterprise laptops with Intel Core Ultra, 32GB RAM, TPM 2.0 and active BIS registration under CRO schedule II.',
      clauses: [
        'Mandatory BIS CRS registration under IS 13252:2010',
        'Energy efficiency rating meeting BEE 5-Star or equivalent benchmark',
        'GFR Rule 144(i) Land Border Country Declaration Required',
        'Original Equipment Manufacturer (OEM) authorization certificate'
      ]
    },
    {
      id: 'GEM/2026/B/4412',
      title: 'Solar Panels & Rooftop Power Units',
      department: 'Ministry of New & Renewable Energy (MNRE)',
      category: 'Renewable Power Systems',
      standardCode: 'IS 14286 / IS/IEC 61730',
      testMethod: 'IS 14286 Crystalline Silicon PV Module Test',
      budget: '₹ 1.20 Crore',
      status: 'Quotes',
      statusType: 'warning',
      date: '27 Aug 2026',
      deadline: '15 Sep 2026',
      quotesCount: 7,
      description: 'Turnkey procurement and installation of 250 kWp Rooftop Crystalline Solar PV array conforming to ALMM list guidelines.',
      clauses: [
        'Mandatory ALMM List-I compliant Solar Modules',
        'BIS certification under IS 14286:2010 and IS/IEC 61730-1/2',
        'Efficiency > 21.5% with 25-year linear performance warranty',
        'Grid interconnection testing per Central Electricity Authority (CEA) norms'
      ]
    },
    {
      id: 'GEM/2026/B/1093',
      title: 'Safety Equipment & Protective Gear',
      department: 'National Highways Authority of India (NHAI)',
      category: 'PPE & Industrial Safety',
      standardCode: 'IS 2925 / IS 3521',
      testMethod: 'IS 2925 Industrial Safety Helmet Impact Test',
      budget: '₹ 18.00 Lakh',
      status: 'Draft',
      statusType: 'neutral',
      date: '26 Aug 2026',
      deadline: '18 Sep 2026',
      quotesCount: 0,
      description: 'Supply of 1,200 High-Impact ISI marked safety helmets and Class 2 fall arrest harnesses for highway maintenance personnel.',
      clauses: [
        'Mandatory ISI mark embossed on shell per IS 2925:1984',
        'Heat resistance testing report from NABL accredited lab',
        'Reflective high-visibility stickers conforming to IRC standards'
      ]
    },
    {
      id: 'GEM/2026/B/6045',
      title: '33kV Medium Voltage Switchgear Panels',
      department: 'Power Grid Corporation of India (PGCIL)',
      category: 'Electrical Distribution',
      standardCode: 'IS 13118 / IS 2099',
      testMethod: 'IS 13118 High-Voltage AC Circuit Breaker Test',
      budget: '₹ 2.80 Crore',
      status: 'AI Ready',
      statusType: 'success',
      date: '25 Aug 2026',
      deadline: '22 Sep 2026',
      quotesCount: 4,
      description: 'Indoor vacuum circuit breaker panels complete with CT/PT and numerical protection relays.',
      clauses: [
        'Type test certificates conforming to IS 13118 from CPRI/ERDA',
        'IP55 enclosure protection per IS 12063',
        'Routine dielectric test reports prior to factory dispatch'
      ]
    },
    {
      id: 'GEM/2026/B/7719',
      title: 'Portland Pozzolana Cement (PPC)',
      department: 'Central Public Works Department (CPWD)',
      category: 'Construction Materials',
      standardCode: 'IS 1489 (Part 1)',
      testMethod: 'IS 4031 Physical Tests for Hydraulic Cement',
      budget: '₹ 85.00 Lakh',
      status: 'Evaluation',
      statusType: 'info',
      date: '24 Aug 2026',
      deadline: '08 Sep 2026',
      quotesCount: 6,
      description: 'Supply of 10,000 bags of fly ash based PPC cement for government housing project phase II.',
      clauses: [
        'Mandatory BIS license number and ISI mark on every bag',
        'Compressive strength 28-day certificate per IS 1489',
        'Fresh stock not older than 6 weeks from packaging date'
      ]
    },
    {
      id: 'GEM/2026/B/3310',
      title: 'Heavy Duty 1.1kV Armoured Copper Cables',
      department: 'Ministry of Defence (DGQA)',
      category: 'Electrical Distribution',
      standardCode: 'IS 694 / IS 1554',
      testMethod: 'IS 10810 Flame Retardant Low Smoke (FRLS) Test',
      budget: '₹ 64.00 Lakh',
      status: 'Quotes',
      statusType: 'warning',
      date: '22 Aug 2026',
      deadline: '12 Sep 2026',
      quotesCount: 8,
      description: 'XLPE insulated armoured multi-core power cables for military cantonment distribution network.',
      clauses: [
        'Mandatory BIS license under IS 1554 (Part 1)',
        'FRLS oxygen index minimum 29% per ASTM D2863',
        '100% conductivity test reports from NABL certified laboratory'
      ]
    }
  ];

  // Indian Standards Database
  const isStandardsList = [
    { code: 'IS 14896:2000', title: 'Electronic Computing Equipment & Terminals', sector: 'it', qco: 'Mandatory CRO Sched II', test: 'IS 13252 / IEC 60950', status: 'Active' },
    { code: 'IS 13252 (Part 1):2010', title: 'Information Technology Equipment - General Safety', sector: 'it', qco: 'DPIIT QCO 2021', test: 'Dielectric & Temperature Rise', status: 'Active' },
    { code: 'IS 14286:2010', title: 'Crystalline Silicon Terrestrial PV Modules', sector: 'solar', qco: 'MNRE Mandatory Order', test: 'Thermal Cycling & Damp Heat', status: 'Active' },
    { code: 'IS/IEC 61730-1:2004', title: 'Photovoltaic (PV) Module Safety Qualification', sector: 'solar', qco: 'ALMM Mandatory', test: 'Fire & Mechanical Load', status: 'Active' },
    { code: 'IS 2925:1984', title: 'Specification for Industrial Safety Helmets', sector: 'safety', qco: 'BIS QCO 2020 (ISI Mark)', test: 'Shock Absorption & Penetration', status: 'Active' },
    { code: 'IS 3521:1999', title: 'Industrial Safety Belts and Harnesses', sector: 'safety', qco: 'Mandatory ISI Mark', test: 'Dynamic Performance Test', status: 'Active' },
    { code: 'IS 13118:1991', title: 'High-Voltage Alternating-Current Circuit-Breakers', sector: 'electrical', qco: 'Central Electricity Order', test: 'Short-circuit & Impulse Test', status: 'Active' },
    { code: 'IS 1489 (Part 1):2015', title: 'Portland Pozzolana Cement - Fly Ash Based', sector: 'construction', qco: 'Mandatory BIS Quality Order', test: 'IS 4031 Fineness & Strength', status: 'Active' },
    { code: 'IS 694:2010', title: 'PVC Insulated Cables for Voltages up to 1100V', sector: 'electrical', qco: 'Mandatory ISI Order', test: 'Conductor Resistance & Insulation', status: 'Active' },
    { code: 'IS 1554 (Part 1):1988', title: 'PVC Insulated Heavy Duty Electrical Cables', sector: 'electrical', qco: 'DPIIT Cable Order', test: 'Armour Tensile & Cold Bend', status: 'Active' }
  ];

  // Vendor Directory
  const vendorsList = [
    { name: 'Larsen & Toubro Electricals Ltd.', gstin: '27AAACL0140P1ZT', msme: 'Large Enterprise', bisLicense: 'CM/L-8940291', rating: 4.9, location: 'Mumbai, Maharashtra', category: 'Electrical Distribution', status: 'Verified' },
    { name: 'Tata Power Solar Systems Ltd.', gstin: '29AAACT2727Q1ZW', msme: 'Large Enterprise', bisLicense: 'CM/L-7193021', rating: 4.8, location: 'Bengaluru, Karnataka', category: 'Solar & Renewable', status: 'Verified' },
    { name: 'Karam Safety Appliances Pvt. Ltd.', gstin: '07AAACK1049R1ZZ', msme: 'Medium Enterprise', bisLicense: 'CM/L-3349102', rating: 4.9, location: 'Noida, Uttar Pradesh', category: 'PPE & Safety', status: 'Verified' },
    { name: 'HCL Infosystems Procurement Div.', gstin: '06AAACH2109P1ZU', msme: 'Large Enterprise', bisLicense: 'CRS-R-4100293', rating: 4.7, location: 'Gurugram, Haryana', category: 'IT Hardware & Compute', status: 'Verified' },
    { name: 'UltraTech Cement Ltd. (Govt Supplies)', gstin: '27AAACU0391A1ZR', msme: 'Large Enterprise', bisLicense: 'CM/L-5049219', rating: 4.9, location: 'Mumbai, Maharashtra', category: 'Construction Materials', status: 'Verified' },
    { name: 'Havells India Industrial Systems', gstin: '07AAACH0892M1ZN', msme: 'Large Enterprise', bisLicense: 'CM/L-6184920', rating: 4.8, location: 'Noida, Uttar Pradesh', category: 'Electrical Distribution', status: 'Verified' }
  ];

  // Quotations Bid Database
  const quotationsDatabase = {
    'GEM/2026/B/8921': [
      { bidder: 'HCL Infosystems Ltd.', gstin: '06AAACH2109P1ZU', quotedPrice: '₹ 38,25,000', lRank: 'L1', score: 98.4, delivery: '14 Days', bisVerified: true },
      { bidder: 'Dell India Enterprise Div.', gstin: '29AAACD2409L1Z8', quotedPrice: '₹ 39,80,000', lRank: 'L2', score: 97.2, delivery: '21 Days', bisVerified: true },
      { bidder: 'HP India Govt Solutions', gstin: '07AAACH1249K1Z5', quotedPrice: '₹ 41,20,000', lRank: 'L3', score: 96.0, delivery: '15 Days', bisVerified: true },
      { bidder: 'Lenovo Commercial Pvt. Ltd.', gstin: '29AAACL4920R1ZT', quotedPrice: '₹ 42,00,000', lRank: 'L4', score: 95.5, delivery: '25 Days', bisVerified: true },
      { bidder: 'Acer India Tech Support', gstin: '29AAACA1092Q1ZV', quotedPrice: '₹ 42,40,000', lRank: 'L5', score: 94.0, delivery: '30 Days', bisVerified: true }
    ],
    'GEM/2026/B/4412': [
      { bidder: 'Tata Power Solar Systems', gstin: '29AAACT2727Q1ZW', quotedPrice: '₹ 1,08,50,000', lRank: 'L1', score: 99.1, delivery: '45 Days', bisVerified: true },
      { bidder: 'Adani Solar Manufacturing', gstin: '24AAACA0492P1ZP', quotedPrice: '₹ 1,12,00,000', lRank: 'L2', score: 98.0, delivery: '40 Days', bisVerified: true },
      { bidder: 'Vikram Solar Limited', gstin: '19AAACV2091R1ZQ', quotedPrice: '₹ 1,15,40,000', lRank: 'L3', score: 96.5, delivery: '50 Days', bisVerified: true }
    ]
  };

  const notificationList = [
    {
      id: 1,
      title: 'BIS Gazette Amendment Alert',
      desc: 'IS 14896:2026 Clause 4.2 has been updated by Bureau of Indian Standards committee.',
      time: '20 mins ago',
      type: 'warning'
    },
    {
      id: 2,
      title: '3 New Quotation Bids Received',
      desc: 'Suppliers submitted bids for Solar Panels [GEM/2026/B/4412].',
      time: '2 hours ago',
      type: 'success'
    },
    {
      id: 3,
      title: 'QCO Quality Control Order Passed',
      desc: 'DPIIT issued mandatory QCO order for electrical appliances.',
      time: '5 hours ago',
      type: 'info'
    },
    {
      id: 4,
      title: 'GeM L1 Benchmark Updated',
      desc: 'L1 price trend index recalculated for IT Computing devices.',
      time: '1 day ago',
      type: 'neutral'
    }
  ];

  // Route map helper
  const navigateTo = (route) => {
    window.location.hash = route;
  };

  // Sync hash routing
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;

      if (hash.startsWith('#/officer/tenders/') || hash.startsWith('#/officer-dashboard/tenders/')) {
        const id = hash.split('/').pop()?.replace(/-/g, '/');
        if (id && id !== 'create') {
          setSelectedTenderId(id);
          setActiveTab('TenderDetail');
          return;
        }
      }

      if (hash === '#/officer/tenders/create' || hash === '#/officer-dashboard/create') {
        setActiveTab('CreateTender');
        return;
      }

      switch (hash) {
        case '#/officer/tenders':
        case '#/officer-dashboard/tenders':
          setActiveTab('Tenders');
          break;
        case '#/officer/standards':
        case '#/officer-dashboard/standards':
          setActiveTab('Standards');
          break;
        case '#/officer/vendors':
        case '#/officer-dashboard/vendors':
          setActiveTab('Vendors');
          break;
        case '#/officer/quotations':
        case '#/officer-dashboard/quotations':
          setActiveTab('Quotations');
          break;
        case '#/officer/evaluation':
        case '#/officer-dashboard/evaluation':
          setActiveTab('Evaluation');
          break;
        case '#/officer/approvals':
        case '#/officer-dashboard/approvals':
          setActiveTab('Approvals');
          break;
        case '#/officer/analytics':
        case '#/officer-dashboard/analytics':
          setActiveTab('Analytics');
          break;
        case '#/officer/settings':
        case '#/officer-dashboard/settings':
          setActiveTab('Settings');
          break;
        case '#/':
        case '#':
        case '':
          if (activeTab !== 'Dashboard' && !hash.startsWith('#/officer')) {
            onBackToLanding?.();
          }
          break;
        default:
          setActiveTab('Dashboard');
          break;
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [onBackToLanding, activeTab]);

  const sidebarItems = [
    { name: 'Dashboard', icon, route: '#/officer/dashboard' },
    { name: 'Tenders', icon, route: '#/officer/tenders', badge: '12' },
    { name: 'Standards', icon, route: '#/officer/standards' },
    { name: 'Vendors', icon, route: '#/officer/vendors' },
    { name: 'Quotations', icon, route: '#/officer/quotations', badge: '7' },
    { name: 'Evaluation', icon, route: '#/officer/evaluation' },
    { name: 'Approvals', icon, route: '#/officer/approvals', badge: '4' },
    { name: 'Analytics', icon, route: '#/officer/analytics' },
    { name: 'Settings', icon, route: '#/officer/settings' },
  ];

  const currentTender = allTenders.find(t => t.id === selectedTenderId) || allTenders[0];

  const filteredTenders = allTenders.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.standardCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.department.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (tenderFilterTab === 'published') return t.status !== 'Draft';
    if (tenderFilterTab === 'aiready') return t.status === 'AI Ready';
    if (tenderFilterTab === 'quotes') return t.status === 'Quotes';
    if (tenderFilterTab === 'draft') return t.status === 'Draft';
    return true;
  });

  const filteredStandards = isStandardsList.filter(s => {
    const matchesSearch = s.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.qco.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (standardsCategory !== 'all') return s.sector === standardsCategory;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 antialiased selection:bg-orange-600 selection:text-white">
      
      {/* ========================================== */}
      {/* 1. TOP HEADER (NAVBAR) */}
      {/* ========================================== */}
      <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-6 lg:px-8 flex items-center justify-between shadow-xs">
        
        {/* Left: App Logo + GOVERNMENT WORKSPACE Subtitle */}
        <div className="flex items-center space-x-3">
          <div 
            onClick={() => navigateTo('#/officer/dashboard')}
            className="flex items-center space-x-2.5 cursor-pointer group"
            title="Dashboard Overview"
          >
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 fill-white/20 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-lg font-black tracking-tight text-slate-900 leading-tight">
                Sahayak
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                GOVERNMENT WORKSPACE
              </span>
            </div>
          </div>

          <span className="hidden md:inline-block h-5 w-px bg-slate-200 ml-2"></span>
          
          <div className="hidden md:flex items-center space-x-2 text-xs font-semibold text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>NIC Server DEL-04 (Active)</span>
          </div>
        </div>

        {/* Right, Search, Notifications & User Profile */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Quick Search */}
          <div className="hidden sm:flex items-center relative w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tenders, IS codes..." 
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100/80 hover:bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:bg-white transition-all text-slate-800"
            />
          </div>

          {/* Notification Bell with interactive drawer */}
          <div className="relative">
            <button 
              type="button" 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 flex items-center justify-center relative transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-600 ring-2 ring-white animate-pulse"></span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-slate-900">Procurement & BIS Alerts</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700">
                      {unreadNotifications} new
                    </span>
                  </div>
                  <button 
                    onClick={() => setUnreadNotifications(0)}
                    className="text-[11px] text-orange-600 font-bold hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notificationList.map((item) => (
                    <div key={item.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-start space-x-3 text-left">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        item.type === 'warning' ? 'bg-amber-100 text-amber-700' :
                        item.type === 'success' ? 'bg-emerald-100 text-emerald-700' :
                        item.type === 'info' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                        <span className="text-[10px] text-slate-400 font-medium mt-1 block">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button 
              type="button"
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center space-x-2.5 p-1.5 pl-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-full bg-orange-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                GO
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-slate-900 leading-tight">Officer</span>
                <span className="text-[10px] text-slate-400 font-medium leading-none">Procurement Lead</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-4 py-2 border-b border-slate-100 text-left">
                  <p className="text-xs font-bold text-slate-900">Officer Rajesh Sharma</p>
                  <p className="text-[11px] text-slate-500">sp.cbi@gov.in</p>
                </div>
                <button 
                  onClick={() => { setProfileDropdownOpen(false); navigateTo('#/officer/settings'); }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  Account Settings
                </button>
                <button 
                  onClick={() => { setProfileDropdownOpen(false); navigateTo('#/'); onBackToLanding?.(); }}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-100 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Exit to Main Website
                </button>
              </div>
            )}
          </div>

        </div>

      </header>

      {/* ========================================== */}
      {/* 2. BODY LAYOUT: LEFT SIDEBAR + MAIN CONTENT */}
      {/* ========================================== */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR NAVIGATION */}
        <aside className="w-60 lg:w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 overflow-y-auto">
          
          <div className="py-4">
            <div className="px-4 pb-2 text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                NAVIGATION
              </span>
            </div>

            <nav className="space-y-1 px-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.name || (item.name === 'Tenders' && (activeTab === 'TenderDetail' || activeTab === 'CreateTender'));

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => navigateTo(item.route)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-orange-50 text-orange-600 font-bold border-l-4 border-orange-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-orange-600' : 'text-slate-400'}`} />
                      <span>{item.name}</span>
                    </div>

                    {'badge' in item && (
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isActive 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer Help / GFR Compliance Info */}
          <div className="p-4 border-t border-slate-100 m-2 rounded-xl bg-slate-50/80 border text-left">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>GFR 144(i) Verified</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              BIS Standard Verification Engine v3.2 Active
            </p>
            <button
              type="button"
              onClick={() => { navigateTo('#/'); onBackToLanding?.(); }}
              className="mt-3 w-full py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200 flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              <span>Back to Home</span>
              <ArrowRight className="w-3 h-3 text-slate-400" />
            </button>
          </div>

        </aside>

        {/* MAIN CONTENT AREA (DYNAMIC PAGE SWITCHING) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50 text-left">
          
          <div className="max-w-6xl mx-auto space-y-6">

            {/* ========================================== */}
            {/* PAGE 1: DASHBOARD OVERVIEW */}
            {/* ========================================== */}
            {activeTab === 'Dashboard' && (
              <>
                {/* Top Greeting & Action Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      Good Morning, Officer
                    </h1>
                    <p className="text-sm text-slate-500 font-normal mt-0.5">
                      Here is the overview of your procurement activities.
                    </p>
                  </div>
                </div>

                {/* 3 KPI Metric Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  
                  {/* Card 1: 12 Active Tenders (Blue Icon) */}
                  <div 
                    onClick={() => navigateTo('#/officer/tenders')}
                    className="bg-white rounded-xl shadow-xs hover:shadow-md border border-slate-200 p-6 flex items-center justify-between transition-all group cursor-pointer"
                  >
                    <div>
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight block">
                        12
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 block">
                        Active Tenders
                      </span>
                      <span className="text-[11px] font-medium text-emerald-600 mt-2 inline-flex items-center gap-1">
                        <ArrowUpRight className="w-3 h-3" /> +2 published this week
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:scale-105 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 2: 4 Review Needed (Warning/Amber Icon) */}
                  <div 
                    onClick={() => navigateTo('#/officer/approvals')}
                    className="bg-white rounded-xl shadow-xs hover:shadow-md border border-slate-200 p-6 flex items-center justify-between transition-all group cursor-pointer"
                  >
                    <div>
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight block">
                        4
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 block">
                        Review Needed
                      </span>
                      <span className="text-[11px] font-medium text-amber-600 mt-2 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 2 pending BIS verification
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100 group-hover:scale-105 transition-transform">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                  </div>

                  {/* Card 3: 7 Quotes Received (Green Check Icon) */}
                  <div 
                    onClick={() => navigateTo('#/officer/quotations')}
                    className="bg-white rounded-xl shadow-xs hover:shadow-md border border-slate-200 p-6 flex items-center justify-between transition-all group cursor-pointer"
                  >
                    <div>
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight block">
                        7
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 block">
                        Quotes Received
                      </span>
                      <span className="text-[11px] font-medium text-emerald-600 mt-2 inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> 3 eligible for evaluation
                      </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                  </div>

                </div>

                {/* Recent Procurement Section (Table/List) */}
                <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
                  
                  <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-2.5">
                      <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                        Recent Procurement
                      </h2>
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                        {allTenders.slice(0, 3).length} Items
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => navigateTo('#/officer/tenders')}
                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Filter className="w-3.5 h-3.5 text-slate-400" />
                        <span>Filter</span>
                      </button>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                          <th className="py-3 px-5 sm:px-6">Project & Department</th>
                          <th className="py-3 px-4">IS Standards</th>
                          <th className="py-3 px-4">Est. Budget</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-5 sm:px-6 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-normal">
                        {allTenders.slice(0, 3).map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/60 transition-colors group">
                            
                            <td className="py-4 px-5 sm:px-6">
                              <div className="flex flex-col">
                                <span 
                                  onClick={() => navigateTo(`#/officer/tenders/${item.id.replace(/\//g, '-')}`)}
                                  className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors cursor-pointer"
                                >
                                  {item.title}
                                </span>
                                <div className="flex items-center space-x-2 mt-0.5 text-[11px] text-slate-500">
                                  <span className="font-mono">{item.id}</span>
                                  <span>•</span>
                                  <span>{item.department}</span>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                                <span className="font-mono text-xs font-bold text-slate-800 bg-orange-50/80 text-orange-950 px-2 py-0.5 rounded border border-orange-200/50">
                                  {item.standardCode}
                                </span>
                              </div>
                            </td>

                            <td className="py-4 px-4 font-semibold text-slate-800">
                              {item.budget}
                            </td>

                            <td className="py-4 px-4">
                              {item.status === 'AI Ready' && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                                  AI Ready
                                </span>
                              )}
                              {item.status === 'Quotes' && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-1.5"></span>
                                  Quotes ({item.quotesCount})
                                </span>
                              )}
                              {item.status === 'Draft' && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5"></span>
                                  Draft
                                </span>
                              )}
                            </td>

                            <td className="py-4 px-5 sm:px-6 text-right">
                              <button
                                type="button"
                                onClick={() => navigateTo(`#/officer/tenders/${item.id.replace(/\//g, '-')}`)}
                                className="inline-flex items-center space-x-1 text-orange-600 hover:text-orange-700 font-bold text-xs sm:text-sm hover:underline cursor-pointer"
                              >
                                <span>View</span>
                                <span aria-hidden="true">→</span>
                              </button>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Footer with Route Link */}
                  <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Showing 3 of 12 active procurements</span>
                    <button 
                      type="button"
                      onClick={() => navigateTo('#/officer/tenders')}
                      className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View All Tenders</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                </div>
              </>
            )}

            {/* ========================================== */}
            {/* PAGE 2: TENDERS MANAGEMENT PAGE (/officer/tenders) */}
            {/* ========================================== */}
            {activeTab === 'Tenders' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Header & Create CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Active Tender Directory</h1>
                    <p className="text-sm text-slate-500">Browse, filter, and audit all active tenders with real-time BIS compliance tracking.</p>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                  {[
                    { id: 'all', label: `All Tenders (${allTenders.length})` },
                    { id: 'published', label: 'Published & Active' },
                    { id: 'aiready', label: 'AI Ready (BIS Validated)' },
                    { id: 'quotes', label: 'Quotes Received' },
                    { id: 'draft', label: 'Drafts' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setTenderFilterTab(tab.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        tenderFilterTab === tab.id
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tenders Table */}
                <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200">
                          <th className="py-3 px-6">Tender Title & Reference</th>
                          <th className="py-3 px-4">Mandatory IS Codes</th>
                          <th className="py-3 px-4">Sanctioned Budget</th>
                          <th className="py-3 px-4">Bids Received</th>
                          <th className="py-3 px-4">Bid Deadline</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs font-normal">
                        {filteredTenders.map((tender) => (
                          <tr key={tender.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="py-4 px-6">
                              <div className="flex flex-col">
                                <span 
                                  onClick={() => navigateTo(`#/officer/tenders/${tender.id.replace(/\//g, '-')}`)}
                                  className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors cursor-pointer"
                                >
                                  {tender.title}
                                </span>
                                <span className="text-[11px] text-slate-500 font-mono mt-0.5">{tender.id} • {tender.department}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 font-mono font-bold text-orange-700">
                              <span className="bg-orange-50 px-2 py-0.5 rounded border border-orange-200">{tender.standardCode}</span>
                            </td>
                            <td className="py-4 px-4 font-bold text-slate-900">{tender.budget}</td>
                            <td className="py-4 px-4 font-semibold text-slate-700">{tender.quotesCount} Submissions</td>
                            <td className="py-4 px-4 text-slate-600">{tender.deadline}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                tender.status === 'AI Ready' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                tender.status === 'Quotes' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                                tender.status === 'Evaluation' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {tender.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => navigateTo(`#/officer/tenders/${tender.id.replace(/\//g, '-')}`)}
                                className="inline-flex items-center space-x-1 text-orange-600 hover:text-orange-700 font-bold hover:underline cursor-pointer"
                              >
                                <span>View →</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* PAGE 3: TENDER DETAIL PAGE (/officer/tenders/[id]) */}
            {/* ========================================== */}
            {activeTab === 'TenderDetail' && (
              <div className="space-y-6 animate-in fade-in">
                {/* Breadcrumb Navigation */}
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
                  <span onClick={() => navigateTo('#/officer/tenders')} className="hover:text-orange-600 cursor-pointer">Tenders</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-900 font-bold">{currentTender.id}</span>
                </div>

                {/* Header Card */}
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
                    <div>
                      <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-orange-100 text-orange-800 text-[11px] font-bold mb-2">
                        <span>{currentTender.id}</span>
                        <span>•</span>
                        <span>{currentTender.category}</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-900">{currentTender.title}</h1>
                      <p className="text-xs text-slate-500 mt-1">{currentTender.department}</p>
                    </div>

                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => alert(`Exported complete GeM Clause PDF for ${currentTender.id}`)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export GeM Clauses</span>
                      </button>
                      <button 
                        onClick={() => alert(`Tender ${currentTender.id} submitted for e-Sign authorization`)}
                        className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                      >
                        Submit for Approval
                      </button>
                    </div>
                  </div>

                  {/* Summary Metric Strip */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Linked IS Standards</span>
                      <span className="text-sm font-mono font-bold text-orange-600 mt-1 block">{currentTender.standardCode}</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Sanctioned Estimate</span>
                      <span className="text-sm font-bold text-slate-900 mt-1 block">{currentTender.budget}</span>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] font-bold text-slate-400 uppercase block">Testing Benchmark</span>
                      <span className="text-sm font-semibold text-slate-800 mt-1 block">{currentTender.testMethod}</span>
                    </div>
                  </div>

                  {/* Specification & Scope */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Scope of Supply & Technical Requirements</h3>
                    <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {currentTender.description}
                    </p>
                  </div>

                  {/* AI Compliance Clauses */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Mandatory BIS & GeM Compliance Clauses</h3>
                    <div className="space-y-2.5">
                      {currentTender.clauses.map((clause, idx) => (
                        <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{clause}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Received Bids Preview */}
                  {quotationsDatabase[currentTender.id] && (
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 mb-3">Incoming Vendor Quotations & Bids</h3>
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-400 uppercase font-bold border-b">
                            <tr>
                              <th className="p-3.5">Bidder Enterprise</th>
                              <th className="p-3.5">Quoted Total</th>
                              <th className="p-3.5">Rank</th>
                              <th className="p-3.5">IS Compliance</th>
                              <th className="p-3.5">Delivery Time</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {quotationsDatabase[currentTender.id].map((quote, qidx) => (
                              <tr key={qidx} className="hover:bg-slate-50">
                                <td className="p-3.5 font-bold text-slate-900">{quote.bidder}</td>
                                <td className="p-3.5 font-mono font-bold text-slate-900">{quote.quotedPrice}</td>
                                <td className="p-3.5">
                                  <span className={`px-2 py-0.5 rounded font-bold ${quote.lRank === 'L1' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                                    {quote.lRank}
                                  </span>
                                </td>
                                <td className="p-3.5 text-emerald-600 font-semibold">✓ {quote.score}% Verified</td>
                                <td className="p-3.5 text-slate-600">{quote.delivery}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* PAGE 4: CREATE TENDER WIZARD (/officer/tenders/create) */}
            {/* ========================================== */}
            {activeTab === 'CreateTender' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Create AI-Compliant Tender Draft</h1>
                    <p className="text-sm text-slate-500">Auto-match Indian Standards (IS), testing protocols, and GeM tender clauses.</p>
                  </div>
                  <button
                    onClick={() => navigateTo('#/officer/tenders')}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                  <form onSubmit={(e) => { e.preventDefault(); alert('Tender Draft Created & Validated Successfully!'); navigateTo('#/officer/tenders'); }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Tender Title / Product Spec *</label>
                        <input required placeholder="e.g. 33kV Vacuum Circuit Breaker Panels" className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Procuring Department *</label>
                        <select className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600 bg-white">
                          <option>Central Public Works Department (CPWD)</option>
                          <option>Central Bureau of Investigation (CBI)</option>
                          <option>Ministry of New & Renewable Energy (MNRE)</option>
                          <option>National Highways Authority (NHAI)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Estimated Tender Value (INR) *</label>
                        <input required placeholder="e.g. ₹ 45,00,000" className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Bid Submission Duration</label>
                        <select className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600 bg-white">
                          <option>14 Days (Fast-track GeM)</option>
                          <option>21 Days (Standard GFR)</option>
                          <option>30 Days (Global / ICB)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">Raw Specification / Scope of Work *</label>
                      <textarea rows={3} required placeholder="Paste draft specifications, voltage ratings, or equipment requirements..." className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600" />
                    </div>

                    <div className="p-4 bg-orange-50/80 rounded-xl border border-orange-200 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Sparkles className="w-5 h-5 text-orange-600" />
                        <div>
                          <div className="text-xs font-bold text-orange-950">AI Instant Standards Matcher Active</div>
                          <div className="text-[11px] text-orange-800">Scans 20,000+ BIS active gazettes for mandatory QCO orders.</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-orange-600 text-white font-bold text-[11px]">Auto-Detecting</span>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                      <button type="button" onClick={() => navigateTo('#/officer/tenders')} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100">Cancel</button>
                      <button type="submit" className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer">Generate & Save Tender Draft</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* PAGE 5: STANDARDS LOOKUP PAGE (/officer/standards) */}
            {/* ========================================== */}
            {activeTab === 'Standards' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Indian Standards & BIS QCO Directory</h1>
                  <p className="text-sm text-slate-500">Live repository of 20,000+ Bureau of Indian Standards (BIS) specifications, mandatory QCO orders, and laboratory test methods.</p>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
                  {[
                    { id: 'all', label: 'All Sectors' },
                    { id: 'it', label: 'IT & Electronics' },
                    { id: 'solar', label: 'Solar & Renewable' },
                    { id: 'safety', label: 'PPE & Industrial Safety' },
                    { id: 'electrical', label: 'Electrical & Cables' },
                    { id: 'construction', label: 'Civil & Construction' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setStandardsCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        standardsCategory === cat.id
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Standards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredStandards.map((std) => (
                    <div key={std.code} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 hover:border-orange-300 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-orange-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">{std.code}</span>
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">{std.status}</span>
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{std.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Mandatory Test: {std.test}</p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-600">QCO Order: <strong className="text-slate-900">{std.qco}</strong></span>
                        <button 
                          onClick={() => alert(`Opening official BIS Gazette details for ${std.code}`)}
                          className="text-orange-600 hover:underline font-bold"
                        >
                          View Gazette →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* PAGE 6: VENDORS PAGE (/officer/vendors) */}
            {/* ========================================== */}
            {activeTab === 'Vendors' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Verified Vendor & Supplier Registry</h1>
                  <p className="text-sm text-slate-500">Government e-Marketplace verified suppliers with active BIS licenses, GSTIN compliance, and MSME ratings.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-6">Supplier Name & Location</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">GSTIN / Enterprise Class</th>
                          <th className="py-3 px-4">BIS License No.</th>
                          <th className="py-3 px-4">Performance</th>
                          <th className="py-3 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {vendorsList.map((vendor, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-4 px-6">
                              <div className="font-bold text-slate-900">{vendor.name}</div>
                              <div className="text-[11px] text-slate-500">{vendor.location}</div>
                            </td>
                            <td className="py-4 px-4 font-semibold text-slate-700">{vendor.category}</td>
                            <td className="py-4 px-4 font-mono text-slate-600">
                              <div>{vendor.gstin}</div>
                              <div className="text-[11px] text-slate-400">{vendor.msme}</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                                {vendor.bisLicense}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-bold text-orange-600">★ {vendor.rating}</td>
                            <td className="py-4 px-6 text-right">
                              <button 
                                onClick={() => alert(`Opening compliance profile for ${vendor.name}`)}
                                className="text-orange-600 hover:text-orange-700 font-bold hover:underline cursor-pointer"
                              >
                                Audit Profile →
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* PAGE 7: QUOTATIONS PAGE (/officer/quotations) */}
            {/* ========================================== */}
            {activeTab === 'Quotations' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Quotations & Bid Evaluations</h1>
                    <p className="text-sm text-slate-500">Commercial bid analysis and L1 pricing rankings for active e-Tenders.</p>
                  </div>
                  
                  {/* Select Tender Filter */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-600">Select Project:</span>
                    <select 
                      value={quotationsTenderId} 
                      onChange={(e) => setQuotationsTenderId(e.target.value)}
                      className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-600"
                    >
                      <option value="GEM/2026/B/8921">GEM/2026/B/8921 - Laptop Procurement</option>
                      <option value="GEM/2026/B/4412">GEM/2026/B/4412 - Solar Panels</option>
                    </select>
                  </div>
                </div>

                {/* Comparison Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                  <div className="p-4 bg-orange-50/50 border-b border-orange-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-950">Active Tender: {quotationsTenderId}</span>
                    <span className="text-xs font-semibold text-emerald-700">✓ L1 Bidder saves 10.0% under sanctioned estimate</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b">
                        <tr>
                          <th className="py-3 px-6">Bidder Name</th>
                          <th className="py-3 px-4">Quoted Bid Amount</th>
                          <th className="py-3 px-4">GeM Rank</th>
                          <th className="py-3 px-4">IS Standards Score</th>
                          <th className="py-3 px-4">Delivery Lead Time</th>
                          <th className="py-3 px-6 text-right">Evaluation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(quotationsDatabase[quotationsTenderId] || quotationsDatabase['GEM/2026/B/8921']).map((bid, bidx) => (
                          <tr key={bidx} className="hover:bg-slate-50">
                            <td className="py-4 px-6 font-bold text-slate-900">
                              <div>{bid.bidder}</div>
                              <div className="text-[11px] text-slate-400 font-mono">{bid.gstin}</div>
                            </td>
                            <td className="py-4 px-4 font-mono text-sm font-black text-slate-900">{bid.quotedPrice}</td>
                            <td className="py-4 px-4">
                              <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${bid.lRank === 'L1' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                                {bid.lRank} Bidder
                              </span>
                            </td>
                            <td className="py-4 px-4 text-emerald-700 font-bold">✓ {bid.score}% Pass</td>
                            <td className="py-4 px-4 text-slate-600">{bid.delivery}</td>
                            <td className="py-4 px-6 text-right">
                              <button 
                                onClick={() => alert(`Bid ${bid.bidder} selected for technical scrutiny`)}
                                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-xs cursor-pointer"
                              >
                                Select Bid
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* PAGE 8: EVALUATION WORKFLOW PAGE (/officer/evaluation) */}
            {/* ========================================== */}
            {activeTab === 'Evaluation' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Technical & Financial Evaluation Matrix</h1>
                  <p className="text-sm text-slate-500">Structured evaluation workflow adhering to General Financial Rules (GFR 2017 Rule 144(i)).</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { step: '1', title: 'Technical Scrutiny', status: 'Completed', color: 'emerald' },
                    { step: '2', title: 'BIS Lab Test Verification', status: 'In Progress', color: 'orange' },
                    { step: '3', title: 'Land Border Declaration', status: 'Pending', color: 'slate' },
                    { step: '4', title: 'Final L1 Sanction', status: 'Pending', color: 'slate' },
                  ].map((s) => (
                    <div key={s.step} className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Step {s.step}</span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1">{s.title}</h4>
                      <span className={`mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.color === 'emerald' ? 'bg-emerald-100 text-emerald-800' :
                        s.color === 'orange' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Automated Scoring Matrix for GEM/2026/B/8921</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">1. IS 14896 / IS 13252 Valid CRS Registration</span>
                      <span className="font-bold text-emerald-600">✓ 100% Passed (All Bidders)</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">2. BEE Energy 5-Star Benchmark Compliance</span>
                      <span className="font-bold text-emerald-600">✓ 100% Passed</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">3. GFR Rule 144(i) Land Border Declaration</span>
                      <span className="font-bold text-amber-600">⏳ Verification in Progress</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* PAGE 9: APPROVALS PAGE (/officer/approvals) */}
            {/* ========================================== */}
            {activeTab === 'Approvals' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Pending Officer Approvals & e-Sign</h1>
                  <p className="text-sm text-slate-500">Authorize tender publications, technical evaluation reports, and supplier contracts.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'APP-9041', title: 'Tender Award Sanction for GEM/2026/B/8921', bidder: 'HCL Infosystems (L1 - ₹38.25 Lakh)', priority: 'HIGH' },
                    { id: 'APP-9042', title: 'Technical Specification Approval for 33kV Switchgear', bidder: 'PowerGrid Division (₹2.80 Cr)', priority: 'URGENT' },
                    { id: 'APP-9043', title: 'QCO Exemption Audit Sign-off for Highway Safety Helmets', bidder: 'NHAI Maintenance Wing', priority: 'MEDIUM' },
                    { id: 'APP-9044', title: 'Vendor MSME Price Preference Approval', bidder: 'Karam Safety Appliances', priority: 'LOW' }
                  ].map((app) => (
                    <div key={app.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-slate-400">{app.id}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            app.priority === 'URGENT' ? 'bg-red-100 text-red-800' :
                            app.priority === 'HIGH' ? 'bg-orange-100 text-orange-800' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {app.priority}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mt-1">{app.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{app.bidder}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => alert(`Details opened for ${app.id}`)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                        >
                          Review
                        </button>
                        <button 
                          onClick={() => alert(`Document ${app.id} digitally signed with NIC e-Sign certificate`)}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                        >
                          Sign with DSC
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* PAGE 10: ANALYTICS PAGE (/officer/analytics) */}
            {/* ========================================== */}
            {activeTab === 'Analytics' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Procurement & Compliance Analytics</h1>
                  <p className="text-sm text-slate-500">Live operational metrics, budget savings, and Bureau of Indian Standards compliance rates.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-bold text-slate-400 uppercase">Total Sanctioned Spend</span>
                    <span className="text-3xl font-black text-slate-900 mt-1 block">₹ 18.40 Cr</span>
                    <span className="text-[11px] font-medium text-emerald-600 mt-2 block">↑ 14.2% optimized under GeM benchmark</span>
                  </div>

                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-bold text-slate-400 uppercase">BIS Compliance Rate</span>
                    <span className="text-3xl font-black text-emerald-600 mt-1 block">99.8%</span>
                    <span className="text-[11px] font-medium text-slate-500 mt-2 block">100% active QCO order coverage</span>
                  </div>

                  <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-xs font-bold text-slate-400 uppercase">Avg. Procurement Cycle</span>
                    <span className="text-3xl font-black text-orange-600 mt-1 block">4.2 Days</span>
                    <span className="text-[11px] font-medium text-emerald-600 mt-2 block">↓ 68% faster than traditional tenders</span>
                  </div>
                </div>

                {/* Spend Breakdown Bar Graphic */}
                <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900">Procurement Volume by Department</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>CPWD (Civil & Construction)</span>
                        <span>₹ 7.2 Cr (39%)</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-600 rounded-full" style={{ width: '39%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>MNRE (Solar & Renewable)</span>
                        <span>₹ 5.1 Cr (28%)</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                        <span>CBI (IT Hardware & Cyber Compute)</span>
                        <span>₹ 3.3 Cr (18%)</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================== */}
            {/* PAGE 11: SETTINGS PAGE (/officer/settings) */}
            {/* ========================================== */}
            {activeTab === 'Settings' && (
              <div className="space-y-6 animate-in fade-in">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Officer Workspace Settings</h1>
                  <p className="text-sm text-slate-500">Configure officer credentials, NIC SSO, digital certificates, and alert preferences.</p>
                </div>

                {settingsSavedToast && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Officer Profile & Security Settings Saved Successfully!</span>
                  </div>
                )}

                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
                  <form onSubmit={(e) => { e.preventDefault(); setSettingsSavedToast(true); setTimeout(() => setSettingsSavedToast(false), 3000); }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Officer Full Name</label>
                        <input defaultValue="Rajesh Kumar Sharma" className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Designation & Cadre</label>
                        <input defaultValue="Executive Engineer / Central Civil Services" className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Official NIC Email</label>
                        <input disabled defaultValue="sp.cbi@gov.in" className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-50 text-slate-500 rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">Department</label>
                        <input defaultValue="Central Bureau of Investigation (CBI)" className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600" />
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">National Single Sign-On (MeriPehchaan / Jan Parichay)</div>
                        <div className="text-[11px] text-slate-500">Authenticated via NIC Central Gateway. Token valid for 24h.</div>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">Active</span>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-slate-100">
                      <button type="submit" className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer">
                        Save Preferences
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>

        </main>

      </div>

    </div>
  );
};
