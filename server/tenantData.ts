export interface TenantStore<T> {
  [orgId: string]: T[];
}

export interface IncidentRecord {
  id: string;
  orgId: string;
  title: string;
  category: "new_lead" | "missed_call" | "overdue_followup" | "scheduling_conflict" | "caregiver_noshow";
  priority: "critical" | "high" | "medium" | "low";
  score: number;
  status: "needs_action" | "in_progress" | "waiting" | "resolved";
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  caregiverName?: string;
  caregiverPhone?: string;
  description: string;
  whyFlagged: string;
  suggestedAction: string;
  source: "phone_sms" | "crm" | "calendar" | "email" | "scheduling";
  slaMinutesRemaining: number;
  dealValue?: number;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  aurixLog: string[];
}

export interface LeadRecord {
  id: string;
  orgId: string;
  name: string;
  phone: string;
  email: string;
  leadSource: "Web Form" | "Inbound Call" | "Hospital Referral" | "Doctor Office" | "Google Search" | "Physician Portal";
  status: "New" | "Contacted" | "Qualified" | "Appointment" | "Won" | "Lost";
  lastContact: string;
  nextFollowUp: string;
  assignedUser: string;
  estimatedValue: number;
  tags: string[];
  notes: string[];
  careNeed?: string;
  createdAt: string;
}

export interface ConversationRecord {
  id: string;
  orgId: string;
  leadId: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  type: "sms" | "ai_chat" | "call" | "missed_call";
  status: "active" | "waiting_response" | "ai_handled" | "closed";
  lastMessage: string;
  lastTimestamp: string;
  unread: boolean;
  hasRecording?: boolean;
  recordingDurationSeconds?: number;
  transcriptSnippet?: string;
  fullTranscript?: string;
  messages: Array<{
    id: string;
    sender: "lead" | "ai_agent" | "human_coordinator";
    senderName: string;
    text: string;
    timestamp: string;
  }>;
}

export interface FollowUpRecord {
  id: string;
  orgId: string;
  leadId: string;
  leadName: string;
  phone: string;
  urgency: "due_today" | "overdue" | "scheduled" | "completed";
  actionRequired: string;
  dueDate: string;
  assignedTo: string;
  aiSuggestedPrompt: string;
  status: "pending" | "completed" | "ai_dispatched";
  dealValue: number;
  lastInteraction: string;
}

export interface AIAgentRecord {
  id: string;
  orgId: string;
  name: string;
  roleDescription: string;
  section: "AI Phone Agent" | "AI SMS Agent" | "Lead Follow-Up Agent" | "Appointment Agent" | "Review/Feedback Agent" | "Reporting Agent";
  status: "Active" | "Paused";
  tasksCompleted: number;
  successRate: number;
  lastActivity: string;
  modelUsed: string;
  autonomousActionsAllowed: boolean;
  capabilities: string[];
  recentEventLog: string[];
}

// Multi-tenant isolated datasets
// Keyed strictly by authenticated orgId: "org_kavik_metro", "org_aurix_valley", "org_bay_rehab"

