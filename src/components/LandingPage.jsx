import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AlertCircle,
  ArrowRight,
  BarChart2,
  BookOpen,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Crown,
  ExternalLink,
  FlaskConical,
  Globe,
  HardHat,
  HelpCircle,
  KeyRound,
  Languages,
  Lock,
  Mail,
  Menu,
  Monitor,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
  Zap
} from 'lucide-react';

import slide1Image from '../assets/how-sahayak-works-slide-1.jpg';
import slide2Image from '../assets/how-sahayak-works-slide-2.jpg';
import slide3Image from '../assets/how-sahayak-works-slide-3.jpg';
import slide4Image from '../assets/how-sahayak-works-slide-4.jpg';
import heroBgVideo from '../assets/WhatsApp Video 2026-09-17 at 12.20.51 PM.mp4';

/* ==========================================================================
   CONSOLIDATED LANDING PAGE COMPONENT & SUBSECTIONS
   All Landing Page components, subsections, graphics, modals, and configurations
   are consolidated into this single .jsx file.
   ========================================================================== */

/* ==========================================================================
   SECTION: AuthModal
   ========================================================================== */
const T = {
  en: {
    govLabel:             'GOVERNMENT OF INDIA',
    portalTitle:          'National Standards & Procurement Portal',
    portalSubtitle:       'Central Procurement & Standards Verification System (Sahayak Gateway)',
    tabLogin:             'Log In',
    tabSignup:            'Sign Up',
    selectRoleLabel:      'SELECT PORTAL ACCESS ROLE:',
    roleOfficer:          'Government Officer',
    roleOfficerSub:       '(.gov.in / .nic.in / PSU / Testing)',
    roleVendor:           'Vendor / Supplier',
    roleVendorSub:        '(GSTIN / GeM Seller)',
    active:               '• Active',
    ssoTitle:             'Jan Parichay (MeriPehchaan SSO)',
    ssoSubtitle:          'National Single Sign-On for Government Officials',
    ssoBtn:               'Login with Parichay',
    orDivider:            'OR OFFICER CREDENTIALS',
    fieldFullName:        'Officer Full Name',
    placeholderName:      'e.g. Rajesh Kumar Sharma',
    fieldEmail:           'Official Government / Testing Email',
    placeholderEmail:     'officer@nic.in or officer@gmail.com',
    emailHint:            'Supports government (.gov.in / .nic.in) and test emails (e.g. Gmail).',
    emailError:           'Please enter a valid email address (e.g. user@gmail.com or officer@gov.in).',
    fieldMinistry:        'Ministry / Department / Agency',
    fieldPassLogin:       'Officer Password',
    fieldPassSignup:      'Create Secure Password (min. 6 characters)',
    forgotPass:           'Forgot Password?',
    fieldCompany:         'Enterprise / Company Legal Name',
    placeholderCompany:   'e.g. Larsen & Toubro Electricals Ltd.',
    fieldBizEmail:        'Business Email',
    placeholderBizEmail:  'tenders@company.com or vendor@gmail.com',
    fieldMobile:          'Registered Mobile Number',
    fieldGstin:           'Company GSTIN / PAN Number',
    gstinHint:            'Used for automatic validation of supplier MSME / QCO certifications.',
    fieldPassVendorLogin: 'Account Password',
    fieldPassVendorSignup:'Create Account Password (min. 6 characters)',
    fieldGem:             'GeM Seller ID / MSME Udyam Reg. No.',
    gemOptional:          '(Optional)',
    placeholderGem:       'e.g. GEM-SELLER-19402 or UDYAM-XX-00-0000000',
    btnOfficerLogin:      'Authorize Officer Login',
    btnVendorLogin:       'Supplier Portal Login',
    btnOfficerSignup:     'Complete Officer Registration',
    btnVendorSignup:      'Register Supplier Account',
    successTitle:         'Authentication Verified',
    successMsg:           'Securely authenticated with National Informatics Centre (NIC) gateway. Establishing encrypted session...',
    ministries: [
      'Central Bureau of Investigation (CBI)',
      'CPWD - Central Public Works Department',
      'Ministry of Commerce & Industry / DPIIT',
      'Ministry of Defence (MoD) / DGQA',
      'Ministry of Railways / RDSO',
      'NHAI - National Highways Authority',
      'Public Sector Undertaking (BHEL / NTPC / PGCIL)',
      'Other Central / State Procurement Division',
    ],
  },
  hi: {
    govLabel:             'भारत सरकार',
    portalTitle:          'राष्ट्रीय मानक एवं खरीद पोर्टल',
    portalSubtitle:       'केंद्रीय अधिप्राप्ति एवं मानक सत्यापन प्रणाली (Sahayak गेटवे)',
    tabLogin:             'लॉगिन करें',
    tabSignup:            'पंजीकरण करें',
    selectRoleLabel:      'पोर्टल उपयोग भूमिका चुनें:',
    roleOfficer:          'सरकारी अधिकारी',
    roleOfficerSub:       '(.gov.in / .nic.in / सार्वजनिक उपक्रम / परीक्षण)',
    roleVendor:           'विक्रेता / आपूर्तिकर्ता',
    roleVendorSub:        '(GSTIN / GeM विक्रेता)',
    active:               '• सक्रिय',
    ssoTitle:             'जन परिचय (मेरी पहचान SSO)',
    ssoSubtitle:          'सरकारी अधिकारियों के लिए राष्ट्रीय एकल साइन-ऑन',
    ssoBtn:               'परिचय से लॉगिन करें',
    orDivider:            'अथवा अधिकारी क्रेडेंशियल से',
    fieldFullName:        'अधिकारी का पूरा नाम',
    placeholderName:      'जैसे: राजेश कुमार शर्मा',
    fieldEmail:           'आधिकारिक सरकारी / परीक्षण ईमेल',
    placeholderEmail:     'officer@nic.in या officer@gmail.com',
    emailHint:            'सरकारी (.gov.in / .nic.in) और परीक्षण ईमेल (उदा. Gmail) समर्थित हैं।',
    emailError:           'कृपया एक वैध ईमेल पता दर्ज करें (उदा. user@gmail.com या officer@gov.in)।',
    fieldMinistry:        'मंत्रालय / विभाग / एजेंसी',
    fieldPassLogin:       'अधिकारी पासवर्ड',
    fieldPassSignup:      'सुरक्षित पासवर्ड बनाएं (कम से कम 6 वर्ण)',
    forgotPass:           'पासवर्ड भूल गए?',
    fieldCompany:         'उद्यम / कंपनी का कानूनी नाम',
    placeholderCompany:   'जैसे: लार्सन एंड टुब्रो इलेक्ट्रिकल्स लि.',
    fieldBizEmail:        'व्यापारिक ईमेल',
    placeholderBizEmail:  'tenders@company.com या vendor@gmail.com',
    fieldMobile:          'पंजीकृत मोबाइल नंबर',
    fieldGstin:           'कंपनी GSTIN / PAN नंबर',
    gstinHint:            'आपूर्तिकर्ता MSME / QCO प्रमाणपत्रों के स्वचालित सत्यापन के लिए।',
    fieldPassVendorLogin: 'खाता पासवर्ड',
    fieldPassVendorSignup:'खाता पासवर्ड बनाएं (कम से कम 6 वर्ण)',
    fieldGem:             'GeM विक्रेता ID / MSME उद्यम पंजीकरण संख्या',
    gemOptional:          '(वैकल्पिक)',
    placeholderGem:       'जैसे: GEM-SELLER-19402 या UDYAM-XX-00-0000000',
    btnOfficerLogin:      'अधिकारी लॉगिन अधिकृत करें',
    btnVendorLogin:       'आपूर्तिकर्ता पोर्टल लॉगिन',
    btnOfficerSignup:     'अधिकारी पंजीकरण पूर्ण करें',
    btnVendorSignup:      'आपूर्तिकर्ता खाता बनाएं',
    successTitle:         'डिजिटल सत्यापन पूर्ण',
    successMsg:           'राष्ट्रीय सूचना विज्ञान केंद्र (NIC) गेटवे के साथ सुरक्षित प्रमाणीकरण। एन्क्रिप्टेड सत्र स्थापित हो रहा है...',
    ministries: [
      'केंद्रीय जांच ब्यूरो (CBI)',
      'CPWD - केंद्रीय लोक निर्माण विभाग',
      'वाणिज्य एवं उद्योग मंत्रालय / DPIIT',
      'रक्षा मंत्रालय (MoD) / DGQA',
      'रेल मंत्रालय / RDSO',
      'NHAI - राष्ट्रीय राजमार्ग प्राधिकरण',
      'सार्वजनिक उपक्रम (BHEL / NTPC / PGCIL)',
      'अन्य केंद्रीय / राज्य खरीद विभाग',
    ],
  },
};

