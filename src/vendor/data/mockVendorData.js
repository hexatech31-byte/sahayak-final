// Vendor Portal — mock/demo data.
// FRONTEND-ONLY: this file simulates the data a real backend API would return.
// Keep the shapes aligned with src/vendor/types so swapping in real API calls
// later only requires replacing these constants/functions, not the UI.


export const VENDOR_PROFILE = {
  companyName: 'ABC Technologies Pvt. Ltd.',
  vendorId: 'VND-2026-00124',
  email: 'procurement@abctechnologies.in',
  phone: '+91 98200 XXXXX',
  address: 'Plot 14, MIDC Industrial Area, Pune, Maharashtra',
  gstin: '27ABCDE1234F1Z5',
  registrationNumber: 'U27310PN2015PTC154211',
  bisCertificatesActive: 2,
  testReportsCount: 5,
  documentsCount: 12,
};

export const PRIMARY_TENDER_ID = 'tnd-2026-00421';

export const TENDERS = [
  {
    id: PRIMARY_TENDER_ID,
    tenderId: 'TND-2026-00421',
    title: 'LED Street Light Procurement',
    organization: 'Municipal Corporation',
    estimatedValue: '\u20b918L',
    deadline: '10 Sep 2026',
    technicalRequirementsCount: 8,
    documentsRequiredCount: 5,
    status: 'Invitation Received',
  },
  {
    id: 'tnd-2026-00438',
    tenderId: 'TND-2026-00438',
    title: 'Solar Equipment Procurement',
    organization: 'Rural Electrification Dept.',
    estimatedValue: '\u20b942L',
    deadline: '2 Sep 2026',
    technicalRequirementsCount: 11,
    documentsRequiredCount: 6,
    status: 'Deadline Approaching',
  },
  {
    id: 'tnd-2026-00397',
    tenderId: 'TND-2026-00397',
    title: 'Water Pump Supply',
    organization: 'Jal Shakti Division',
    estimatedValue: '\u20b99.6L',
    deadline: '18 Aug 2026',
    technicalRequirementsCount: 6,
    documentsRequiredCount: 4,
    status: 'Quotation Submitted',
  },
];