export const TENANT_INCIDENTS: TenantStore<IncidentRecord> = {
  "org_kavik_metro": [
    {
      id: "INC-1082",
      orgId: "org_kavik_metro",
      title: "Caregiver no-show reported by client daughter",
      category: "caregiver_noshow",
      priority: "critical",
      score: 96,
      status: "needs_action",
      customerName: "Eleanor Vance (Family: Clara Vance)",
      customerPhone: "(555) 234-8901",
      customerEmail: "clara.vance@example.com",
      caregiverName: "Marcus Brody, CNA",
      caregiverPhone: "(555) 891-2300",
      description: "Scheduled 08:00 AM med administration shift missed without check-in. Client's daughter called distraught.",
      whyFlagged: "SLA breached: High vulnerability patient alone without required insulin supervision.",
      suggestedAction: "Deploy on-call backup caregiver (Elena Gomez) and send priority reassuring SMS to Clara.",
      source: "scheduling",
      slaMinutesRemaining: -12,
      dealValue: 4800,
      assignedTo: "Sarah Jenkins (Ops)",
      createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      aurixLog: [
        "08:05: Automated ping sent to Marcus Brody (no response).",
        "08:15: Geofence check failed: caregiver device not detected within 0.5mi of residence.",
        "08:20: Aurix identified 2 eligible nearby caregivers on standby (Elena Gomez, David Chen).",
        "08:22: Escalated to Ops Queue as Critical Priority 96.",
      ],
    },
    {
      id: "INC-1081",
      orgId: "org_kavik_metro",
      title: "Double-booking conflict: Post-op mobility therapy",
      category: "scheduling_conflict",
      priority: "high",
      score: 84,
      status: "needs_action",
      customerName: "Arthur Pendelton",
      customerPhone: "(555) 345-6712",
      customerEmail: "arthur.p@example.com",
      caregiverName: "Jessica Hayes, PT",
      caregiverPhone: "(555) 432-1100",
      description: "Jessica Hayes booked simultaneously for Arthur Pendelton (North Shore) and Margaret Liu (West Hills) at 10:30 AM.",
      whyFlagged: "Travel time physically infeasible (34 miles apart, estimated 55 min transit).",
      suggestedAction: "Shift Margaret Liu's appointment to 12:30 PM or reassign to Robert Vance.",
      source: "calendar",
      slaMinutesRemaining: 18,
      dealValue: 3200,
      assignedTo: "Sarah Jenkins (Ops)",
      createdAt: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      aurixLog: [
        "07:45: Calendar sync detected overlap across 2 independent agency portals.",
        "07:46: Calculated transit route via Google Maps: 52 min expected delay.",
        "07:48: Flagged for human review to confirm client schedule flexibility.",
      ],
    },
    {
      id: "INC-1080",
      orgId: "org_kavik_metro",
      title: "Inbound High-Value Lead: 24/7 Memory Care inquiry",
      category: "new_lead",
      priority: "high",
      score: 82,
      status: "needs_action",
      customerName: "Dr. Gregory House for Martha House",
      customerPhone: "(555) 902-3344",
      customerEmail: "ghouse@hospital.org",
      description: "Hospital discharge coordinator seeking immediate 24/7 home aide placement beginning tomorrow morning.",
      whyFlagged: "Enterprise hospital referral partner with estimated $14,000/mo placement value.",
      suggestedAction: "Call Dr. House back with intake assessment slot before 11:00 AM.",
      source: "phone_sms",
      slaMinutesRemaining: 28,
      dealValue: 14000,
      assignedTo: "Sarah Jenkins (Ops)",
      createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      aurixLog: [
        "08:10: Inbound voicemail transcribed with high confidence.",
        "08:11: Entity extraction matched hospital affiliation and urgent discharge timeline.",
        "08:12: Verified nurse supervisor capacity in North District: 3 open spots.",
      ],
    },
    {
      id: "INC-1079",
      orgId: "org_kavik_metro",
      title: "Missed emergency callback after weekend discharge",
      category: "missed_call",
      priority: "high",
      score: 78,
      status: "in_progress",
      customerName: "Thomas Sterling",
      customerPhone: "(555) 789-0123",
      description: "Missed call from patient contact at 06:45 AM. Left voicemail regarding prescription refills.",
      whyFlagged: "2 missed attempts within 45 minutes; pharmacy authorization cutoff is 1:00 PM.",
      suggestedAction: "Initiate callback and link with on-duty clinical nurse.",
      source: "phone_sms",
      slaMinutesRemaining: 45,
      dealValue: 2400,
      assignedTo: "Sarah Jenkins (Ops)",
      createdAt: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      aurixLog: [
        "06:46: Voicemail recording captured and transcribed.",
        "06:50: Auto-SMS sent: 'We received your message and Sarah is reviewing urgently.'",
        "07:15: Status transitioned to In Progress.",
      ],
    },
    {
      id: "INC-1078",
      orgId: "org_kavik_metro",
      title: "Overdue care plan re-certification follow-up",
      category: "overdue_followup",
      priority: "medium",
      score: 62,
      status: "waiting",
      customerName: "Beatrice Morales",
      customerPhone: "(555) 678-9012",
      customerEmail: "bmorales@example.com",
      description: "Medicare Advantage 60-day authorization documentation pending physician signature.",
      whyFlagged: "Authorization expires in 72 hours; risk of claim denial.",
      suggestedAction: "Resend electronic DocuSign link to Dr. Sterling's clinic.",
      source: "crm",
      slaMinutesRemaining: 180,
      dealValue: 5600,
      assignedTo: "Alex Rivera (Compliance)",
      createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      aurixLog: [
        "06:00: Daily compliance sweep matched expiry window < 3 days.",
        "06:05: Automated reminder dispatched to primary care fax/e-portal.",
        "07:30: Patient daughter notified of pending paperwork.",
      ],
    },
    {
      id: "INC-1075",
      orgId: "org_kavik_metro",
      title: "Routine shift swap request between caregivers",
      category: "scheduling_conflict",
      priority: "low",
      score: 35,
      status: "resolved",
      customerName: "Franklin Ross",
      caregiverName: "Samira Patel ↔ James Cole",
      description: "Mutual consent shift exchange for Thursday evening shift.",
      whyFlagged: "Automated qualification check passed with zero overtime penalty.",
      suggestedAction: "Auto-approved by Aurix Autonomous Rules Engine.",
      source: "scheduling",
      slaMinutesRemaining: 600,
      dealValue: 1200,
      assignedTo: "Aurix Autonomous",
      createdAt: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 200 * 60 * 1000).toISOString(),
      aurixLog: [
        "05:12: Swap request submitted by Samira Patel via mobile app.",
        "05:13: Verified James Cole has active CPR, Dementia cert, and within 40hr/wk cap.",
        "05:14: Client Franklin Ross auto-notified with photo of replacement caregiver.",
        "05:15: Auto-resolved without requiring Sarah's manual intervention.",
      ],
    },
  ],
  "org_aurix_valley": [
    {
      id: "INC-VAL-101",
      orgId: "org_aurix_valley",
      title: "Valley Hospice shift handover verification",
      category: "scheduling_conflict",
      priority: "high",
      score: 85,
      status: "needs_action",
      customerName: "Geraldine Vance",
      customerPhone: "(555) 777-1234",
      caregiverName: "David Chen, LPN",
      description: "Shift handoff between evening LPN and night shift.",
      whyFlagged: "Palliative care protocol verification pending.",
      suggestedAction: "Confirm medication protocol with supervising physician.",
      source: "scheduling",
      slaMinutesRemaining: 30,
      dealValue: 6400,
      assignedTo: "David Chen (Valley Care)",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aurixLog: ["Valley Care internal audit initialized."],
    },
  ],
  "org_bay_rehab": [
    {
      id: "INC-BAY-201",
      orgId: "org_bay_rehab",
      title: "Post-Acute stroke physical therapy intake",
      category: "new_lead",
      priority: "critical",
      score: 92,
      status: "needs_action",
      customerName: "Jonathan Archer",
      customerPhone: "(555) 888-4321",
      description: "Bay Area Post-Acute physical therapy intake referral.",
      whyFlagged: "Immediate hospital discharge requested for today.",
      suggestedAction: "Confirm intake slot with lead PT clinician.",
      source: "crm",
      slaMinutesRemaining: 15,
      dealValue: 11200,
      assignedTo: "Amanda Torres (Bay Post-Acute)",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aurixLog: ["Bay Area Post-Acute intake protocol active."],
    },
  ],
};

