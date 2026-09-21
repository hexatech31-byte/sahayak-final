import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { VENDOR_PROFILE } from '../data/mockVendorData';

const VendorAuthContext = createContext(undefined);

export const VendorAuthProvider = ({ children }) => {
  const { user, userProfile, role, logout: authLogout, loading } = useAuth();

  const session = useMemo(() => {
    if (!user || role !== 'vendor') {
      return null;
    }
    return {
      role: 'vendor',
      companyName: userProfile?.companyName || userProfile?.name || VENDOR_PROFILE.companyName,
      vendorId: userProfile?.gstin || VENDOR_PROFILE.vendorId,
      email: user.email || userProfile?.email || '',
      uid: user.uid,
    };
  }, [user, userProfile, role]);

  const login = () => {
    // Kept for backward compatibility
  };

  const logout = async () => {
    await authLogout();
  };

  return (
    <VendorAuthContext.Provider value={{ session, login, logout, loading }}>
      {children}
    </VendorAuthContext.Provider>
  );
};

export function useVendorAuth() {
  const ctx = useContext(VendorAuthContext);
  if (!ctx) throw new Error('useVendorAuth must be used within VendorAuthProvider');
  return ctx;
}

export default VendorAuthContext;
