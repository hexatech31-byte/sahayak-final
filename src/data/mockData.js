export const CATEGORIES = [
  {
    id: 'electrical',
    name: 'Electrical & Power Distribution',
    iconName: 'Zap',
    count: 3840,
    description: '33kV/11kV switchgear, vacuum circuit breakers, power transformers, FR-LSH cables, earthing & solar PV systems.',
    popularCodes: ['IS 13118 : 1991', 'IS 2099 : 1986', 'IS 732 : 2019', 'IS 694 : 2010', 'IS 1180 : 2014']
  },
  {
    id: 'civil',
    name: 'Civil Infrastructure & Construction',
    iconName: 'Building2',
    count: 4280,
    description: 'Structural concrete, TMT reinforcement rebars (Fe 500D/600), cement, aggregates, bridge design & seismic codes.',
    popularCodes: ['IS 456 : 2000', 'IS 1786 : 2008', 'IS 383 : 2016', 'IS 800 : 2007', 'IS 1893 : 2016']
  },
  {
    id: 'it-telecom',
    name: 'IT Hardware & Telecommunications',
    iconName: 'Cpu',
    count: 2950,
    description: 'Data center servers, biometric scanners, CCTV surveillance, optical fiber, MeitY CRS electronics & UPS units.',
    popularCodes: ['IS 13252 : 2010', 'IS 16046 : 2018', 'IS 616 : 2017', 'IS 16074 : 2013', 'IS 16333 : 2022']
  },
  {
    id: 'mechanical',
    name: 'Industrial Machinery & Heavy Equipment',
    iconName: 'Wrench',
    count: 3100,
    description: 'Centrifugal water pumps, diesel generators, pressure vessels, industrial valves, piping & heavy earthmoving equipment.',
    popularCodes: ['IS 8472 : 2019', 'IS 2825 : 2022', 'IS 3589 : 2001', 'IS 9079 : 2018', 'IS 14220 : 2017']
  },
  {
    id: 'safety-ppe',
    name: 'Personal Protective Equipment (PPE) & Safety',
    iconName: 'ShieldAlert',
    count: 2450,
    description: 'Industrial safety helmets, fire alarm systems, safety harnesses, chemical respirators, fire extinguishers & life jackets.',
    popularCodes: ['IS 2925 : 1984', 'IS 2189 : 2008', 'IS 15683 : 2018', 'IS 3521 : 2021', 'IS 3844 : 2022']
  },
  {
    id: 'chemicals-water',
    name: 'Chemicals, Fertilizers & Testing Labs',
    iconName: 'FlaskConical',
    count: 3620,
    description: 'HDPE potable water supply pipes (JJM), industrial polymers, water purification chemicals, fertilizers & laboratory testing.',
    popularCodes: ['IS 4984 : 2016', 'IS 10500 : 2012', 'IS 1239 : 2004', 'IS 4985 : 2021', 'IS 1448 : 2020']
  }
];

