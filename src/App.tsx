import React, { useState } from "react";
import { QueryClientProvider, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { api, setUserRoleHeader } from "./lib/api";
import { Incident, IncidentStatus, UserRole } from "./types";
import { ToastProvider, useToast } from "./components/ui/Toast";
import { Sidebar, NavSection } from "./components/layout/Sidebar";
import { TopBar } from "./components/layout/TopBar";
import { KpiCards } from "./components/dashboard/KpiCards";
import { ThroughputChart } from "./components/dashboard/ThroughputChart";
import { IncidentTable } from "./components/dashboard/IncidentTable";
import { AITriagePanel } from "./components/dashboard/AITriagePanel";
import { CreateIncidentModal, CreateIncidentFormData } from "./components/dashboard/CreateIncidentModal";
import { IncidentDetailModal } from "./components/dashboard/IncidentDetailModal";
import { AuditLogView } from "./components/dashboard/AuditLogView";
import { RulesView } from "./components/dashboard/RulesView";
import { ExecutiveDashboardView } from "./components/dashboard/ExecutiveDashboardView";
import { OverviewCommandCenter } from "./components/crm/OverviewCommandCenter";
import { LeadsCRMView } from "./components/crm/LeadsCRMView";
import { ConversationsInboxView } from "./components/crm/ConversationsInboxView";
import { FollowUpsWorkflowView } from "./components/crm/FollowUpsWorkflowView";
import { AIAgentsAutomationView } from "./components/crm/AIAgentsAutomationView";
import { ErrorState, LoadingState } from "./components/ui/States";

function DashboardContent() {
  const { toast } = useToast();
  const qc = useQueryClient();

  const [activeSection, setActiveSection] = useState<NavSection>("overview");
  const [userRole, setUserRole] = useState<UserRole>("coordinator");
  const [activeSessionKey, setActiveSessionKey] = useState<string>("sess_sarah_coordinator");
  const [overviewTimeframe, setOverviewTimeframe] = useState<"7d" | "30d" | "90d">("30d");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [triageIncident, setTriageIncident] = useState<Incident | null>(null);

  // Organization & Session Data (Multi-Tenant Context)
  const { data: orgData } = useQuery({
    queryKey: ["organizations"],
    queryFn: () => api.getOrganizations(),
    staleTime: 60000,
  });

  // Current Verified Session
  const { data: sessionData, refetch: refetchSession } = useQuery({
    queryKey: ["currentSession", activeSessionKey],
    queryFn: () => api.getSession(),
  });

  // 1. Load Overview Metrics
  const {
    data: overviewMetrics,
    isLoading: isOverviewLoading,
    refetch: refetchOverview,
  } = useQuery({
    queryKey: ["overviewMetrics", activeSessionKey, overviewTimeframe],
    queryFn: () => api.getOverviewMetrics(overviewTimeframe),
    refetchInterval: 25000,
  });

  // 2. Load CRM Leads
  const {
    data: leadsData,
    isLoading: isLeadsLoading,
    refetch: refetchLeads,
  } = useQuery({
    queryKey: ["crmLeads", activeSessionKey],
    queryFn: () => api.getLeads(),
    refetchInterval: 20000,
  });

  // 3. Load Conversations
  const {
    data: conversationsData,
    isLoading: isConversationsLoading,
    refetch: refetchConversations,
  } = useQuery({
    queryKey: ["conversations", activeSessionKey],
    queryFn: () => api.getConversations(),
    refetchInterval: 15000,
  });

  // 4. Load Follow-Ups
  const {
    data: followUpsData,
    isLoading: isFollowUpsLoading,
    refetch: refetchFollowUps,
  } = useQuery({
    queryKey: ["followUps", activeSessionKey],
    queryFn: () => api.getFollowUps(),
    refetchInterval: 20000,
  });

  // 5. Load AI Agents
  const {
    data: aiAgentsData,
    isLoading: isAgentsLoading,
    refetch: refetchAgents,
  } = useQuery({
    queryKey: ["aiAgents", activeSessionKey],
    queryFn: () => api.getAIAgents(),
    refetchInterval: 30000,
  });

  // Existing Load Metrics
  const {
    data: metrics,
    isLoading: isMetricsLoading,
    isError: isMetricsError,
    refetch: refetchMetrics,
    isFetching: isMetricsFetching,
  } = useQuery({
    queryKey: ["metrics", activeSessionKey, userRole],
    queryFn: () => api.getMetrics(),
    refetchInterval: 30000,
  });

  // Load Incidents
  const {
    data: incidentsData,
    isLoading: isIncidentsLoading,
    isError: isIncidentsError,
    refetch: refetchIncidents,
    isFetching: isIncidentsFetching,
  } = useQuery({
    queryKey: ["incidents", activeSessionKey, userRole],
    queryFn: () => api.getIncidents(),
    refetchInterval: 20000,
  });

  // Load Audit Logs
  const {
    data: auditLogsData,
    isLoading: isAuditLoading,
    refetch: refetchAudit,
  } = useQuery({
    queryKey: ["auditLogs", activeSessionKey, userRole],
    queryFn: () => api.getAuditLogs(),
    enabled: activeSection === "audit",
  });

  // Handle Session Switch (Cross-Tenant Demonstration)
  const handleSwitchSession = (newSessionKey: string) => {
    setActiveSessionKey(newSessionKey);
    import("./lib/api").then(({ setSessionToken }) => {
      setSessionToken(newSessionKey);
      qc.invalidateQueries();
      toast({
        type: "info",
        title: "Switched Organization Context",
        message: `Active session set to: ${newSessionKey}. Tenant data isolated.`,
      });
    });
  };

  // Handle Role Change
  const handleRoleChange = (newRole: UserRole) => {
    setUserRole(newRole);
    setUserRoleHeader(newRole);
    qc.invalidateQueries({ queryKey: ["metrics"] });
    qc.invalidateQueries({ queryKey: ["incidents"] });
    qc.invalidateQueries({ queryKey: ["auditLogs"] });
    toast({
      type: "info",
      title: "RBAC Role Switched",
      message: `Simulating access as: ${newRole.toUpperCase()}. Permissions updated.`,
    });
  };

  // Create Incident Mutation
  const createMutation = useMutation({
    mutationFn: (newIncident: CreateIncidentFormData) => api.createIncident(newIncident),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ["incidents"] });
      qc.invalidateQueries({ queryKey: ["metrics"] });
      qc.invalidateQueries({ queryKey: ["auditLogs"] });
      toast({
        type: "success",
        title: "Incident Queued",
        message: `${created.id}: ${created.title} added to operations queue.`,
      });
    },
    onError: (err: any) => {
      toast({
        type: "error",
        title: "Failed to Queue Incident",
        message: err.message,
      });
    },
  });

  // Update Incident Status Mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes }: { id: string; status: IncidentStatus; notes?: string }) =>
      api.updateIncident(id, { status, resolutionNotes: notes }),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: ["incidents"] });
      qc.invalidateQueries({ queryKey: ["metrics"] });
      qc.invalidateQueries({ queryKey: ["auditLogs"] });
      toast({
        type: "success",
        title: "Incident Updated",
        message: `${updated.id} marked as ${updated.status.replace("_", " ")}.`,
      });
    },
    onError: (err: any) => {
      toast({
        type: "error",
        title: "Update Failed",
        message: err.message,
      });
    },
  });

  // Bulk Action Mutation
  const bulkMutation = useMutation({
    mutationFn: (payload: { ids: string[]; action: "resolve" | "mark_in_progress" | "snooze" }) =>
      api.bulkActions({ incidentIds: payload.ids, action: payload.action }),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["incidents"] });
      qc.invalidateQueries({ queryKey: ["metrics"] });
      qc.invalidateQueries({ queryKey: ["auditLogs"] });
      toast({
        type: "success",
        title: "Bulk Action Completed",
        message: res.message,
      });
    },
    onError: (err: any) => {
      toast({
        type: "error",
        title: "Bulk Action Failed",
        message: err.message,
      });
    },
  });

  const handleRefreshAll = () => {
    refetchOverview();
    refetchLeads();
    refetchConversations();
    refetchFollowUps();
    refetchAgents();
    refetchMetrics();
    refetchIncidents();
    if (activeSection === "audit") refetchAudit();
    toast({
      type: "info",
      title: "Data Refreshed",
      message: "Fetched latest state from Kavik Operations backend.",
    });
  };

  const incidents = incidentsData?.data || [];
  const criticalBreachesCount = metrics?.criticalSlaBreaches || 0;
  const needsAttentionCount = metrics?.needsAttentionCount || 0;

  // Filter for the specific view
  const displayIncidents =
    activeSection === "queue"
      ? incidents.filter((i) => i.status === "needs_action" || i.status === "in_progress")
      : incidents;

  const getSectionTitle = () => {
    switch (activeSection) {
      case "overview":
        return {
          title: "Command Center Overview",
          subtitle: "Real-time agency growth telemetry: leads, appointments, revenue, missed calls, and AI dispatch",
        };
      case "leads":
        return {
          title: "Leads & Referrals CRM",
          subtitle: "Manage intake pipelines, hospital referrals, follow-up dates, notes, and care plans",
        };
      case "conversations":
        return {
          title: "Communications Inbox",
          subtitle: "Omnichannel inbox for SMS, AI conversations, voice calls, recordings, and transcripts",
        };
      case "followups":
        return {
          title: "Dedicated Follow-Up Workflow",
          subtitle: "Operational cadence for Due Today, Overdue, Scheduled, and AI One-Click outreach",
        };
      case "agents":
        return {
          title: "Autonomous AI Agents",
          subtitle: "Manage, monitor, and toggle 24/7 AI Phone, SMS, Follow-Up, and Scheduling bots",
        };
      case "dashboard":
        return {
          title: "Home Healthcare Executive & SaaS Operations",
          subtitle: "Agency MMR, caregiver APPU, EVV compliance, and clinical dictation engine",
        };
      case "queue":
        return {
          title: "Needs Attention Queue",
          subtitle: "Urgency-ranked items requiring operational coordinator review & action",
        };
      case "table":
        return {
          title: "All Operations Incidents",
          subtitle: "Comprehensive log across all statuses, care aides, and clients",
        };
      case "analytics":
        return {
          title: "Throughput & Capacity Analytics",
          subtitle: "Hourly ingestion vs. human coordinator and autonomous Aurix triage",
        };
      case "rules":
        return {
          title: "Aurix Autonomous Decision Policy",
          subtitle: "Configured triggers, escalation windows, and automatic resolution rules",
        };
      case "audit":
        return {
          title: "System Audit & Compliance Log",
          subtitle: "Tamper-evident trace of human operator and automated AI decisions",
        };
    }
  };

  const sectionMeta = getSectionTitle();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100 font-sans antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        needsAttentionCount={needsAttentionCount}
        criticalBreachesCount={criticalBreachesCount}
        userRole={userRole}
        onChangeRole={handleRoleChange}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Sticky Top Bar */}
        <TopBar
          title={sectionMeta.title}
          subtitle={sectionMeta.subtitle}
          onOpenCreate={() => setIsCreateOpen(true)}
          onRefresh={handleRefreshAll}
          isRefreshing={isMetricsFetching || isIncidentsFetching}
          userRole={userRole}
          breachCount={criticalBreachesCount}
          tenantOrgName={sessionData?.tenant?.orgName}
          activeSessionKey={activeSessionKey}
          availableSessions={orgData?.availableSessions || []}
          onSwitchSession={handleSwitchSession}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Overview Command Center */}
          {activeSection === "overview" && (
            <section aria-label="Command Center Overview">
              {isOverviewLoading || !overviewMetrics ? (
                <LoadingState message="Loading Agency Command Center metrics..." />
              ) : (
                <OverviewCommandCenter
                  metrics={overviewMetrics}
                  timeframe={overviewTimeframe}
                  onTimeframeChange={setOverviewTimeframe}
                  onNavigate={(sec) => setActiveSection(sec)}
                />
              )}
            </section>
          )}

          {/* Section 2: CRM Leads */}
          {activeSection === "leads" && (
            <section aria-label="Leads and Referral CRM">
              {isLeadsLoading ? (
                <LoadingState message="Loading patient and referral leads..." />
              ) : (
                <LeadsCRMView
                  leads={leadsData?.data || []}
                  onUpdateLead={async (id, updates) => {
                    await api.updateLead(id, updates);
                    qc.invalidateQueries({ queryKey: ["crmLeads"] });
                    qc.invalidateQueries({ queryKey: ["overviewMetrics"] });
                    qc.invalidateQueries({ queryKey: ["followUps"] });
                    toast({
                      type: "success",
                      title: "Lead Updated",
                      message: "Lead information saved successfully.",
                    });
                  }}
                  onCreateLead={async (newLead) => {
                    await api.createLead(newLead);
                    qc.invalidateQueries({ queryKey: ["crmLeads"] });
                    qc.invalidateQueries({ queryKey: ["overviewMetrics"] });
                    qc.invalidateQueries({ queryKey: ["followUps"] });
                    toast({
                      type: "success",
                      title: "Lead Created",
                      message: `${newLead.name} added to pipeline.`,
                    });
                  }}
                  onBulkAction={async (payload) => {
                    const res = await api.bulkLeadAction(payload);
                    qc.invalidateQueries({ queryKey: ["crmLeads"] });
                    qc.invalidateQueries({ queryKey: ["overviewMetrics"] });
                    toast({
                      type: "success",
                      title: "Bulk Action Completed",
                      message: res.message,
                    });
                  }}
                />
              )}
            </section>
          )}

          {/* Section 3: Conversations Inbox */}
          {activeSection === "conversations" && (
            <section aria-label="Communications Inbox">
              {isConversationsLoading ? (
                <LoadingState message="Loading communications inbox..." />
              ) : (
                <ConversationsInboxView
                  conversations={conversationsData?.data || []}
                  onSendMessage={async (conversationId, text) => {
                    await api.sendConversationMessage(conversationId, {
                      text,
                      sender: "coordinator",
                      senderName: "Operations Coordinator",
                    });
                    qc.invalidateQueries({ queryKey: ["conversations"] });
                    qc.invalidateQueries({ queryKey: ["overviewMetrics"] });
                    toast({
                      type: "success",
                      title: "Message Sent",
                      message: "SMS / message delivered to recipient.",
                    });
                  }}
                />
              )}
            </section>
          )}

          {/* Section 4: Follow-Ups Workflow */}
          {activeSection === "followups" && (
            <section aria-label="Follow-Up Workflow">
              {isFollowUpsLoading || !followUpsData ? (
                <LoadingState message="Loading follow-up cadence workflow..." />
              ) : (
                <FollowUpsWorkflowView
                  counts={followUpsData.counts}
                  items={followUpsData.items}
                  onTriggerAI={async (id) => {
                    const res = await api.triggerAIFollowUp(id);
                    qc.invalidateQueries({ queryKey: ["followUps"] });
                    qc.invalidateQueries({ queryKey: ["crmLeads"] });
                    qc.invalidateQueries({ queryKey: ["conversations"] });
                    qc.invalidateQueries({ queryKey: ["overviewMetrics"] });
                    toast({
                      type: "success",
                      title: "AI Action Executed",
                      message: res.message,
                    });
                  }}
                  onMarkCompleted={async (id) => {
                    await api.updateFollowUp(id, { status: "completed" });
                    qc.invalidateQueries({ queryKey: ["followUps"] });
                    qc.invalidateQueries({ queryKey: ["overviewMetrics"] });
                    toast({
                      type: "success",
                      title: "Follow-Up Completed",
                      message: "Task marked completed.",
                    });
                  }}
                />
              )}
            </section>
          )}

          {/* Section 5: AI Agents Automation */}
          {activeSection === "agents" && (
            <section aria-label="Autonomous AI Agents">
              {isAgentsLoading ? (
                <LoadingState message="Loading AI agent configurations..." />
              ) : (
                <AIAgentsAutomationView
                  agents={aiAgentsData?.data || []}
                  onToggleAgent={async (id) => {
                    const res = await api.toggleAIAgent(id);
                    qc.invalidateQueries({ queryKey: ["aiAgents"] });
                    qc.invalidateQueries({ queryKey: ["overviewMetrics"] });
                    toast({
                      type: "info",
                      title: "AI Agent Updated",
                      message: `${res.data.name} is now ${res.data.status}.`,
                    });
                  }}
                />
              )}
            </section>
          )}

          {/* Section: Dashboard (Executive SaaS Hub) */}
          {activeSection === "dashboard" && (
            <section aria-label="Executive Performance Dashboard">
              <ExecutiveDashboardView
                metrics={metrics}
                isLoading={isMetricsLoading}
                onNavigateToQueue={() => setActiveSection("queue")}
              />
            </section>
          )}

          {/* Always show KPI Cards on Queue and Table views */}
          {(activeSection === "queue" || activeSection === "table") && (
            <section aria-label="Key Performance Indicators">
              <KpiCards
                metrics={metrics}
                isLoading={isMetricsLoading}
                onFilterBreaches={() => {
                  setActiveSection("queue");
                  toast({
                    type: "info",
                    title: "Breached Items Filtered",
                    message: "Viewing high-urgency SLA breaches in the queue.",
                  });
                }}
              />
            </section>
          )}

          {/* Section: Queue or Table */}
          {(activeSection === "queue" || activeSection === "table") && (
            <section className="space-y-4" aria-label="Incident Management">
              {isIncidentsError ? (
                <ErrorState
                  title="Could not load incident queue"
                  description="Failed to fetch incidents from the server API. Check server connection."
                  onRetry={() => refetchIncidents()}
                />
              ) : (
                <IncidentTable
                  incidents={displayIncidents}
                  isLoading={isIncidentsLoading}
                  onOpenAITriage={(inc) => setTriageIncident(inc)}
                  onSelectIncident={(inc) => setSelectedIncident(inc)}
                  onUpdateStatus={(id, status) => updateStatusMutation.mutate({ id, status })}
                  onBulkAction={(ids, action) => bulkMutation.mutate({ ids, action })}
                  userRole={userRole}
                />
              )}
            </section>
          )}

          {/* Section: Analytics & Throughput */}
          {activeSection === "analytics" && (
            <section className="space-y-6 max-w-5xl" aria-label="Operations Analytics">
              <KpiCards metrics={metrics} isLoading={isMetricsLoading} />
              <ThroughputChart metrics={metrics} isLoading={isMetricsLoading} />
            </section>
          )}

          {/* Section: Rules View */}
          {activeSection === "rules" && <RulesView />}

          {/* Section: Audit Trail */}
          {activeSection === "audit" && (
            <AuditLogView
              logs={auditLogsData?.data || []}
              isLoading={isAuditLoading}
              onRefresh={() => refetchAudit()}
            />
          )}
        </main>
      </div>

      {/* Aurix AI Copilot Triage Modal */}
      {triageIncident && (
        <AITriagePanel
          incident={triageIncident}
          onClose={() => setTriageIncident(null)}
          onResolve={(id, notes) => updateStatusMutation.mutate({ id, status: "resolved", notes })}
          onReassign={(id, newAssignee) =>
            api.updateIncident(id, { assignedTo: newAssignee }).then(() => {
              qc.invalidateQueries({ queryKey: ["incidents"] });
              toast({ type: "success", title: "Incident Reassigned", message: `Assigned to ${newAssignee}` });
            })
          }
          userRole={userRole}
        />
      )}

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          isOpen={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onUpdateStatus={(id, status, notes) => updateStatusMutation.mutate({ id, status, notes })}
          onOpenAI={(inc) => {
            setSelectedIncident(null);
            setTriageIncident(inc);
          }}
          userRole={userRole}
        />
      )}

      {/* Create Incident Modal */}
      <CreateIncidentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={async (data) => {
          await createMutation.mutateAsync(data);
        }}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <DashboardContent />
      </ToastProvider>
    </QueryClientProvider>
  );
}