export const TENANT_LEADS: TenantStore<LeadRecord> = {
  "org_kavik_metro": [
    {
      id: "LEAD-201",
      orgId: "org_kavik_metro",
      name: "Eleanor Vance",
      phone: "(555) 234-5678",
      email: "evance.family@example.com",
      leadSource: "Hospital Referral",
      status: "Appointment",
      lastContact: "12 mins ago",
      nextFollowUp: "Tomorrow, 10:00 AM",
      assignedUser: "Sarah Jenkins (Ops)",
      estimatedValue: 9400,
      tags: ["Post-Stroke Rehab", "Skilled RN", "Urgent"],
      notes: ["Discharge nurse at St. Jude recommended 4x/wk RN visits. Daughter confirmed time."],
      careNeed: "24/7 Companion & Wound Care Dressing",
      createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    },
    {
      id: "LEAD-202",
      orgId: "org_kavik_metro",
      name: "Thomas Sterling",
      phone: "(555) 789-0123",
      email: "tsterling@business.org",
      leadSource: "Inbound Call",
      status: "Contacted",
      lastContact: "24 mins ago",
      nextFollowUp: "Today, 2:30 PM",
      assignedUser: "Alex Rivera",
      estimatedValue: 6200,
      tags: ["Medicare Part C", "Physical Therapy"],
      notes: ["Called regarding post-knee surgery mobility rehabilitation."],
      careNeed: "In-home PT 3x weekly",
      createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    },
    {
      id: "LEAD-203",
      orgId: "org_kavik_metro",
      name: "Clara Higgins",
      phone: "(555) 456-7890",
      email: "clara.h@gmail.com",
      leadSource: "Doctor Office",
      status: "Won",
      lastContact: "45 mins ago",
      nextFollowUp: "Weekly Check-in",
      assignedUser: "Sarah Jenkins (Ops)",
      estimatedValue: 14000,
      tags: ["Dementia Care", "VIP Client", "Private Pay"],
      notes: ["Care contract executed for 6-month specialized memory support."],
      careNeed: "Memory Care Aide 7 days/wk",
      createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    },
    {
      id: "LEAD-204",
      orgId: "org_kavik_metro",
      name: "Robert Chen",
      phone: "(555) 890-1234",
      email: "rchen.arch@chenpartners.com",
      leadSource: "Web Form",
      status: "Qualified",
      lastContact: "1 hour ago",
      nextFollowUp: "Today, 4:00 PM",
      assignedUser: "David Kim (Intake)",
      estimatedValue: 8800,
      tags: ["Respite Care", "Weekend"],
      notes: ["Needs respite relief for aging father on weekends."],
      careNeed: "Weekend 12-hr CNA shifts",
      createdAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    },
    {
      id: "LEAD-205",
      orgId: "org_kavik_metro",
      name: "Beatrice Morales",
      phone: "(555) 678-9012",
      email: "bmorales@example.com",
      leadSource: "Physician Portal",
      status: "New",
      lastContact: "2 hours ago",
      nextFollowUp: "Today, 1:00 PM",
      assignedUser: "Unassigned (AI Queue)",
      estimatedValue: 5600,
      tags: ["Medicaid Waiver", "ADL Assistance"],
      notes: ["Physician e-referral received. Intake paperwork pending review."],
      careNeed: "Bathing, dressing, meal prep assistance",
      createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    },
    {
      id: "LEAD-206",
      orgId: "org_kavik_metro",
      name: "Franklin Ross",
      phone: "(555) 345-6789",
      email: "franklin.ross@verizon.net",
      leadSource: "Google Search",
      status: "Contacted",
      lastContact: "Yesterday",
      nextFollowUp: "In 2 days",
      assignedUser: "Sarah Jenkins (Ops)",
      estimatedValue: 4500,
      tags: ["Fall Risk", "Mobility Aide"],
      notes: ["Discussed safety assessment with client's son."],
      careNeed: "Fall prevention companion care",
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    },
    {
      id: "LEAD-207",
      orgId: "org_kavik_metro",
      name: "Evelyn Wright",
      phone: "(555) 912-3456",
      email: "ewright1942@gmail.com",
      leadSource: "Hospital Referral",
      status: "Lost",
      lastContact: "3 days ago",
      nextFollowUp: "Archived",
      assignedUser: "Alex Rivera",
      estimatedValue: 3200,
      tags: ["Distance Out of Zone"],
      notes: ["Client relocated outside active county dispatch radius."],
      careNeed: "Skilled Nursing",
      createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    },
  ],
  "org_aurix_valley": [
    {
      id: "LEAD-VAL-301",
      orgId: "org_aurix_valley",
      name: "Harold Washington",
      phone: "(555) 777-9911",
      email: "hwash@valleycare.com",
      leadSource: "Hospital Referral",
      status: "Qualified",
      lastContact: "3 hours ago",
      nextFollowUp: "Tomorrow, 2:00 PM",
      assignedUser: "David Chen (Valley Care)",
      estimatedValue: 8400,
      tags: ["Valley Hospice"],
      notes: ["Valley referral protocol."],
      createdAt: new Date().toISOString(),
    },
  ],
  "org_bay_rehab": [
    {
      id: "LEAD-BAY-401",
      orgId: "org_bay_rehab",
      name: "Theresa Palmer",
      phone: "(555) 888-2233",
      email: "tpalmer@bayrehab.org",
      leadSource: "Doctor Office",
      status: "Appointment",
      lastContact: "1 hour ago",
      nextFollowUp: "Thursday, 10:00 AM",
      assignedUser: "Amanda Torres (Bay Post-Acute)",
      estimatedValue: 12500,
      tags: ["Bay Post-Acute"],
      notes: ["Post-surgical rehab protocol."],
      createdAt: new Date().toISOString(),
    },
  ],
};

