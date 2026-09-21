# Sahayak — AI-Powered Indian Standards (BIS) Recommendation Engine

> **Smart India Hackathon (SIH 2026) Initiative**  
> Developed for the Ministry of Consumer Affairs, Food & Public Distribution and Bureau of Indian Standards (BIS).

Sahayak is a clean, modern, light-themed enterprise landing page and recommendation engine prototype designed for government and enterprise procurement officers. It solves the critical problem of outdated standard references, omitted normative test methods, and overlooked mandatory Quality Control Orders (QCOs) in public tenders.

---

## 🌟 Key Capabilities & Features

1. **Semantic Search over Keyword Matching**: Understands engineering context, material grades (e.g. Fe 500D vs Fe 600), operating environments, and functional parameters to pinpoint exact IS codes.
2. **Normative & Allied Reference Mapper**: Section 2 dependency tree extraction linking primary codes to mandatory testing methods, chemical compositions, and safety standards.
3. **Version Control & Amendment Tracker**: Proactive tracking of active revisions, published amendments, reaffirmed validity dates, and superseded standards.
4. **Multilingual Query Support**: Indic NLP allowing procurement officers to search in 12+ Indian languages (Hindi, Tamil, Telugu, Marathi, Bengali, etc.).
5. **Interactive Live Spec Simulator**: Hands-on specification tester with preset clauses and auto-generated tender compliance clauses ready for GeM (Government e-Marketplace) and CPPP portals.
6. **Statutory & Regulatory Alignment**: Aligned with General Financial Rules (GFR 2017) Rule 144(i), DPIIT Mandatory QCO 2026, and Public Procurement (Make in India) Orders.

---

## 🎨 Color System & Customization

All primary and secondary colors are configured via CSS variables in [`src/index.css`](src/index.css) and Tailwind CSS classes for instant theme personalization:

```css
:root {
  /* Primary Trust / Government Accent */
  --primary-900: #1e3a8a; /* Deep Slate Blue */
  --primary-700: #1d4ed8;
  --primary-600: #2563eb; /* Electric Royal Blue */
  --primary-50:  #eff6ff;

  /* Secondary Accent / Certification Trust */
  --accent-700:  #0f766e;
  --accent-600:  #0d9488; /* Teal / Emerald Accent */
  --accent-50:   #f0fdfa;

  /* Surfaces & Backgrounds */
  --bg-page:     #f8fafc; /* Warm Off-White */
  --bg-surface:  #ffffff; /* Pure White Card Surface */
  --border-subtle: #e2e8f0; /* Soft Slate Border */
}
```

---

## 📁 Component Directory Structure

```
src/
├── types/
│   └── index.ts                 # TypeScript interfaces for Standards, Categories, FAQs
├── data/
│   └── mockData.ts              # Real Indian Standards (IS), QCOs, Categories & Presets
├── components/
│   ├── Navbar.tsx               # Header with Parichay/GeM SSO modal triggers
│   ├── HeroSection.tsx          # Split hero layout with enterprise stock photography
│   ├── ProblemSolution.tsx      # 3-column problem vs AI solution grid
│   ├── CategoryCoverage.tsx     # Interactive category pills & live standard preview
│   ├── FeatureShowcase.tsx      # 4 interactive deep-dive feature tabs
│   ├── InteractiveSpecFinder.tsx# Interactive simulator & copyable tender clause
│   ├── ComplianceSection.tsx    # GFR 2017, DPIIT QCO & GeM statutory pillars
│   ├── FaqSection.tsx           # Expandable accordion for procurement queries
│   ├── CtaBanner.tsx            # High impact CTA banner for government bodies
│   ├── Footer.tsx               # Enterprise multi-column footer with SIH tags
│   ├── AuthModal.tsx            # Modal for Parichay / GeM Buyer ID sign-in preview
│   └── DemoModal.tsx            # Interactive 4-step guided walkthrough modal
├── App.tsx                      # Main landing page assembler with state management
└── index.css                    # Tailwind CSS v4 setup & custom light-mode styling
```

---

## 🚀 Running the Project

### React + Vite Application
```bash
# 1. Navigate to the project directory
cd Sahayak-main

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the development server
npm run dev

# 4. Build for production
npm run build
```

### Standalone Single-File Version
A complete standalone single-file HTML version is also available at:
`../standardflow-landing-page/index.html`

You can open it directly in any browser (Chrome, Edge, Firefox, Safari) by double-clicking it without requiring Node.js or any build step.