export const AuthModal = ({ isOpen, initialMode = 'login', onClose, onLoginSuccess }) => {
  const { login, signup, resetPassword } = useAuth();
  const [lang, setLang] = useState('en');
  const [authMode, setAuthMode] = useState(initialMode);
  const [selectedRole, setSelectedRole] = useState('officer');
  
  // Officer Login state
  const [officerLoginEmail, setOfficerLoginEmail] = useState('');
  const [officerLoginPassword, setOfficerLoginPassword] = useState('');

  // Officer Signup state
  const [officerSignupName, setOfficerSignupName] = useState('');
  const [officerSignupEmail, setOfficerSignupEmail] = useState('');
  const [officerSignupMinistry, setOfficerSignupMinistry] = useState('0');
  const [officerSignupPassword, setOfficerSignupPassword] = useState('');

  // Vendor Login state
  const [vendorLoginEmail, setVendorLoginEmail] = useState('');
  const [vendorLoginPassword, setVendorLoginPassword] = useState('');

  // Vendor Signup state
  const [vendorSignupCompany, setVendorSignupCompany] = useState('');
  const [vendorSignupEmail, setVendorSignupEmail] = useState('');
  const [vendorSignupMobile, setVendorSignupMobile] = useState('');
  const [vendorSignupGstin, setVendorSignupGstin] = useState('');
  const [vendorSignupPassword, setVendorSignupPassword] = useState('');
  const [vendorSignupGem, setVendorSignupGem] = useState('');

  // Notifications, Errors & Loading state
  const [authNotice, setAuthNotice] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [authError, setAuthError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const t = T[lang];

  useEffect(() => {
    if (isOpen) {
      setAuthMode(initialMode);
      setSubmitted(false);
      setEmailError('');
      setAuthError('');
      setAuthNotice('');
      setAuthSuccess('');
      setIsSubmitting(false);
      setIsResetting(false);
      setOfficerLoginPassword('');
      setOfficerSignupPassword('');
      setVendorLoginPassword('');
      setVendorSignupPassword('');
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  // Mode change handler (clears password and error state automatically)
  const handleModeChange = (mode) => {
    setAuthMode(mode);
    setEmailError('');
    setAuthError('');
    setAuthNotice('');
    setAuthSuccess('');
    setOfficerLoginPassword('');
    setOfficerSignupPassword('');
    setVendorLoginPassword('');
    setVendorSignupPassword('');
  };

  // Role change handler (clears password and error state automatically)
  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setEmailError('');
    setAuthError('');
    setAuthNotice('');
    setAuthSuccess('');
    setOfficerLoginPassword('');
    setOfficerSignupPassword('');
    setVendorLoginPassword('');
    setVendorSignupPassword('');
  };

  // Standard Email Validator
  const isValidEmailFormat = (email) => {
    const trimmed = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmed);
  };

  const getFriendlyErrorMessage = (error) => {
    const code = error?.code || '';
    if (code === 'auth/email-already-in-use') {
      return lang === 'hi' 
        ? 'यह ईमेल पहले से पंजीकृत है। कृपया लॉगिन करें।' 
        : 'This email is already registered. Please log in instead.';
    }
    if (code === 'auth/wrong-password') {
      return lang === 'hi' 
        ? 'गलत पासवर्ड। कृपया पुनः प्रयास करें।' 
        : 'Incorrect password. Please try again.';
    }
    if (code === 'auth/invalid-credential' || code === 'auth/user-not-found') {
      return lang === 'hi' 
        ? 'अमान्य क्रेडेंशियल या खाता मौजूद नहीं है।' 
        : 'Invalid credentials or account does not exist.';
    }
    if (code === 'auth/weak-password') {
      return lang === 'hi' 
        ? 'पासवर्ड कम से कम 6 वर्णों का होना चाहिए।' 
        : 'Password must be at least 6 characters.';
    }
    if (code === 'auth/invalid-email') {
      return lang === 'hi' 
        ? 'कृपया एक वैध ईमेल पता दर्ज करें।' 
        : 'Please enter a valid email address.';
    }
    if (code === 'auth/network-request-failed') {
      return lang === 'hi' 
        ? 'नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।' 
        : 'Network error. Please check your internet connection.';
    }
    if (code === 'auth/too-many-requests') {
      return lang === 'hi' 
        ? 'बहुत सारे असफल प्रयास। कृपया कुछ समय बाद पुनः प्रयास करें।' 
        : 'Too many failed attempts. Please try again later.';
    }
    if (error?.message) {
      return error.message;
    }
    return lang === 'hi' ? 'प्रमाणीकरण विफल रहा। कृपया पुनः प्रयास करें।' : 'Authentication failed. Please try again.';
  };

  // Real Backend Forgot Password Handler
  const handleForgotPassword = async () => {
    const targetEmail = (selectedRole === 'officer' ? officerLoginEmail : vendorLoginEmail).trim();
    setAuthError('');
    setAuthNotice('');
    setAuthSuccess('');

    if (!targetEmail) {
      setAuthNotice(
        lang === 'hi'
          ? 'पासवर्ड रीसेट लिंक प्राप्त करने के लिए कृपया ऊपर अपना ईमेल दर्ज करें।'
          : 'Please enter your email address in the field above to receive a password reset link.'
      );
      return;
    }

    if (!isValidEmailFormat(targetEmail)) {
      setAuthError(
        lang === 'hi'
          ? 'कृपया पासवर्ड रीसेट के लिए एक वैध ईमेल पता दर्ज करें।'
          : 'Please enter a valid email address to receive password reset link.'
      );
      return;
    }

    setIsResetting(true);
    try {
      if (resetPassword) {
        await resetPassword(targetEmail);
      }
      setIsResetting(false);
      setAuthSuccess(
        lang === 'hi'
          ? `पासवर्ड रीसेट लिंक ${targetEmail} पर भेज दिया गया है। कृपया अपना इनबॉक्स और स्पैम फ़ोल्डर जांचें।`
          : `Password reset link sent to ${targetEmail}. Please check your inbox and spam folder.`
      );
    } catch (err) {
      setIsResetting(false);
      const code = err?.code || '';
      if (code === 'auth/user-not-found') {
        setAuthError(
          lang === 'hi'
            ? 'इस ईमेल से कोई खाता पंजीकृत नहीं है। कृपया पहले साइन अप करें।'
            : 'No registered account found with this email. Please sign up first.'
        );
      } else {
        setAuthError(getFriendlyErrorMessage(err));
      }
    }
  };

  const validateForm = () => {
    if (selectedRole === 'officer') {
      const email = (authMode === 'login' ? officerLoginEmail : officerSignupEmail).trim();
      const password = authMode === 'login' ? officerLoginPassword : officerSignupPassword;

      if (!email) {
        setEmailError(lang === 'hi' ? 'कृपया ईमेल दर्ज करें।' : 'Please enter your email address.');
        return false;
      }
      if (!isValidEmailFormat(email)) {
        setEmailError(t.emailError);
        return false;
      }
      if (authMode === 'signup' && !officerSignupName.trim()) {
        setAuthError(lang === 'hi' ? 'कृपया अपना पूरा नाम दर्ज करें।' : 'Please enter your full name.');
        return false;
      }
      if (!password || password.length < 6) {
        setAuthError(lang === 'hi' ? 'पासवर्ड कम से कम 6 वर्णों का होना चाहिए।' : 'Password must be at least 6 characters.');
        return false;
      }
    } else {
      // Vendor
      const email = (authMode === 'login' ? vendorLoginEmail : vendorSignupEmail).trim();
      const password = authMode === 'login' ? vendorLoginPassword : vendorSignupPassword;

      if (!email) {
        setAuthError(lang === 'hi' ? 'कृपया व्यापारिक ईमेल दर्ज करें।' : 'Please enter your business email.');
        return false;
      }
      if (!isValidEmailFormat(email)) {
        setAuthError(lang === 'hi' ? 'कृपया एक वैध व्यापारिक ईमेल दर्ज करें।' : 'Please enter a valid business email address.');
        return false;
      }
      if (authMode === 'signup') {
        if (!vendorSignupCompany.trim()) {
          setAuthError(lang === 'hi' ? 'कृपया कंपनी का नाम दर्ज करें।' : 'Please enter enterprise / company name.');
          return false;
        }
        if (!vendorSignupMobile.trim() || vendorSignupMobile.trim().length < 10) {
          setAuthError(lang === 'hi' ? 'कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
          return false;
        }
        if (!vendorSignupGstin.trim()) {
          setAuthError(lang === 'hi' ? 'कृपया कंपनी GSTIN / PAN नंबर दर्ज करें।' : 'Please enter company GSTIN / PAN number.');
          return false;
        }
      }
      if (!password || password.length < 6) {
        setAuthError(lang === 'hi' ? 'पासवर्ड कम से कम 6 वर्णों का होना चाहिए।' : 'Password must be at least 6 characters.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError('');
    setAuthError('');
    setAuthNotice('');
    setAuthSuccess('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let activeRole = selectedRole;

      if (authMode === 'login') {
        if (selectedRole === 'officer') {
          const email = officerLoginEmail.trim();
          const password = officerLoginPassword;
          try {
            const result = await login(email, password);
            activeRole = result.role || 'officer';
          } catch (err) {
            setIsSubmitting(false);
            const code = err?.code || '';
            if (code === 'auth/user-not-found') {
              setAuthMode('signup');
              setOfficerSignupEmail(email);
              setOfficerLoginPassword('');
              setOfficerSignupPassword('');
              setAuthError('');
              setAuthNotice(
                lang === 'hi'
                  ? 'खाता मौजूद नहीं है। आपके ईमेल के साथ साइन अप पर स्थानांतरित किया गया। कृपया अपना पंजीकरण पूर्ण करें।'
                  : 'Account does not exist. Redirected to Sign Up with your email. Please complete your registration.'
              );
              return;
            } else if (code === 'auth/wrong-password') {
              setAuthNotice('');
              setAuthError(lang === 'hi' ? 'गलत पासवर्ड। कृपया पुनः प्रयास करें।' : 'Incorrect password. Please check and try again.');
              return;
            } else if (code === 'auth/invalid-credential') {
              setAuthNotice('');
              setAuthError(
                lang === 'hi'
                  ? 'अमान्य क्रेडेंशियल। कृपया ईमेल और पासवर्ड जांचें, या साइन अप करें।'
                  : 'Invalid email or password. Please verify your credentials, or click Sign Up.'
              );
              return;
            } else {
              setAuthNotice('');
              setAuthError(getFriendlyErrorMessage(err));
              return;
            }
          }
        } else {
          // Vendor Login
          const email = vendorLoginEmail.trim();
          const password = vendorLoginPassword;
          try {
            const result = await login(email, password);
            activeRole = result.role || 'vendor';
          } catch (err) {
            setIsSubmitting(false);
            const code = err?.code || '';
            if (code === 'auth/user-not-found') {
              setAuthMode('signup');
              setVendorSignupEmail(email);
              setVendorLoginPassword('');
              setVendorSignupPassword('');
              setAuthError('');
              setAuthNotice(
                lang === 'hi'
                  ? 'खाता मौजूद नहीं है। आपके ईमेल के साथ साइन अप पर स्थानांतरित किया गया। कृपया अपना पंजीकरण पूर्ण करें।'
                  : 'Account does not exist. Redirected to Sign Up with your email. Please complete your registration.'
              );
              return;
            } else if (code === 'auth/wrong-password') {
              setAuthNotice('');
              setAuthError(lang === 'hi' ? 'गलत पासवर्ड। कृपया पुनः प्रयास करें।' : 'Incorrect password. Please check and try again.');
              return;
            } else if (code === 'auth/invalid-credential') {
              setAuthNotice('');
              setAuthError(
                lang === 'hi'
                  ? 'अमान्य क्रेडेंशियल। कृपया ईमेल और पासवर्ड जांचें, या साइन अप करें।'
                  : 'Invalid email or password. Please verify your credentials, or click Sign Up.'
              );
              return;
            } else {
              setAuthNotice('');
              setAuthError(getFriendlyErrorMessage(err));
              return;
            }
          }
        }
      } else {
        // Signup
        if (selectedRole === 'officer') {
          const email = officerSignupEmail.trim();
          const password = officerSignupPassword;
          const result = await signup({
            email,
            password,
            role: 'officer',
            name: officerSignupName.trim(),
            ministry: t.ministries[parseInt(officerSignupMinistry, 10)] || t.ministries[0],
          });
          activeRole = result.role || 'officer';
        } else {
          // Vendor Signup
          const email = vendorSignupEmail.trim();
          const password = vendorSignupPassword;
          const result = await signup({
            email,
            password,
            role: 'vendor',
            name: vendorSignupCompany.trim(),
            companyName: vendorSignupCompany.trim(),
            mobile: vendorSignupMobile.trim(),
            gstin: vendorSignupGstin.trim().toUpperCase(),
            gemNumber: vendorSignupGem.trim(),
          });
          activeRole = result.role || 'vendor';
        }
      }

      setSubmitted(true);
      setIsSubmitting(false);

      // Transition with timeout to allow user to read success screen
      setTimeout(() => {
        setSubmitted(false);
        if (onLoginSuccess) {
          onLoginSuccess(activeRole);
        }
        onClose();
      }, 1500);

    } catch (err) {
      setIsSubmitting(false);
      setAuthNotice('');
      setAuthSuccess('');
      setAuthError(getFriendlyErrorMessage(err));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl border border-slate-300 overflow-hidden my-auto max-h-[92vh] flex flex-col text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tricolor Bar */}
        <div className="h-1.5 w-full grid grid-cols-3">
          <div className="bg-[#FF9933]" />
          <div className="bg-white" />
          <div className="bg-[#138808]" />
        </div>

        {/* Header */}
        <div className="bg-[#0B2545] text-white p-4 sm:p-5 flex items-start justify-between border-b border-[#081b33]">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-12 flex-shrink-0 bg-white/10 p-1 rounded flex items-center justify-center border border-white/20">
              <svg viewBox="0 0 100 120" className="w-full h-full text-amber-300 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5 C55 5 60 8 62 14 C65 12 70 12 73 16 C76 20 75 25 72 28 C76 32 75 38 71 42 C74 46 72 52 68 56 C66 62 58 66 50 66 C42 66 34 62 32 56 C28 52 26 46 29 42 C25 38 24 32 28 28 C25 25 24 20 27 16 C30 12 35 12 38 14 C40 8 45 5 50 5 Z" opacity="0.95" />
                <rect x="25" y="70" width="50" height="12" rx="2" fill="currentColor" />
                <circle cx="50" cy="76" r="4" fill="#0B2545" />
                <path d="M20 86 L80 86 L70 98 L30 98 Z" fill="currentColor" />
                <text x="50" y="112" textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="bold" fontFamily="sans-serif">सत्यमेव जयते</text>
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-amber-300 tracking-wider">{t.govLabel}</span>
                <span className="px-1.5 rounded text-[10px] font-bold bg-amber-500/25 text-amber-200 border border-amber-400/40">NIC-eGov</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight leading-snug mt-0.5">{t.portalTitle}</h2>
              <p className="text-[11px] text-slate-300">{t.portalSubtitle}</p>
            </div>
          </div>

          {/* Language toggle + Close */}
          <div className="flex items-center gap-2 ml-2 shrink-0">
            <button
              type="button"
              onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-bold transition-colors cursor-pointer"
              title="Switch Language"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50 text-xs font-bold text-center">
          <button
            type="button"
            onClick={() => handleModeChange('login')}
            className={`py-3 px-4 flex items-center justify-center border-b-2 transition-all cursor-pointer ${
              authMode === 'login'
                ? 'border-orange-600 bg-white text-orange-600 font-bold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {t.tabLogin}
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('signup')}
            className={`py-3 px-4 flex items-center justify-center border-b-2 transition-all cursor-pointer ${
              authMode === 'signup'
                ? 'border-orange-600 bg-white text-orange-600 font-bold shadow-xs'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {t.tabSignup}
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {submitted ? (
            <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-lg border border-emerald-300 my-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6 text-emerald-700" />
              </div>
              <h4 className="text-sm font-bold text-emerald-950">{t.successTitle}</h4>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">{t.successMsg}</p>
              <div className="pt-2">
                <span className="inline-block w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          ) : (
            <>
              {/* Role Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-2">
                  {t.selectRoleLabel}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Officer */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('officer')}
                    className={`p-3 rounded-lg border-2 text-left transition-all flex items-start space-x-3 cursor-pointer ${
                      selectedRole === 'officer'
                        ? 'border-orange-600 bg-orange-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded mt-0.5 ${selectedRole === 'officer' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-900">{t.roleOfficer}</span>
                        {selectedRole === 'officer' && (
                          <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded">{t.active}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.roleOfficerSub}</p>
                    </div>
                  </button>

                  {/* Vendor */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('vendor')}
                    className={`p-3 rounded-lg border-2 text-left transition-all flex items-start space-x-3 cursor-pointer ${
                      selectedRole === 'vendor'
                        ? 'border-orange-600 bg-orange-50/40 shadow-xs'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 rounded mt-0.5 ${selectedRole === 'vendor' ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-slate-900">{t.roleVendor}</span>
                        {selectedRole === 'vendor' && (
                          <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-1.5 py-0.5 rounded">{t.active}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.roleVendorSub}</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Password Reset Success Banner */}
              {authSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-start space-x-2 text-emerald-900 text-xs animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span className="font-semibold leading-snug">{authSuccess}</span>
                </div>
              )}

              {/* Informational Notice Banner */}
              {authNotice && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-start space-x-2 text-amber-900 text-xs animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <span className="font-semibold leading-snug">{authNotice}</span>
                </div>
              )}

              {/* General Auth Error Display */}
              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 text-red-700 text-xs animate-in fade-in">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span className="font-semibold leading-snug">{authError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5 pt-1" autoComplete="off">

                {/* OFFICER FORM */}
                {selectedRole === 'officer' && (
                  <>
                    {/* SSO Banner */}
                    <div className="p-3 bg-orange-50/60 border border-orange-200 rounded-lg flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded bg-orange-600 text-white flex items-center justify-center">
                          <KeyRound className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{t.ssoTitle}</div>
                          <div className="text-[11px] text-slate-600">{t.ssoSubtitle}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(true);
                          setTimeout(() => { setSubmitted(false); onClose(); if (onLoginSuccess) onLoginSuccess('officer'); }, 1600);
                        }}
                        className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
                      >
                        <span>{t.ssoBtn}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-slate-200" />
                      <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.orDivider}</span>
                      <div className="flex-grow border-t border-slate-200" />
                    </div>

                    {/* Officer Sign Up Only Fields */}
                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          {t.fieldFullName} <span className="text-red-600">*</span>
                        </label>
                        <input 
                          type="text" 
                          required 
                          id="officer_signup_name"
                          name="officer_signup_name"
                          autoComplete="name"
                          value={officerSignupName}
                          onChange={(e) => setOfficerSignupName(e.target.value)}
                          placeholder={t.placeholderName}
                          className="w-full px-3 py-2 rounded border border-slate-300 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none" 
                        />
                      </div>
                    )}

                    {/* Officer Email Input */}
                    <div>
                      <label className="block text-xs font-bold text-slate-800 mb-1">
                        {t.fieldEmail} <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email" 
                        required 
                        id={authMode === 'login' ? "officer_login_email" : "officer_signup_email"}
                        name={authMode === 'login' ? "officer_login_email" : "officer_signup_email"}
                        autoComplete="username"
                        value={authMode === 'login' ? officerLoginEmail : officerSignupEmail}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (authMode === 'login') {
                            setOfficerLoginEmail(val);
                          } else {
                            setOfficerSignupEmail(val);
                          }
                          if (emailError) setEmailError('');
                          if (authError) setAuthError('');
                          if (authNotice) setAuthNotice('');
                          if (authSuccess) setAuthSuccess('');
                        }}
                        placeholder={t.placeholderEmail}
                        className={`w-full px-3 py-2 rounded border text-xs focus:outline-none ${
                          emailError ? 'border-red-500 ring-2 ring-red-200 focus:ring-red-500' : 'border-slate-300 focus:ring-2 focus:ring-orange-600'
                        }`}
                      />
                      {emailError ? (
                        <p className="text-[11px] text-red-600 mt-1 font-semibold flex items-start gap-1">
                          <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{emailError}</span>
                        </p>
                      ) : (
                        <p className="text-[10px] text-slate-500 mt-1">{t.emailHint}</p>
                      )}
                    </div>

                    {/* Officer Ministry Selection (Sign Up Only) */}
                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          {t.fieldMinistry} <span className="text-red-600">*</span>
                        </label>
                        <select 
                          required 
                          id="officer_signup_ministry"
                          name="officer_signup_ministry"
                          value={officerSignupMinistry}
                          onChange={(e) => setOfficerSignupMinistry(e.target.value)}
                          className="w-full px-3 py-2 rounded border border-slate-300 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none bg-white"
                        >
                          {t.ministries.map((m, i) => <option key={i} value={i}>{m}</option>)}
                        </select>
                      </div>
                    )}

                    {/* Officer Password Input */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-800">
                          {authMode === 'login' ? t.fieldPassLogin : t.fieldPassSignup} <span className="text-red-600">*</span>
                        </label>
                        {authMode === 'login' && (
                          <button
                            type="button"
                            disabled={isResetting}
                            onClick={handleForgotPassword}
                            className="text-[11px] text-orange-600 hover:text-orange-700 hover:underline font-semibold cursor-pointer disabled:opacity-50"
                          >
                            {isResetting ? 'Sending link...' : t.forgotPass}
                          </button>
                        )}
                      </div>
                      <input 
                        type="password" 
                        required 
                        id={authMode === 'login' ? "officer_login_password" : "officer_signup_password"}
                        name={authMode === 'login' ? "officer_login_password" : "officer_signup_password"}
                        autoComplete={authMode === 'login' ? "current-password" : "new-password"}
                        value={authMode === 'login' ? officerLoginPassword : officerSignupPassword}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (authMode === 'login') {
                            setOfficerLoginPassword(val);
                          } else {
                            setOfficerSignupPassword(val);
                          }
                          if (authError) setAuthError('');
                        }}
                        placeholder="••••••••••••"
                        className="w-full px-3 py-2 rounded border border-slate-300 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none" 
                      />
                    </div>
                  </>
                )}

                {/* VENDOR FORM */}
                {selectedRole === 'vendor' && (
                  <>
                    {/* Vendor Company Name (Sign Up Only) */}
                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          {t.fieldCompany} <span className="text-red-600">*</span>
                        </label>
                        <input 
                          type="text" 
                          required 
                          id="vendor_signup_company"
                          name="vendor_signup_company"
                          autoComplete="organization"
                          value={vendorSignupCompany}
                          onChange={(e) => setVendorSignupCompany(e.target.value)}
                          placeholder={t.placeholderCompany}
                          className="w-full px-3 py-2 rounded border border-slate-300 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none" 
                        />
                      </div>
                    )}

                    {/* Vendor Email & Mobile */}
                    <div className={`grid gap-3 ${authMode === 'signup' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'}`}>
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          {t.fieldBizEmail} <span className="text-red-600">*</span>
                        </label>
                        <input 
                          type="email" 
                          required 
                          id={authMode === 'login' ? "vendor_login_email" : "vendor_signup_email"}
                          name={authMode === 'login' ? "vendor_login_email" : "vendor_signup_email"}
                          autoComplete="username"
                          value={authMode === 'login' ? vendorLoginEmail : vendorSignupEmail}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (authMode === 'login') {
                              setVendorLoginEmail(val);
                            } else {
                              setVendorSignupEmail(val);
                            }
                            if (authError) setAuthError('');
                            if (authNotice) setAuthNotice('');
                            if (authSuccess) setAuthSuccess('');
                          }}
                          placeholder={t.placeholderBizEmail}
                          className="w-full px-3 py-2 rounded border border-slate-300 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none" 
                        />
                      </div>
                      {authMode === 'signup' && (
                        <div>
                          <label className="block text-xs font-bold text-slate-800 mb-1">
                            {t.fieldMobile} <span className="text-red-600">*</span>
                          </label>
                          <div className="flex">
                            <span className="inline-flex items-center px-2.5 py-2 rounded-l border border-r-0 border-slate-300 bg-slate-100 text-slate-600 text-xs font-semibold">+91</span>
                            <input 
                              type="tel" 
                              required 
                              maxLength={10} 
                              id="vendor_signup_mobile"
                              name="vendor_signup_mobile"
                              autoComplete="tel"
                              value={vendorSignupMobile}
                              onChange={(e) => setVendorSignupMobile(e.target.value)}
                              placeholder="9876543210"
                              className="w-full px-3 py-2 rounded-r border border-slate-300 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none" 
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Vendor GSTIN (Sign Up Only) */}
                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          {t.fieldGstin} <span className="text-red-600">*</span>
                        </label>
                        <input 
                          type="text" 
                          required 
                          id="vendor_signup_gstin"
                          name="vendor_signup_gstin"
                          autoComplete="off"
                          value={vendorSignupGstin}
                          onChange={(e) => setVendorSignupGstin(e.target.value)}
                          placeholder="E.G. 07AAAAA0000A1Z5 OR ABCDE1234F"
                          className="w-full px-3 py-2 rounded border border-slate-300 text-xs uppercase focus:ring-2 focus:ring-orange-600 focus:outline-none" 
                        />
                        <p className="text-[10px] text-slate-500 mt-1">{t.gstinHint}</p>
                      </div>
                    )}

                    {/* Vendor Password */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-bold text-slate-800">
                          {authMode === 'login' ? t.fieldPassVendorLogin : t.fieldPassVendorSignup} <span className="text-red-600">*</span>
                        </label>
                        {authMode === 'login' && (
                          <button
                            type="button"
                            disabled={isResetting}
                            onClick={handleForgotPassword}
                            className="text-[11px] text-orange-600 hover:text-orange-700 hover:underline font-semibold cursor-pointer disabled:opacity-50"
                          >
                            {isResetting ? 'Sending link...' : t.forgotPass}
                          </button>
                        )}
                      </div>
                      <input 
                        type="password" 
                        required 
                        id={authMode === 'login' ? "vendor_login_password" : "vendor_signup_password"}
                        name={authMode === 'login' ? "vendor_login_password" : "vendor_signup_password"}
                        autoComplete={authMode === 'login' ? "current-password" : "new-password"}
                        value={authMode === 'login' ? vendorLoginPassword : vendorSignupPassword}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (authMode === 'login') {
                            setVendorLoginPassword(val);
                          } else {
                            setVendorSignupPassword(val);
                          }
                          if (authError) setAuthError('');
                        }}
                        placeholder="••••••••••••"
                        className="w-full px-3 py-2 rounded border border-slate-300 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none" 
                      />
                    </div>

                    {/* Vendor GeM ID (Sign Up Only, Optional) */}
                    {authMode === 'signup' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-800 mb-1">
                          {t.fieldGem} <span className="text-slate-400 font-normal">{t.gemOptional}</span>
                        </label>
                        <input 
                          type="text" 
                          id="vendor_signup_gem"
                          name="vendor_signup_gem"
                          autoComplete="off"
                          value={vendorSignupGem}
                          onChange={(e) => setVendorSignupGem(e.target.value)}
                          placeholder={t.placeholderGem}
                          className="w-full px-3 py-2 rounded border border-slate-300 text-xs focus:ring-2 focus:ring-orange-600 focus:outline-none" 
                        />
                      </div>
                    )}
                  </>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md ${
                    isSubmitting ? 'opacity-75 cursor-wait' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {authMode === 'login'
                          ? selectedRole === 'officer' ? t.btnOfficerLogin : t.btnVendorLogin
                          : selectedRole === 'officer' ? t.btnOfficerSignup : t.btnVendorSignup}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


/* ==========================================================================
   SECTION: DemoModal
   ========================================================================== */
export const DemoModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: '1. Ingest Tender Requirements',
      desc: 'Procurement officer enters technical scope in natural language, Hindi, or pastes raw specification paragraphs.',
      badge: 'Step 1: NLP Parsing',
      visual: 'Query: 110mm HDPE PE-100 PN-10 potable water pipe for Jal Jeevan Mission rural gravity scheme.'
    },
    {
      title: '2. Semantic Mapping & BIS Gazette Resolution',
      desc: 'Engine resolves exact active Indian Standard (IS 4984:2016) and cross-checks with Gazette notifications to ensure it is not superseded.',
      badge: 'Step 2: Standards Indexing',
      visual: 'Primary Standard: IS 4984 : 2016 (Reaffirmed 2021) • Mandatory DPIIT QCO Active.'
    },
    {
      title: '3. Normative Dependency Extraction',
      desc: 'Section 2 Normative References automatically extracted into testing checklist (IS 10500 drinking water, IS 7634 laying, IS 2530 testing).',
      badge: 'Step 3: Graph Construction',
      visual: 'Linked 3 Allied Norms & 8 Mandatory Third-Party Inspection (TPI) checkpoints.'
    },
    {
      title: '4. Export GeM / CPPP Formatted Clause',
      desc: 'One-click copy of standardized, GFR 2017 compliant procurement clause ready for instant publication on tender portals.',
      badge: 'Step 4: Bid Readiness',
      visual: 'Tender clause formatted with mandatory QCO declaration and test criteria.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Simulation Canvas */}
        <div className="relative bg-slate-900 text-white p-8 sm:p-10 flex flex-col items-center justify-center min-h-[260px] border-b border-slate-800">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-950/50 to-amber-950/40 opacity-60" />
          
          <div className="relative z-10 text-center space-y-3 max-w-lg">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-400/30">
              {steps[currentStep].badge}
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {steps[currentStep].title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 font-light">
              {steps[currentStep].desc}
            </p>

            <div className="p-3 bg-slate-800/90 rounded-lg border border-slate-700 font-mono text-xs text-orange-300 text-left">
              {steps[currentStep].visual}
            </div>
          </div>
        </div>

        {/* Step Progress Controller */}
        <div className="p-6 bg-slate-50 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx ? 'w-8 bg-orange-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-lg cursor-pointer"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-lg flex items-center space-x-1 cursor-pointer"
            >
              <span>{currentStep === steps.length - 1 ? 'Replay' : 'Next Step'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};


/* ==========================================================================
   SECTION: Navbar
   ========================================================================== */
export const Navbar = ({ onOpenAuth, onOpenFinder }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('English');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  ];

  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);

      const sectionIds = ['hero', 'what-we-fix', 'sectors', 'faq'];
      const scrollPosition = window.scrollY + 220;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { id: 'hero', name: 'Home', href: '#hero' },
    { id: 'what-we-fix', name: 'Comparison', href: '#what-we-fix' },
    { id: 'sectors', name: 'Coverage', href: '#sectors' },
    { id: 'faq', name: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-2.5 shadow-sm bg-white/95 backdrop-blur-md border-b border-slate-200/80'
          : 'py-3 sm:py-3.5 bg-white/90 backdrop-blur-xs border-b border-slate-200/60 shadow-xs'
      }`}
    >
      <div className="w-full px-6 sm:px-10 md:px-12 lg:px-14 xl:px-16 2xl:px-20 max-w-[1600px] mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <a 
          href="#hero" 
          onClick={() => setActiveSection('hero')} 
          className="flex items-center group" 
          title="Sahayak — AI Support for Smart Procurement"
        >
          <img 
            src="/sahayak-brand-equal.png?v=5" 
            alt="Sahayak — AI Support for Smart Procurement" 
            className="h-9 sm:h-11 w-auto object-contain group-hover:opacity-95 transition-opacity"
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7 xl:space-x-9">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setActiveSection(link.id)}
                className={
                  isActive
                    ? "relative py-1 text-[15px] font-bold text-[#FA4D09] after:content-[''] after:absolute after:-bottom-2 after:left-0 after:right-0 after:h-[2px] after:bg-[#FA4D09] transition-colors"
                    : "py-1 text-[15px] font-semibold text-[#1e3a5f] hover:text-[#FA4D09] transition-colors"
                }
              >
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons & Language Selector */}
        <div className="hidden sm:flex items-center space-x-3">
          {/* Language Dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold text-[#1e3a5f] bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 rounded-full transition-all cursor-pointer shadow-2xs hover:border-slate-300"
              aria-label="Select Language"
              aria-expanded={langDropdownOpen}
            >
              <Globe className="w-4 h-4 text-[#FA4D09]" />
              <span>{selectedLang}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200/80 py-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                <div className="px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Select Language
                </div>
                <div className="py-1">
                  {languages.map((lang) => {
                    const isSelected = selectedLang === lang.label;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setSelectedLang(lang.label);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'text-[#FA4D09] font-bold bg-orange-50/80'
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <span>{lang.label}</span>
                          {lang.native !== lang.label && (
                            <span className="text-xs text-slate-400 font-normal">({lang.native})</span>
                          )}
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-[#FA4D09]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenAuth('login')}
            className="px-6 py-1.5 text-sm font-bold text-[#071d3c] border border-slate-300 rounded-full hover:bg-slate-50 transition-colors cursor-pointer bg-white/80 backdrop-blur-xs"
          >
            Log In
          </button>
          
          <button
            onClick={() => onOpenAuth('signup')}
            className="inline-flex items-center gap-1.5 px-6 py-2 text-sm font-bold text-white bg-[#FA4D09] hover:bg-[#e04305] active:bg-[#c93c04] rounded-full shadow-md shadow-[#FA4D09]/20 hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Sign Up</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setActiveSection(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-[#FA4D09] font-bold bg-orange-50'
                      : 'text-slate-700 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </div>

            {/* Mobile Language Selector */}
            <div className="pt-3 pb-1 border-t border-slate-100">
              <div className="px-4 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#FA4D09]" />
                <span>Language</span>
              </div>
              <div className="grid grid-cols-3 gap-2 px-2">
                {languages.map((lang) => {
                  const isSelected = selectedLang === lang.label;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => {
                        setSelectedLang(lang.label);
                      }}
                      className={`py-2 px-2 text-xs font-semibold rounded-lg text-center border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-orange-50 border-[#FA4D09] text-[#FA4D09] font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <div>{lang.label}</div>
                      {lang.native !== lang.label && (
                        <div className="text-[10px] text-slate-400 font-normal">{lang.native}</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth('login');
                }}
                className="w-full py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 rounded-full"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenFinder();
                }}
                className="w-full py-2.5 text-sm font-bold text-white bg-[#FA4D09] hover:bg-[#e04305] rounded-full shadow-sm"
              >
                Get Started →
              </button>
            </div>
          </div>
        )}
      </header>
  );
};