export const TENANT_CONVERSATIONS: TenantStore<ConversationRecord> = {
  "org_kavik_metro": [
    {
      id: "CONV-301",
      orgId: "org_kavik_metro",
      leadId: "LEAD-201",
      contactName: "Eleanor Vance (Daughter: Karen)",
      contactPhone: "(555) 234-5678",
      contactEmail: "evance.family@example.com",
      type: "ai_chat",
      status: "ai_handled",
      lastMessage: "Confirmed! We have scheduled Nurse Samira for the 10:00 AM assessment tomorrow.",
      lastTimestamp: "12 mins ago",
      unread: false,
      hasRecording: false,
      messages: [
        { id: "m-1", sender: "lead", senderName: "Karen Vance", text: "Hi, my mother was discharged from St. Jude today. Do you have nurses certified in diabetic wound care?", timestamp: "18 mins ago" },
        { id: "m-2", sender: "ai_agent", senderName: "Kavik Clinical AI Agent", text: "Hello Karen. Yes, our Registered Nurses (RNs) are fully certified in complex wound management and diabetic care plans. Would you like to book an in-home intake assessment tomorrow morning?", timestamp: "15 mins ago" },
        { id: "m-3", sender: "lead", senderName: "Karen Vance", text: "Yes please, around 10am would be perfect.", timestamp: "13 mins ago" },
        { id: "m-4", sender: "ai_agent", senderName: "Kavik Clinical AI Agent", text: "Confirmed! We have scheduled Nurse Samira for the 10:00 AM assessment tomorrow. A confirmation text with her bio has been dispatched.", timestamp: "12 mins ago" },
      ],
    },
    {
      id: "CONV-302",
      orgId: "org_kavik_metro",
      leadId: "LEAD-202",
      contactName: "Thomas Sterling",
      contactPhone: "(555) 789-0123",
      contactEmail: "tsterling@business.org",
      type: "sms",
      status: "waiting_response",
      lastMessage: "Do you accept Medicare Advantage Part C for in-home physical therapy?",
      lastTimestamp: "24 mins ago",
      unread: true,
      hasRecording: false,
      messages: [
        { id: "m-5", sender: "ai_agent", senderName: "Kavik AI Agent", text: "Hello Thomas, thank you for contacting Kavik Home Health. How may we assist your family today?", timestamp: "30 mins ago" },
        { id: "m-6", sender: "lead", senderName: "Thomas Sterling", text: "Do you accept Medicare Advantage Part C for in-home physical therapy?", timestamp: "24 mins ago" },
      ],
    },
    {
      id: "CONV-303",
      orgId: "org_kavik_metro",
      leadId: "LEAD-205",
      contactName: "Beatrice Morales",
      contactPhone: "(555) 678-9012",
      type: "call",
      status: "active",
      lastMessage: "Voicemail transcribed: Physician prescription authorization documentation inquiry.",
      lastTimestamp: "1 hour ago",
      unread: false,
      hasRecording: true,
      recordingDurationSeconds: 78,
      transcriptSnippet: "Hello, this is Dr. Sterling's office calling on behalf of Beatrice Morales. We need to confirm the 60-day home health re-certification documentation...",
      fullTranscript: "[00:00] Inbound Call connected.\n[00:05] Caller: 'Hello, this is Dr. Sterling's clinic calling regarding patient Beatrice Morales. We need to confirm the 60-day home health re-certification documentation is queued before the 1:00 PM cutoff.'\n[00:30] AI Voice Assistant: 'Thank you Dr. Sterling's clinic. I have verified Beatrice Morales' file and tagged Sarah Jenkins on the coordinator desk to execute the digital sign-off.'\n[00:55] Caller: 'Excellent, thank you for the prompt turnaround.'\n[01:18] Call ended gracefully.",
      messages: [
        { id: "m-7", sender: "lead", senderName: "Dr. Sterling Clinic", text: "Inbound call regarding 60-day re-certification authorization.", timestamp: "1 hour ago" },
        { id: "m-8", sender: "ai_agent", senderName: "AI Voice Agent", text: "Call handled autonomously. Document verification dispatched to coordinator queue.", timestamp: "58 mins ago" },
      ],
    },
    {
      id: "CONV-304",
      orgId: "org_kavik_metro",
      leadId: "LEAD-204",
      contactName: "Robert Chen",
      contactPhone: "(555) 890-1234",
      type: "missed_call",
      status: "ai_handled",
      lastMessage: "Missed call caught. AI triggered auto-SMS: 'Hi Robert, we noticed you called! How can Kavik Care assist?'",
      lastTimestamp: "1 hour ago",
      unread: false,
      hasRecording: true,
      recordingDurationSeconds: 22,
      transcriptSnippet: "Missed call at 08:14 AM. Left brief tone without speaking.",
      messages: [
        { id: "m-9", sender: "lead", senderName: "Robert Chen", text: "[Missed Inbound Call - 22s duration]", timestamp: "1 hour ago" },
        { id: "m-10", sender: "ai_agent", senderName: "Kavik Auto-SMS Agent", text: "Hi Robert, we noticed we just missed your call! This is Kavik Home Health. Would you prefer a quick callback or to chat right here via text?", timestamp: "59 mins ago" },
        { id: "m-11", sender: "lead", senderName: "Robert Chen", text: "Text is great, looking for weekend respite care for my dad.", timestamp: "55 mins ago" },
      ],
    },
  ],
  "org_aurix_valley": [
    {
      id: "CONV-VAL-501",
      orgId: "org_aurix_valley",
      leadId: "LEAD-VAL-301",
      contactName: "Harold Washington",
      contactPhone: "(555) 777-9911",
      type: "sms",
      status: "active",
      lastMessage: "Confirmed intake time for tomorrow at 2 PM.",
      lastTimestamp: "1 hour ago",
      unread: false,
      messages: [
        { id: "mv-1", sender: "lead", senderName: "Harold Washington", text: "Valley Care hospice inquiry.", timestamp: "2 hours ago" },
      ],
    },
  ],
  "org_bay_rehab": [
    {
      id: "CONV-BAY-601",
      orgId: "org_bay_rehab",
      leadId: "LEAD-BAY-401",
      contactName: "Theresa Palmer",
      contactPhone: "(555) 888-2233",
      type: "call",
      status: "active",
      lastMessage: "Physical therapy schedule confirmed.",
      lastTimestamp: "45 mins ago",
      unread: false,
      messages: [
        { id: "mb-1", sender: "lead", senderName: "Theresa Palmer", text: "Requesting schedule confirmation.", timestamp: "50 mins ago" },
      ],
    },
  ],
};

