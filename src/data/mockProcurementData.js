
// ─── 1. REALISTIC GOVERNMENT PROCUREMENT TENDERS ───────────────────────────
export const INITIAL_TENDERS = [
  {
    id: 'GEM/2026/B/1049281',
    title: 'Desktop Computers and Workstations (85 Units)',
    department: 'Department of Information Technology (MeitY)',
    category: 'IT Hardware',
    standardCodes: ['IS 13252 (Part 1) : 2010'],
    primaryStandard: 'IS 13252 (Part 1) : 2010',
    budget: '₹ 42.50 Lakh',
    budgetValue: 4250000,
    status: 'Technical Evaluation',
    createdDate: '24 Aug 2026',
    deadline: '05 Sep 2026',
    quotesCount: 4,
    complianceScore: 94,
    description: 'Supply, installation, and commissioning of 85 enterprise desktop computers with Intel Core i7 processor, 32GB RAM, TPM 2.0 security, and 3-year on-site OEM warranty.',
    aiRecommendations: [
      {
        code: 'IS 13252 (Part 1) : 2010',
        title: 'Information Technology Equipment — Safety Requirements',
        score: 99.0,
        reason: 'Mandatory under MeitY Compulsory Registration Scheme (CRS Schedule II).',
        qcoStatus: 'Mandatory QCO in Force',
        testMethod: 'Dielectric Voltage Withstand & Heat Resistance Test'
      }
    ],
    checklist: [
      { item: 'BIS Standard identified & validated against Gazette schedule', checked: true },
      { item: 'MeitY CRS registration verified on portal', checked: true },
      { item: 'NABL accredited test report submitted', checked: true },
      { item: 'GFR Rule 144(i) land border declaration included', checked: true }
    ],
    clauses: [
      'Mandatory BIS CRS registration under IS 13252:2010 with valid R-Number.',
      'Energy efficiency benchmark meeting BEE 5-Star / EPEAT standard.',
      'GFR Rule 144(i) Compliance: Bidders must have valid DPIIT registration if applicable.',
      '3-Year Comprehensive On-Site Warranty with Next-Business-Day resolution SLA.'
    ]
  },
  {
    id: 'GEM/2026/B/1048712',
    title: '250 kWp Rooftop Grid-Tied Solar PV Plant',
    department: 'Ministry of New and Renewable Energy (MNRE)',
    category: 'Solar & Renewable',
    standardCodes: ['IS 14286 : 2010'],
    primaryStandard: 'IS 14286 : 2010',
    budget: '₹ 1.18 Crore',
    budgetValue: 11800000,
    status: 'Bid Submission',
    createdDate: '26 Aug 2026',
    deadline: '12 Sep 2026',
    quotesCount: 3,
    complianceScore: 98,
    description: 'Design, supply, installation, testing, and commissioning of 250 kWp Grid-Connected Rooftop Solar Photovoltaic Power Plant with 5-year comprehensive O&M.',
    aiRecommendations: [
      {
        code: 'IS 14286 : 2010',
        title: 'Crystalline Silicon Terrestrial Photovoltaic (PV) Modules',
        score: 99.5,
        reason: 'Mandatory under MNRE ALMM List-I and Solar PV Quality Control Order.',
        qcoStatus: 'Mandatory MNRE Order',
        testMethod: 'Thermal Cycling, Damp Heat & Mechanical Load Testing'
      }
    ],
    checklist: [
      { item: 'BIS Standard identified & validated against Gazette schedule', checked: true },
      { item: 'Approved List of Models and Manufacturers (ALMM) validation', checked: true },
      { item: '25-Year Linear Performance Warranty clause added', checked: true }
    ],
    clauses: [
      'Modules must be manufactured by an ALMM List-I approved indigenous supplier.',
      'BIS Certification under IS 14286:2010 is mandatory.',
      'Minimum solar module efficiency of 21.5% at Standard Testing Conditions.'
    ]
  },
  {
    id: 'GEM/2026/B/1047640',
    title: 'Industrial Safety Helmets and Full Body Harnesses (1,200 Sets)',
    department: 'National Highways Authority of India (NHAI)',
    category: 'PPE & Safety',
    standardCodes: ['IS 2925 : 1984'],
    primaryStandard: 'IS 2925 : 1984',
    budget: '₹ 17.60 Lakh',
    budgetValue: 1760000,
    status: 'Tender Published',
    createdDate: '25 Aug 2026',
    deadline: '18 Sep 2026',
    quotesCount: 2,
    complianceScore: 100,
    description: 'Supply of 1,200 industrial safety helmets with HDPE shell and full body harness sets conforming to BIS specifications for highway construction projects.',
    aiRecommendations: [
      {
        code: 'IS 2925 : 1984',
        title: 'Specification for Industrial Safety Helmets',
        score: 100,
        reason: 'Mandatory ISI mark required under Protective Equipment Quality Control Order.',
        qcoStatus: 'Mandatory ISI Mark',
        testMethod: 'Shock Absorption & Penetration Resistance Test'
      }
    ],
    checklist: [
      { item: 'BIS Standard identified & validated against Gazette schedule', checked: true },
      { item: 'Mandatory ISI Embossing on shell required', checked: true },
      { item: 'Flame retardant & heat resistance test certified', checked: true }
    ],
    clauses: [
      'Each helmet must bear embossed BIS Standard Mark (ISI) with valid CM/L license.',
      'Shell material must be high-density polyethylene (HDPE) with non-conductive suspension.',
      'NABL lab test report for impact resistance within 6 months of tender submission.'
    ]
  },
  {
    id: 'GEM/2026/B/1046915',
    title: 'Portland Pozzolana Cement (PPC) — 15,000 Bags (50kg)',
    department: 'Central Public Works Department (CPWD)',
    category: 'Construction Materials',
    standardCodes: ['IS 1489 (Part 1) : 2015'],
    primaryStandard: 'IS 1489 (Part 1) : 2015',
    budget: '₹ 82.40 Lakh',
    budgetValue: 8240000,
    status: 'Financial Evaluation',
    createdDate: '22 Aug 2026',
    deadline: '08 Sep 2026',
    quotesCount: 3,
    complianceScore: 97,
    description: 'Supply of fly-ash based Portland Pozzolana Cement in 50kg moisture-proof HDPE bags for Central Vista government office building works.',
    aiRecommendations: [
      {
        code: 'IS 1489 (Part 1) : 2015',
        title: 'Portland Pozzolana Cement — Specification (Fly Ash Based)',
        score: 100,
        reason: 'Mandatory BIS Quality Control Order under Ministry of Commerce & Industry.',
        qcoStatus: 'Mandatory ISI Mark',
        testMethod: '28-Day Compressive Strength & Fineness Test'
      }
    ],
    checklist: [
      { item: 'BIS Standard identified & validated against Gazette schedule', checked: true },
      { item: 'ISI Mark on every bag verified with active CM/L license', checked: true },
      { item: 'Batch test certificate with weekly dispatch required', checked: true }
    ],
    clauses: [
      'Every bag must carry standard ISI mark, CM/L number, and manufacturing week.',
      'Supplied cement must not be older than 4 weeks from date of manufacturing.',
      '28-day compressive strength must satisfy minimum 33 MPa per IS 1489.'
    ]
  },
  {
    id: 'GEM/2026/B/1045230',
    title: 'ABC Dry Powder Portable Fire Extinguishers (450 Units)',
    department: 'Central Bureau of Investigation (CBI)',
    category: 'PPE & Safety',
    standardCodes: ['IS 15683 : 2018'],
    primaryStandard: 'IS 15683 : 2018',
    budget: '₹ 12.80 Lakh',
    budgetValue: 1280000,
    status: 'Specification Review',
    createdDate: '27 Aug 2026',
    deadline: '22 Sep 2026',
    quotesCount: 0,
    complianceScore: 91,
    description: 'Supply and mounting of 450 units of 6kg stored pressure ABC dry chemical powder portable fire extinguishers for branch office headquarters.',
    aiRecommendations: [
      {
        code: 'IS 15683 : 2018',
        title: 'Portable Fire Extinguishers — Performance and Construction',
        score: 98.0,
        reason: 'Mandatory BIS Quality Control Order for fire safety apparatus.',
        qcoStatus: 'Mandatory ISI Mark',
        testMethod: 'Hydrostatic Pressure & Fire Rating Test'
      }
    ],
    checklist: [
      { item: 'BIS Standard identified & validated against Gazette schedule', checked: true },
      { item: 'Hydrostatic burst pressure test certified', checked: false }
    ],
    clauses: [
      'Each cylinder must carry valid BIS ISI Mark with valid manufacturer CM/L license.',
      'Pressure gauge must indicate operating pressure range per IS 15683.',
      '5-Year comprehensive maintenance and gas refill guarantee.'
    ]
  }
];

