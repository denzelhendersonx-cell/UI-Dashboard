import React, { useState } from "react";
import {
  MessageSquare,
  Phone,
  PhoneMissed,
  Bot,
  Send,
  Sparkles,
  User,
  Search,
  CheckCircle2,
  Clock,
  Play,
  FileText,
  Volume2,
  ShieldCheck
} from "lucide-react";
import { Conversation, ConversationType } from "../../types";

interface ConversationsInboxViewProps {
  conversations: Conversation[];
  onSendMessage: (conversationId: string, text: string) => Promise<void>;
}

export function ConversationsInboxView({ conversations, onSendMessage }: ConversationsInboxViewProps) {
  const [selectedId, setSelectedId] = useState<string>(conversations[0]?.id || "");
  const [filterType, setFilterType] = useState<string>("all");
  const [inputText, setInputText] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showFullTranscript, setShowFullTranscript] = useState(false);

  const activeConv = conversations.find((c) => c.id === selectedId) || conversations[0];

  const filteredConversations = conversations.filter((c) => {
    if (filterType === "all") return true;
    if (filterType === "sms") return c.type === "sms";
    if (filterType === "ai") return c.type === "ai_chat";
    if (filterType === "calls") return c.type === "call";
    if (filterType === "missed") return c.type === "missed_call";
    return true;
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConv) return;
    const textToSend = inputText.trim();
    setInputText("");
    await onSendMessage(activeConv.id, textToSend);
  };

  const getTypeBadge = (type: ConversationType) => {
    switch (type) {
      case "sms":
        return {
          icon: <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />,
          label: "SMS",
          color: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
        };
      case "ai_chat":
        return {
          icon: <Bot className="w-3.5 h-3.5 text-emerald-400" />,
          label: "AI Chat",
          color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
        };
      case "call":
        return {
          icon: <Phone className="w-3.5 h-3.5 text-purple-400" />,
          label: "Call",
          color: "bg-purple-500/15 text-purple-300 border-purple-500/30",
        };
      case "missed_call":
      default:
        return {
          icon: <PhoneMissed className="w-3.5 h-3.5 text-rose-400" />,
          label: "Missed Call",
          color: "bg-rose-500/15 text-rose-300 border-rose-500/30",
        };
    }
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-400" />
            Communications Inbox (SMS, Voice & AI Triage)
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Centralized hub for patient family inquiries, automated voice agent callbacks, call transcripts, and SMS chats.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              filterType === "all" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            All Channels ({conversations.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("sms")}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              filterType === "sms" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            SMS
          </button>
          <button
            type="button"
            onClick={() => setFilterType("ai")}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              filterType === "ai" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            AI Bots
          </button>
          <button
            type="button"
            onClick={() => setFilterType("calls")}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              filterType === "calls" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Voice Calls
          </button>
          <button
            type="button"
            onClick={() => setFilterType("missed")}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              filterType === "missed" ? "bg-neutral-800 text-white shadow-sm" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Missed Calls
          </button>
        </div>
      </div>

      {/* Main Inbox Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[650px]">
        {/* Left Column: Conversation List (4 cols) */}
        <div className="lg:col-span-4 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 backdrop-blur-md shadow-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-neutral-800/80 bg-neutral-950/40">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Inbox Threads ({filteredConversations.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-neutral-800/60">
            {filteredConversations.map((c) => {
              const isSelected = activeConv?.id === c.id;
              const badge = getTypeBadge(c.type);

              return (
                <div
                  key={c.id}
                  id={`conv-item-${c.id}`}
                  onClick={() => setSelectedId(c.id)}
                  className={`p-3.5 transition-colors cursor-pointer flex flex-col gap-1.5 ${
                    isSelected
                      ? "bg-indigo-950/30 border-l-4 border-indigo-500"
                      : "hover:bg-neutral-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-semibold text-xs text-neutral-100 truncate">
                      <span>{c.contactName}</span>
                      {c.unread && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 shrink-0">
                      {c.lastTimestamp}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {c.lastMessage}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badge.color}`}
                    >
                      {badge.icon}
                      {badge.label}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">{c.contactPhone}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Thread & Player (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl border border-neutral-800/90 bg-neutral-900/70 backdrop-blur-md shadow-xl flex flex-col justify-between overflow-hidden">
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-neutral-800/80 bg-neutral-950/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white tracking-tight">
                      {activeConv.contactName}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        getTypeBadge(activeConv.type).color
                      }`}
                    >
                      {getTypeBadge(activeConv.type).icon}
                      {getTypeBadge(activeConv.type).label}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-400 mt-0.5 font-mono">
                    <span>{activeConv.contactPhone}</span>
                    {activeConv.contactEmail && <span>· {activeConv.contactEmail}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300 font-mono">
                    Status: {activeConv.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Call Recording & Transcript Box (if available) */}
              {activeConv.hasRecording && (
                <div className="mx-4 mt-4 p-3.5 rounded-xl border border-purple-500/30 bg-purple-950/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                        <Volume2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-purple-200">
                          Inbound Call Recording ({activeConv.recordingDurationSeconds}s)
                        </span>
                        <span className="block text-[10px] font-mono text-neutral-400">
                          AI Speech-to-Text Transcribed with 98% Accuracy
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                    >
                      <Play className={`w-3.5 h-3.5 ${isPlayingAudio ? "animate-pulse" : ""}`} />
                      {isPlayingAudio ? "Playing 0:14 / 1:18..." : "Play Audio"}
                    </button>
                  </div>

                  {activeConv.fullTranscript && (
                    <div className="pt-2 border-t border-purple-500/20 text-xs">
                      <button
                        type="button"
                        onClick={() => setShowFullTranscript(!showFullTranscript)}
                        className="text-[11px] font-semibold text-purple-300 hover:text-purple-200 flex items-center gap-1 cursor-pointer mb-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {showFullTranscript ? "Hide Full Clinical Transcript" : "View Full Clinical Transcript"}
                      </button>

                      {showFullTranscript && (
                        <pre className="p-3 rounded-lg bg-neutral-950/90 border border-neutral-800 text-[11px] font-mono text-neutral-300 whitespace-pre-wrap max-h-36 overflow-y-auto">
                          {activeConv.fullTranscript}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Chat Message Bubble Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {activeConv.messages.map((m) => {
                  const isLead = m.sender === "lead";
                  const isAI = m.sender === "ai_agent";

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isLead ? "items-start" : "items-end"}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-neutral-400">
                        {isAI && <Bot className="w-3 h-3 text-emerald-400" />}
                        {!isAI && !isLead && <User className="w-3 h-3 text-indigo-400" />}
                        <span className="font-semibold">{m.senderName}</span>
                        <span>· {m.timestamp}</span>
                      </div>

                      <div
                        className={`p-3 rounded-2xl max-w-md text-xs leading-relaxed ${
                          isLead
                            ? "bg-neutral-800 text-neutral-100 rounded-tl-xs border border-neutral-700/80"
                            : isAI
                            ? "bg-emerald-950/40 text-emerald-100 rounded-tr-xs border border-emerald-500/30"
                            : "bg-indigo-600 text-white rounded-tr-xs shadow-md shadow-indigo-600/30"
                        }`}
                      >
                        {m.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Input Box */}
              <form
                onSubmit={handleSend}
                className="p-3 border-t border-neutral-800/80 bg-neutral-950/80 flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder={`Reply to ${activeConv.contactName} via SMS or trigger AI dispatch...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 text-xs">
              <MessageSquare className="w-8 h-8 mb-2 stroke-1" />
              <span>Select a conversation thread to view communications</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