/* ==========================================================================
   SECTION: HowSahayakWorks
   ========================================================================== */
/**
 * 4-Step Automated Workflow data configuration.
 * All CTA buttons strictly follow the Sahayak primary orange color system (#F45B18).
 */
export const WORKFLOW_STEPS = [
  {
    id: 1,
    step: '01',
    titleLine1: 'Paste Spec or',
    titleLine2: 'Upload Document.',
    description: 'Accepts raw tender clauses, specification paragraphs, or full PDF bid documents.',
    buttonLabel: 'Start Procurement',
    buttonRoute: '/procurement',
    image: slide1Image,
    alt: 'From Unstructured Tender Text to Verified Standards - Sahayak Smart Procurement',
    isStandaloneImage: true,
  },
  {
    id: 2,
    step: '02',
    titleLine1: 'Your Procurement',
    titleLine2: 'Workspace All in One Place.',
    description: 'Deep semantic analysis evaluates engineering parameters, ratings, terminology and procurement context.',
    buttonLabel: 'Analyze Specification',
    buttonRoute: '/procurement/text',
    image: slide2Image,
    alt: 'Your Procurement Workspace All in One Place - Sahayak Smart Procurement',
    isStandaloneImage: true,
  },
  {
    id: 3,
    step: '03',
    titleLine1: 'From Requirements',
    titleLine2: 'to Ready Tender.',
    description: 'Receive active IS codes, relevant test methods and mandatory QCO compliance flags in one clear result.',
    buttonLabel: 'View Standards',
    buttonRoute: '/dashboard/standards',
    image: slide3Image,
    alt: 'From Requirements to Ready Tender - Sahayak Smart Procurement',
    isStandaloneImage: true,
  },
  {
    id: 4,
    step: '04',
    titleLine1: 'Guidance from',
    titleLine2: 'Experts.',
    description: 'Valuable insights and field validation at Solapur Mahanagarpalika.',
    buttonLabel: 'Explore Sahayak',
    buttonRoute: '/procurement',
    image: slide4Image,
    alt: 'Guidance from Experts - Valuable insights at Solapur Mahanagarpalika',
    isStandaloneImage: true,
  },
];

