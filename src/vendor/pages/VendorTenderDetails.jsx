import React from 'react';
import {
  Calendar,
  IndianRupee,
  Package,
  MapPin,
  Clock,
  CheckCircle2,
  Download,
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
} from 'lucide-react';
import { VendorLayout } from '../components/VendorLayout';
import { StatusBadge } from '../components/StatusBadge';
import { TENDER_DETAILS } from '../data/mockVendorData';
import { useNavigate, useParams } from 'react-router-dom';

export const VendorTenderDetails = () => {
  const navigate = useNavigate();
  const { id: tenderId = '' } = useParams();
  const tender = TENDER_DETAILS[tenderId];

  if (!tender) {
    return (
      <VendorLayout title="Tender Not Found">
        <div className="text-center py-16 text-sm text-slate-400">
          This tender could not be found.
          <div className="mt-4">
            <button
              onClick={() => navigate('/vendor/tenders')}
              className="text-orange-600 font-bold text-sm cursor-pointer"
            >
              Back to Tenders
            </button>
          </div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout title="Tender Details" subtitle={tender.tenderId}>
      <button
        onClick={() => navigate('/vendor/tenders')}
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-orange-600 mb-4 cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        <span>Back to Tenders</span>
      </button>

      {/* Top section */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{tender.title}</h2>
            <p className="text-xs text-slate-500 mt-1">
              Tender ID: <span className="font-semibold text-slate-700">{tender.tenderId}</span> &middot; {tender.organization}
            </p>
          </div>
          <StatusBadge status={tender.status} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Estimated Value</p>
              <p className="text-sm font-bold text-slate-800">{tender.estimatedValue}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Quotation Deadline</p>
              <p className="text-sm font-bold text-slate-800">{tender.deadline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Quantity</p>
              <p className="text-sm font-bold text-slate-800">{tender.quantity}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview */}
      <Section title="Overview">
        <p className="text-sm text-slate-600 leading-relaxed">{tender.overview}</p>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          <InfoRow icon={Package} label="Quantity" value={tender.quantity} />
          <InfoRow icon={MapPin} label="Delivery Location" value={tender.deliveryLocation} />
          <InfoRow icon={Clock} label="Expected Delivery" value={tender.deliveryPeriod} />
        </div>
      </Section>

      {/* Technical Requirements */}
      <Section title="Technical Requirements" subtitle={tender.product}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tender.technicalParameters.map((p) => (
            <div key={p.id} className="border border-slate-200 rounded-lg p-3.5">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{p.label}</p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">{p.required}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Applicable Standards */}
      <Section title="Applicable Standards" subtitle="Required Indian Standards" highlight>
        <div className="mb-3 flex items-start gap-2 text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <span>
            Standards data shown below is structured demo/placeholder content for this prototype and is not a verified
            Indian Standards determination. Real standards data will replace this once connected to the standards engine.
          </span>
        </div>
        <div className="space-y-3">
          {tender.applicableStandards.map((s) => (
            <div key={s.id} className="flex items-start justify-between gap-3 border border-slate-200 rounded-lg p-4">
              <div className="flex items-start gap-3 min-w-0">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900">{s.code}</p>
                  <p className="text-[11px] font-semibold text-orange-700 mt-0.5">{s.category}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.summary}</p>
                </div>
              </div>
              <button className="text-[11px] font-bold text-orange-600 hover:text-orange-700 whitespace-nowrap cursor-pointer">
                View Details
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* Certification Requirements */}
      <Section title="Certification Requirements">
        <div className="grid sm:grid-cols-3 gap-3">
          {tender.certifications.map((c) => (
            <div key={c.id} className="flex items-center gap-2.5 border border-slate-200 rounded-lg p-3.5">
              <ShieldCheck className="w-4.5 h-4.5 text-orange-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-slate-800">{c.name}</p>
                <p className="text-[10px] text-slate-500">{c.required ? 'Required' : 'Optional'}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Required Documents */}
      <Section title="Required Documents">
        <div className="divide-y divide-slate-100">
          {tender.requiredDocuments.map((d) => (
            <div key={d.id} className="flex items-center justify-between py-3">
              <span className="text-sm text-slate-700">{d.name}</span>
              <StatusBadge status={d.status} />
            </div>
          ))}
        </div>
      </Section>

      {/* Downloads */}
      <Section title="Downloads">
        <div className="grid sm:grid-cols-3 gap-3">
          {['Download Tender Document', 'Download Technical Requirements', 'Download Supporting Documents'].map((label) => (
            <button
              key={label}
              onClick={() => alert('Document download will be available once file storage is connected to the backend.')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </Section>

      {/* Primary CTAs */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
        <button
          onClick={() => navigate(`/vendor/tenders/${tender.id}/compliance`)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
        >
          <span>Start Compliance Response</span>
        </button>
        <button
          onClick={() => navigate(`/vendor/tenders/${tender.id}/quotation`)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-full shadow-md shadow-orange-600/20 transition-colors cursor-pointer"
        >
          <span>Submit Quotation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </VendorLayout>
  );
};

const Section = ({
  title,
  subtitle,
  highlight,
  children,
}) => (
  <div className={`bg-white rounded-xl border p-5 sm:p-6 mb-6 ${highlight ? 'border-orange-200' : 'border-slate-200'}`}>
    <div className="mb-4">
      <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2.5">
    <Icon className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
    <div>
      <p className="text-[10px] text-slate-400 font-semibold uppercase">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  </div>
);