// ─── 2. STANDARDS REGISTRY (6 Core Indian Standards) ────────────────────────
export const INITIAL_STANDARDS = [
  {
    id: 'is-13252',
    code: 'IS 13252 (Part 1) : 2010',
    title: 'Information Technology Equipment — General Safety Requirements',
    sector: 'IT',
    description: 'Mandatory standard covering electrical safety, insulation resistance, flame retardance, and radiation limits for IT hardware.',
    qcoStatus: 'MeitY Mandatory CRS',
    testingMethod: 'Dielectric Voltage Withstand & Flame Retardance',
    status: 'Active',
    lastUpdated: 'Mar 2024',
    applicability: 'Compulsory for all central and state government compute, server, and networking tenders.',
    testingRequirements: [
      'Creepage distance and clearance measurement per Clause 2.10',
      'Flammability classification of PCB materials (UL 94 V-0)',
      'Touch current and protective earth resistance test'
    ],
    relatedStandards: ['IS 14896 : 2000'],
    exampleCategories: ['Desktop Computers', 'Laptops', 'Servers', 'Monitors']
  },
  {
    id: 'is-14286',
    code: 'IS 14286 : 2010',
    title: 'Crystalline Silicon Terrestrial Photovoltaic (PV) Modules — Design Qualification',
    sector: 'Solar',
    description: 'Specification for long-term electrical and mechanical durability of solar PV panels under high irradiance.',
    qcoStatus: 'MNRE ALMM Order',
    testingMethod: 'Thermal Cycling, Damp Heat, UV Preconditioning',
    status: 'Active',
    lastUpdated: 'Nov 2023',
    applicability: 'Compulsory for all rooftop and ground-mounted solar tenders under central schemes.',
    testingRequirements: [
      '200 thermal cycles (-40°C to +85°C)',
      '1,000 hours Damp Heat test at 85°C / 85% RH',
      'Mechanical load test up to 2,400 Pa'
    ],
    relatedStandards: ['IS/IEC 61730-1 : 2004'],
    exampleCategories: ['Solar Modules', 'Solar Rooftop Plants', 'Solar Inverters']
  },
  {
    id: 'is-2925',
    code: 'IS 2925 : 1984',
    title: 'Specification for Industrial Safety Helmets',
    sector: 'Safety',
    description: 'Requirements for non-metallic safety helmets intended to protect head against impact, penetration, and electrical shock.',
    qcoStatus: 'Mandatory ISI Mark',
    testingMethod: 'Impact Drop & Shell Penetration Resistance',
    status: 'Active',
    lastUpdated: 'Aug 2022',
    applicability: 'Compulsory for construction, highway works, mining, and civil engineering personnel PPE.',
    testingRequirements: [
      'Shock absorption test with 5kg striker',
      'Penetration test with 3kg conical striker',
      'Electrical insulation test up to 2,000V'
    ],
    relatedStandards: ['IS 3521 : 2021'],
    exampleCategories: ['Safety Helmets', 'Headgear PPE']
  },
  {
    id: 'is-1489',
    code: 'IS 1489 (Part 1) : 2015',
    title: 'Portland Pozzolana Cement — Specification (Part 1: Fly Ash Based)',
    sector: 'Construction',
    description: 'Physical and chemical criteria for blended PPC cement utilizing processed fly ash for durable concrete works.',
    qcoStatus: 'Mandatory ISI Mark',
    testingMethod: '28-Day Compressive Strength & Soundness Test',
    status: 'Active',
    lastUpdated: 'May 2023',
    applicability: 'CPWD, NHAI, Railways civil construction and structural infrastructure contracts.',
    testingRequirements: [
      'Fineness by Blaine air permeability (min 300 m²/kg)',
      'Compressive strength: 16 MPa (3d), 22 MPa (7d), 33 MPa (28d)',
      'Soundness expansion maximum 10mm'
    ],
    relatedStandards: ['IS 456 : 2000'],
    exampleCategories: ['Cement', 'Concrete', 'Civil Materials']
  },
  {
    id: 'is-15683',
    code: 'IS 15683 : 2018',
    title: 'Portable Fire Extinguishers — Performance and Construction',
    sector: 'Safety',
    description: 'Specifies construction, hydraulic pressure testing, and discharge rating for portable fire safety extinguishers.',
    qcoStatus: 'Mandatory ISI Mark',
    testingMethod: 'Hydrostatic Pressure & Fire Suppression Rating',
    status: 'Active',
    lastUpdated: 'Jan 2023',
    applicability: 'Compulsory for all government office buildings, data centres, and institutional premises.',
    testingRequirements: [
      'Hydraulic proof pressure test at 30 bar for 30 seconds',
      'Minimum discharge duration test per extinguisher capacity',
      'Corrosion resistance test (salt spray 240 hours)'
    ],
    relatedStandards: ['IS 2190 : 2010'],
    exampleCategories: ['Fire Extinguishers', 'Safety Equipment']
  },
  {
    id: 'is-1786',
    code: 'IS 1786 : 2008',
    title: 'High Strength Deformed Steel Bars (TMT Fe 500D / 550D)',
    sector: 'Construction',
    description: 'Requirements for thermo-mechanically treated (TMT) steel rebars with enhanced ductility for earthquake-resistant structures.',
    qcoStatus: 'Mandatory Steel QCO',
    testingMethod: 'Tensile Yield Strength & Bend/Re-bend Test',
    status: 'Active',
    lastUpdated: 'Jul 2023',
    applicability: 'All RCC structural frameworks, flyovers, bridges, and building foundations.',
    testingRequirements: [
      'Yield stress minimum 500 N/mm² (Fe 500D)',
      'Ultimate tensile strength / yield ratio >= 1.10',
      'Elongation at gauge length >= 16%'
    ],
    relatedStandards: ['IS 456 : 2000'],
    exampleCategories: ['TMT Steel Rebars', 'Reinforcement Bars']
  }
];

