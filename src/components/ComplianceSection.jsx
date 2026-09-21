import React from 'react';
import { 
  ShieldCheck, 
  Scale, 
  Building2, 
  CheckCircle, 
  Award,
  BookOpen
} from 'lucide-react';

export const ComplianceSection = () => {
  const compliancePillars = [
    {
      icon: <Scale className="w-6 h-6 text-blue-600" />,
      title: 'GFR 2017 Rule 144(i) Alignment',
      subtitle: 'Mandatory Technical Conformance',
      description: 'Ensures tender criteria mandate recognized Indian Standards (published by BIS), preventing vendor disputes and technical disqualification appeals.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-teal-600" />,
      title: 'DPIIT Mandatory QCO 2026',
      subtitle: 'Statutory Certification Verification',
      description: 'Cross-checks items against 850+ published Quality Control Orders. Automatically verifies if ISI certification or CRS registration is mandatory by law.'
    },
    {
      icon: <Building2 className="w-6 h-6 text-indigo-600" />,
      title: 'GeM & CPPP Portal Synergy',
      subtitle: 'Standardized Tender Cataloging',
      description: 'Generates standardized product category codes and technical parameters formatted for seamless upload onto the Government e-Marketplace.'
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-600" />,
      title: 'Make in India (MII) Order Sync',
      subtitle: 'Local Content & Testing Facilities',
      description: 'Identifies mandatory domestic testing standards and NABL-accredited laboratory test protocols under the Public Procurement Order.'
    }
  ];

  return (
    <section id="compliance" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Statutory & Regulatory Alignment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Institutional Trust & Full Statutory Compliance
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Sahayak is engineered to adhere strictly to government procurement directives, ministry guidelines, and Bureau of Indian Standards protocols.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {compliancePillars.map((pillar, index) => (
            <div
              key={index}
              className="card-surface rounded-2xl p-6 flex flex-col justify-between hover:border-blue-300 transition-all duration-200"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-4">
                  {pillar.icon}
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {pillar.subtitle}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs text-teal-700 font-semibold">
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                <span>Audited & Verified</span>
              </div>
            </div>
          ))}
        </div>

        {/* Government Integration Callout Box */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-md">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                <BookOpen className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  Bureau of Indian Standards (BIS) Gazette & Reaffirmation Database
                </h4>
                <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl font-light">
                  Continuous synchronization with the Gazette of India ensures zero obsolete standards in your procurement tenders.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white/10 text-white border border-white/20">
                BIS Act 2016 Aligned
              </span>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-400/30">
                Smart India Hackathon 2026
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
