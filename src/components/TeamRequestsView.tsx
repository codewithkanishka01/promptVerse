import React, { useState } from 'react';
import {
  Inbox,
  Send,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Calendar,
  Layers,
  ArrowRight,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { TeamRequest, Student } from '../types';

interface TeamRequestsViewProps {
  requests: TeamRequest[];
  currentUser: Student;
  onAcceptRequest: (requestId: string) => void;
  onDeclineRequest: (requestId: string) => void;
  onInquirySubmit: (requestId: string, message: string) => void;
  showToast: (msg: string) => void;
}

export const TeamRequestsView: React.FC<TeamRequestsViewProps> = ({
  requests,
  currentUser,
  onAcceptRequest,
  onDeclineRequest,
  onInquirySubmit,
  showToast
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [inquiryModalReq, setInquiryModalReq] = useState<TeamRequest | null>(null);
  const [inquiryText, setInquiryText] = useState('');

  const incomingRequests = requests.filter((r) => r.receiverId === currentUser.id);
  const outgoingRequests = requests.filter((r) => r.senderId === currentUser.id);

  const displayedRequests = activeSubTab === 'incoming' ? incomingRequests : outgoingRequests;

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryModalReq || !inquiryText.trim()) return;

    onInquirySubmit(inquiryModalReq.id, inquiryText);
    showToast(`Sent question to ${inquiryModalReq.senderName}.`);
    setInquiryModalReq(null);
    setInquiryText('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1">
              <Inbox className="w-3.5 h-3.5" />
              <span>Section 14 • Team Requests & Invitations</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">Project Invitations & Inquiries</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review incoming role offers or manage sent invitations to prospective teammates.
            </p>
          </div>

          {/* Subtabs */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveSubTab('incoming')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'incoming'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Incoming ({incomingRequests.length})
            </button>
            <button
              onClick={() => setActiveSubTab('outgoing')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'outgoing'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sent Out ({outgoingRequests.length})
            </button>
          </div>
        </div>
      </div>

      {/* Invitations List */}
      <div className="space-y-4">
        {displayedRequests.length > 0 ? (
          displayedRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-sm transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-extrabold text-sm flex items-center justify-center shadow-xs shrink-0">
                    {req.senderAvatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-extrabold text-slate-900">{req.projectName}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          req.status === 'Accepted'
                            ? 'bg-emerald-50 text-emerald-700'
                            : req.status === 'Declined'
                            ? 'bg-rose-50 text-rose-700'
                            : req.status === 'Inquiry'
                            ? 'bg-amber-50 text-amber-800'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-0.5">
                      Invited by <strong className="text-slate-700">{req.senderName}</strong> for role:{' '}
                      <strong className="text-indigo-600 font-bold">{req.role}</strong>
                    </p>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 font-medium shrink-0 self-start sm:self-center">
                  Sent {req.createdAt}
                </span>
              </div>

              {/* Invitation Details Body */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                    Expected Contribution:
                  </span>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
                    {req.expectedContribution}
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
                      Targeted Skills:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {req.requiredSkills.map((s) => (
                        <span
                          key={s}
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                    <div className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{req.timeCommitment}</span>
                    </div>
                    <div className="flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Target Deadline: {req.deadline}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inquiry thread if present */}
              {req.inquiryMessage && (
                <div className="mt-4 p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                    <span>Question regarding this invitation:</span>
                  </div>
                  <p className="text-amber-800 italic">"{req.inquiryMessage}"</p>
                </div>
              )}

              {/* Actions Footer for Incoming */}
              {activeSubTab === 'incoming' && req.status === 'Pending' && (
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    onClick={() => setInquiryModalReq(req)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Ask Question</span>
                  </button>

                  <button
                    onClick={() => onDeclineRequest(req.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>

                  <button
                    onClick={() => onAcceptRequest(req.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept Invitation</span>
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80">
            <Inbox className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No {activeSubTab} requests right now</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Invitations sent or received will appear here with full commitment specs.
            </p>
          </div>
        )}
      </div>

      {/* Inquiry Question Modal */}
      {inquiryModalReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-base font-extrabold text-slate-900">
              Ask {inquiryModalReq.senderName} a Question
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Regarding role <span className="font-semibold text-indigo-600">{inquiryModalReq.role}</span> on{' '}
              <span className="font-semibold">{inquiryModalReq.projectName}</span>.
            </p>

            <form onSubmit={handleSendInquiry} className="mt-4 space-y-4">
              <textarea
                rows={4}
                value={inquiryText}
                onChange={(e) => setInquiryText(e.target.value)}
                placeholder="e.g. Can you share more about the sprint schedule or tech stack libraries used?"
                required
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-500 focus:outline-none resize-none"
              />

              <div className="flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setInquiryModalReq(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                >
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