export const TENANT_FOLLOWUPS: TenantStore<FollowUpRecord> = {
  "org_kavik_metro": [
    {
      id: "FU-101",
      orgId: "org_kavik_metro",
      leadId: "LEAD-202",
      leadName: "Thomas Sterling",
      phone: "(555) 789-0123",
      urgency: "due_today",
      actionRequired: "Call this lead back",
      dueDate: "Today, 2:30 PM",
      assignedTo: "Sarah Jenkins (Ops)",
      aiSuggestedPrompt: "Review Medicare Advantage approval and offer Tuesday 2 PM physical therapy intake slot.",
      status: "pending",
      dealValue: 6200,
      lastInteraction: "Inbound call 24 mins ago regarding physical therapy coverage",
    },
    {
      id: "FU-102",
      orgId: "org_kavik_metro",
      leadId: "LEAD-205",
      leadName: "Beatrice Morales",
      phone: "(555) 678-9012",
      urgency: "due_today",
      actionRequired: "Send a text tomorrow",
      dueDate: "Today, 4:00 PM",
      assignedTo: "Alex Rivera",
      aiSuggestedPrompt: "Send SMS confirmation of DocuSign receipt from Dr. Sterling's clinic.",
      status: "pending",
      dealValue: 5600,
      lastInteraction: "Clinic called with prescription approval at 8:00 AM",
    },
    {
      id: "FU-103",
      orgId: "org_kavik_metro",
      leadId: "LEAD-204",
      leadName: "Robert Chen",
      phone: "(555) 890-1234",
      urgency: "due_today",
      actionRequired: "Call this lead back",
      dueDate: "Today, 5:00 PM",
      assignedTo: "David Kim",
      aiSuggestedPrompt: "Confirm weekend respite care schedule and introduce aide Marcus Brody.",
      status: "pending",
      dealValue: 8800,
      lastInteraction: "Texted interest in 12-hr Saturday CNA shift",
    },
    {
      id: "FU-104",
      orgId: "org_kavik_metro",
      leadId: "LEAD-208",
      leadName: "Arthur Pendelton",
      phone: "(555) 321-7654",
      urgency: "due_today",
      actionRequired: "Try again in 3 days",
      dueDate: "Today, 3:15 PM",
      assignedTo: "Sarah Jenkins (Ops)",
      aiSuggestedPrompt: "Check if post-operative discharge date was confirmed by orthopedic surgeon.",
      status: "pending",
      dealValue: 7100,
      lastInteraction: "Left voicemail 2 days ago",
    },
    {
      id: "FU-201",
      orgId: "org_kavik_metro",
      leadId: "LEAD-209",
      leadName: "Martha Washington-Cole",
      phone: "(555) 555-0199",
      urgency: "overdue",
      actionRequired: "Call this lead back",
      dueDate: "Yesterday, 11:00 AM",
      assignedTo: "Alex Rivera",
      aiSuggestedPrompt: "Immediate callback: Daughter expressed concern over caregiver weekend coverage.",
      status: "pending",
      dealValue: 12500,
      lastInteraction: "Urgent inquiry logged 26 hours ago",
    },
    {
      id: "FU-202",
      orgId: "org_kavik_metro",
      leadId: "LEAD-210",
      leadName: "Harold Finch",
      phone: "(555) 444-2211",
      urgency: "overdue",
      actionRequired: "Follow up after appointment",
      dueDate: "Yesterday, 3:00 PM",
      assignedTo: "Sarah Jenkins (Ops)",
      aiSuggestedPrompt: "Review post-assessment notes from RN Samira Patel and present customized plan.",
      status: "pending",
      dealValue: 9800,
      lastInteraction: "In-home nurse assessment completed yesterday morning",
    },
    {
      id: "FU-301",
      orgId: "org_kavik_metro",
      leadId: "LEAD-201",
      leadName: "Eleanor Vance",
      phone: "(555) 234-5678",
      urgency: "scheduled",
      actionRequired: "Follow up after appointment",
      dueDate: "Tomorrow, 11:30 AM",
      assignedTo: "Sarah Jenkins (Ops)",
      aiSuggestedPrompt: "Gather nurse assessment scoring (OASIS-E) and send service agreement to daughter Karen.",
      status: "pending",
      dealValue: 9400,
      lastInteraction: "Appointment booked for Tomorrow 10:00 AM",
    },
    {
      id: "FU-302",
      orgId: "org_kavik_metro",
      leadId: "LEAD-206",
      leadName: "Franklin Ross",
      phone: "(555) 345-6789",
      urgency: "scheduled",
      actionRequired: "Send a text tomorrow",
      dueDate: "In 2 days, 10:00 AM",
      assignedTo: "Sarah Jenkins (Ops)",
      aiSuggestedPrompt: "Send SMS with verified CNA credentials & introduce caregiver James Cole.",
      status: "pending",
      dealValue: 4500,
      lastInteraction: "Shift swap completed yesterday",
    },
    {
      id: "FU-401",
      orgId: "org_kavik_metro",
      leadId: "LEAD-203",
      leadName: "Clara Higgins",
      phone: "(555) 456-7890",
      urgency: "completed",
      actionRequired: "Care plan signed & verified",
      dueDate: "Today, 9:00 AM",
      assignedTo: "Aurix AI Engine",
      aiSuggestedPrompt: "Automated onboarding packet dispatched & verified with primary caregiver.",
      status: "completed",
      dealValue: 14000,
      lastInteraction: "Won lead signed contract at 8:45 AM",
    },
  ],
  "org_aurix_valley": [
    {
      id: "FU-VAL-701",
      orgId: "org_aurix_valley",
      leadId: "LEAD-VAL-301",
      leadName: "Harold Washington",
      phone: "(555) 777-9911",
      urgency: "due_today",
      actionRequired: "Valley intake phone follow up",
      dueDate: "Today, 5:00 PM",
      assignedTo: "David Chen (Valley Care)",
      aiSuggestedPrompt: "Confirm palliative physician notes.",
      status: "pending",
      dealValue: 8400,
      lastInteraction: "Intake form submitted",
    },
  ],
  "org_bay_rehab": [
    {
      id: "FU-BAY-801",
      orgId: "org_bay_rehab",
      leadId: "LEAD-BAY-401",
      leadName: "Theresa Palmer",
      phone: "(555) 888-2233",
      urgency: "scheduled",
      actionRequired: "Verify PT prescription",
      dueDate: "Tomorrow, 9:00 AM",
      assignedTo: "Amanda Torres (Bay Post-Acute)",
      aiSuggestedPrompt: "Re-confirm physical therapist arrival window.",
      status: "pending",
      dealValue: 12500,
      lastInteraction: "Initial assessment scheduled",
    },
  ],
};

