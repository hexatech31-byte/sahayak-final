import React, { useMemo, useState } from 'react';
import { ChevronLeft, CheckCircle2 } from 'lucide-react';
import { VendorLayout } from '../components/VendorLayout';
import { DocumentUploadCard } from '../components/DocumentUploadCard';
import { ConfirmModal } from '../components/ConfirmModal';
import { TENDER_DETAILS, PRIMARY_QUOTATION_COMMERCIALS } from '../data/mockVendorData';
import { useNavigate, useParams } from 'react-router-dom';

function formatINR(n) {
  return '\u20b9' + n.toLocaleString('en-IN');
}

export const VendorQuotationSubmit = () => {
  const navigate = useNavigate();
  const { id: tenderId = '' } = useParams();
  const tender = TENDER_DETAILS[tenderId];

  const isPrimary = tenderId === Object.keys(TENDER_DETAILS)[0];
  const seed = isPrimary
    ? PRIMARY_QUOTATION_COMMERCIALS
    : { productPrice: 0, gst: 0, deliveryCharges: 0, installationCharges: 0 };

  const [productPrice, setProductPrice] = useState(seed.productPrice);
  const [gst, setGst] = useState(seed.gst);
  const [deliveryCharges, setDeliveryCharges] = useState(seed.deliveryCharges);
  const [installationCharges, setInstallationCharges] = useState(seed.installationCharges);
  const [deliveryTime, setDeliveryTime] = useState(isPrimary ? '30 days' : '');
  const [warranty, setWarranty] = useState(isPrimary ? '5 years' : '');
  const [paymentTerms, setPaymentTerms] = useState(isPrimary ? '30% advance' : '');
  const [notes, setNotes] = useState('');

  const [documents, setDocuments] = useState({
    'BIS Certificate': isPrimary ? 'BIS_Certificate_2026.pdf' : null,
    'Test Reports': isPrimary ? 'Test_Report_2026.pdf' : null,
    'Company Registration': isPrimary ? 'Company_Registration.pdf' : null,
    'Previous Experience': null,
    'Product Datasheet': isPrimary ? 'Product_Datasheet.pdf' : null,
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const total = useMemo(
    () => (Number(productPrice) || 0) + (Number(gst) || 0) + (Number(deliveryCharges) || 0) + (Number(installationCharges) || 0),
    [productPrice, gst, deliveryCharges, installationCharges]
  );

  const docsUploadedCount = Object.values(documents).filter(Boolean).length;
  const docsTotal = Object.keys(documents).length;
  const requirementsResponded = tender?.technicalParameters.length ?? 8;
  const requirementsTotal = tender?.technicalRequirementsCount ?? 8;

  if (!tender) {
    return (
      <VendorLayout title="Submit Quotation">
        <div className="text-center py-16 text-sm text-slate-400">Tender not found.</div>
      </VendorLayout>
    );
  }

  if (submitted) {
    return (
      <VendorLayout title="Submit Quotation" subtitle={tender.title}>
        <div className="max-w-lg mx-auto bg-white rounded-xl border border-slate-200 p-8 text-center mt-10">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-extrabold text-slate-900">Quotation Submitted Successfully</h2>
          <p className="text-sm text-slate-500 mt-2">
            Tender: <span className="font-semibold text-slate-700">{tender.title}</span>
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Status: <span className="font-semibold text-amber-600">Under Review</span>
          </p>
          <button
            onClick={() => navigate('/vendor/quotations')}
            className="mt-6 inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-full shadow-md shadow-orange-600/20 transition-colors cursor-pointer"
          >
            View My Quotations
          </button>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout title="Submit Quotation" subtitle={tender.title}>
      <button
        onClick={() => navigate(`/vendor/tenders/${tender.id}`)}
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-orange-600 mb-4 cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
        <span>Back to Tender Details</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Commercial Quotation */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-4">Commercial Quotation</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <MoneyField label="Product Price" value={productPrice} onChange={setProductPrice} />
              <MoneyField label="GST" value={gst} onChange={setGst} />
              <MoneyField label="Delivery Charges" value={deliveryCharges} onChange={setDeliveryCharges} />
              <MoneyField label="Installation Charges" value={installationCharges} onChange={setInstallationCharges} />
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">Total</span>
              <span className="text-xl font-extrabold text-orange-600">{formatINR(total)}</span>
            </div>
          </div>

          {/* Delivery / Warranty / Payment */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-4">Terms</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <TextField label="Delivery Time" value={deliveryTime} onChange={setDeliveryTime} placeholder="e.g. 30 days" />
              <TextField label="Warranty" value={warranty} onChange={setWarranty} placeholder="e.g. 5 years" />
              <TextField label="Payment Terms" value={paymentTerms} onChange={setPaymentTerms} placeholder="e.g. 30% advance" />
            </div>
            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Additional Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-orange-600 focus:outline-none resize-none"
                placeholder="Any additional context for the procurement officer..."
              />
            </div>
          </div>

          {/* Document Uploads */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-4">Document Uploads</h3>
            <div className="space-y-3">
              {Object.keys(documents).map((docName) => (
                <DocumentUploadCard
                  key={docName}
                  label={docName}
                  fileName={documents[docName]}
                  onFileSelected={(file) => setDocuments((prev) => ({ ...prev, [docName]: file.name }))}
                  onRemove={() => setDocuments((prev) => ({ ...prev, [docName]: null }))}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Quotation Summary sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 sticky top-24">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-4">Quotation Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Commercial Total</span>
                <span className="font-bold text-slate-900">{formatINR(total)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Technical Requirements</span>
                <span className="font-bold text-slate-900">
                  {requirementsResponded} / {requirementsTotal} Responded
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Required Documents</span>
                <span className="font-bold text-slate-900">
                  {docsUploadedCount} / {docsTotal} Uploaded
                </span>
              </div>
            </div>
            <button
              onClick={() => setConfirmOpen(true)}
              className="w-full mt-6 inline-flex items-center justify-center px-6 py-3 text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-full shadow-md shadow-orange-600/20 transition-colors cursor-pointer"
            >
              Submit Quotation
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmOpen}
        title="Submit Quotation?"
        description="Once submitted, your quotation will be sent for procurement review."
        confirmLabel="Confirm Submission"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          setSubmitted(true);
        }}
      />
    </VendorLayout>
  );
};

const MoneyField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">₹</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full pl-7 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-orange-600 focus:outline-none"
      />
    </div>
  </div>
);

const TextField = ({
  label,
  value,
  onChange,
  placeholder,
}) => (
  <div>
    <label className="block text-xs font-bold text-slate-700 mb-1.5">{label}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-orange-600 focus:outline-none"
    />
  </div>
);