// ─── 3. REGISTERED SUPPLIERS & VENDORS ──────────────────────────────────────
export const INITIAL_VENDORS = [
  {
    id: 'VEND-001',
    name: 'Dell International Services India Pvt. Ltd.',
    gstin: '29AAAAA0000A1Z5',
    category: 'IT',
    supplierClass: 'Class-I Local Supplier (MII 55%)',
    bisLicense: 'CRS-R-4100293',
    location: 'Bengaluru, Karnataka',
    rating: 4.8,
    status: 'Verified',
    previousContracts: 38,
    complianceScore: 99,
    contactEmail: 'govt.tenders@dell.com',
    contactPhone: '+91 80 6608 7000',
    recentBids: [
      { tenderTitle: 'Desktop Computers and Workstations (85 Units)', bidAmount: '₹ 39,80,000', date: '28 Aug 2026' }
    ]
  },
  {
    id: 'VEND-002',
    name: 'Tata Power Solar Systems Ltd.',
    gstin: '27BBBBB1111B2Z6',
    category: 'Solar',
    supplierClass: 'ALMM List-I Manufacturer (MII 75%)',
    bisLicense: 'CM/L-7193021',
    location: 'Mumbai, Maharashtra',
    rating: 4.9,
    status: 'Verified',
    previousContracts: 34,
    complianceScore: 98,
    contactEmail: 'solar.govt@tatapower.com',
    contactPhone: '+91 22 6665 8282',
    recentBids: [
      { tenderTitle: '250 kWp Rooftop Solar PV Plant', bidAmount: '₹ 1,08,50,000', date: '27 Aug 2026' }
    ]
  },
  {
    id: 'VEND-003',
    name: 'Karam Safety Private Ltd.',
    gstin: '07AAACK1049R1ZZ',
    category: 'Safety',
    supplierClass: 'MSE Registered Manufacturer (MII 85%)',
    bisLicense: 'CM/L-3349102',
    location: 'Noida, Uttar Pradesh',
    rating: 4.7,
    status: 'Verified',
    previousContracts: 76,
    complianceScore: 100,
    contactEmail: 'tenders@karam.in',
    contactPhone: '+91 120 473 4400',
    recentBids: [
      { tenderTitle: 'Industrial Safety Helmets & Harnesses', bidAmount: '₹ 16,80,000', date: '26 Aug 2026' }
    ]
  },
  {
    id: 'VEND-004',
    name: 'UltraTech Cement Limited',
    gstin: '27AAACU0391A1ZR',
    category: 'Construction',
    supplierClass: 'Class-I Local Supplier (MII 95%)',
    bisLicense: 'CM/L-5049219',
    location: 'Mumbai, Maharashtra',
    rating: 4.9,
    status: 'Verified',
    previousContracts: 92,
    complianceScore: 99,
    contactEmail: 'institutional.sales@ultratechcement.com',
    contactPhone: '+91 22 6691 7800',
    recentBids: [
      { tenderTitle: 'Portland Pozzolana Cement (PPC)', bidAmount: '₹ 78,90,000', date: '24 Aug 2026' }
    ]
  }
];