export const STANDARDS_DATABASE = {
  electrical: [
    {
      id: 'is-13118',
      code: 'IS 13118 : 1991',
      title: 'High-Voltage Alternating-Current Circuit-Breakers — Specification',
      category: 'Electrical & Power Distribution',
      edition: 'Reaffirmed 2021 (Aligned with IEC 62271-100)',
      status: 'Active',
      qcoMandatory: true,
      qcoDetails: 'Mandatory under Ministry of Power Quality Control Order. BIS Type Test Certificate Compulsory.',
      relevanceScore: 99.2,
      description: 'Specifies ratings, construction, and testing for AC vacuum and SF6 circuit breakers for voltages 1kV to 33kV and above.',
      normativeReferences: [
        { code: 'IS 2099 : 1986', title: 'Bushings for Alternating Voltages Above 1000 Volts', type: 'Material Spec' },
        { code: 'IS 12063 : 1987', title: 'Classification of Degrees of Protection Provided by Enclosures (IP Code)', type: 'Safety' },
        { code: 'IS 3427 : 1997', title: 'AC Metal-Enclosed Switchgear and Controlgear for Rated Voltages 1kV to 52kV', type: 'Installation' },
        { code: 'IS 9968 (Part 2)', title: 'Elastomer Insulated Cables for Working Voltages up to 33kV', type: 'Testing Method' }
      ],
      keywords: ['33kV circuit breaker', 'vacuum circuit breaker', 'VCB switchgear', 'substation', 'RDSS tender']
    },
    {
      id: 'is-694',
      code: 'IS 694 : 2010',
      title: 'Polyvinyl Chloride Insulated Unsheathed and Sheathed Cables with Rigid and Flexible Conductor',
      category: 'Electrical & Power Distribution',
      edition: '4th Revision (Reaffirmed 2021)',
      status: 'Active',
      qcoMandatory: true,
      qcoDetails: 'Mandatory under DPIIT Electrical Wires and Cable (Quality Control) Order. BIS License Required.',
      relevanceScore: 97.8,
      description: 'Requirements for single and multi-core PVC insulated electrical cables up to 1100V with FR-LSH fire rating.',
      normativeReferences: [
        { code: 'IS 8130 : 2013', title: 'Conductors for Insulated Electric Cables and Flexible Cords', type: 'Material Spec' },
        { code: 'IS 5831 : 1984', title: 'PVC Insulation and Sheath of Electric Cables', type: 'Material Spec' },
        { code: 'IS 10810 (Parts)', title: 'Methods of Test for Cables', type: 'Testing Method' }
      ],
      keywords: ['copper wire', 'building wiring', 'FR-LSH cable', 'flexible cable', '1100V']
    }
  ],
  civil: [
    {
      id: 'is-1786',
      code: 'IS 1786 : 2008',
      title: 'High Strength Deformed Steel Bars and Wires for Concrete Reinforcement',
      category: 'Civil Infrastructure & Construction',
      edition: '4th Revision (Reaffirmed 2023 with Amd 1-3)',
      status: 'Active',
      qcoMandatory: true,
      qcoDetails: 'Mandatory under Steel and Steel Products (Quality Control) Order, 2020. BIS ISI Mark Compulsory.',
      relevanceScore: 98.6,
      description: 'Covers deformed steel bars for concrete reinforcement in grades Fe 415, Fe 500, Fe 500D, Fe 550, Fe 550D and Fe 600.',
      normativeReferences: [
        { code: 'IS 1608 : 2018', title: 'Metallic Materials — Tensile Testing at Ambient Temperature', type: 'Testing Method' },
        { code: 'IS 228 (Part 1-24)', title: 'Methods of Chemical Analysis of Steels', type: 'Testing Method' },
        { code: 'IS 13620 : 1993', title: 'Fusion Bonded Epoxy Coated Reinforcing Bars', type: 'Material Spec' },
        { code: 'IS 13920 : 2016', title: 'Ductile Design of Concrete Structures for Seismic Forces', type: 'Safety' }
      ],
      keywords: ['TMT rebars', 'Fe 500D', 'reinforcement steel', 'concrete reinforcement', 'ductile detailing']
    },
    {
      id: 'is-456',
      code: 'IS 456 : 2000',
      title: 'Plain and Reinforced Concrete — Code of Practice',
      category: 'Civil Infrastructure & Construction',
      edition: '4th Revision (Incorporating Amendment Nos. 1 to 5)',
      status: 'Active',
      qcoMandatory: false,
      relevanceScore: 96.4,
      description: 'National code of practice for structural plain and reinforced concrete design in civil works, bridges, and buildings.',
      normativeReferences: [
        { code: 'IS 383 : 2016', title: 'Coarse and Fine Aggregate for Concrete — Specification', type: 'Material Spec' },
        { code: 'IS 269 : 2015', title: 'Ordinary Portland Cement — Specification', type: 'Material Spec' },
        { code: 'IS 516 : 2021', title: 'Hardened Concrete — Methods of Test', type: 'Testing Method' }
      ],
      keywords: ['concrete mix', 'structural design', 'RCC', 'curing', 'compressive strength']
    }
  ],
  'it-telecom': [
    {
      id: 'is-13252',
      code: 'IS 13252 (Part 1) : 2010',
      title: 'Information Technology Equipment — Safety: General Requirements',
      category: 'IT Hardware & Telecommunications',
      edition: '2nd Revision (Aligned with IEC 60950-1)',
      status: 'Active',
      qcoMandatory: true,
      qcoDetails: 'Mandatory registration under MeitY Compulsory Registration Scheme (CRS).',
      relevanceScore: 99.1,
      description: 'Applies to IT hardware equipment, rackmount servers, personal computers, biometric scanners and networking hardware.',
      normativeReferences: [
        { code: 'IS 616 : 2017', title: 'Audio, Video and Similar Electronic Apparatus — Safety Requirements', type: 'Safety' },
        { code: 'IS 16046 (Part 2) : 2018', title: 'Secondary Lithium Cells and Batteries for Portable Applications', type: 'Safety' }
      ],
      keywords: ['servers', 'networking switches', 'data center', 'electronic safety', 'CRS MeitY']
    }
  ],
  'chemicals-water': [
    {
      id: 'is-4984',
      code: 'IS 4984 : 2016',
      title: 'High Density Polyethylene (HDPE) Pipes for Water Supply — Specification',
      category: 'Chemicals, Fertilizers & Testing Labs',
      edition: '5th Revision',
      status: 'Active',
      qcoMandatory: true,
      qcoDetails: 'Mandatory under DPIIT Quality Control Order. Statutory for Jal Jeevan Mission (JJM) public tenders.',
      relevanceScore: 98.2,
      description: 'Requirements for HDPE pipes in PE 63, PE 80, and PE 100 grades for municipal and rural potable water distribution.',
      normativeReferences: [
        { code: 'IS 10500 : 2012', title: 'Drinking Water — Specification', type: 'Safety' },
        { code: 'IS 7634 (Part 2) : 2012', title: 'Plastics Pipes Installation — Laying and Jointing of Polyethylene Pipes', type: 'Installation' },
        { code: 'IS 2530 : 1963', title: 'Methods of Test for Polyethylene Moulding Materials', type: 'Testing Method' }
      ],
      keywords: ['HDPE pipe', 'Jal Jeevan Mission', 'potable water', 'PE 100', 'butt fusion']
    }
  ]
};

