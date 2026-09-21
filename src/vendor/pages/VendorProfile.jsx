import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  FileBadge, 
  Hash, 
  Pencil, 
  FolderOpen, 
  Bell, 
  LogOut, 
  X, 
  CheckCircle2, 
  Save 
} from 'lucide-react';
import { VendorLayout } from '../components/VendorLayout';
import { VENDOR_PROFILE } from '../data/mockVendorData';
import { useVendorAuth } from '../context/VendorAuthContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const VendorProfile = () => {
  const { session, logout } = useVendorAuth();
  const { user, userProfile, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const companyName = userProfile?.companyName || userProfile?.name || session?.companyName || VENDOR_PROFILE.companyName;
  const email = userProfile?.email || user?.email || session?.email || VENDOR_PROFILE.email;
  const phone = userProfile?.mobile || session?.mobile || VENDOR_PROFILE.phone;
  const gstin = userProfile?.gstin || session?.gstin || VENDOR_PROFILE.gstin;
  const regNumber = userProfile?.gemNumber || session?.gemNumber || VENDOR_PROFILE.registrationNumber;
  const address = userProfile?.address || VENDOR_PROFILE.address;

  // Edit form state
  const [editCompany, setEditCompany] = useState(companyName);
  const [editPhone, setEditPhone] = useState(phone);
  const [editGstin, setEditGstin] = useState(gstin);
  const [editRegNumber, setEditRegNumber] = useState(regNumber);
  const [editAddress, setEditAddress] = useState(address);

  const handleOpenEdit = () => {
    setEditCompany(companyName);
    setEditPhone(phone);
    setEditGstin(gstin);
    setEditRegNumber(regNumber);
    setEditAddress(address);
    setIsEditing(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (updateProfile) {
        await updateProfile({
          companyName: editCompany,
          name: editCompany,
          mobile: editPhone,
          gstin: editGstin.toUpperCase(),
          gemNumber: editRegNumber,
          address: editAddress,
        });
      }
      setIsSaving(false);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setIsSaving(false);
      alert('Could not update profile in cloud database. Please try again.');
    }
  };

  return (
    <VendorLayout title="Profile" subtitle="Your vendor organization details and certification summary.">
      {saveSuccess && (
        <div className="p-4 mb-6 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Vendor profile updated and synced successfully to your cloud account!</span>
        </div>
      )}

      {/* Header card */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 mb-6 flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xl font-extrabold shrink-0 shadow-xs">
            {companyName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">{companyName}</h2>
            <p className="text-xs text-slate-500 mt-0.5">GSTIN / ID: {gstin || VENDOR_PROFILE.vendorId}</p>
          </div>
        </div>

        <button
          onClick={handleOpenEdit}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Organization Details */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">Organization Details</h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Verified Supplier
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <DetailRow icon={Building2} label="Company Name" value={companyName} />
            <DetailRow icon={Mail} label="Registered Email" value={email} />
            <DetailRow icon={Phone} label="Contact Mobile" value={phone} />
            <DetailRow icon={FileBadge} label="GSTIN / PAN" value={gstin} />
            <DetailRow icon={Hash} label="GeM / Registration No." value={regNumber} />
            <DetailRow icon={MapPin} label="Registered Address" value={address} />
          </div>
        </div>

        {/* Certification Summary + Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide mb-4">Certification Summary</h3>
            <div className="space-y-3">
              <SummaryRow label="BIS Certificates" value={`${VENDOR_PROFILE.bisCertificatesActive} Active`} />
              <SummaryRow label="Test Reports" value={String(VENDOR_PROFILE.testReportsCount)} />
              <SummaryRow label="Documents" value={String(VENDOR_PROFILE.documentsCount)} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-2.5 space-y-1">
            <ActionRow icon={Pencil} label="Edit Organization Details" onClick={handleOpenEdit} />
            <ActionRow icon={FolderOpen} label="Manage Documents" onClick={() => navigate('/vendor/documents')} />
            <ActionRow icon={Bell} label="Notification Settings" onClick={() => navigate('/vendor/notifications')} />
            <ActionRow
              icon={LogOut}
              label="Logout"
              danger
              onClick={() => {
                logout();
                navigate('/');
              }}
            />
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-left">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-600" />
                <h3 className="font-extrabold text-slate-900 text-sm">Edit Vendor Profile</h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Company Legal Name</label>
                <input
                  type="text"
                  required
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Registered Business Email (Read Only)</label>
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full px-3 py-2 text-xs border border-slate-200 bg-slate-50 text-slate-500 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">GSTIN / PAN</label>
                  <input
                    type="text"
                    required
                    value={editGstin}
                    onChange={(e) => setEditGstin(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 uppercase rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">GeM ID / Registration No.</label>
                <input
                  type="text"
                  value={editRegNumber}
                  onChange={(e) => setEditRegNumber(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Registered Address</label>
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs rounded-lg shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </VendorLayout>
  );
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2.5">
    <Icon className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
    <div className="min-w-0">
      <p className="text-[10px] text-slate-400 font-semibold uppercase">{label}</p>
      <p className="text-sm font-semibold text-slate-800 break-words">{value}</p>
    </div>
  </div>
);

const SummaryRow = ({ label, value }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="text-sm font-extrabold text-orange-600">{value}</span>
  </div>
);

const ActionRow = ({
  icon: Icon,
  label,
  onClick,
  danger,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
      danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-50'
    }`}
  >
    <Icon className={`w-4 h-4 ${danger ? 'text-red-500' : 'text-slate-400'}`} />
    <span>{label}</span>
  </button>
);

export default VendorProfile;