export const TENDER_DETAILS = {
  [PRIMARY_TENDER_ID]: {
    ...TENDERS[0],
    status: 'Open for Quotation',
    overview:
      'Supply of LED street lighting equipment for municipal road infrastructure, including fixtures, mounting hardware and commissioning support.',
    quantity: '500 Units',
    deliveryLocation: 'Municipal Corporation Central Store, Pune',
    deliveryPeriod: '30 days from Purchase Order',
    product: 'LED Street Light',
    technicalParameters: [
      { id: 'p1', label: 'Power', required: '90W' },
      { id: 'p2', label: 'Efficiency', required: '\u2265120 lm/W' },
      { id: 'p3', label: 'IP Rating', required: 'IP66' },
      { id: 'p4', label: 'Application', required: 'Outdoor Municipal Roads' },
      { id: 'p5', label: 'Warranty', required: 'Minimum 5 Years' },
    ],
    applicableStandards: [
      {
        id: 's1',
        code: 'IS 10322',
        category: 'Primary Product Standard',
        summary: 'General and safety requirements for luminaires used in outdoor lighting installations.',
      },
      {
        id: 's2',
        code: 'IS 16108',
        category: 'Testing Requirement',
        summary: 'Performance and photometric testing requirements for LED luminaires.',
      },
      {
        id: 's3',
        code: 'IS 15885',
        category: 'Safety Requirement',
        summary: 'Safety requirements for electronic control gear used with LED light sources.',
      },
    ],
    certifications: [
      { id: 'c1', name: 'BIS Certification', required: true },
      { id: 'c2', name: 'Test Report', required: true },
      { id: 'c3', name: 'Additional Compliance Evidence', required: true },
    ],
    requiredDocuments: [
      { id: 'd1', name: 'BIS Certificate', status: 'Not Uploaded' },
      { id: 'd2', name: 'Test Reports', status: 'Not Uploaded' },
      { id: 'd3', name: 'Company Registration', status: 'Uploaded' },
      { id: 'd4', name: 'Previous Experience', status: 'Verified' },
      { id: 'd5', name: 'Product Datasheet', status: 'Not Uploaded' },
    ],
  },
  'tnd-2026-00438': {
    ...TENDERS[1],
    status: 'Deadline Approaching',
    overview: 'Supply and installation of grid-connected solar PV equipment for rural electrification sites.',
    quantity: '120 Units',
    deliveryLocation: 'REC Regional Warehouse, Nashik',
    deliveryPeriod: '45 days from Purchase Order',
    product: 'Solar PV Module & Inverter Set',
    technicalParameters: [
      { id: 'p1', label: 'Module Wattage', required: '540W' },
      { id: 'p2', label: 'Module Efficiency', required: '\u226520.5%' },
      { id: 'p3', label: 'Inverter Type', required: 'Grid-Tied, 3-Phase' },
      { id: 'p4', label: 'Warranty', required: 'Minimum 10 Years' },
    ],
    applicableStandards: [
      {
        id: 's1',
        code: 'IS/IEC 61215',
        category: 'Primary Product Standard',
        summary: 'Design qualification and type approval requirements for terrestrial PV modules.',
      },
      {
        id: 's2',
        code: 'IS 16221',
        category: 'Testing Requirement',
        summary: 'Test procedures for grid-connected PV inverters.',
      },
    ],
    certifications: [
      { id: 'c1', name: 'BIS Certification', required: true },
      { id: 'c2', name: 'Test Report', required: true },
      { id: 'c3', name: 'Additional Compliance Evidence', required: false },
    ],
    requiredDocuments: [
      { id: 'd1', name: 'BIS Certificate', status: 'Not Uploaded' },
      { id: 'd2', name: 'Test Reports', status: 'Uploaded' },
      { id: 'd3', name: 'Company Registration', status: 'Verified' },
      { id: 'd4', name: 'Previous Experience', status: 'Verified' },
      { id: 'd5', name: 'Product Datasheet', status: 'Uploaded' },
      { id: 'd6', name: 'GST Certificate', status: 'Verified' },
    ],
  },
  'tnd-2026-00397': {
    ...TENDERS[2],
    status: 'Closed',
    overview: 'Supply of centrifugal water pumps for municipal water distribution stations.',
    quantity: '40 Units',
    deliveryLocation: 'Jal Shakti Division Store, Nagpur',
    deliveryPeriod: '21 days from Purchase Order',
    product: 'Centrifugal Water Pump',
    technicalParameters: [
      { id: 'p1', label: 'Flow Rate', required: '450 LPM' },
      { id: 'p2', label: 'Head', required: '35m' },
      { id: 'p3', label: 'Motor Rating', required: '15 HP' },
      { id: 'p4', label: 'Warranty', required: 'Minimum 3 Years' },
    ],
    applicableStandards: [
      {
        id: 's1',
        code: 'IS 8034',
        category: 'Primary Product Standard',
        summary: 'Specification for horizontal centrifugal pumps for clear, cold water.',
      },
      {
        id: 's2',
        code: 'IS 9137',
        category: 'Testing Requirement',
        summary: 'Code of acceptance tests for centrifugal pumps.',
      },
    ],
    certifications: [
      { id: 'c1', name: 'BIS Certification', required: true },
      { id: 'c2', name: 'Test Report', required: true },
      { id: 'c3', name: 'Additional Compliance Evidence', required: false },
    ],
    requiredDocuments: [
      { id: 'd1', name: 'BIS Certificate', status: 'Verified' },
      { id: 'd2', name: 'Test Reports', status: 'Verified' },
      { id: 'd3', name: 'Company Registration', status: 'Verified' },
      { id: 'd4', name: 'Previous Experience', status: 'Verified' },
    ],
  },
};

export const PRIMARY_STANDARD_RESPONSES = [
  { standardId: 's1', status: 'Compliant', evidenceFileName: 'Test_Report_2026.pdf' },
  { standardId: 's2', status: 'Compliant', evidenceFileName: 'Photometric_Report_2026.pdf' },
  { standardId: 's3', status: 'Pending' },
];

export const PRIMARY_PARAMETER_RESPONSES = [
  { parameterId: 'p1', value: '90W', meetsRequirement: true },
  { parameterId: 'p2', value: '125 lm/W', meetsRequirement: true },
  { parameterId: 'p3', value: 'IP66', meetsRequirement: true },
  { parameterId: 'p4', value: 'Outdoor Municipal Roads', meetsRequirement: true },
  { parameterId: 'p5', value: '5 Years', meetsRequirement: true },
];

export const PRIMARY_QUOTATION_COMMERCIALS = {
  productPrice: 1450000,
  gst: 261000,
  deliveryCharges: 25000,
  installationCharges: 40000,
};

export const QUOTATIONS = [
  {
    id: 'qt-2026-0081',
    quotationId: 'QT-2026-0081',
    tenderId: 'tnd-2026-00397',
    tenderTitle: 'Water Pump Supply',
    submittedDate: '12 Aug 2026',
    totalValue: '\u20b98,90,000',
    status: 'Under Review',
  },
  {
    id: 'qt-2026-0073',
    quotationId: 'QT-2026-0073',
    tenderId: 'tnd-2026-00355',
    tenderTitle: 'Road Signage Supply',
    submittedDate: '2 Jul 2026',
    totalValue: '\u20b95,20,000',
    status: 'Clarification Required',
  },
  {
    id: 'qt-2026-0061',
    quotationId: 'QT-2026-0061',
    tenderId: 'tnd-2026-00312',
    tenderTitle: 'CCTV Surveillance Rollout',
    submittedDate: '18 Jun 2026',
    totalValue: '\u20b922,40,000',
    status: 'Accepted',
  },
];

