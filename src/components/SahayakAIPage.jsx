import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Send, 
  Paperclip, 
  Mic, 
  Copy, 
  RefreshCw, 
  ThumbsUp, 
  ThumbsDown, 
  FileText, 
  Layers, 
  FileCheck2, 
  ShieldCheck, 
  Shield, 
  ArrowLeft, 
  ChevronRight, 
  LogOut,
  Menu,
  MessageSquare
} from 'lucide-react';

const STORAGE_KEY = 'sahayak_ai_conversations_v1';

// Vector dual-bubble with 2-dots icon matching reference image
export function SahayakChatIcon({ className = "w-5 h-5 text-white" }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* Front speech bubble */}
      <path d="M14 13a2.5 2.5 0 0 0 2.5-2.5V6A2.5 2.5 0 0 0 14 3.5H5.5A2.5 2.5 0 0 0 3 6v4.5A2.5 2.5 0 0 0 5.5 13H7l-.5 3 3.5-3H14z" />
      <line x1="7.5" y1="8" x2="7.51" y2="8" strokeWidth="3" />
      <line x1="11.5" y1="8" x2="11.51" y2="8" strokeWidth="3" />
      {/* Back speech bubble */}
      <path d="M16.5 7.5h1A2.5 2.5 0 0 1 20 10v4.5a2.5 2.5 0 0 1-2.5 2.5h-1l-2.5 2.5.5-2.5h-3a2.5 2.5 0 0 1-2.4-1.8" />
    </svg>
  );
}

// Realistic procurement responses
const KNOWLEDGE_RESPONSES = {
  spec: {
    title: 'Technical Specification Drafting Guide (GFR & BIS Compliant)',
    content: `Here is a structured framework for drafting your technical specification compliant with General Financial Rules (GFR 2017) and Bureau of Indian Standards (BIS):

1. **Item Identification & Scope:**
   • Clearly describe the item, intended operating environment, and required quantities.
   • Specify primary standard benchmarks (e.g., **IS 13252 (Part 1): 2010** for IT Hardware safety).

2. **Core Performance Parameters:**
   • Avoid proprietary brand names (e.g., use *"Intel Core i7 13th Gen or equivalent AMD Ryzen 7"*).
   • Mandate minimum physical parameters: Processor speed, RAM capacity, Energy Star / BEE rating.

3. **Statutory & Regulatory Clauses:**
   • Mandatory compliance with **GFR 144(i)** (no restrictive specifications favoring specific OEMs).
   • Make in India (MII) Preference clause under DPIIT Order P-45021/2/2017-PP (BE-II).

4. **Warranty & SLA Requirements:**
   • 3-Year comprehensive on-site OEM warranty with next-business-day response time.`
  },
  cctv: {
    title: 'Technical Specification: IP CCTV Surveillance System',
    content: `Structured Technical Specifications for IP CCTV System compliant with Ministry of Home Affairs & BIS Guidelines:

1. **Camera Specifications:**
   • **Resolution:** 4MP / 1080p Full HD real-time @ 30fps.
   • **Sensor & Lens:** 1/2.8" Progressive Scan CMOS, Motorized Varifocal 2.8mm–12mm lens.
   • **Night Vision:** Smart IR range up to 40 meters.
   • **Standards:** Conforming to **IS 13252 (Part 1)** and ONVIF Profile S/G/T compliance.

2. **Network & Storage (NVR):**
   • 32-Channel NVR with RAID-5 support for storage redundancy.
   • Mandatory continuous recording storage retention for minimum 30 days.

3. **Cybersecurity & Compliance:**
   • STQC certification or CERT-In audited firmware to prevent unauthorized telemetry.
   • Compliance with GFR 144(xi) border country restrictions.`
  },
  process: {
    title: 'Public Procurement & Tendering Lifecycle Overview',
    content: `The standard Government e-Marketplace (GeM) & CPPP e-tendering process follows these key stages:

1. **Indent & Requirement Approval:**
   • Administrative Approval (A/A) and Expenditure Sanction (E/S) by the competent authority.
   • Verification of non-availability on GeM (or GeM Custom Bid creation).

2. **Tender Notice Publication:**
   • Publishing of Notice Inviting Tender (NIT) with RFP documents, eligibility, and EMD requirements.
   • Minimum bidding window (typically 14 to 21 days for Open Tenders).

3. **Bid Evaluation (Two-Cover System):**
   • **Cover 1 (Technical):** Verification of BIS certifications, OEM authorizations (MAF), past experience, and turnover.
   • **Cover 2 (Financial):** Commercial opening for technically qualified bidders to establish L1.

4. **Award of Contract (AoC) & Performance Guarantee:**
   • Issuance of Letter of Intent (LoI) followed by Performance Bank Guarantee (PBG, 3–5%).`
  },
  rfp: {
    title: 'Essential Components of a Government RFP / Tender Document',
    content: `A comprehensive Request for Proposal (RFP) for government procurement must include:

1. **Section I: Tender Notice & Schedule of Dates (NIT)**
   • Critical dates (Pre-bid meeting, Submission deadline, Technical opening date).

2. **Section II: Instructions to Bidders (ITB)**
   • Bid submission format, Earnest Money Deposit (EMD) exemption rules for MSMEs/Startups.

3. **Section III: Eligibility & Qualification Criteria**
   • Minimum 3 years in business, average annual turnover criteria (min 30% of estimated cost).
   • Past performance: successfully executed contracts for similar goods/services.

4. **Section IV: Technical Specifications & Schedule of Requirements (SOR)**
   • Precise technical parameters, BIS/ISO compliance, test reports from NABL accredited labs.

5. **Section V: Commercial Terms & Payment Milestones**
   • 80% on delivery & preliminary inspection, 20% post installation and final acceptance.`
  },
  review: {
    title: 'Procurement Requirement Review & Compliance Audit',
    content: `Based on standard procurement auditing protocols, here is a compliance checklist for your requirement:

✓ **GFR 144(xi) Check:** Ensure bidders from countries sharing land borders with India have required registration with the competent authority.
✓ **Non-Restrictive Specs:** Parameter ranges are generic and allow at least 3 distinct OEMs to compete.
✓ **BIS Standards Linked:** Applicable Indian Standard codes are explicitly referenced.
✓ **Local Content Mandate:** Local content % minimum defined (Class-I: >50%, Class-II: >20%).
✓ **Inspection Clause:** Pre-dispatch inspection (PDI) and Joint Receipt Inspection (JRI) clearly defined.`
  },
  default: {
    title: 'Procurement Assistant Insights',
    content: `Thank you for your inquiry. Here is guidance based on General Financial Rules (GFR 2017) and Bureau of Indian Standards (BIS):

• **Procurement Mode Selection:** Check if item is available on GeM under Direct Purchase (up to ₹25,000), L1 comparison (up to ₹5,00,000), or Open Bid.
• **Standards Conformance:** Ensure compliance with mandatory BIS certification orders where applicable.
• **Fair Competition:** Clauses must avoid restrictive vendor-specific conditions.`
  }
};

