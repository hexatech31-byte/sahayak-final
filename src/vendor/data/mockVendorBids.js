// New "Vendor Opportunities / My Bids" suite — mock/demo data.
// FRONTEND-ONLY: this simulates a bid-tracking backend using localStorage so
// the flow (browse tender -> submit bid -> track bid -> reply to
// clarification) can be demonstrated end-to-end. Kept separate from
// mockVendorData.js so the existing VendorDashboard/Tenders/Quotations pages
// are completely unaffected.

import { PRIMARY_TENDER_ID } from './mockVendorData';

const STORAGE_KEY = 'sf_vendor_new_bids';

function seedBids() {
  return [
    {
      id: 'bid-seed-1',
      tenderId: 'tnd-2026-00397',
      tenderRefId: 'TND-2026-00397',
      tenderTitle: 'Water Pump Supply',
      vendorName: 'ABC Technologies Pvt. Ltd.',
      vendorEmail: 'procurement@abctechnologies.in',
      commercialBidAmount: 890000,
      status: 'Compliant',
      submittedAt: '12 Aug 2026',
      officerDecision: {
        status: 'Shortlisted',
        decidedAt: '20 Aug 2026',
        officerRemarks: 'Meets IS 8034 requirements. Proceeding to commercial evaluation.',
      },
      clarifications: [],
      uploadedDocuments: [
        { docId: 'd1', docName: 'BIS_License_CML_Active.pdf' },
        { docId: 'd2', docName: 'NABL_Type_Test_Report_Full.pdf' },
      ],
    },
  ];
}

function readBids() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore corrupted/inaccessible storage
  }
  const seeded = seedBids();
  writeBids(seeded);
  return seeded;
}

function writeBids(bids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bids));
  } catch {
    // ignore
  }
}

export function getVendorBids() {
  return readBids();
}

export function addVendorBid(bid) {
  const bids = readBids();
  const withId = { id: `bid-${Date.now()}`, ...bid };
  const updated = [withId, ...bids];
  writeBids(updated);
  return updated;
}

export function updateVendorBid(bidId, updater) {
  const bids = readBids();
  const updated = bids.map((b) => (b.id === bidId ? updater(b) : b));
  writeBids(updated);
  return updated;
}

export { PRIMARY_TENDER_ID };
