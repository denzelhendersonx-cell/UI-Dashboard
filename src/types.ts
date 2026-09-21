export type IncidentCategory = 
  | 'new_lead' 
  | 'missed_call' 
  | 'overdue_followup' 
  | 'scheduling_conflict' 
  | 'caregiver_noshow';

export type IncidentPriority = 'critical' | 'high' | 'medium' | 'low';

export type IncidentStatus = 'needs_action' | 'in_progress' | 'waiting' | 'resolved';

export type IncidentSource = 'phone_sms' | 'crm' | 'calendar' | 'email' | 'scheduling';

export type UserRole = 'admin' | 'coordinator' | 'manager' | 'viewer';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  team: string;
}

export interface Incident {
  id: string;
  title: string;
  category: IncidentCategory;
  priority: IncidentPriority;
  score: number; // 0-100 urgency score
  status: IncidentStatus;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  caregiverName?: string;
  caregiverPhone?: string;
  description: string;
  whyFlagged: string;
  suggestedAction: string;
  source: IncidentSource;
  slaMinutesRemaining: number; // negative means breached
  dealValue?: number;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
  aurixLog: string[]; // Autonomous triage history
}

export interface BusinessMetrics {
  mrr: {
    current: number;
    previous: number;
    growthPercent: number;
    target: number;
    netNewMRR: number;
    breakdown: {
      newCustomerMRR: number;
      expansionMRR: number;
      churnMRR: number;
    };
    history: {
      month: string;
      mrr: number;
      newMRR: number;
      expansionMRR: number;
      churnMRR: number;
      netMRR: number;
    }[];
  };
  arpu: {
    current: number; // Average Revenue Per User / APPU
    previous: number;
    growthPercent: number;
    cohortByTier: {
      tier: string;
      arpu: number;
      userCount: number;
      sharePercent: number;
    }[];
  };
  freeToPaidConversion: {
    ratePercent: number;
    previousRatePercent: number;
    changePercent: number;
    avgDaysToConvert: number;
    freeTrialActiveCount: number;
    paidConversionsThisMonth: number;
    cohorts: {
      month: string;
      trials: number;
      conversions: number;
      rate: number;
    }[];
  };
  failedDictations: {
    totalDictations: number;
    failedCount: number;
    failureRatePercent: number;
    recoveredCount: number;
    recoveryRatePercent: number;
    trendPercent: number;
    errorBreakdown: {
      reason: string;
      count: number;
      percentage: number;
      severity: 'low' | 'medium' | 'high';
      color: string;
    }[];
    recentFailures: {
      id: string;
      caregiverName: string;
      clientName: string;
      timestamp: string;
      durationSeconds: number;
      failureReason: string;
      status: 'pending_retry' | 'auto_recovered' | 'manual_review';
      confidence: number;
      audioQualityDb: number;
      snippet: string;
    }[];
  };
  conversionFunnel: {
    stages: {
      id: string;
      name: string;
      count: number;
      conversionRate: number; // % of top of funnel
      stepDropoffRate: number; // % lost from previous step
      avgDuration: string;
      description: string;
      color: string;
    }[];
    topDropoffFactor: string;
    overallConversionRate: number;
  };
  homeHealthCare: {
    activeCarePlans: number;
    evvCompliancePercent: number; // Electronic Visit Verification
    evvStatus: 'compliant' | 'warning' | 'audit_risk';
    caregiverUtilizationRate: number; // % active billing hours
    missedVisitsRatePercent: number;
    medicationAdherenceRatePercent: number;
    avgOasisDocumentationTimeHours: number; // OASIS-E intake time in hours
    medicarePrivatePayRatio: {
      medicareAdvantagePercent: number;
      medicaidWaiverPercent: number;
      privatePayPercent: number;
      veteransAffairsPercent: number;
    };
    fieldCaregiverCount: {
      rnLpn: number;
      cnaHha: number;
      physicalTherapy: number;
      onCallStandby: number;
    };
  };
}

