import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase';

const PROCUREMENTS_COLLECTION = 'procurements';

/**
 * Creates a persistent procurement record in Firestore.
 * Ensures initial schemas are truthful with AI pipeline status set to "pending".
 */
export async function createProcurement({
  user,
  title = '',
  category = '',
  description = '',
  inputMode = 'text',
  inputData = {},
  currentStage = 'input',
  status = 'in_progress',
}) {
  if (!user || !user.uid) {
    throw new Error('Authentication required to create a procurement record.');
  }

  if (!isFirebaseConfigured || !db) {
    throw new Error('Firestore is not configured. Please check Firebase environment variables.');
  }

  const procurementsRef = collection(db, PROCUREMENTS_COLLECTION);
  const newDocRef = doc(procurementsRef);
  const procurementId = newDocRef.id;

  const procurementDoc = {
    // Identity & Ownership
    id: procurementId,
    createdBy: user.uid,
    officerId: user.uid,
    officerEmail: user.email || '',
    officerName: user.displayName || user.email?.split('@')[0] || 'Officer',

    // Basic Procurement Information
    title: title.trim() || 'Untitled Procurement',
    category: category || 'General',
    description: description.trim() || '',

    // Input Mode & Raw Data (Store metadata/raw parameters only, NO binary file data)
    inputMode: inputMode, // 'text' | 'document' | 'quotation'
    inputData: {
      ...inputData,
    },

    // Workflow State
    currentStage: currentStage, // 'input' | 'understand' | 'processing' | 'analysis' | 'specification' | 'publishing' | 'bidding' | 'evaluation' | 'approval' | 'completed'
    status: status,             // 'draft' | 'in_progress' | 'awaiting_review' | 'approved' | 'published'

    // AI Processing Status
    processing: {
      status: 'pending',
      startedAt: null,
      completedAt: null,
    },

    // AI Understanding from Qwen
    understanding: null,
    understandingStatus: 'pending', // 'pending' | 'confirmed'

    // Standards Analysis from RAG
    standardsAnalysis: null,

    // AI Status Tracking
    aiStatus: {
      understanding: 'pending', // 'pending' | 'processing' | 'completed' | 'failed'
      standards: 'pending' // 'pending' | 'processing' | 'completed' | 'failed'
    },

    // AI Error Tracking
    aiErrors: null,

    // Technical Specification (Pending until future AI Spec Generator runs)
    technicalSpecification: {
      status: 'pending',
      data: null,
    },

    // Tender Details (Draft/Not created until publish stage)
    tender: {
      status: 'not_created',
      tenderId: null,
    },

    // Timestamps
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(newDocRef, procurementDoc);
  return { id: procurementId, ...procurementDoc };
}

/**
 * Fetches a single procurement by ID from Firestore.
 * Verifies document exists and belongs to the authenticated user.
 */
export async function getProcurementById(procurementId, currentUserId) {
  if (!procurementId) {
    throw new Error('Procurement ID is required.');
  }

  if (!isFirebaseConfigured || !db) {
    throw new Error('Firestore is not configured.');
  }

  const docRef = doc(db, PROCUREMENTS_COLLECTION, procurementId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    const error = new Error('Procurement not found.');
    error.code = 'NOT_FOUND';
    throw error;
  }

  const data = docSnap.data();

  // Strict ownership enforcement
  if (currentUserId && data.createdBy !== currentUserId) {
    const error = new Error('Access denied: You do not have permission to view this procurement.');
    error.code = 'PERMISSION_DENIED';
    throw error;
  }

  return { id: docSnap.id, ...data };
}

/**
 * Fetches all procurements created by the specified officer.
 */
export async function getOfficerProcurements(officerUid) {
  if (!officerUid) {
    return [];
  }

  if (!isFirebaseConfigured || !db) {
    return [];
  }

  try {
    const q = query(
      collection(db, PROCUREMENTS_COLLECTION),
      where('createdBy', '==', officerUid),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const procurements = [];
    querySnapshot.forEach((doc) => {
      procurements.push({ id: doc.id, ...doc.data() });
    });

    return procurements;
  } catch (error) {
    console.warn('Could not fetch officer procurements with order clause; trying simple query:', error);
    // Fallback if composite index is pending
    const simpleQuery = query(
      collection(db, PROCUREMENTS_COLLECTION),
      where('createdBy', '==', officerUid)
    );
    const querySnapshot = await getDocs(simpleQuery);
    const procurements = [];
    querySnapshot.forEach((doc) => {
      procurements.push({ id: doc.id, ...doc.data() });
    });
    // Sort in memory by createdAt
    return procurements.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || a.createdAt || 0;
      const timeB = b.createdAt?.toMillis?.() || b.createdAt || 0;
      return timeB - timeA;
    });
  }
}

/**
 * Updates procurement document fields with ownership guard.
 */
export async function updateProcurement(procurementId, updates, currentUserId) {
  if (!procurementId) throw new Error('Procurement ID is required.');
  if (!isFirebaseConfigured || !db) throw new Error('Firestore is not configured.');

  // Validate ownership first
  if (currentUserId) {
    await getProcurementById(procurementId, currentUserId);
  }

  const docRef = doc(db, PROCUREMENTS_COLLECTION, procurementId);
  const updateData = {
    ...updates,
    updatedAt: serverTimestamp(),
  };

  console.log('[DEBUG] Firestore update data:', updateData);
  await updateDoc(docRef, updateData);
  return { id: procurementId, ...updateData };
}

/**
 * Updates the workflow stage and status for a procurement.
 */
export async function updateProcurementStage(procurementId, { currentStage, status, stageUpdates = {} }, currentUserId) {
  const updates = {
    ...(currentStage ? { currentStage } : {}),
    ...(status ? { status } : {}),
  };

  // Merge stageUpdates - dot notation keys work natively in Firestore
  Object.assign(updates, stageUpdates);

  console.log('[DEBUG] Firebase updates:', updates);
  return updateProcurement(procurementId, updates, currentUserId);
}