export const PROBLEM_SOLUTIONS = [
  {
    id: 'scope-overlaps',
    category: 'Standard Lifecycle & Gazette Amendments',
    iconName: 'FileClock',
    problem: {
      title: 'Scope & Revision Overlaps in Technical Tenders',
      description: 'Tender clauses copied from earlier templates frequently cite obsolete standards (e.g. citing withdrawn IS 1786:1985), leading to contractor disputes, inspection failure, and arbitrations.',
      impact: 'Up to 34% of public technical bids contain at least one superseded or withdrawn Indian Standard.'
    },
    solution: {
      title: 'Automated Semantic Mapping (20,000+ Codes)',
      description: 'Sahayak continuously ingests Gazette of India notices, automatically mapping unstructured tender clauses to currently active, reaffirmed BIS standards and gazetted amendments.',
      benefit: '100% statutory adherence to active BIS codes with zero obsolete standard risk.'
    }
  },
  {
    id: 'omitted-normative',
    category: 'Normative Dependency Constellation',
    iconName: 'GitFork',
    problem: {
      title: 'Omitted Normative Testing & Safety References',
      description: 'Tender drafters specify primary product codes but omit Section 2 Normative References (tensile testing, chemical spectrometry, weldability), leaving quality enforcement ambiguous.',
      impact: 'Vendors bypass mandatory third-party inspection (TPI) due to missing testing clauses.'
    },
    solution: {
      title: 'Instant Cross-Referencing & Inspection Matrix',
      description: 'The engine recursively constructs the complete normative dependency tree, extracting mandatory material specifications, testing protocols (IS 1608, IS 228), and safety codes.',
      benefit: 'Bulletproof Third-Party Inspection (TPI) criteria for GeM & CPPP technical bids.'
    }
  },
  {
    id: 'qco-risk',
    category: 'Statutory Quality Control Orders (QCOs)',
    iconName: 'ShieldCheck',
    problem: {
      title: 'Compliance Risk Under Mandatory QCO Notifications',
      description: 'Over 850+ product categories are now notified under mandatory DPIIT/Ministry Quality Control Orders. Specifying non-QCO compliant items violates GFR 2017 Rule 144(i).',
      impact: 'Immediate C&AG audit strictures, tender cancellation, and re-tendering delays of 4–8 months.'
    },
    solution: {
      title: 'Automatic BIS ISI Mark & MeitY CRS Detection',
      description: 'Instantly identifies if an item falls under statutory Quality Control Orders, embedding mandatory certification compliance clauses directly into the tender draft.',
      benefit: 'Total compliance with General Financial Rules (GFR) and DPIIT statutory orders.'
    }
  }
];