// Seed initial conversations for a rich first impression
const SEED_CONVERSATIONS = [
  {
    id: 'conv-cctv-1',
    title: 'Technical Specification – CCTV',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 101,
        sender: 'user',
        text: 'Help me create a technical specification for 50 IP CCTV cameras for office surveillance.',
        timestamp: '10:30 AM'
      },
      {
        id: 102,
        sender: 'ai',
        title: KNOWLEDGE_RESPONSES.cctv.title,
        text: KNOWLEDGE_RESPONSES.cctv.content,
        timestamp: '10:31 AM'
      }
    ]
  },
  {
    id: 'conv-rfp-2',
    title: 'RFP requirements for IT equipment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messages: [
      {
        id: 201,
        sender: 'user',
        text: 'What are the essential RFP requirements for purchasing government IT hardware?',
        timestamp: '09:15 AM'
      },
      {
        id: 202,
        sender: 'ai',
        title: KNOWLEDGE_RESPONSES.rfp.title,
        text: KNOWLEDGE_RESPONSES.rfp.content,
        timestamp: '09:16 AM'
      }
    ]
  },
  {
    id: 'conv-eval-3',
    title: 'Tender evaluation criteria',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    messages: [
      {
        id: 301,
        sender: 'user',
        text: 'How should we formulate the two-cover technical and financial evaluation criteria?',
        timestamp: 'Yesterday'
      },
      {
        id: 302,
        sender: 'ai',
        title: 'Tender Evaluation Guidelines (QCBS vs LCS)',
        text: 'In standard public procurement, Two-Cover evaluation requires evaluating Cover-1 (Technical & Statutory Compliance) independently before opening Cover-2 (Financial). Bidders scoring above the technical threshold qualify for financial opening where L1 is awarded.',
        timestamp: 'Yesterday'
      }
    ]
  },
  {
    id: 'conv-gem-4',
    title: 'GeM procurement process',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    messages: [
      {
        id: 401,
        sender: 'user',
        text: 'Explain the tendering and bidding workflow on the GeM portal.',
        timestamp: '3 days ago'
      },
      {
        id: 402,
        sender: 'ai',
        title: KNOWLEDGE_RESPONSES.process.title,
        text: KNOWLEDGE_RESPONSES.process.content,
        timestamp: '3 days ago'
      }
    ]
  }
];