export interface DashboardMetrics {
  needsAttentionCount: number;
  criticalSlaBreaches: number;
  inProgressCount: number;
  resolvedTodayCount: number;
  aurixAutomatedResolutions: number;
  avgTriageTimeMinutes: number;
  totalDealValueAtRisk: number;
  throughputHistory: {
    time: string;
    incoming: number;
    resolved: number;
    automated: number;
  }[];
  categoryDistribution: {
    category: IncidentCategory;
    label: string;
    count: number;
    color: string;
  }[];
  business?: BusinessMetrics;
}

// ----------------------------------------------------
// 1. Overview Command Center Types
// ----------------------------------------------------
export interface OverviewMetrics {
  timeframe?: "7d" | "30d" | "90d";
  leadsThisMonth: number;
  newLeadsToday: number;
  appointmentsBooked: number;
  followUpsDue: number;
  conversionRate: number; // e.g. 24.8%
  revenueEstimated: number; // e.g. $148,650
  aiActivityCount: number; // e.g. 1,420 automated actions
  missedCalls: number;
  recentActivity: {
    id: string;
    type: 'call' | 'sms' | 'appointment' | 'lead_won' | 'ai_action';
    title: string;
    description: string;
    timestamp: string;
    badge?: string;
  }[];
  performanceChart: {
    period: string;
    leads: number;
    appointments: number;
    won: number;
    revenue: number;
  }[];
}

// ----------------------------------------------------
// 2. CRM Leads Types
// ----------------------------------------------------
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Appointment' | 'Won' | 'Lost';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  leadSource: 'Web Form' | 'Inbound Call' | 'Hospital Referral' | 'Doctor Office' | 'Google Search' | 'Physician Portal';
  status: LeadStatus;
  lastContact: string;
  nextFollowUp: string;
  assignedUser: string;
  estimatedValue: number;
  tags: string[];
  notes: string[];
  careNeed?: string;
  createdAt: string;
}

// ----------------------------------------------------
// 3. Conversations Inbox Types
// ----------------------------------------------------
export type ConversationType = 'sms' | 'ai_chat' | 'call' | 'missed_call';

export interface MessageBubble {
  id: string;
  sender: 'lead' | 'ai_agent' | 'human_coordinator';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  leadId: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  type: ConversationType;
  status: 'active' | 'waiting_response' | 'ai_handled' | 'closed';
  lastMessage: string;
  lastTimestamp: string;
  unread: boolean;
  hasRecording?: boolean;
  recordingDurationSeconds?: number;
  transcriptSnippet?: string;
  fullTranscript?: string;
  messages: MessageBubble[];
}

// ----------------------------------------------------
// 4. Follow-Ups Workflow Types
// ----------------------------------------------------
export type FollowUpUrgency = 'due_today' | 'overdue' | 'scheduled' | 'completed';

export interface FollowUpItem {
  id: string;
  leadId: string;
  leadName: string;
  phone: string;
  urgency: FollowUpUrgency;
  actionRequired: string; // e.g. "Call this lead back", "Send text tomorrow", "Follow up after appointment", "Try again in 3 days"
  dueDate: string;
  assignedTo: string;
  aiSuggestedPrompt: string;
  status: 'pending' | 'completed' | 'ai_dispatched';
  dealValue: number;
  lastInteraction: string;
}

// ----------------------------------------------------
// 5. AI Agents Automation Types
// ----------------------------------------------------
export interface AIAgentConfig {
  id: string;
  name: string;
  roleDescription: string;
  section: 'AI Phone Agent' | 'AI SMS Agent' | 'Lead Follow-Up Agent' | 'Appointment Agent' | 'Review/Feedback Agent' | 'Reporting Agent';
  status: 'Active' | 'Paused';
  tasksCompleted: number;
  successRate: number; // e.g. 87%
  lastActivity: string; // e.g. "4 minutes ago"
  modelUsed: string;
  autonomousActionsAllowed: boolean;
  capabilities: string[];
  recentEventLog: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  incidentId: string;
  action: string;
  performedBy: string;
  role: UserRole;
  details: string;
}

export interface IncidentFilterOptions {
  search: string;
  category?: IncidentCategory | 'all';
  priority?: IncidentPriority | 'all';
  status?: IncidentStatus | 'all';
  source?: IncidentSource | 'all';
  onlyBreachedSla?: boolean;
}