export const CORE_FEATURES = [
  {
    id: 'semantic-search',
    title: 'Semantic Context Search',
    subtitle: 'Contextual Engineering Comprehension vs. Exact Keyword Matching',
    iconName: 'BrainCircuit',
    badge: 'Neural NLP Engine',
    description: 'Tender descriptions use functional engineering requirements rather than exact standard titles. Our model evaluates voltage levels, material grades, tensile ratings, and operating environments.',
    bullets: [
      'Accurately resolves complex clauses like "33kV Outdoor Vacuum Circuit Breakers" to IS 13118:1991.',
      'Identifies implicit material grades (Fe 500D vs Fe 600) and seismic detailing codes.',
      'Provides explainable AI confidence scores for tender evaluation committees.'
    ],
    visualType: 'semantic-search'
  },
  {
    id: 'normative-engine',
    title: 'Normative Dependency Engine',
    subtitle: 'Automated Extraction of Testing, Installation & Safety Protocols',
    iconName: 'Network',
    badge: 'Graph Intelligence',
    description: 'Every primary standard anchors a constellation of mandatory testing methods, raw material specs, and installation guidelines. Sahayak constructs the full inspection tree.',
    bullets: [
      'Extracts allied test methods (tensile IS 1608, chemical spectrometry IS 228).',
      'Integrates installation codes (IS 732 for electrical, IS 7634 for piping).',
      'Generates ready-to-paste GeM & CPPP technical bid clauses with mandatory inspection checkpoints.'
    ],
    visualType: 'normative-graph'
  },
  {
    id: 'multilingual-query',
    title: 'Multilingual Query Support',
    subtitle: 'Input Specifications in English, Hindi (हिंदी) or Regional Languages',
    iconName: 'Languages',
    badge: 'Indic Language AI',
    description: 'Designed for state public works departments, irrigation divisions, and municipal bodies across India. Allows field engineers to query in their regional language.',
    bullets: [
      'Seamless semantic parsing for Hindi, Tamil, Telugu, Marathi, Bengali, and Gujarati.',
      'Translates localized field terminology into formal Bureau of Indian Standards nomenclature.',
      'Outputs standardized bilingual clauses for state-level procurement documentation.'
    ],
    visualType: 'multilingual'
  },
  {
    id: 'revision-tracker',
    title: 'Real-Time BIS Revision Tracker',
    subtitle: 'Flags Obsolete Standards & Recommends Active Gazette Amendments',
    iconName: 'History',
    badge: 'Live Gazette Sync',
    description: 'Maintains an up-to-the-minute index of BIS Gazette notifications, reaffirmed validity periods, and draft standards under public review.',
    bullets: [
      'Proactive warnings when drafting specifications with upcoming mandatory QCO enforcement dates.',
      'Complete audit trail of standard revisions from inception to latest amendment.',
      'Direct synchronization with the official Bureau of Indian Standards portal.'
    ],
    visualType: 'version-diff'
  }
];