/**
 * Individual Slide Component.
 */
export const WorkflowSlide = ({ step, isActive, onNavigate, prefersReducedMotion }) => {
  // If the slide is a standalone full graphic (Slide 1), display it clean and crisp without darkening overlays
  if (step.isStandaloneImage) {
    return (
      <div
        role="tabpanel"
        aria-hidden={!isActive}
        onClick={() => onNavigate(step.buttonRoute)}
        className={`absolute inset-0 w-full h-full cursor-pointer ${
          prefersReducedMotion
            ? isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            : `transition-all duration-700 ease-out ${
                isActive
                  ? 'opacity-100 translate-x-0 z-10 pointer-events-auto'
                  : 'opacity-0 translate-x-10 z-0 pointer-events-none'
              }`
        }`}
      >
        <img
          src={step.image}
          alt={step.alt}
          className="w-full h-full object-cover object-center select-none"
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div
      role="tabpanel"
      aria-hidden={!isActive}
      className={`absolute inset-0 w-full h-full ${
        prefersReducedMotion
          ? isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          : `transition-all duration-700 ease-out ${
              isActive
                ? 'opacity-100 translate-x-0 z-10 pointer-events-auto'
                : 'opacity-0 translate-x-10 z-0 pointer-events-none'
            }`
      }`}
    >
      {/* Background Image */}
      <img
        src={step.image}
        alt={step.alt}
        className="absolute inset-0 w-full h-full object-cover object-center"
        loading="lazy"
      />

      {/* Multi-tier dark gradient overlay to guarantee contrast & readability for white text */}
      {/* Desktop horizontal gradient (heavy on left, subtle on right) */}
      <div
        className="hidden md:block absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(90deg, rgba(7,20,38,0.96) 0%, rgba(7,20,38,0.85) 42%, rgba(7,20,38,0.35) 72%, rgba(7,20,38,0.12) 100%)',
        }}
      />
      {/* Mobile/Tablet vertical gradient */}
      <div
        className="md:hidden absolute inset-0 pointer-events-none z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(7,20,38,0.96) 0%, rgba(7,20,38,0.88) 55%, rgba(7,20,38,0.65) 100%)',
        }}
      />
      {/* Subtle bottom gradient for controls contrast */}
      <div
        className="absolute inset-x-0 bottom-0 h-28 pointer-events-none z-[1]"
        style={{
          background: 'linear-gradient(0deg, rgba(7,20,38,0.55) 0%, transparent 100%)',
        }}
      />

      {/* Slide Content */}
      <div className="relative z-[2] h-full flex flex-col justify-center px-6 sm:px-10 md:px-12 lg:px-14 py-8 md:py-0 max-w-lg lg:max-w-xl text-left">
        {/* Heading */}
        <h3 className="text-2xl sm:text-3xl lg:text-4xl xl:text-[2.65rem] font-black text-white tracking-tight leading-[1.12] mb-3 sm:mb-4">
          {step.titleLine1}
          <br />
          {step.titleLine2}
        </h3>

        {/* Small Orange Workflow Accent Line */}
        <div className="w-14 sm:w-16 h-1 bg-[#ff8a3d] rounded-full mb-3.5 sm:mb-4.5 shadow-sm shadow-[#ff8a3d]/40" />

        {/* Description */}
        <p className="text-xs sm:text-sm lg:text-base text-slate-100/90 font-normal leading-relaxed mb-5 sm:mb-6 max-w-md">
          {step.description}
        </p>

        {/* Mandatory Orange CTA Button (Strict Sahayak Orange #F45B18 on all 3 screens) */}
        <div>
          <button
            onClick={() => onNavigate(step.buttonRoute)}
            type="button"
            className="inline-flex items-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#f45b18] hover:bg-[#dd4a0a] active:bg-[#c43f07] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#f45b18]/25 hover:shadow-lg hover:shadow-[#f45b18]/35 transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer group"
          >
            <span>{step.buttonLabel}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Workflow Carousel Component with 5s autoplay and manual navigation.
 */
