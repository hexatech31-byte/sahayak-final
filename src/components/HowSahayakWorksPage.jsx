import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Scale, 
  Layers, 
  Building2, 
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  Navbar, 
  Footer, 
  AuthModal, 
  DemoModal, 
  WorkflowCarousel, 
  WORKFLOW_STEPS 
} from './LandingPage';

export function HowSahayakWorksPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenFinder = () => {
    if (user) {
      navigate('/procurement');
    } else {
      handleOpenAuth('signup');
    }
  };

  const handleLoginSuccess = () => {
    setAuthModalOpen(false);
    navigate('/procurement');
  };

  const handleCarouselNavigate = (route) => {
    if (user) {
      navigate(route);
    } else {
      handleOpenAuth('signup');
    }
  };

  const stepDetails = [
    {
      num: '01',
      title: 'Smart Requirement Intake',
      subtitle: 'Plain Text, Specifications or Bid PDF',
      desc: 'Paste requirements in natural language or upload standard tender files. Sahayak processes multi-page documents, extracting core technical parameters seamlessly.',
      badge: 'Step 01',
      color: 'border-blue-500/30 bg-blue-50/50 text-blue-700'
    },
    {
      num: '02',
      title: 'Semantic BIS Standard Alignment',
      subtitle: 'Active IS Codes & Mandatory QCOs',
      desc: 'Our AI engine maps your specifications against thousands of Indian Standards, identifying primary IS numbers, test methods, and mandatory Quality Control Orders.',
      badge: 'Step 02',
      color: 'border-orange-500/30 bg-orange-50/50 text-[#FA4D09]'
    },
    {
      num: '03',
      title: 'Error-Proof Specification Clauses',
      subtitle: 'Eliminate Restrictive & Missing Clauses',
      desc: 'Automatically generate neutral, legally sound, and standards-compliant clauses that prevent tender cancellations and vendor disputes.',
      badge: 'Step 03',
      color: 'border-emerald-500/30 bg-emerald-50/50 text-emerald-700'
    },
    {
      num: '04',
      title: 'GeM & Gazette Ready Export',
      subtitle: 'Official RFP & Tender Publication',
      desc: 'Export structured tender text formatted for Government e-Marketplace (GeM) custom bids and official Gazette publication in one click.',
      badge: 'Step 04',
      color: 'border-purple-500/30 bg-purple-50/50 text-purple-700'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-sans text-slate-800 flex flex-col antialiased selection:bg-[#FA4D09] selection:text-white">
      
      {/* Navbar */}
      <Navbar 
        activePage="how-sahayak-works"
        onOpenAuth={handleOpenAuth}
        onOpenFinder={handleOpenFinder}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-24 sm:pt-28 pb-16">
        
        {/* Page Header */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center mb-10 sm:mb-14">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/70 border border-orange-200/80 text-[#FA4D09] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
            <Sparkles size={14} className="text-[#FA4D09]" />
            <span>Interactive Workflow Demonstration</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#041D3F] tracking-tight leading-tight">
            How <span className="text-[#FA4D09]">Sahayak</span> Works
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
            From unstructured tender text to verified Indian Standards in seconds. Experience our end-to-end intelligent procurement engine.
          </p>

        </section>

        {/* Slideshow Presentation Container */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-16">
          <div className="bg-white p-3 sm:p-5 rounded-3xl sm:rounded-4xl shadow-2xl shadow-slate-900/10 border border-slate-200/80">
            <WorkflowCarousel 
              steps={WORKFLOW_STEPS} 
              initialSlide={0} 
              onNavigate={handleCarouselNavigate}
              className="w-full rounded-2xl sm:rounded-3xl border border-white/80"
            />
          </div>
        </section>

        {/* Step Breakdown Cards */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-16">
          
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-[#041D3F] tracking-tight">
              Four Steps to Zero Tender Errors
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600">
              A structured AI-guided workflow designed specifically for public procurement officers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stepDetails.map((item, idx) => (
              <div 
                key={idx}
                className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden text-left"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <span className={	ext-xs font-bold px-3 py-1 rounded-full border }>
                    {item.badge}
                  </span>
                  <span className="font-mono text-2xl font-black text-slate-300">
                    {item.num}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#041D3F] mb-1">
                  {item.title}
                </h3>
                
                <h4 className="text-xs font-bold text-[#FA4D09] uppercase tracking-wide mb-2.5">
                  {item.subtitle}
                </h4>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

        </section>

        {/* Call to Action Banner */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#041D3F] to-[#0A3060] rounded-3xl p-8 sm:p-12 text-center text-white shadow-xl shadow-slate-950/15 relative overflow-hidden">
            
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                Ready to Create Standards-Compliant Tenders?
              </h2>
              <p className="text-sm sm:text-base text-slate-200 font-medium">
                Get instant recommendations for IS codes, test methods, and QCO mandates in your next tender document.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleOpenFinder}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-sm sm:text-base font-bold text-white bg-[#FA4D09] hover:bg-[#e04305] active:bg-[#c93c04] rounded-full shadow-lg shadow-[#FA4D09]/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer onOpenAuth={handleOpenAuth} />

      {/* Modals */}
      {authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {demoModalOpen && (
        <DemoModal
          isOpen={demoModalOpen}
          onClose={() => setDemoModalOpen(false)}
        />
      )}

    </div>
  );
}

export default HowSahayakWorksPage;
