import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../../firebase/firebaseConfig';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  // Fetch Firestore user profile from dedicated collections (officers / vendors / users)
  const fetchUserProfile = useCallback(async (uid) => {
    if (!db) return null;
    try {
      // 1. Check officers collection
      const officerDocRef = doc(db, 'officers', uid);
      const officerDocSnap = await getDoc(officerDocRef);
      if (officerDocSnap.exists()) {
        const data = { ...officerDocSnap.data(), role: 'officer' };
        setUserProfile(data);
        setRole('officer');
        return data;
      }

      // 2. Check vendors collection
      const vendorDocRef = doc(db, 'vendors', uid);
      const vendorDocSnap = await getDoc(vendorDocRef);
      if (vendorDocSnap.exists()) {
        const data = { ...vendorDocSnap.data(), role: 'vendor' };
        setUserProfile(data);
        setRole('vendor');
        return data;
      }

      // 3. Check users collection
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setUserProfile(data);
        setRole(data.role || null);
        return data;
      }

      return null;
    } catch (err) {
      console.error('Error fetching user profile from Firestore:', err);
      return null;
    }
  }, []);

  // Listen to Firebase auth state change
  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        let profile = await fetchUserProfile(currentUser.uid);
        // If logged in via Auth but no Firestore record exists yet, create one
        if (!profile) {
          const fallbackRole = currentUser.email?.includes('gov.in') || currentUser.email?.includes('nic.in') ? 'officer' : 'vendor';
          const newProfile = {
            uid: currentUser.uid,
            email: currentUser.email || '',
            role: fallbackRole,
            name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          try {
            if (fallbackRole === 'officer') {
              await setDoc(doc(db, 'officers', currentUser.uid), newProfile);
            } else {
              await setDoc(doc(db, 'vendors', currentUser.uid), newProfile);
            }
            await setDoc(doc(db, 'users', currentUser.uid), newProfile);
          } catch (e) {
            console.warn('Auto-init profile notice:', e);
          }
          setUserProfile(newProfile);
          setRole(fallbackRole);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserProfile]);

  // Real Signup with Firebase Auth and Separate Firestore Collections
  const signup = async ({ email, password, role: userRole, ...profileData }) => {
    if (!auth || !db) {
      throw new Error('Firebase is not configured. Please restore your Firebase keys in the .env file.');
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const createdUser = userCredential.user;
      const uid = createdUser.uid;

      const baseData = {
        uid,
        email: email.trim(),
        role: userRole,
        name: profileData.name || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (userRole === 'officer') {
        const officerData = {
          ...baseData,
          ministry: profileData.ministry || '',
        };

        await setDoc(doc(db, 'officers', uid), officerData);
        await setDoc(doc(db, 'users', uid), officerData);

        setUser(createdUser);
        setUserProfile(officerData);
        setRole('officer');
        setLoading(false);
        return { user: createdUser, profile: officerData, role: 'officer' };
      } else {
        const vendorData = {
          ...baseData,
          companyName: profileData.companyName || profileData.name || '',
          mobile: profileData.mobile || '',
          gstin: profileData.gstin || '',
          gemNumber: profileData.gemNumber || '',
        };

        await setDoc(doc(db, 'vendors', uid), vendorData);
        await setDoc(doc(db, 'users', uid), vendorData);

        setUser(createdUser);
        setUserProfile(vendorData);
        setRole('vendor');
        setLoading(false);
        return { user: createdUser, profile: vendorData, role: 'vendor' };
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Real Login with Firebase Auth and Auto-Profile Recovery
  const login = async (email, password) => {
    if (!auth || !db) {
      throw new Error('Firebase is not configured. Please restore your Firebase keys in the .env file.');
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const loggedInUser = userCredential.user;
      let profile = await fetchUserProfile(loggedInUser.uid);

      // If document was not yet present in Firestore, auto-create it now
      if (!profile) {
        const inferredRole = email.includes('gov.in') || email.includes('nic.in') ? 'officer' : 'vendor';
        const newProfile = {
          uid: loggedInUser.uid,
          email: email.trim(),
          role: inferredRole,
          name: loggedInUser.displayName || email.split('@')[0],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        try {
          if (inferredRole === 'officer') {
            await setDoc(doc(db, 'officers', loggedInUser.uid), newProfile);
          } else {
            await setDoc(doc(db, 'vendors', loggedInUser.uid), newProfile);
          }
          await setDoc(doc(db, 'users', loggedInUser.uid), newProfile);
        } catch (e) {
          console.warn('Profile write notice:', e);
        }

        profile = newProfile;
        setUserProfile(newProfile);
        setRole(inferredRole);
      }

      setUser(loggedInUser);
      setLoading(false);

      return { 
        user: loggedInUser, 
        profile, 
        role: profile?.role || 'officer' 
      };
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Real Password Reset via Firebase sendPasswordResetEmail()
  const resetPassword = async (email) => {
    if (!auth) {
      throw new Error('Firebase is not configured. Please restore your Firebase keys in the .env file.');
    }
    const trimmedEmail = (email || '').trim();
    if (!trimmedEmail) {
      throw new Error('Please enter a valid email address.');
    }
    return await sendPasswordResetEmail(auth, trimmedEmail);
  };

  // Update Profile Data in Firestore
  const updateProfile = async (updatedFields) => {
    if (!user || !db) return;
    try {
      const currentRole = role || userProfile?.role || 'officer';
      const collectionName = currentRole === 'officer' ? 'officers' : 'vendors';
      
      const payload = {
        ...updatedFields,
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, collectionName, user.uid), payload, { merge: true });
      await setDoc(doc(db, 'users', user.uid), payload, { merge: true });

      setUserProfile((prev) => ({ ...prev, ...payload }));
      return true;
    } catch (err) {
      console.error('Error updating user profile:', err);
      throw err;
    }
  };

  // Real Logout with Firebase signOut()
  const logout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
    setUser(null);
    setUserProfile(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        role,
        loading,
        signup,
        login,
        logout,
        resetPassword,
        updateProfile,
        fetchUserProfile,
        isConfigured: isFirebaseConfigured,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