export const WorkflowCarousel = ({ steps, initialSlide = 0, onNavigate, className = '' }) => {
  const [current, setCurrent] = useState(initialSlide);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const timerRef = useRef(null);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Autoplay management: restart timer on any manual slide change
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (!prefersReducedMotion) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % steps.length);
      }, 3500);
    }
  }, [steps.length, prefersReducedMotion]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + steps.length) % steps.length);
    startTimer();
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % steps.length);
    startTimer();
  };

  const handleSelect = (index) => {
    setCurrent(index);
    startTimer();
  };

  return (
    <div
      className={`relative w-full mx-auto aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/15 bg-[#0c1a2e] border border-slate-200/80 select-none ${className}`}
    >
      {/* Slides Container */}
      <div className="relative w-full h-full overflow-hidden">
        {steps.map((step, idx) => (
          <WorkflowSlide
            key={step.id}
            step={step}
            isActive={idx === current}
            onNavigate={onNavigate}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}
      </div>


      {/* Bottom Navigation Dots */}
      <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5">
        {steps.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(idx)}
            type="button"
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 sm:h-2.5 transition-all duration-300 rounded-full cursor-pointer ${
              idx === current
                ? 'w-8 sm:w-10 bg-white shadow-md'
                : 'w-2 sm:w-2.5 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Main "How Sahayak Works" Section Component.
 */
export const HowSahayakWorks = ({ onOpenAuth }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigate = (route) => {
    if (user) {
      navigate(route);
    } else if (onOpenAuth) {
      onOpenAuth('signup');
    } else {
      navigate(route);
    }
  };

  return (
    <section id="how-it-works" className="py-16 sm:py-20 bg-white border-y border-slate-200/80 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-orange-50/90 border border-orange-200/80 text-orange-700 text-xs font-semibold tracking-wide mb-3.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#f45b18]" />
            <span>Interactive Workflow</span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-slate-900 tracking-tight leading-tight">
            How Sahayak Works
          </h2>

          {/* Subtitle */}
          <p className="mt-2.5 text-base sm:text-lg text-slate-600 font-medium">
            “From unstructured tender text to verified Indian Standards in seconds.”
          </p>
        </div>

        {/* Compact, Properly Proportioned Workflow Carousel */}
        <div className="max-w-5xl mx-auto">
          <WorkflowCarousel steps={WORKFLOW_STEPS} onNavigate={handleNavigate} />
        </div>

      </div>
    </section>
  );
};

// Also export as HowItWorks for seamless drop-in backwards compatibility
export const HowItWorks = HowSahayakWorks;


/* ==========================================================================
   SECTION: HeroSection
   ========================================================================== */
export const HeroSection = ({ onOpenFinder, onOpenDemo }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigate = (route) => {
    if (user) {
      navigate(route);
    } else if (onOpenFinder) {
      onOpenFinder();
    } else {
      navigate(route);
    }
  };

  return (
    <section 
      id="hero" 
      className="relative flex-1 flex flex-col justify-center overflow-hidden pt-16 sm:pt-20 lg:pt-16 pb-8 sm:pb-12 lg:pb-8 select-none z-10"
    >
      {/* Main Container */}
      <div className="w-full px-5 sm:px-8 lg:px-10 xl:px-14 max-w-[1720px] mx-auto my-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 xl:gap-14">
          
          {/* Left Column — Typography and CTA */}
          <div className="w-full lg:w-[40%] xl:w-[38%] flex flex-col items-start justify-center text-left py-3 sm:py-6 shrink-0">
            
            {/* 4-Line Headline */}
            <h1 className="text-[34px] sm:text-[42px] lg:text-[46px] xl:text-[52px] font-black tracking-tight leading-[1.1] text-[#041D3F] mb-4 sm:mb-5 lg:mb-6 text-left">
              <span className="block">Every Indian</span>
              <span className="block">Standard.</span>
              <span className="block text-[#FC4814]">Right Specification.</span>
              <span className="block">Zero Tender Errors.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[14px] sm:text-[15px] lg:text-[16px] leading-[1.6] text-[#475569] font-medium max-w-[460px] mb-6 sm:mb-7 lg:mb-8 text-left">
              Upload your product spec or tender document. AI instantly recommends exact active IS codes, test methods, and mandatory BIS certifications.
            </p>

            {/* Get Started Button */}
            <div className="flex items-center text-left">
              <button
                onClick={onOpenFinder}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 sm:py-4 text-[15px] sm:text-[16px] font-bold text-white bg-[#FC4814] hover:bg-[#e03d0d] active:bg-[#c9350a] rounded-full shadow-lg shadow-[#FC4814]/30 hover:shadow-xl hover:shadow-[#FC4814]/40 transition-all transform hover:-translate-y-0.5 cursor-pointer group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          {/* Right Column — Larger Interactive Workflow Slideshow */}
          <div className="w-full lg:w-[60%] xl:w-[62%] flex items-center justify-center lg:justify-end">
            <div className="w-full max-w-[880px] xl:max-w-[960px] 2xl:max-w-[1040px]">
              <WorkflowCarousel 
                steps={WORKFLOW_STEPS} 
                initialSlide={0} 
                onNavigate={handleNavigate} 
                className="w-full rounded-[22px] sm:rounded-[28px] border border-white/90 shadow-[0_18px_45px_-8px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/5" 
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};


/* ==========================================================================
   SECTION: ManualVsSahayak
   ========================================================================== */
/**
 * Manual Portal & Keyword Search vs Sahayak Engine comparison section.
 * Faithfully matches the exact visual structure, typography, and human-centered
 * photography from the provided reference design (Image 2).
 */
export const ManualVsSahayak = () => {
  const manualPoints = [
    'Must know exact IS code',
    'Struggles with plain descriptions',
    'Easy to miss related codes',
    'Time-consuming gazette checks',
    'No warnings for incomplete specs',
    'Need to cross-check across BIS lists',
  ];

  const sahayakPoints = [
    'Paste your product specs in plain English',
    'Understands technical details (voltage, materials, load)',
    'Pulls all related safety, testing and allied codes',
    'Checks active QCOs',
    'Catches missing clauses and tender errors',
    'Gives ready-to-use standard clauses (GeM)',
  ];

  return (
    <section id="what-we-fix" className="py-20 sm:py-24 bg-slate-50 relative overflow-hidden border-b border-slate-200/80">
      
      {/* Soft Ambient Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-orange-100/30 via-amber-100/30 to-orange-100/20 blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-[1550px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-orange-50/90 border border-orange-200/80 text-orange-700 text-xs font-semibold tracking-wide mb-3.5 shadow-xs">
            <BarChart2 className="w-3.5 h-3.5 text-[#f45b18]" />
            <span>Problem vs. Solution</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-[#0b1d3a] tracking-tight leading-tight">
            Traditional Search vs. Sahayak Engine
          </h2>
        </div>

        {/* Side-by-Side Comparison Grid (Two Cards Exactly Matching Reference Image 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-10 items-stretch w-full mx-auto">
          
          {/* Card 1 - Left Column: Manual Portal & Keyword Search */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row justify-between text-left relative overflow-hidden group hover:shadow-md transition-shadow">
            
            {/* Left Content Column */}
            <div className="p-6 sm:p-8 lg:p-7 xl:p-8 flex-1 flex flex-col justify-between z-10">
              <h3 className="text-xl sm:text-2xl lg:text-[1.65rem] font-black text-[#0b1d3a] tracking-tight leading-tight mb-6">
                Manual Portal &amp;<br className="hidden sm:inline" /> Keyword Search
              </h3>

              {/* 6 Manual Points with Red Circular X Icons */}
              <div className="space-y-3.5 sm:space-y-4">
                {manualPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center space-x-3 sm:space-x-3.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#ff244f] flex items-center justify-center shrink-0 shadow-xs">
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[3.5]" />
                    </div>
                    <span className="text-xs sm:text-[13.5px] lg:text-sm font-semibold text-[#0b1d3a] leading-snug">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full md:w-[260px] lg:w-[300px] xl:w-[330px] shrink-0 relative flex items-center justify-center overflow-hidden bg-white">
              <img
                src="/manual-bis-workflow.png"
                srcSet="/manual-bis-workflow.png 1x, /manual-bis-workflow@2x.png 2x"
                alt="Manual BIS Portal and Document Cross-Checking Workstation"
                className="w-full h-60 md:h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>

          {/* Card 2 - Right Column: Sahayak Engine (Recommended) */}
          <div className="bg-white rounded-3xl border-2 border-[#f45b18] shadow-lg flex flex-col md:flex-row justify-between text-left relative overflow-hidden group hover:shadow-xl transition-shadow">
            
            {/* Top-Right Recommended Badge */}
            <div className="absolute top-0 right-0 bg-[#f45b18] text-white text-[11px] sm:text-xs font-bold px-3.5 py-1.5 rounded-bl-xl tracking-wider uppercase flex items-center gap-1.5 shadow-xs z-20">
              <Crown className="w-3.5 h-3.5 text-white fill-white" />
              <span>RECOMMENDED</span>
            </div>

            {/* Left Content Column */}
            <div className="p-6 sm:p-8 lg:p-7 xl:p-8 flex-1 flex flex-col justify-between z-10">
              <h3 className="text-xl sm:text-2xl lg:text-[1.65rem] font-black text-[#0b1d3a] tracking-tight leading-tight mb-6">
                Sahayak Engine
              </h3>

              {/* 6 Sahayak Engine Points with Orange Circular Checkmark Icons */}
              <div className="space-y-3.5 sm:space-y-4">
                {sahayakPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center space-x-3 sm:space-x-3.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#16a34a] flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white stroke-[3.5]" />
                    </div>
                    <span className="text-xs sm:text-[13.5px] lg:text-sm font-semibold text-[#0b1d3a] leading-snug">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Image */}
            <div className="w-full md:w-[260px] lg:w-[300px] xl:w-[330px] shrink-0 relative flex items-center justify-center overflow-hidden bg-white">
              <img
                src="/sahayak-engine-workflow.png"
                srcSet="/sahayak-engine-workflow.png 1x, /sahayak-engine-workflow@2x.png 2x"
                alt="Professional using Sahayak Procurement AI Dashboard on Laptop"
                className="w-full h-60 md:h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

// Aliases for backward compatibility
export const WhatWeFix = ManualVsSahayak;


/* ==========================================================================
   SECTION: SupportedSectors
   ========================================================================== */
export const SupportedSectors = ({ onSelectSector }) => {
  const sectors = [
    {
      id: 'electrical',
      title: 'Electrical & Power Equipment',
      icon: <Zap className="w-5 h-5 text-[#B44A14] stroke-[2.2]" />,
      iconBg: 'bg-[#FFE8DC]',
      count: '3,840+ Codes',
      badgeStyle: 'bg-[#FFEBDC] text-[#B8531D]',
      dotColor: 'bg-[#FA4D09]',
      borderColor: 'border-[#F8DFC8]',
      bgImage: '/sectors/electrical.png',
      codes: ['IS 13118 (VCB)', 'IS 694 (Cables)', 'IS 1180 (Transformers)'],
      sampleQuery: 'Procurement of 33kV outdoor vacuum circuit breakers for substation'
    },
    {
      id: 'civil',
      title: 'Civil Construction Materials',
      icon: <HardHat className="w-5 h-5 text-[#1E293B] stroke-[2.2]" />,
      iconBg: 'bg-[#E5F0FA]',
      count: '4,280+ Codes',
      badgeStyle: 'bg-[#D4F8E7] text-[#0B7C50]',
      dotColor: 'bg-[#5B86B7]',
      borderColor: 'border-[#D3E8D7]',
      bgImage: '/sectors/civil.png',
      codes: ['IS 1786 (Fe 500D)', 'IS 456 (RCC)', 'IS 383 (Aggregates)'],
      sampleQuery: 'High yield strength corrosion-resistant TMT rebars Fe 500D'
    },
    {
      id: 'it',
      title: 'IT Hardware & Telecommunications',
      icon: <Monitor className="w-5 h-5 text-[#854D0E] stroke-[2.2]" />,
      iconBg: 'bg-[#FEEBD8]',
      count: '2,950+ Codes',
      badgeStyle: 'bg-[#FEF7D5] text-[#926310]',
      dotColor: 'bg-[#FA4D09]',
      borderColor: 'border-[#F7DFCC]',
      bgImage: '/sectors/it.png',
      codes: ['IS 13252 (IT Safety)', 'IS 16046 (Lithium UPS)', 'IS 616 (Electronics)'],
      sampleQuery: 'Enterprise 42U rackmount server enclosure with redundant PDU'
    },
    {
      id: 'machinery',
      title: 'Industrial Machinery & Pumps',
      icon: <Settings className="w-5 h-5 text-[#1E293B] stroke-[2.2]" />,
      iconBg: 'bg-[#E6F0FC]',
      count: '3,100+ Codes',
      badgeStyle: 'bg-[#FFE6D3] text-[#B85517]',
      dotColor: 'bg-[#FA4D09]',
      borderColor: 'border-[#D4E3F3]',
      bgImage: '/sectors/machinery.png',
      codes: ['IS 8472 (Pumps)', 'IS 2825 (Pressure Vessels)', 'IS 3589 (Pipes)'],
      sampleQuery: 'Centrifugal monoblock water pumps for agricultural water distribution'
    },
    {
      id: 'chemicals',
      title: 'Chemicals & Protective Gear (PPE)',
      icon: <FlaskConical className="w-5 h-5 text-[#064E3B] stroke-[2.2]" />,
      iconBg: 'bg-[#D5F9EE]',
      count: '3,620+ Codes',
      badgeStyle: 'bg-[#D4F8ED] text-[#0B7C59]',
      dotColor: 'bg-[#FA4D09]',
      borderColor: 'border-[#C5F3E7]',
      bgImage: '/sectors/chemicals.png',
      codes: ['IS 4984 (HDPE Pipe)', 'IS 10500 (Water)', 'IS 2925 (Helmets)'],
      sampleQuery: 'HDPE Potable Water Pipes PE-100 PN-10 for Jal Jeevan Mission'
    },
    {
      id: 'safety',
      title: 'Safety & Mandatory BIS Items',
      icon: <ShieldCheck className="w-5 h-5 text-[#BE123C] stroke-[2.2]" />,
      iconBg: 'bg-[#FEE2E9]',
      count: '850+ QCOs',
      badgeStyle: 'bg-[#FEE0E9] text-[#C11D51]',
      dotColor: 'bg-[#FA4D09]',
      borderColor: 'border-[#FCD3DF]',
      bgImage: '/sectors/safety.png',
      codes: ['IS 2189 (Fire Alarms)', 'IS 15683 (Extinguishers)', 'IS 3521 (Harness)'],
      sampleQuery: 'Industrial safety harness and fall arrester conforming to BIS QCO'
    }
  ];

  return (
    <section id="sectors" className="py-12 sm:py-16 bg-white border-b border-slate-200/70 select-none">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header matching exact reference */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-9">
          <h2 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-[#041D3F] tracking-tight">
            Supported Sectors &amp; Coverage
          </h2>
          <div className="w-14 h-[3.5px] bg-[#FA4D09] rounded-full mx-auto mt-2.5" />
        </div>

        {/* 6 Visual Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {sectors.map((sector) => (
            <div
              key={sector.id}
              onClick={() => onSelectSector && onSelectSector(sector.sampleQuery)}
              className={`relative overflow-hidden rounded-[18px] border ${sector.borderColor} bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between cursor-pointer group min-h-[195px] sm:min-h-[202px]`}
            >
              {/* Sharp, unblurred Sector Background Image visible on right */}
              <img
                src={sector.bgImage}
                alt={sector.title}
                className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none z-0 select-none transition-transform duration-300 group-hover:scale-105"
              />

              {/* Left-side Blur: blurs only the left background behind text, leaves right side crisp & visible */}
              <img
                src={sector.bgImage}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover object-right pointer-events-none z-[1] select-none blur-[6px] transition-transform duration-300 group-hover:scale-105"
                style={{
                  maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 65%)',
                  WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 65%)'
                }}
              />

              {/* Soft Left Gradient Overlay so Text is 100% Proper and Legible */}
              <div 
                className="absolute inset-0 pointer-events-none z-[2]"
                style={{
                  background: 'linear-gradient(to right, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.55) 40%, rgba(255,255,255,0) 70%)'
                }}
              />

              {/* Card Foreground Content */}
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-full ${sector.iconBg} flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform duration-200`}>
                      {sector.icon}
                    </div>
                    <span className={`text-[11.5px] font-bold px-3 py-1 rounded-full ${sector.badgeStyle} shadow-2xs`}>
                      {sector.count}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[14px] sm:text-[14.5px] lg:text-[15px] font-extrabold text-[#041D3F] mb-2 tracking-tight group-hover:text-[#FA4D09] transition-colors whitespace-nowrap drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                    {sector.title}
                  </h3>

                  {/* Code Bullets */}
                  <div className="space-y-1 mb-2.5 max-w-[70%]">
                    {sector.codes.map((c, i) => (
                      <div key={i} className="text-[11.5px] sm:text-[12px] font-semibold text-[#334155] flex items-center gap-2 leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)]">
                        <span className={`w-1.5 h-1.5 rounded-full ${sector.dotColor} shrink-0`} />
                        <span className="truncate">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Link with subtle divider line */}
                <div>
                  <div className="w-28 h-[1px] bg-slate-200/80 mb-2" />
                  <div className="inline-flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-bold text-[#FA4D09] group-hover:gap-2.5 transition-all">
                    <span>Test Sample Spec</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.4]" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};


/* ==========================================================================
   SECTION: ComplianceFramework
   ========================================================================== */
/* Official BIS Logo with BIS label */
const BisMark = () => (
  <div className="flex flex-col items-center justify-center shrink-0">
    <svg viewBox="0 0 100 80" className="w-9 h-7 sm:w-10 sm:h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Blue Triangle */}
      <path
        d="M50 8 L14 74 Q12 78 16 78 L84 78 Q88 78 86 74 L50 8 Z"
        fill="#0B4D9C"
      />
      {/* Inner White Triangle */}
      <path
        d="M50 25 L27 68 L73 68 Z"
        fill="#FFFFFF"
      />
      {/* Center Red Dot */}
      <circle cx="50" cy="50" r="8.5" fill="#D32F2F" />
    </svg>
    <span className="text-[10px] font-black tracking-widest text-[#0B4D9C] mt-0.5 select-none">BIS</span>
  </div>
);

/* Official GeM Star Emblem with GeM label */
const GemMark = () => (
  <div className="flex flex-col items-center justify-center shrink-0">
    <svg viewBox="0 0 100 90" className="w-9 h-7 sm:w-10 sm:h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Top Petal - Green */}
      <polygon points="50,6 58,32 50,47 42,32" fill="#22C55E" />
      {/* Top-Right Petal - Orange */}
      <polygon points="88,35 71,45 50,47 67,28" fill="#F97316" />
      {/* Bottom-Right Petal - Blue */}
      <polygon points="74,83 54,66 50,47 69,54" fill="#0284C7" />
      {/* Bottom-Left Petal - Red */}
      <polygon points="26,83 31,54 50,47 46,66" fill="#EF4444" />
      {/* Top-Left Petal - Deep Blue */}
      <polygon points="12,35 33,28 50,47 29,45" fill="#1D4ED8" />
      {/* Center White Core */}
      <circle cx="50" cy="47" r="4.5" fill="#FFFFFF" />
    </svg>
    <span className="text-[9px] font-black tracking-wider text-slate-700 mt-0.5 select-none">GeM</span>
  </div>
);

/* Official Ashoka Lion Capital (State Emblem of India) */
const AshokaEmblem = () => (
  <div className="flex flex-col items-center justify-center shrink-0">
    <svg viewBox="0 0 100 110" className="w-8 h-9 sm:w-9 sm:h-10 text-slate-800" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      {/* Central Lion Profile */}
      <path d="M50 7 C46 7 42 11 42 15 C42 19 45 23 47 25 C45 27 43 30 43 35 C43 39 46 43 50 45 C54 43 57 39 57 35 C57 30 55 27 53 25 C55 23 58 19 58 15 C58 11 54 7 50 7 Z" />
      {/* Left Lion Profile */}
      <path d="M36 15 C32 15 28 19 28 23 C28 28 31 32 34 34 C32 37 31 41 32 45 C34 49 38 52 42 53 C41 49 40 45 41 41 C38 39 36 35 36 31 C36 26 38 22 41 19 C39 17 38 15 36 15 Z" />
      {/* Right Lion Profile */}
      <path d="M64 15 C62 15 61 17 59 19 C62 22 64 26 64 31 C64 35 62 39 59 41 C60 45 59 49 58 53 C62 52 66 49 68 45 C69 41 68 37 66 34 C69 32 72 28 72 23 C72 19 68 15 64 15 Z" />
      {/* Lion Chest Body */}
      <path d="M42 53 C44 55 47 56 50 56 C53 56 56 55 58 53 C60 59 62 65 64 71 L36 71 C38 65 40 59 42 53 Z" />
      {/* Abacus Base Platform */}
      <rect x="22" y="73" width="56" height="11" rx="2" fill="currentColor" />
      {/* Ashoka Chakra Wheel */}
      <circle cx="50" cy="78.5" r="4" fill="#ffffff" />
      <circle cx="50" cy="78.5" r="1.5" fill="currentColor" />
      {/* Bell Capital Base */}
      <path d="M26 86 L74 86 L70 95 L30 95 Z" fill="currentColor" />
      {/* Satyameva Jayate Motto Bar */}
      <rect x="30" y="98" width="40" height="3" rx="1.5" fill="currentColor" opacity="0.85" />
    </svg>
    <span className="text-[7px] font-bold tracking-wider text-slate-700 mt-0.5 select-none">सत्यमेव जयते</span>
  </div>
);

/* Official BIS Logo for Document Header with Hindi Motto */
const BisDocLogo = () => (
  <div className="flex flex-col items-center justify-center shrink-0">
    <svg viewBox="0 0 100 80" className="w-8 h-6 sm:w-9 sm:h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M50 8 L14 74 Q12 78 16 78 L84 78 Q88 78 86 74 L50 8 Z"
        fill="#0B4D9C"
      />
      <path
        d="M50 25 L27 68 L73 68 Z"
        fill="#FFFFFF"
      />
      <circle cx="50" cy="50" r="8.5" fill="#D32F2F" />
    </svg>
    <span className="text-[5.5px] font-bold tracking-tight text-[#0B4D9C] mt-0.5 select-none leading-none">
      मानकः पथप्रदर्शकः
    </span>
  </div>
);

/* Official Ashoka Emblem for Document Header with Hindi Motto */
const AshokaDocLogo = () => (
  <div className="flex flex-col items-center justify-center shrink-0">
    <svg viewBox="0 0 100 110" className="w-6 h-7 sm:w-7 sm:h-8 text-slate-800" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 7 C46 7 42 11 42 15 C42 19 45 23 47 25 C45 27 43 30 43 35 C43 39 46 43 50 45 C54 43 57 39 57 35 C57 30 55 27 53 25 C55 23 58 19 58 15 C58 11 54 7 50 7 Z" />
      <path d="M36 15 C32 15 28 19 28 23 C28 28 31 32 34 34 C32 37 31 41 32 45 C34 49 38 52 42 53 C41 49 40 45 41 41 C38 39 36 35 36 31 C36 26 38 22 41 19 C39 17 38 15 36 15 Z" />
      <path d="M64 15 C62 15 61 17 59 19 C62 22 64 26 64 31 C64 35 62 39 59 41 C60 45 59 49 58 53 C62 52 66 49 68 45 C69 41 68 37 66 34 C69 32 72 28 72 23 C72 19 68 15 64 15 Z" />
      <path d="M42 53 C44 55 47 56 50 56 C53 56 56 55 58 53 C60 59 62 65 64 71 L36 71 C38 65 40 59 42 53 Z" />
      <rect x="22" y="73" width="56" height="11" rx="2" fill="currentColor" />
      <circle cx="50" cy="78.5" r="4" fill="#ffffff" />
      <circle cx="50" cy="78.5" r="1.5" fill="currentColor" />
      <path d="M26 86 L74 86 L70 95 L30 95 Z" fill="currentColor" />
      <rect x="30" y="98" width="40" height="3" rx="1.5" fill="currentColor" opacity="0.85" />
    </svg>
    <span className="text-[5.5px] font-bold tracking-wider text-slate-700 mt-0.5 select-none leading-none">
      सत्यमेव जयते
    </span>
  </div>
);

export const ComplianceFramework = () => {
  const containerRef = useRef(null);
  const bisRef = useRef(null);
  const gemRef = useRef(null);
  const dpiitRef = useRef(null);
  const tlsRef = useRef(null);
  const docRef = useRef(null);

  const [coords, setCoords] = useState(null);

  const updateCoords = useCallback(() => {
    if (!containerRef.current || !docRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const docRect = docRef.current.getBoundingClientRect();
    const bisRect = bisRef.current?.getBoundingClientRect();
    const gemRect = gemRef.current?.getBoundingClientRect();
    const dpiitRect = dpiitRef.current?.getBoundingClientRect();
    const tlsRect = tlsRef.current?.getBoundingClientRect();

    if (!bisRect || !gemRect || !dpiitRect || !tlsRect) return;

    const docLeft = docRect.left - containerRect.left;
    const docRight = docRect.right - containerRect.left;
    const docTop = docRect.top - containerRect.top;
    const docHeight = docRect.height;

    // Start points on the outer edge of each card
    const startBis = {
      x: bisRect.right - containerRect.left,
      y: bisRect.top + bisRect.height * 0.5 - containerRect.top
    };
    const startGem = {
      x: gemRect.right - containerRect.left,
      y: gemRect.top + gemRect.height * 0.5 - containerRect.top
    };
    const startDpiit = {
      x: dpiitRect.left - containerRect.left,
      y: dpiitRect.top + dpiitRect.height * 0.5 - containerRect.top
    };
    const startTls = {
      x: tlsRect.left - containerRect.left,
      y: tlsRect.top + tlsRect.height * 0.5 - containerRect.top
    };

    // Landing coordinates aligned to the document sections
    // Upper line targets the procurement title box (~22% height)
    // Lower line targets Section 2 Critical Dates (~62% height)
    const landingLeftUpper = { x: docLeft, y: docTop + docHeight * 0.22 };
    const landingLeftLower = { x: docLeft, y: docTop + docHeight * 0.62 };
    const landingRightUpper = { x: docRight, y: docTop + docHeight * 0.22 };
    const landingRightLower = { x: docRight, y: docTop + docHeight * 0.62 };

    setCoords({
      bis: { start: startBis, end: landingLeftUpper },
      gem: { start: startGem, end: landingLeftLower },
      dpiit: { start: startDpiit, end: landingRightUpper },
      tls: { start: startTls, end: landingRightLower }
    });
  }, []);

  useLayoutEffect(() => {
    updateCoords();
  }, [updateCoords]);

  useEffect(() => {
    const t1 = setTimeout(updateCoords, 50);
    const t2 = setTimeout(updateCoords, 200);
    const t3 = setTimeout(updateCoords, 500);

    const handleResize = () => updateCoords();
    window.addEventListener('resize', handleResize);

    let observer;
    if (containerRef.current && window.ResizeObserver) {
      observer = new ResizeObserver(() => updateCoords());
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
    };
  }, [updateCoords]);

  // Clean, elegant Bezier S-curve generators with smooth horizontal exit and entry
  const getLeftCurve = (start, end) => {
    const dx = end.x - start.x;
    const cp1x = start.x + dx * 0.45;
    const cp1y = start.y;
    const cp2x = end.x - dx * 0.35;
    const cp2y = end.y;
    return `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;
  };

  const getRightCurve = (start, end) => {
    const dx = start.x - end.x;
    const cp1x = start.x - dx * 0.45;
    const cp1y = start.y;
    const cp2x = end.x + dx * 0.35;
    const cp2y = end.y;
    return `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;
  };

  return (
    <section id="compliance" className="py-20 lg:py-24 bg-[#FAF9F6] border-y border-slate-200/60 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-orange-200/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-orange-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* TOP CENTER: Exact Header requested by User */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold text-[#0F172A] tracking-tight leading-tight">
            Compliance Built Into <span className="text-[#F97316]">Every Tender</span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
            We align with India's official regulatory bodies to ensure every tender you create meets the highest standards of compliance and security.
          </p>
        </div>

        {/* MAIN HORIZONTAL COMPOSITION (Left Cards | Center Stack | Right Cards) */}
        <div
          ref={containerRef}
          className="relative max-w-6xl mx-auto flex flex-col lg:grid lg:grid-cols-[1fr_minmax(315px,360px)_1fr] items-stretch gap-6 lg:gap-8 xl:gap-12"
        >
          {/* Dynamic SVG Curved Connector Lines with Orange Circular Endpoints (Desktop Only) */}
          {coords && (
            <svg
              className="absolute inset-0 pointer-events-none w-full h-full z-20 hidden lg:block overflow-visible"
              aria-hidden="true"
            >
              {/* BIS -> Center Report Top-Left */}
              <path
                d={getLeftCurve(coords.bis.start, coords.bis.end)}
                stroke="#F97316"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx={coords.bis.start.x} cy={coords.bis.start.y} r="4.5" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx={coords.bis.end.x} cy={coords.bis.end.y} r="4.5" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" />

              {/* GeM -> Center Report Bottom-Left */}
              <path
                d={getLeftCurve(coords.gem.start, coords.gem.end)}
                stroke="#F97316"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx={coords.gem.start.x} cy={coords.gem.start.y} r="4.5" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx={coords.gem.end.x} cy={coords.gem.end.y} r="4.5" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" />

              {/* DPIIT & Ministries -> Center Report Top-Right */}
              <path
                d={getRightCurve(coords.dpiit.start, coords.dpiit.end)}
                stroke="#F97316"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx={coords.dpiit.start.x} cy={coords.dpiit.start.y} r="4.5" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx={coords.dpiit.end.x} cy={coords.dpiit.end.y} r="4.5" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" />

              {/* 256-bit TLS Encryption -> Center Report Bottom-Right */}
              <path
                d={getRightCurve(coords.tls.start, coords.tls.end)}
                stroke="#F97316"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <circle cx={coords.tls.start.x} cy={coords.tls.start.y} r="4.5" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx={coords.tls.end.x} cy={coords.tls.end.y} r="4.5" fill="#F97316" stroke="#FFFFFF" strokeWidth="2" />
            </svg>
          )}

          {/* LEFT SIDE: BIS and GeM Cards */}
          <div className="flex flex-col justify-between w-full max-w-md lg:max-w-[360px] lg:justify-self-end h-full gap-6">
            
            {/* Top Left Card: BIS */}
            <div
              ref={bisRef}
              className="relative bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-200/80 hover:bg-[#FFFDFB] hover:border-orange-300 hover:shadow-[0_10px_28px_-4px_rgba(249,115,22,0.12)] hover:-translate-y-0.5 transition-all duration-300 ease-out flex items-center gap-4 sm:gap-5 cursor-pointer overflow-hidden"
            >
              {/* Blue accent line on left edge */}
              <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-[#0284C7] rounded-r-md" />

              {/* BIS Logo Squircle */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-[#F0F5FA] border border-[#E2E8F0]/80 flex items-center justify-center">
                <BisMark />
              </div>

              {/* Card Content */}
              <div className="flex flex-col items-start flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] leading-tight">BIS</h3>
                <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed mt-1 mb-3">
                  Mapped to active IS codes, amendments, and quality standards.
                </p>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF8F0] text-[#16A34A] text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 fill-[#16A34A] text-white" />
                  <span>Aligned</span>
                </span>
              </div>
            </div>

            {/* Bottom Left Card: GeM */}
            <div
              ref={gemRef}
              className="relative bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-200/80 hover:bg-[#FFFDFB] hover:border-orange-300 hover:shadow-[0_10px_28px_-4px_rgba(249,115,22,0.12)] hover:-translate-y-0.5 transition-all duration-300 ease-out flex items-center gap-4 sm:gap-5 cursor-pointer overflow-hidden"
            >
              {/* Orange accent line on left edge */}
              <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-[#F97316] rounded-r-md" />

              {/* GeM Logo Squircle */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-[#FFF7F0] border border-[#FED7AA]/50 flex items-center justify-center">
                <GemMark />
              </div>

              {/* Card Content */}
              <div className="flex flex-col items-start flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] leading-tight">GeM</h3>
                <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed mt-1 mb-3">
                  Fully compliant with GeM procurement guidelines.
                </p>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF8F0] text-[#16A34A] text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 fill-[#16A34A] text-white" />
                  <span>Aligned</span>
                </span>
              </div>
            </div>

          </div>

          {/* CENTER: Compact Layered Document Stack with 100% Vector-Sharp, Visible, Crisp HTML Report */}
          <div className="relative flex items-center justify-center w-full max-w-[320px] sm:max-w-[345px] lg:max-w-[355px] xl:max-w-[365px] mx-auto my-6 lg:my-0">
            {/* Layered Paper Sheet 1 (Behind, tilted left) */}
            <div className="absolute inset-0 bg-white rounded-2xl shadow-sm -rotate-[2.5deg] scale-[0.98] -translate-x-2 translate-y-1 border border-slate-200/70 pointer-events-none" />

            {/* Layered Paper Sheet 2 (Behind, tilted slightly right) */}
            <div className="absolute inset-0 bg-white rounded-2xl shadow-sm rotate-[2deg] scale-[0.99] translate-x-1.5 translate-y-0.5 border border-slate-200/70 pointer-events-none" />

            {/* Main Front Document Container: Crisp, Razor-Sharp, 100% Visible */}
            <div
              ref={docRef}
              className="relative z-10 w-full bg-white rounded-2xl shadow-[0_14px_42px_rgba(0,0,0,0.08)] border border-slate-200/90 p-4 sm:p-4.5 text-slate-800 select-none transition-all duration-300 hover:shadow-[0_18px_50px_rgba(0,0,0,0.12)]"
            >
              {/* DOCUMENT HEADER: Logos & Ministry Title */}
              <div className="flex items-center justify-between gap-1.5 pb-2.5 border-b border-slate-100">
                <BisDocLogo />
                <div className="flex flex-col items-center text-center flex-1 px-1">
                  <h4 className="text-[10px] sm:text-[11px] font-black text-[#0A2540] tracking-tight leading-tight">
                    REQUEST FOR PROPOSAL (RFP)
                  </h4>
                  <span className="text-[8px] sm:text-[8.5px] font-bold text-slate-700 tracking-wide mt-0.5">
                    (TENDER DOCUMENT)
                  </span>
                  <span className="text-[6.5px] sm:text-[7.2px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                    MINISTRY OF HOUSING AND URBAN AFFAIRS
                  </span>
                  <span className="text-[6px] sm:text-[6.5px] text-slate-400">
                    Government of India
                  </span>
                </div>
                <AshokaDocLogo />
              </div>

              {/* PROCUREMENT TITLE ORANGE HIGHLIGHT BOX */}
              <div className="mt-2.5 mb-2.5 p-1.5 rounded bg-[#FFF7ED] border border-[#FDBA74] text-center shadow-xs">
                <p className="text-[7.2px] sm:text-[7.8px] font-bold text-[#0F172A] uppercase tracking-tight leading-snug">
                  SUPPLY, INSTALLATION, TESTING AND COMMISSIONING OF IT INFRASTRUCTURE FOR GOVERNMENT OFFICES
                </p>
              </div>

              {/* SECTION 1: TENDER INFORMATION */}
              <div className="mb-2.5">
                <div className="flex items-stretch rounded-t-sm overflow-hidden">
                  <span className="bg-[#F97316] text-white text-[7.5px] sm:text-[8px] font-black px-1.5 py-0.5 flex items-center justify-center">
                    1.
                  </span>
                  <span className="bg-[#0A2540] text-white text-[7.5px] sm:text-[8px] font-bold px-2 py-0.5 flex-1 uppercase tracking-wider">
                    TENDER INFORMATION
                  </span>
                </div>

                {/* Table */}
                <div className="border border-t-0 border-slate-200/90 text-[7px] sm:text-[7.6px] overflow-hidden">
                  <div className="grid grid-cols-[115px_1fr] sm:grid-cols-[125px_1fr] bg-slate-100 font-bold text-slate-700 border-b border-slate-200 px-1.5 py-0.5">
                    <span>Particular</span>
                    <span>Details</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-slate-600 font-medium">
                    <div className="grid grid-cols-[115px_1fr] sm:grid-cols-[125px_1fr] px-1.5 py-0.5 bg-white">
                      <span className="text-slate-500">Tender ID</span>
                      <span className="font-semibold text-slate-800">GEM/2024/IT/123456</span>
                    </div>
                    <div className="grid grid-cols-[115px_1fr] sm:grid-cols-[125px_1fr] px-1.5 py-0.5 bg-slate-50/50">
                      <span className="text-slate-500">Department</span>
                      <span className="text-slate-700">Ministry of Housing and Urban Affairs</span>
                    </div>
                    <div className="grid grid-cols-[115px_1fr] sm:grid-cols-[125px_1fr] px-1.5 py-0.5 bg-white">
                      <span className="text-slate-500">Item Category</span>
                      <span className="text-slate-700">IT Infrastructure</span>
                    </div>
                    <div className="grid grid-cols-[115px_1fr] sm:grid-cols-[125px_1fr] px-1.5 py-0.5 bg-slate-50/50">
                      <span className="text-slate-500">Mode of Procurement</span>
                      <span className="text-slate-700">Open Tender</span>
                    </div>
                    <div className="grid grid-cols-[115px_1fr] sm:grid-cols-[125px_1fr] px-1.5 py-0.5 bg-white">
                      <span className="text-slate-500">Bid Submission Date</span>
                      <span className="font-semibold text-slate-800">12-05-2024</span>
                    </div>
                    <div className="grid grid-cols-[115px_1fr] sm:grid-cols-[125px_1fr] px-1.5 py-0.5 bg-slate-50/50">
                      <span className="text-slate-500">Performance Security</span>
                      <span className="text-slate-700">As per tender document</span>
                    </div>
                    <div className="grid grid-cols-[115px_1fr] sm:grid-cols-[125px_1fr] px-1.5 py-0.5 bg-white">
                      <span className="text-slate-500">Validity Period</span>
                      <span className="font-semibold text-slate-800">180 Days</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 2: CRITICAL DATES */}
              <div className="mb-2.5">
                <div className="flex items-stretch rounded-t-sm overflow-hidden">
                  <span className="bg-[#F97316] text-white text-[7.5px] sm:text-[8px] font-black px-1.5 py-0.5 flex items-center justify-center">
                    2.
                  </span>
                  <span className="bg-[#0A2540] text-white text-[7.5px] sm:text-[8px] font-bold px-2 py-0.5 flex-1 uppercase tracking-wider">
                    CRITICAL DATES
                  </span>
                </div>

                {/* Table */}
                <div className="border border-t-0 border-slate-200/90 text-[6.8px] sm:text-[7.4px] overflow-hidden">
                  <div className="grid grid-cols-[1.1fr_1.2fr_0.9fr] bg-slate-100 font-bold text-slate-700 border-b border-slate-200 px-1.5 py-0.5">
                    <span>Event</span>
                    <span>Date &amp; Time</span>
                    <span>Location</span>
                  </div>
                  <div className="divide-y divide-slate-100 text-slate-600 font-medium">
                    <div className="grid grid-cols-[1.1fr_1.2fr_0.9fr] px-1.5 py-0.5 bg-white">
                      <span className="text-slate-500">Bid Publish Date</span>
                      <span className="text-slate-700">01-05-2024 10:00 AM</span>
                      <span className="font-semibold text-slate-800">GeM Portal</span>
                    </div>
                    <div className="grid grid-cols-[1.1fr_1.2fr_0.9fr] px-1.5 py-0.5 bg-slate-50/50">
                      <span className="text-slate-500">Pre-bid Meeting</span>
                      <span className="text-slate-700">05-05-2024 11:00 AM</span>
                      <span className="text-slate-700">Online (MS Teams)</span>
                    </div>
                    <div className="grid grid-cols-[1.1fr_1.2fr_0.9fr] px-1.5 py-0.5 bg-white">
                      <span className="text-slate-500">Bid Submission End</span>
                      <span className="text-slate-700">12-05-2024 05:00 PM</span>
                      <span className="font-semibold text-slate-800">GeM Portal</span>
                    </div>
                    <div className="grid grid-cols-[1.1fr_1.2fr_0.9fr] px-1.5 py-0.5 bg-slate-50/50">
                      <span className="text-slate-500">Technical Bid Opening</span>
                      <span className="text-slate-700">13-05-2024 11:00 AM</span>
                      <span className="font-semibold text-slate-800">GeM Portal</span>
                    </div>
                    <div className="grid grid-cols-[1.1fr_1.2fr_0.9fr] px-1.5 py-0.5 bg-white">
                      <span className="text-slate-500">Financial Bid Opening</span>
                      <span className="text-slate-700">To be notified</span>
                      <span className="font-semibold text-slate-800">GeM Portal</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DOCUMENT FOOTER */}
              <div className="flex items-center justify-between pt-2 mt-1 border-t border-slate-100">
                <div className="flex flex-col gap-0.5">
                  <div className="h-0.5 w-8 bg-[#F97316] rounded-full" />
                  <div className="h-0.5 w-4 bg-[#F97316]/70 rounded-full" />
                </div>
                <span className="text-[7px] sm:text-[7.5px] text-slate-400 font-medium">
                  Page 1 of 24
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: DPIIT & Ministries and 256-bit TLS Encryption Cards */}
          <div className="flex flex-col justify-between w-full max-w-md lg:max-w-[360px] lg:justify-self-start h-full gap-6">
            
            {/* Top Right Card: DPIIT & Ministries */}
            <div
              ref={dpiitRef}
              className="relative bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-200/80 hover:bg-[#FFFDFB] hover:border-orange-300 hover:shadow-[0_10px_28px_-4px_rgba(249,115,22,0.12)] hover:-translate-y-0.5 transition-all duration-300 ease-out flex items-center gap-4 sm:gap-5 cursor-pointer overflow-hidden"
            >
              {/* Indigo accent line on right edge */}
              <div className="absolute right-0 top-3 bottom-3 w-1.5 bg-[#6366F1] rounded-l-md" />

              {/* DPIIT Logo Squircle */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-[#F4F2FD] border border-[#E0E7FF]/60 flex items-center justify-center">
                <AshokaEmblem />
              </div>

              {/* Card Content */}
              <div className="flex flex-col items-start flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] leading-tight">DPIIT &amp; Ministries</h3>
                <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed mt-1 mb-3">
                  Updated with DPIIT policies and mandatory QCO orders.
                </p>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF8F0] text-[#16A34A] text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 fill-[#16A34A] text-white" />
                  <span>Aligned</span>
                </span>
              </div>
            </div>

            {/* Bottom Right Card: 256-bit TLS Encryption */}
            <div
              ref={tlsRef}
              className="relative bg-white rounded-2xl p-5 sm:p-6 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] border border-slate-200/80 hover:bg-[#FFFDFB] hover:border-orange-300 hover:shadow-[0_10px_28px_-4px_rgba(249,115,22,0.12)] hover:-translate-y-0.5 transition-all duration-300 ease-out flex items-center gap-4 sm:gap-5 cursor-pointer overflow-hidden"
            >
              {/* Orange accent line on right edge */}
              <div className="absolute right-0 top-3 bottom-3 w-1.5 bg-[#F97316] rounded-l-md" />

              {/* TLS Lock Squircle */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-[#FFF3EC] border border-[#FED7AA]/50 flex items-center justify-center">
                <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-[#F97316] stroke-[2.2]" />
              </div>

              {/* Card Content */}
              <div className="flex flex-col items-start flex-1 min-w-0">
                <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] leading-tight">256-bit TLS Encryption</h3>
                <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed mt-1 mb-3">
                  256-bit TLS encryption for secure processing.
                </p>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAF8F0] text-[#16A34A] text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 fill-[#16A34A] text-white" />
                  <span>Secured</span>
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};


/* ==========================================================================
   SECTION: FaqSection
   ========================================================================== */
const FAQ_ITEMS = [
  {
    id: 'accuracy',
    question: 'How accurate is the Sahayak engine?',
    answer: 'Sahayak achieves over 99% precision by using semantic decomposition across all active Bureau of Indian Standards (BIS) technical standards.',
  },
  {
    id: 'updates',
    question: 'How frequently are BIS amendments and QCO gazettes updated?',
    answer: 'Our engine synchronizes continuously with daily official BIS gazette notifications, DPIIT Quality Control Orders, and Ministry updates to ensure your specifications never reference obsolete or superseded standards.'
  },
  {
    id: 'upload',
    question: 'Can I upload complex multi-page GeM tender PDFs and BOQs?',
    answer: 'Yes. You can upload comprehensive tender documents, multi-schedule BOQs (Bills of Quantities), and technical requirement sheets in PDF or Excel formats. Sahayak parses equipment items and maps corresponding IS codes automatically.'
  },
  {
    id: 'affiliation',
    question: 'Is Sahayak officially affiliated with the Bureau of Indian Standards?',
    answer: 'Sahayak is an intelligent AI procurement platform built for the Smart India Hackathon (SIH 2026). It aligns strictly with BIS standards catalogs, GFR 2017 Rule 144(i), and GeM public procurement directives to assist officers and vendors.'
  },
  {
    id: 'collaboration',
    question: 'Can procurement teams and contractors share project workspaces?',
    answer: 'Yes. Sahayak offers role-based collaborative workspaces where procurement panels, technical evaluators, and bidding contractors can review resolved standards, export compliance checklists, and share audit reports.'
  }
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-white relative overflow-hidden border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs sm:text-sm font-medium tracking-wide shadow-xs">
            <HelpCircle className="w-4 h-4 text-orange-600" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-slate-900 tracking-tight mt-4">
            Everything You Need to Know
          </h2>
        </div>

        {/* Polished Interactive Accordion Cards */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.id}
                className={`bg-white border rounded-2xl transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                  isOpen 
                    ? 'border-slate-300 border-l-4 border-l-orange-600 bg-orange-50/20' 
                    : 'border-slate-200 hover:border-orange-200'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-6 flex items-center justify-between gap-4 text-left cursor-pointer select-none group focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-slate-900 text-base sm:text-lg group-hover:text-orange-950 transition-colors">
                    {item.question}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 text-slate-400 group-hover:text-orange-600 ${
                      isOpen ? 'rotate-180 text-orange-600' : ''
                    }`}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-3 text-slate-600 leading-relaxed text-sm sm:text-base border-t border-slate-100/90">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export const FaqSection = FAQSection;


/* ==========================================================================
   SECTION: Footer
   ========================================================================== */
export const Footer = ({ onOpenAuth, onOpenStandards }) => {
  return (
    <footer className="bg-[#181210] text-slate-400 text-xs relative overflow-hidden">
      
      {/* Subtle Grid Dot Pattern Background Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#fb923c_1px,transparent_1px)] [background-size:24px_24px]"
      ></div>

      {/* 1. Upper CTA Banner (Warm Dark Section) */}
      <div className="relative z-10 border-b border-stone-800/80 py-20 px-4 sm:px-6 lg:px-8 text-center max-w-5xl mx-auto">
        
        {/* Top Pill Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-orange-950/50 border border-orange-700/60 text-orange-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-orange-400" />
          <span>Ready for Next-Gen Standards Discovery?</span>
        </div>

        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto">
          Streamline Your Procurement & Compliance Today
        </h2>

        {/* Subheading */}
        <p className="mt-4 mb-8 text-base sm:text-lg text-stone-300 max-w-2xl mx-auto font-normal leading-relaxed">
          Join thousands of public officers, infrastructure contractors, and compliance managers using Sahayak to draft flawless tender specifications.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => onOpenAuth ? onOpenAuth('signup') : (window.location.href = '#')}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold text-sm transition-all shadow-lg shadow-orange-600/25 hover:shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Create Free Account</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
          </button>
          
          <a 
            href="#sectors"
            onClick={onOpenStandards}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-stone-300" />
            <span>Browse Standards Directory</span>
          </a>
        </div>

      </div>

      {/* 2. Main 4-Column Footer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Column 1: Brand Info (Span 5 cols) */}
          <div className="lg:col-span-5 flex flex-col text-left">
            <div className="mb-4">
              <img 
                src="/sahayak-brand-equal-white.png?v=5" 
                alt="Sahayak — AI Support for Smart Procurement" 
                className="h-10 sm:h-11 w-auto object-contain"
              />
            </div>
            
            <p className="text-stone-400 text-sm leading-relaxed mb-4 max-w-sm">
              Built for smarter public procurement and Indian Standards discovery. Empowering technical officers, EPC contractors, and authorities across India.
            </p>

            <p className="text-stone-500 text-xs italic">
              Independent technology platform facilitating Indian Standards adoption.
            </p>
          </div>

          {/* Column 2: PLATFORM (Span 2 cols) */}
          <div className="lg:col-span-2 flex flex-col text-left">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              PLATFORM
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><a href="#hero" className="text-stone-400 hover:text-orange-400 transition-colors">Home</a></li>
              <li><a href="#how-it-works" className="text-stone-400 hover:text-orange-400 transition-colors">How It Works</a></li>
              <li><a href="#what-we-fix" className="text-stone-400 hover:text-orange-400 transition-colors">Comparison</a></li>
              <li><a href="#sectors" className="text-stone-400 hover:text-orange-400 transition-colors">Coverage</a></li>
              <li><a href="#compliance" className="text-stone-400 hover:text-orange-400 transition-colors">Compliance</a></li>
              <li><a href="#faq" className="text-stone-400 hover:text-orange-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Column 3: PORTALS & RESOURCES (Span 2 cols) */}
          <div className="lg:col-span-2 flex flex-col text-left">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              PORTALS & RESOURCES
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a href="https://www.bis.gov.in" target="_blank" rel="noreferrer" className="text-stone-400 hover:text-orange-400 transition-colors inline-flex items-center gap-1.5">
                  <span>BIS Portal</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li>
                <a href="https://gem.gov.in" target="_blank" rel="noreferrer" className="text-stone-400 hover:text-orange-400 transition-colors inline-flex items-center gap-1.5">
                  <span>GeM Portal</span>
                  <ExternalLink className="w-3 h-3 text-stone-500" />
                </a>
              </li>
              <li><a href="#sectors" className="text-stone-400 hover:text-orange-400 transition-colors">IS Code Index</a></li>
              <li><a href="#compliance" className="text-stone-400 hover:text-orange-400 transition-colors">GFR 2017 Rule 144(i)</a></li>
            </ul>
          </div>

          {/* Column 4: LEGAL & CONTACT (Span 3 cols) */}
          <div className="lg:col-span-3 flex flex-col text-left">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              LEGAL & CONTACT
            </h3>
            <ul className="space-y-2.5 text-sm font-medium">
              <li><a href="#faq" className="text-stone-400 hover:text-orange-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#faq" className="text-stone-400 hover:text-orange-400 transition-colors">Terms of Service</a></li>
              <li>
                <a href="#compliance" className="text-stone-400 hover:text-orange-400 transition-colors inline-flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-orange-400" />
                  <span>Security Standards</span>
                </a>
              </li>
              <li className="pt-2">
                <a href="mailto:sih2026@sahayak.in" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors inline-flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-orange-400" />
                  <span>sih2026@sahayak.in</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* 3. Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-stone-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400 text-center md:text-left">
          <div>
            © 2026 Sahayak. AI-Powered Indian Standards (BIS) Recommendation Engine.
          </div>
          <div className="text-stone-400 md:text-right max-w-xl text-[11px] leading-relaxed">
            Built for Smart India Hackathon (SIH 2026) • Compliant with General Financial Rules (GFR 2017 Rule 144(i)) & GeM Guidelines.
          </div>
        </div>

      </div>

    </footer>
  );
};


/* ==========================================================================
   SECTION: LandingPage
   ========================================================================== */
export const LandingPage = () => {
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (role) => {
    setAuthModalOpen(false);
    if (role === 'vendor') {
      navigate('/vendor/dashboard');
    } else {
      navigate('/home');
    }
  };

  const handleOpenFinder = () => {
    handleOpenAuth('signup');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased selection:bg-orange-600 selection:text-white">

      {/* ── Above-the-fold viewport lock: header + hero exactly 100vh on desktop ── */}
      <div className="relative min-h-screen lg:h-screen lg:max-h-screen flex flex-col overflow-x-hidden bg-white">
        
        {/* Full-viewport background video */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none select-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-center"
          >
            <source src={heroBgVideo} type="video/mp4" />
          </video>
          {/* Soft readability overlay to keep video vibrant while text remains sharp */}
          <div className="absolute inset-0 bg-white/25 lg:bg-gradient-to-r lg:from-white/65 lg:via-white/30 lg:to-transparent" />
        </div>

        {/* 1. Navbar */}
        <Navbar
          onOpenAuth={handleOpenAuth}
          onOpenFinder={handleOpenFinder}
        />

        {/* 2. Hero Section — 1st Page */}
        <HeroSection
          onOpenFinder={handleOpenFinder}
          onOpenDemo={() => setDemoModalOpen(true)}
        />
      </div>

      {/* 2. Manual Portal vs Sahayak Engine Comparison */}
      <ManualVsSahayak />

      {/* 5. Supported Sectors */}
      <SupportedSectors onSelectSector={() => navigate('/dashboard/standards')} />

      {/* 6. Compliance Framework */}
      <ComplianceFramework />

      {/* 7. FAQ */}
      <FaqSection />

      {/* 8. Footer */}
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
};

/* ==========================================================================
   DEFAULT EXPORT
   ========================================================================== */
export default LandingPage;