export const TENANT_AI_AGENTS: TenantStore<AIAgentRecord> = {
  "org_kavik_metro": [
    {
      id: "agent-phone",
      orgId: "org_kavik_metro",
      name: "Aura Clinical Voice Dispatcher",
      roleDescription: "Answers inbound phone calls 24/7, conducts hospital discharge intake, triages emergencies, and schedules home nurse visits.",
      section: "AI Phone Agent",
      status: "Active",
      tasksCompleted: 1248,
      successRate: 87,
      lastActivity: "4 minutes ago",
      modelUsed: "Gemini 3.8 Flash Speech",
      autonomousActionsAllowed: true,
      capabilities: [
        "Natural conversational voice triage",
        "Instant voicemail transcript & clinical keyword extraction",
        "After-hours hospital referral intake",
        "Direct live-agent warm transfer for acute emergencies",
      ],
      recentEventLog: [
        "08:31: Handled inquiry from St. Jude Discharge Planner for patient Eleanor Vance",
        "08:14: Instantaneous auto-callback triggered for missed call from Robert Chen",
        "07:45: Verified nurse supervisor capacity in North District (3 open slots)",
      ],
    },
    {
      id: "agent-sms",
      orgId: "org_kavik_metro",
      name: "Pulse Patient & Family SMS Agent",
      roleDescription: "Instantaneously engages inbound lead SMS inquiries, answers caregiver credential questions, and sends automated reminder links.",
      section: "AI SMS Agent",
      status: "Active",
      tasksCompleted: 2890,
      successRate: 94,
      lastActivity: "2 minutes ago",
      modelUsed: "Gemini 3.8 Flash",
      autonomousActionsAllowed: true,
      capabilities: [
        "Sub-30-second lead response time",
        "Care plan & pricing brochure dispatch",
        "Caregiver photo & bio introductions to clients",
        "Multi-channel SMS verification for shift arrivals",
      ],
      recentEventLog: [
        "08:33: Dispatched nurse bio & arrival window to Karen Vance",
        "08:20: Sent DocuSign link for 60-day authorization re-certification",
        "07:50: Auto-replied to insurance eligibility inquiry via SMS",
      ],
    },
    {
      id: "agent-followup",
      orgId: "org_kavik_metro",
      name: "Cadence Lead Follow-Up Engine",
      roleDescription: "Monitors lead aging, triggers automated multi-touch sequences, and re-engages dormant hospital inquiries.",
      section: "Lead Follow-Up Agent",
      status: "Active",
      tasksCompleted: 840,
      successRate: 82,
      lastActivity: "9 minutes ago",
      modelUsed: "Aurix Rules Engine + Gemini Flash",
      autonomousActionsAllowed: true,
      capabilities: [
        "Dynamic cadence timing (Day 1, 3, 7, 14)",
        "Loss prevention detection for stalled care plans",
        "Physician clinic re-certification chase logic",
        "Auto-snooze and reassignment based on coordinator capacity",
      ],
      recentEventLog: [
        "08:25: Flagged 6 overdue follow-ups for coordinator Sarah Jenkins",
        "08:00: Sent 72-hour reminder to Dr. Sterling's clinic for signature",
        "07:15: Rescheduled lead touchpoint for Franklin Ross",
      ],
    },
    {
      id: "agent-appointment",
      orgId: "org_kavik_metro",
      name: "Scheduler Care Assessment Agent",
      roleDescription: "Books in-home nurse assessments, matches caregiver competencies to patient clinical needs, and checks real-time road travel times.",
      section: "Appointment Agent",
      status: "Active",
      tasksCompleted: 432,
      successRate: 96,
      lastActivity: "12 minutes ago",
      modelUsed: "Gemini 3.8 Flash + Geo Route Solver",
      autonomousActionsAllowed: true,
      capabilities: [
        "Travel-time optimized caregiver scheduling",
        "Clinical match: RN vs LPN vs CNA certification",
        "Automatic calendar invite dispatch to family & clinician",
        "Real-time cancellation backfill",
      ],
      recentEventLog: [
        "08:22: Booked initial in-home assessment for Eleanor Vance with Nurse Samira",
        "07:30: Optimized Thursday nurse driving route (saved 34 mins travel time)",
        "06:45: Replaced caregiver on morning shift within 4 minutes",
      ],
    },
    {
      id: "agent-review",
      orgId: "org_kavik_metro",
      name: "Compassion Review & Feedback Agent",
      roleDescription: "Collects patient and family satisfaction surveys post-visit, flags clinical dissatisfaction, and drives Google 5-star reviews.",
      section: "Review/Feedback Agent",
      status: "Active",
      tasksCompleted: 615,
      successRate: 91,
      lastActivity: "18 minutes ago",
      modelUsed: "Gemini 3.8 Flash",
      autonomousActionsAllowed: true,
      capabilities: [
        "Post-visit NPS survey dispatch via SMS",
        "Negative sentiment auto-escalation to Director of Nursing",
        "Automated Google Business review requests for 5-star promoters",
        "Caregiver recognition badges based on family compliments",
      ],
      recentEventLog: [
        "08:15: Captured 5-star rating from Higgins family for Aide James Cole",
        "Yesterday: Escalated medication delivery delay to pharmacy liaison",
      ],
    },
    {
      id: "agent-reporting",
      orgId: "org_kavik_metro",
      name: "Atlas Executive Reporting Agent",
      roleDescription: "Aggregates billing telemetry, EVV compliance audit reports, payer revenue forecasting, and daily executive morning digests.",
      section: "Reporting Agent",
      status: "Active",
      tasksCompleted: 310,
      successRate: 99,
      lastActivity: "1 hour ago",
      modelUsed: "Gemini 3.8 Flash Analytical",
      autonomousActionsAllowed: false,
      capabilities: [
        "Real-time EVV state audit packet generation",
        "MRR, ARPU, and conversion funnel variance analysis",
        "Missed visit liability forecasting",
        "Automated CSV snapshot export",
      ],
      recentEventLog: [
        "08:00: Compiled daily 8:00 AM Executive Performance Digest",
        "07:00: Reconciled EVV clock-in records against 21st Century Cures Act rulebook",
        "06:00: Generated monthly MRR cohort expansion breakdown",
      ],
    },
  ],
  "org_aurix_valley": [
    {
      id: "agent-val-phone",
      orgId: "org_aurix_valley",
      name: "Valley Care Voice Agent",
      roleDescription: "Valley senior care hotline and triage dispatcher.",
      section: "AI Phone Agent",
      status: "Active",
      tasksCompleted: 210,
      successRate: 92,
      lastActivity: "10 minutes ago",
      modelUsed: "Gemini 3.8 Flash Speech",
      autonomousActionsAllowed: true,
      capabilities: ["Senior hotline routing"],
      recentEventLog: ["Valley hotline operational"],
    },
  ],
  "org_bay_rehab": [
    {
      id: "agent-bay-sched",
      orgId: "org_bay_rehab",
      name: "Bay Post-Acute Scheduler",
      roleDescription: "Post-acute clinic PT/OT scheduler.",
      section: "Appointment Agent",
      status: "Active",
      tasksCompleted: 145,
      successRate: 95,
      lastActivity: "25 minutes ago",
      modelUsed: "Gemini 3.8 Flash",
      autonomousActionsAllowed: true,
      capabilities: ["Post-acute scheduling"],
      recentEventLog: ["Bay rehab schedule synchronized"],
    },
  ],
};