export const QUOTATION_DETAILS = {
  'qt-2026-0081': {
    ...QUOTATIONS[0],
    commercials: { productPrice: 820000, gst: 47700, deliveryCharges: 12300, installationCharges: 10000 },
    deliveryTime: '21 days',
    warranty: '3 Years',
    paymentTerms: '30% advance',
    requirementsResponded: 6,
    requirementsTotal: 6,
    standardsDeclared: 2,
    documentsUploaded: 4,
  },
  'qt-2026-0073': {
    ...QUOTATIONS[1],
    commercials: { productPrice: 480000, gst: 25000, deliveryCharges: 10000, installationCharges: 5000 },
    deliveryTime: '15 days',
    warranty: '2 Years',
    paymentTerms: '50% advance, 50% on delivery',
    requirementsResponded: 5,
    requirementsTotal: 5,
    standardsDeclared: 1,
    documentsUploaded: 3,
    clarificationMessage: 'Please provide an updated test report for the reflective sheeting material.',
  },
  'qt-2026-0061': {
    ...QUOTATIONS[2],
    commercials: { productPrice: 2050000, gst: 130000, deliveryCharges: 40000, installationCharges: 20000 },
    deliveryTime: '30 days',
    warranty: '3 Years',
    paymentTerms: '30% advance',
    requirementsResponded: 9,
    requirementsTotal: 9,
    standardsDeclared: 2,
    documentsUploaded: 5,
  },
};

export const VENDOR_DOCUMENTS = [
  { id: 'vd1', name: 'Company Registration Certificate', uploadDate: '4 Jan 2026', status: 'Verified' },
  { id: 'vd2', name: 'GST Certificate', uploadDate: '4 Jan 2026', status: 'Verified' },
  { id: 'vd3', name: 'BIS Certificate — LED Luminaires', uploadDate: '22 Mar 2026', status: 'Verified' },
  { id: 'vd4', name: 'BIS Certificate — Solar Modules', uploadDate: '10 Jun 2026', status: 'Expiring' },
  { id: 'vd5', name: 'Test Report — IS 16108', uploadDate: '15 Jun 2026', status: 'Uploaded' },
  { id: 'vd6', name: 'Previous Experience Certificate — Pune Municipal', uploadDate: '2 Feb 2026', status: 'Verified' },
  { id: 'vd7', name: 'Product Datasheet — LED Street Light 90W', uploadDate: '18 Jul 2026', status: 'Uploaded' },
];

export const VENDOR_NOTIFICATIONS = [
  {
    id: 'n1',
    title: 'New tender invitation received — LED Street Light Procurement',
    timestamp: '2 hours ago',
    read: false,
    linkPath: `/vendor/tenders/${PRIMARY_TENDER_ID}`,
  },
  {
    id: 'n2',
    title: 'Clarification requested on Road Signage Supply quotation',
    timestamp: '1 day ago',
    read: false,
    linkPath: '/vendor/quotations/qt-2026-0073',
  },
  {
    id: 'n3',
    title: 'Quotation deadline tomorrow — Solar Equipment Procurement',
    timestamp: '1 day ago',
    read: false,
    linkPath: '/vendor/tenders/tnd-2026-00438',
  },
  {
    id: 'n4',
    title: 'Document verification update — Previous Experience Certificate',
    timestamp: '3 days ago',
    read: true,
    linkPath: '/vendor/documents',
  },
  {
    id: 'n5',
    title: 'Quotation submitted successfully — Water Pump Supply',
    timestamp: '2 weeks ago',
    read: true,
    linkPath: '/vendor/quotations/qt-2026-0081',
  },
  {
    id: 'n6',
    title: 'Tender result announced — CCTV Surveillance Rollout',
    timestamp: '2 months ago',
    read: true,
    linkPath: '/vendor/quotations/qt-2026-0061',
  },
];

export const RECENT_ACTIVITY = [
  { id: 'a1', text: 'Quotation submitted successfully for Water Pump Supply', timestamp: '2 weeks ago' },
  { id: 'a2', text: 'New tender invitation received — LED Street Light Procurement', timestamp: '2 hours ago' },
  { id: 'a3', text: 'Clarification requested on Road Signage Supply quotation', timestamp: '1 day ago' },
  { id: 'a4', text: 'Document verified — Previous Experience Certificate', timestamp: '3 days ago' },
];

export const ACTION_REQUIRED_ITEMS = [
  { id: 'ar1', action: 'Submit quotation', context: 'LED Street Light Procurement', tenderId: PRIMARY_TENDER_ID, cta: 'Submit Quotation' },
  { id: 'ar2', action: 'Upload BIS Certificate', context: 'Solar Equipment Procurement', tenderId: 'tnd-2026-00438', cta: 'Upload' },
  { id: 'ar3', action: 'Respond to clarification', context: 'Road Signage Supply', quotationId: 'qt-2026-0073', cta: 'Respond' },
];