export const SAMPLE_QUERIES = [
  {
    id: 'q1',
    title: '33kV Outdoor Vacuum Circuit Breakers (Substation Tender)',
    queryText: 'Procurement of 33kV, 1250A, 25kA 3-phase outdoor vacuum circuit breakers (VCB) with motorized spring charge mechanism, porcelain bushings, and IP55 control kiosk for 33/11kV substation under RDSS scheme',
    category: 'Electrical & Power Distribution',
    detectedStandards: ['IS 13118 : 1991 (AC Circuit Breakers)', 'IS 2099 : 1986 (High Voltage Bushings)', 'IS 12063 : 1987 (IP55 Enclosure Protection)', 'IS 3427 : 1997 (Metal Enclosed Switchgear)'],
    qcoCount: 1
  },
  {
    id: 'q2',
    title: 'TMT Reinforcement Steel Fe 500D (Coastal Pier Project)',
    queryText: 'High yield strength corrosion-resistant thermo-mechanically treated steel rebars Fe 500D with epoxy coating for earthquake-resistant bridge piers in marine environment',
    category: 'Civil Infrastructure & Construction',
    detectedStandards: ['IS 1786 : 2008 (Fe 500D Rebars)', 'IS 13620 : 1993 (Fusion Bonded Epoxy)', 'IS 13920 : 2016 (Ductile Seismic Detailing)', 'IS 456 : 2000 (Marine Concrete Design)'],
    qcoCount: 1
  },
  {
    id: 'q3',
    title: 'HDPE Potable Water Supply Pipes (Jal Jeevan Mission)',
    queryText: 'High Density Polyethylene pipes PE-100 grade, PN 10 rating, 110mm diameter for rural drinking water distribution network under Jal Jeevan Mission',
    category: 'Chemicals, Fertilizers & Testing Labs',
    detectedStandards: ['IS 4984 : 2016 (HDPE Water Supply)', 'IS 10500 : 2012 (Drinking Water Quality)', 'IS 7634 (Part 2) : 2012 (Laying & Jointing)'],
    qcoCount: 1
  },
  {
    id: 'q4',
    title: 'Enterprise Rackmount Server Infrastructure (Smart City)',
    queryText: 'High-density 42U rackmount server enclosure with dual redundant power distribution units, biometric smart lock, and surge suppression for municipal data center',
    category: 'IT Hardware & Telecommunications',
    detectedStandards: ['IS 13252 (Part 1) : 2010 (IT Equipment Safety)', 'IS 16046 : 2018 (Lithium UPS)', 'IS 616 : 2017 (Surge Electronics)'],
    qcoCount: 2
  }
];

export const FAQS = [
  {
    id: 'faq-1',
    category: 'Statutory Compliance',
    question: 'How does Sahayak align with General Financial Rules (GFR 2017) Rule 144(i)?',
    answer: 'GFR 2017 Rule 144(i) explicitly mandates that technical specifications should, as far as practicable, conform to recognized national standards (Indian Standards published by BIS). Sahayak automatically verifies that your tender clauses strictly cite active, reaffirmed BIS standards and statutory Quality Control Orders (QCOs).'
  },
  {
    id: 'faq-2',
    category: 'Standards Integrity',
    question: 'How are BIS Gazette notifications and standard amendments synchronized?',
    answer: 'The platform ingests official Bureau of Indian Standards Gazette notifications daily, tracking standard revisions, published amendments (1 through N), reaffirmation cycles, and withdrawal notices so that obsolete codes are flagged immediately during tender formulation.'
  },
  {
    id: 'faq-3',
    category: 'Authentication & Security',
    question: 'What authentication methods are supported for government procurement officers?',
    answer: 'Sahayak integrates with the National Single Sign-On ecosystem including Jan Parichay (MeriPehchaan), GeM Primary Buyer Organization ID, and official government email domains (@gov.in, @nic.in, @psu.co.in) following CERT-In guidelines.'
  },
  {
    id: 'faq-4',
    category: 'GeM & CPPP Export',
    question: 'Can the generated compliance clauses be directly uploaded to GeM and CPPP?',
    answer: 'Yes. The engine formats the technical parameters, normative testing methods, and mandatory QCO declarations into standardized bid formats that can be copied and pasted directly into Government e-Marketplace (GeM) and Central Public Procurement Portal (CPPP) tender documents.'
  }
];