// Helper getter functions ensuring multi-tenant isolation
export function getIncidentsForOrg(orgId: string): IncidentRecord[] {
  if (!TENANT_INCIDENTS[orgId]) {
    TENANT_INCIDENTS[orgId] = [];
  }
  return TENANT_INCIDENTS[orgId];
}

export function getLeadsForOrg(orgId: string): LeadRecord[] {
  if (!TENANT_LEADS[orgId]) {
    TENANT_LEADS[orgId] = [];
  }
  return TENANT_LEADS[orgId];
}

export function getConversationsForOrg(orgId: string): ConversationRecord[] {
  if (!TENANT_CONVERSATIONS[orgId]) {
    TENANT_CONVERSATIONS[orgId] = [];
  }
  return TENANT_CONVERSATIONS[orgId];
}

export function getFollowUpsForOrg(orgId: string): FollowUpRecord[] {
  if (!TENANT_FOLLOWUPS[orgId]) {
    TENANT_FOLLOWUPS[orgId] = [];
  }
  return TENANT_FOLLOWUPS[orgId];
}

export function getAIAgentsForOrg(orgId: string): AIAgentRecord[] {
  if (!TENANT_AI_AGENTS[orgId]) {
    TENANT_AI_AGENTS[orgId] = [];
  }
  return TENANT_AI_AGENTS[orgId];
}