// ─── 4. FINANCIAL BIDS & QUOTATIONS ─────────────────────────────────────────
export const INITIAL_QUOTATIONS = [
  {
    id: 'QUOT-1049281-01',
    tenderId: 'GEM/2026/B/1049281',
    tenderTitle: 'Desktop Computers and Workstations (85 Units)',
    vendorId: 'VEND-001',
    vendorName: 'Dell International Services India Pvt. Ltd.',
    gstin: '29AAAAA0000A1Z5',
    bidAmount: '₹ 39,80,000',
    bidValue: 3980000,
    deliveryTime: '21 Days',
    bisCompliance: true,
    technicalScore: 99,
    financialScore: 98,
    overallScore: 98.5,
    rank: 'L1',
    status: 'Selected L1'
  },
  {
    id: 'QUOT-1048712-01',
    tenderId: 'GEM/2026/B/1048712',
    tenderTitle: '250 kWp Rooftop Grid-Tied Solar PV Plant',
    vendorId: 'VEND-002',
    vendorName: 'Tata Power Solar Systems Ltd.',
    gstin: '27BBBBB1111B2Z6',
    bidAmount: '₹ 1,08,50,000',
    bidValue: 10850000,
    deliveryTime: '45 Days',
    bisCompliance: true,
    technicalScore: 98,
    financialScore: 100,
    overallScore: 99.0,
    rank: 'L1',
    status: 'Submitted'
  },
  {
    id: 'QUOT-1047640-01',
    tenderId: 'GEM/2026/B/1047640',
    tenderTitle: 'Industrial Safety Helmets and Full Body Harnesses (1,200 Sets)',
    vendorId: 'VEND-003',
    vendorName: 'Karam Safety Private Ltd.',
    gstin: '07AAACK1049R1ZZ',
    bidAmount: '₹ 16,80,000',
    bidValue: 1680000,
    deliveryTime: '15 Days',
    bisCompliance: true,
    technicalScore: 100,
    financialScore: 100,
    overallScore: 100.0,
    rank: 'L1',
    status: 'Selected L1'
  },
  {
    id: 'QUOT-1046915-01',
    tenderId: 'GEM/2026/B/1046915',
    tenderTitle: 'Portland Pozzolana Cement (PPC) — 15,000 Bags (50kg)',
    vendorId: 'VEND-004',
    vendorName: 'UltraTech Cement Limited',
    gstin: '27AAACU0391A1ZR',
    bidAmount: '₹ 78,90,000',
    bidValue: 7890000,
    deliveryTime: '10 Days',
    bisCompliance: true,
    technicalScore: 97,
    financialScore: 98,
    overallScore: 97.5,
    rank: 'L1',
    status: 'Submitted'
  }
];