// Generate short descriptive title from query
function generateSmartTitle(query) {
  const lower = query.toLowerCase();
  if (lower.includes('cctv') || lower.includes('camera')) return 'Technical Specification – CCTV';
  if (lower.includes('spec') || lower.includes('technical') || lower.includes('requirement')) return 'Technical Specification';
  if (lower.includes('rfp') || lower.includes('document')) return 'RFP requirements';
  if (lower.includes('eval') || lower.includes('criteria')) return 'Tender evaluation criteria';
  if (lower.includes('gem') || lower.includes('process') || lower.includes('tender')) return 'GeM procurement process';
  if (lower.includes('review') || lower.includes('audit')) return 'Review procurement requirement';
  if (lower.includes('vendor') || lower.includes('quote') || lower.includes('quotation')) return 'Vendor & Quotation Analysis';
  
  // Truncate to first 4-5 words
  const words = query.trim().split(/\s+/).slice(0, 5).join(' ');
  return words.length > 32 ? words.slice(0, 30) + '...' : words;
}

// Categorize date grouping
function getGrouping(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return 'Previous 7 Days';
  return 'Older';
}

export function SahayakAIPage() {
  const navigate = useNavigate();

  // Conversations state with persistent localStorage
  const [conversations, setConversations] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load conversations from localStorage', e);
    }
    return SEED_CONVERSATIONS;
  });

  const [activeConvId, setActiveConvId] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  // Inline editing state for conversation title
  const [editingConvId, setEditingConvId] = useState(null);
  const [editTitleValue, setEditTitleValue] = useState('');

  const messagesEndRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch (e) {
      console.error('Failed to save conversations to localStorage', e);
    }
  }, [conversations]);

  // Current active conversation
  const currentConversation = conversations.find(c => c.id === activeConvId) || null;
  const messages = currentConversation ? currentConversation.messages : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Start a fresh empty conversation
  const handleNewChat = () => {
    setActiveConvId(null);
    setInputValue('');
    setIsMobileSidebarOpen(false);
  };

  // Select a conversation from history
  const handleSelectConversation = (id) => {
    setActiveConvId(id);
    setIsMobileSidebarOpen(false);
  };

  // Delete a conversation
  const handleDeleteConversation = (e, id) => {
    e.stopPropagation();
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== id);
      return updated;
    });
    if (activeConvId === id) {
      setActiveConvId(null);
    }
  };

  // Start renaming a conversation
  const handleStartRename = (e, conv) => {
    e.stopPropagation();
    setEditingConvId(conv.id);
    setEditTitleValue(conv.title);
  };

  // Save renamed conversation
  const handleSaveRename = (e, id) => {
    e.stopPropagation();
    if (!editTitleValue.trim()) {
      setEditingConvId(null);
      return;
    }
    setConversations(prev => prev.map(c => c.id === id ? { ...c, title: editTitleValue.trim() } : c));
    setEditingConvId(null);
  };

  // Handle Sending a Message
  const handleSend = (textToSend) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setInputValue('');
    setIsTyping(true);

    // Determine realistic answer
    const lower = query.toLowerCase();
    let matchedKey = 'default';
    if (lower.includes('cctv') || lower.includes('camera')) {
      matchedKey = 'cctv';
    } else if (lower.includes('spec') || lower.includes('technical') || lower.includes('requirement')) {
      matchedKey = 'spec';
    } else if (lower.includes('process') || lower.includes('tender') || lower.includes('lifecycle')) {
      matchedKey = 'process';
    } else if (lower.includes('rfp') || lower.includes('include') || lower.includes('document')) {
      matchedKey = 'rfp';
    } else if (lower.includes('review') || lower.includes('audit') || lower.includes('check') || lower.includes('compliance')) {
      matchedKey = 'review';
    }

    const matchedData = KNOWLEDGE_RESPONSES[matchedKey];

    // If no active conversation, create a new one!
    let targetConvId = activeConvId;
    if (!targetConvId) {
      targetConvId = 'conv-' + Date.now();
      const newTitle = generateSmartTitle(query);
      const newConv = {
        id: targetConvId,
        title: newTitle,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [userMessage]
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveConvId(targetConvId);
    } else {
      // Append user message to existing conversation
      setConversations(prev => prev.map(c => {
        if (c.id === targetConvId) {
          return {
            ...c,
            updatedAt: new Date().toISOString(),
            messages: [...c.messages, userMessage]
          };
        }
        return c;
      }));
    }

    // AI Response Delay
    setTimeout(() => {
      setIsTyping(false);
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        title: matchedData.title,
        text: matchedData.content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversations(prev => prev.map(c => {
        if (c.id === targetConvId) {
          return {
            ...c,
            updatedAt: new Date().toISOString(),
            messages: [...c.messages, aiMessage]
          };
        }
        return c;
      }));
    }, 850);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleFeedback = (index, type) => {
    setFeedback(prev => ({
      ...prev,
      [index]: prev[index] === type ? null : type
    }));
  };

  const suggestionCards = [
    {
      id: 'spec',
      icon: FileText,
      title: 'Help me create a technical specification',
      desc: 'Draft structured requirements compliant with BIS standards and GFR norms'
    },
    {
      id: 'process',
      icon: Layers,
      title: 'Explain the tendering process',
      desc: 'Step-by-step guidance on public procurement, NIT, and GeM workflows'
    },
    {
      id: 'rfp',
      icon: FileCheck2,
      title: 'What should an RFP include?',
      desc: 'Essential clauses, eligibility conditions, and evaluation metrics'
    },
    {
      id: 'review',
      icon: ShieldCheck,
      title: 'Review my procurement requirement',
      desc: 'Audit compliance against GFR 144(i) and non-restrictive guidelines'
    }
  ];

  // Group conversations by date
  const groupedConversations = {
    'Today': conversations.filter(c => getGrouping(c.createdAt) === 'Today'),
    'Yesterday': conversations.filter(c => getGrouping(c.createdAt) === 'Yesterday'),
    'Previous 7 Days': conversations.filter(c => getGrouping(c.createdAt) === 'Previous 7 Days'),
    'Older': conversations.filter(c => getGrouping(c.createdAt) === 'Older')
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-orange-600 selection:text-white overflow-hidden">
      
      {/* ── Top Full-Width Header (Clean & Minimal: No Create Tender, No Notification) ── */}
      <header className="h-16 border-b border-slate-200 bg-white px-4 sm:px-8 flex items-center justify-between relative shrink-0 shadow-xs z-30">
        
        {/* Left: Mobile Drawer Trigger + Sahayak Logo & Workspace Tag */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl md:hidden cursor-pointer"
            title="Toggle Chat History"
          >
            <Menu size={20} />
          </button>

          <div 
            onClick={() => navigate('/home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 bg-orange-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-orange-600/20 group-hover:scale-105 transition-transform shrink-0">
              <Shield className="w-5 h-5 fill-white/20 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-slate-900 leading-tight tracking-tight text-base group-hover:text-orange-600 transition-colors">
                Sahayak
              </h1>
              <span className="text-[10px] tracking-wider text-slate-400 font-bold uppercase block">
                GOVERNMENT WORKSPACE
              </span>
            </div>
          </div>
        </div>

        {/* Right: Clean Action - Back to Procurement (No Create Tender, No Notification Icon) */}
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-orange-200 bg-white hover:bg-orange-50 transition-all cursor-pointer shadow-xs"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Back to Procurement</span>
          <span className="sm:hidden">Back</span>
        </button>
      </header>

      {/* ── Main Workspace Body (Sidebar on Left, Chat on Right) ── */}
      <div className="flex-1 flex overflow-hidden relative">

        {/* ── Dedicated AI Conversation History Sidebar ── */}
        <aside className={`
          fixed md:static inset-y-0 left-0 z-20 w-72 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-xs transition-transform duration-300 ease-in-out md:translate-x-0
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          
          {/* Top Section: New Chat Button + Recent Chats List */}
          <div className="flex-1 flex flex-col min-h-0 p-4">
            
            {/* + New Chat Prominent Button */}
            <button
              type="button"
              onClick={handleNewChat}
              className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 active:scale-[0.98] text-white font-bold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-orange-600/20 transition-all cursor-pointer mb-5 shrink-0"
            >
              <Plus size={18} className="stroke-[2.5]" />
              <span>New Chat</span>
            </button>

            {/* Conversation History Heading */}
            <div className="text-[11px] font-extrabold tracking-wider text-slate-400 px-2 mb-2 uppercase shrink-0">
              RECENT CHATS
            </div>

            {/* Scrollable Conversation List Grouped by Date */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {Object.entries(groupedConversations).map(([groupTitle, convs]) => {
                if (convs.length === 0) return null;
                return (
                  <div key={groupTitle} className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 px-2.5 py-1">
                      {groupTitle}
                    </div>
                    {convs.map((conv) => {
                      const isActive = conv.id === activeConvId;
                      const isEditing = editingConvId === conv.id;

                      return (
                        <div
                          key={conv.id}
                          onClick={() => handleSelectConversation(conv.id)}
                          className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                            isActive
                              ? 'bg-orange-50 text-orange-600 font-bold border-l-4 border-orange-600 shadow-xs'
                              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 border-l-4 border-transparent'
                          }`}
                        >
                          {isEditing ? (
                            <div className="flex items-center gap-1.5 w-full" onClick={e => e.stopPropagation()}>
                              <input
                                type="text"
                                value={editTitleValue}
                                onChange={e => setEditTitleValue(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') handleSaveRename(e, conv.id);
                                  if (e.key === 'Escape') setEditingConvId(null);
                                }}
                                autoFocus
                                className="flex-1 bg-white border border-orange-300 rounded px-2 py-0.5 text-xs text-slate-800 outline-none"
                              />
                              <button
                                type="button"
                                onClick={e => handleSaveRename(e, conv.id)}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer"
                              >
                                <Check size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingConvId(null)}
                                className="p-1 text-slate-400 hover:bg-slate-200 rounded cursor-pointer"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                                <MessageSquare size={14} className={isActive ? 'text-orange-600 shrink-0' : 'text-slate-400 shrink-0'} />
                                <span className="truncate leading-snug">
                                  {conv.title}
                                </span>
                              </div>

                              {/* Hover Action Controls (Rename & Delete) */}
                              <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                                <button
                                  type="button"
                                  onClick={e => handleStartRename(e, conv)}
                                  className="p-1 text-slate-400 hover:text-slate-700 hover:bg-white rounded transition-colors cursor-pointer"
                                  title="Rename"
                                >
                                  <Edit3 size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={e => handleDeleteConversation(e, conv.id)}
                                  className="p-1 text-slate-400 hover:text-rose-600 hover:bg-white rounded transition-colors cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              {conversations.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-400">
                  No conversation history yet.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Footer: Help & Support + Logout */}
          <div className="p-4 border-t border-slate-100 shrink-0">
            <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center gap-3 px-3.5 py-3 hover:bg-slate-50 transition-colors cursor-pointer text-left"
              >
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <span className="text-orange-500 font-black text-sm leading-none">?</span>
                </div>
                <span className="flex-1 text-xs font-bold text-slate-800">Help &amp; Support</span>
                <ChevronRight size={14} className="text-slate-400 shrink-0" />
              </button>

              <div className="h-px bg-slate-100 mx-0" />

              <div className="p-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full py-2 px-3 bg-orange-50 hover:bg-orange-100 text-orange-600 hover:text-orange-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

        </aside>

        {/* Mobile backdrop for drawer */}
        {isMobileSidebarOpen && (
          <div 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 z-10 md:hidden backdrop-blur-xs"
          />
        )}

        {/* ── Main Chat Conversation Center ── */}
        <main className="flex-1 flex flex-col justify-between overflow-hidden p-4 sm:p-6 lg:p-8 bg-slate-50">
          
          {/* Sahayak AI Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 max-w-4xl w-full mx-auto shrink-0">
            <div className="flex items-center gap-3">
              {/* Flat, crisp, minimal vector chat bubble icon in Sahayak orange */}
              <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <SahayakChatIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight">
                  Sahayak AI
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Your intelligent procurement assistant
                </p>
              </div>
            </div>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={handleNewChat}
                className="text-xs font-bold text-slate-500 hover:text-orange-600 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-orange-200 bg-white hover:bg-orange-50 transition-colors cursor-pointer"
              >
                + New Chat
              </button>
            )}
          </div>

          {/* ── Chat Messages Stream / Empty State ── */}
          <div className="flex-1 overflow-y-auto my-4 max-w-4xl w-full mx-auto pr-1 space-y-4">
            
            {/* Empty State / Welcome Screen */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[70%] text-center px-4 py-6 animate-in fade-in duration-300">
                
                {/* Minimal Chat Icon Badge */}
                <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mb-5 shadow-xs">
                  <SahayakChatIcon className="w-8 h-8 text-orange-600" />
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  How can I help you today?
                </h3>
                <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
                  Ask anything about procurement, tenders, specifications, vendors, quotations, evaluations or approvals.
                </p>

                {/* 4 Clean Suggestion Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-8 w-full max-w-2xl text-left">
                  {suggestionCards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleSend(card.title)}
                        className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs hover:border-orange-300 hover:shadow-md transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-200 transition-colors shrink-0">
                            <Icon size={18} className="stroke-[2]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                              {card.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                              {card.desc}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Render Active Message History */}
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {msg.sender === 'user' ? (
                  /* User Message Bubble */
                  <div className="bg-slate-900 text-white rounded-2xl rounded-tr-xs px-4.5 py-3 text-sm max-w-[85%] sm:max-w-[75%] shadow-xs leading-relaxed text-left">
                    {msg.text}
                    <span className="text-[10px] text-slate-400 block text-right mt-1.5 font-medium">
                      {msg.timestamp}
                    </span>
                  </div>
                ) : (
                  /* AI Response Card */
                  <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-5 sm:p-6 text-slate-800 shadow-xs max-w-full sm:max-w-[92%] text-left">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-xs shrink-0">
                          <SahayakChatIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-bold text-slate-900">
                          Sahayak AI
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          · {msg.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Title & Body */}
                    {msg.title && (
                      <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mb-2">
                        {msg.title}
                      </h4>
                    )}
                    
                    <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line space-y-2">
                      {msg.text}
                    </div>

                    {/* Action Toolbar */}
                    <div className="flex items-center justify-between pt-3.5 mt-4 border-t border-slate-100 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.text, idx)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                          title="Copy response"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check size={13} className="text-emerald-600" />
                              <span className="text-emerald-600 font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSend(messages[idx - 1]?.text || 'Regenerate')}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                          title="Regenerate"
                        >
                          <RefreshCw size={13} />
                          <span>Regenerate</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleFeedback(idx, 'up')}
                          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                            feedback[idx] === 'up' 
                              ? 'bg-emerald-50 text-emerald-600 font-bold' 
                              : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                          }`}
                          title="Helpful"
                        >
                          <ThumbsUp size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFeedback(idx, 'down')}
                          className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                            feedback[idx] === 'down' 
                              ? 'bg-rose-50 text-rose-600 font-bold' 
                              : 'hover:bg-slate-100 text-slate-400 hover:text-slate-600'
                          }`}
                          title="Not helpful"
                        >
                          <ThumbsDown size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* AI Thinking Indicator */}
            {isTyping && (
              <div className="flex items-start gap-3 animate-in fade-in duration-200 text-left">
                <div className="w-7 h-7 rounded-lg bg-orange-600 text-white flex items-center justify-center shadow-xs shrink-0 mt-1">
                  <SahayakChatIcon className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500">
                      Sahayak AI is thinking
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-bounce [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Fixed Chat Input Bar at Bottom ── */}
          <div className="pt-2 shrink-0 max-w-4xl w-full mx-auto">
            <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-2 flex items-center gap-2 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
              
              {/* Attachment Button */}
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
                title="Attach document or specification"
              >
                <Paperclip size={18} />
              </button>

              {/* Text Input */}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Sahayak AI anything..."
                className="flex-1 text-xs sm:text-sm text-slate-800 placeholder-slate-400 bg-transparent outline-none px-2 py-1.5 font-medium"
              />

              {/* Microphone Button */}
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer shrink-0"
                title="Voice input"
              >
                <Mic size={18} />
              </button>

              {/* Orange Send Button */}
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!inputValue.trim()}
                className="w-9 h-9 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-40 disabled:hover:bg-orange-600 text-white flex items-center justify-center transition-all shadow-sm shadow-orange-600/25 cursor-pointer disabled:cursor-not-allowed shrink-0"
                title="Send message"
              >
                <Send size={16} className="stroke-[2.2]" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Sahayak AI provides guidance based on GFR 2017 & Bureau of Indian Standards (BIS). Verify statutory requirements.
            </p>
          </div>

        </main>
      </div>

    </div>
  );
}