// ─── 5. TECHNICAL EVALUATION SCORECARDS ─────────────────────────────────────
export const INITIAL_EVALUATIONS = [
  {
    id: 'EVAL-1049281',
    tenderId: 'GEM/2026/B/1049281',
    tenderTitle: 'Desktop Computers and Workstations (85 Units)',
    department: 'Department of Information Technology (MeitY)',
    budget: '₹ 42.50 Lakh',
    technicalScore: 98,
    financialScore: 98,
    complianceScore: 100,
    overallScore: 98.0,
    status: 'In Progress',
    recommendedVendor: 'Dell International Services (L1 - ₹39,80,000)',
    criteria: [
      { name: 'MeitY CRS Registration under IS 13252:2010', score: 25, maxScore: 25, status: 'PASS', notes: 'Valid R-Number R-4100293 verified on MeitY CRS portal.' },
      { name: 'OEM Manufacturer Authorization & Local Service SLA', score: 25, maxScore: 25, status: 'PASS', notes: 'Direct OEM authorization and local Delhi-NCR support verified.' },
      { name: 'GFR Rule 144(i) Land Border Declaration', score: 25, maxScore: 25, status: 'PASS', notes: 'Self-declaration with audited supply chain origin submitted.' },
      { name: 'BEE 5-Star Energy Efficiency Benchmark', score: 23, maxScore: 25, status: 'PASS', notes: 'BEE energy test report compliant with 85% active power factor.' }
    ]
  },
  {
    id: 'EVAL-1046915',
    tenderId: 'GEM/2026/B/1046915',
    tenderTitle: 'Portland Pozzolana Cement (PPC) — 15,000 Bags',
    department: 'Central Public Works Department (CPWD)',
    budget: '₹ 82.40 Lakh',
    technicalScore: 97,
    financialScore: 98,
    complianceScore: 100,
    overallScore: 97.5,
    status: 'Awaiting Evaluation',
    recommendedVendor: 'UltraTech Cement Limited (L1 - ₹78,90,000)',
    criteria: [
      { name: 'IS 1489 (Part 1) Mandatory ISI Marking on Bags', score: 35, maxScore: 35, status: 'PASS', notes: 'Active license CM/L-5049219 verified on BIS portal.' },
      { name: '28-Day Compressive Strength Test (> 33 MPa)', score: 34, maxScore: 35, status: 'PASS', notes: 'NABL test report indicates 36.2 MPa average strength.' },
      { name: 'Soundness Expansion per IS 1489 (< 10mm)', score: 28, maxScore: 30, status: 'PASS', notes: 'Le Chatelier expansion measured at 3.4mm.' }
    ]
  }
];

// ─── 6. DSC SANCTIONS & APPROVALS ───────────────────────────────────────────
export const INITIAL_APPROVALS = [
  {
    id: 'APP-1049281',
    ref: 'SANCTION/MEITY/2026/089',
    tenderId: 'GEM/2026/B/1049281',
    tenderName: 'Desktop Computers & Workstations Award to Dell (L1)',
    department: 'Department of Information Technology (MeitY)',
    budget: '₹ 39.80 Lakh',
    evaluationScore: 98.0,
    recommendedVendor: 'Dell International Services India Pvt. Ltd.',
    status: 'Pending',
    submittedDate: '28 Aug 2026',
    priority: 'HIGH',
    remarks: 'Evaluation committee recommendation approved. 6.3% savings achieved under sanctioned estimate.'
  },
  {
    id: 'APP-1048712',
    ref: 'SANCTION/MNRE/2026/044',
    tenderId: 'GEM/2026/B/1048712',
    tenderName: '250 kWp Solar PV Plant Technical Sanction',
    department: 'Ministry of New and Renewable Energy (MNRE)',
    budget: '₹ 1.08 Crore',
    evaluationScore: 99.0,
    recommendedVendor: 'Tata Power Solar Systems Ltd.',
    status: 'Pending',
    submittedDate: '27 Aug 2026',
    priority: 'MEDIUM',
    remarks: 'ALMM List-I compliance verified. Technical scrutiny complete.'
  }
];

// ─── 7. OPERATIONAL NOTIFICATIONS ───────────────────────────────────────────
export const INITIAL_NOTIFICATIONS = [
  {
    id: 'NOTIF-1',
    title: 'DSC Sanction Required',
    desc: 'Desktop Computer Procurement (GEM/2026/B/1049281) requires final DSC signature.',
    time: '25 mins ago',
    type: 'urgent',
    read: false,
    route: '/dashboard/approvals'
  },
  {
    id: 'NOTIF-2',
    title: 'Quotation Received',
    desc: 'Tata Power Solar submitted a bid of ₹ 1.08 Cr for 250 kWp Solar PV Plant.',
    time: '2 hours ago',
    type: 'info',
    read: false,
    route: '/dashboard/quotations'
  },
  {
    id: 'NOTIF-3',
    title: 'Standards Verification Completed',
    desc: 'BIS license CM/L-3349102 for Karam Safety Private Ltd. was verified.',
    time: '5 hours ago',
    type: 'success',
    read: true,
    route: '/dashboard/vendors'
  }
];

// ─── 8. OFFICER PROFILE SETTINGS ───────────────────────────────────────────
export const INITIAL_SETTINGS = {
  officerName: 'Rajesh Kumar Sharma',
  designation: 'Executive Engineer (Procurement & Works)',
  department: 'Central Public Works Department (CPWD) / Central Division',
  email: 'sp.cbi@gov.in',
  dscSerial: 'NIC-DSC-CLASS3-IND-8940219 (Valid until Dec 2027)',
  verificationEngine: 'BIS National Standards Directory v4.1 (Active)',
  smsAlerts: true,
  emailAlerts: true,
  autoAssignStandards: true,
  compactView: false
};
