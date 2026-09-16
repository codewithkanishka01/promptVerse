import React, { useState } from 'react';
import { X, Send, Clock, Calendar, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Student, Project } from '../types';

interface InviteModalProps {
  student: Student;
  project: Project;
  onClose: () => void;
  onSendInvite: (inviteData: {
    role: string;
    requiredSkills: string[];
    expectedContribution: string;
    deadline: string;
    timeCommitment: string;
  }) => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({
  student,
  project,
  onClose,
  onSendInvite
}) => {
  // Pre-fill suggested role based on student's top skill
  const defaultRole = student.skills.some((s) => s.name === 'UI/UX' || s.name === 'Figma')
    ? 'Lead UI/UX Designer & Prototyper'
    : student.skills.some((s) => s.name === 'Node.js' || s.name === 'Backend' || s.name === 'Database')
    ? 'Backend Systems Architect'
    : student.skills.some((s) => s.name === 'Machine Learning' || s.name === 'OpenCV' || s.name === 'Python')
    ? 'AI & Vision Engineer'
    : `${student.skills[0]?.name || 'Full-Stack'} Developer`;

  const [role, setRole] = useState(defaultRole);
  const [expectedContribution, setExpectedContribution] = useState(
    `Collaborate on core sprint milestones for ${project.name}, build module architecture, and lead weekly standup reviews.`
  );
  const [timeCommitment, setTimeCommitment] = useState(`${student.hoursPerWeek || 10} hours / week`);
  const [deadline, setDeadline] = useState(project.deadline || 'May 20, 2026');

  // Filter skills that the student covers for this project
  const relevantSkills = student.skills
    .filter((s) =>
      project.requiredSkills.some(
        (req) => req.toLowerCase() === s.name.toLowerCase() || s.name.toLowerCase().includes(req.toLowerCase())
      )
    )
    .map((s) => s.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendInvite({
      role,
      requiredSkills: relevantSkills.length > 0 ? relevantSkills : [student.skills[0]?.name || 'Engineering'],
      expectedContribution,
      deadline,
      timeCommitment
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-extrabold text-base flex items-center justify-center shadow-md shadow-indigo-100">
              {student.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-extrabold text-slate-900">Invite {student.name}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                  {student.availability}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                To join: <span className="font-semibold text-indigo-600">{project.name}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Target Skills to Leverage</label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-200">
              {student.skills.map((s) => (
                <span
                  key={s.name}
                  className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700"
                >
                  {s.name} ({s.level})
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Expected Contribution</label>
            <textarea
              rows={3}
              value={expectedContribution}
              onChange={(e) => setExpectedContribution(e.target.value)}
              required
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Time Commitment
                </span>
              </label>
              <input
                type="text"
                value={timeCommitment}
                onChange={(e) => setTimeCommitment(e.target.value)}
                required
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  Project Deadline
                </span>
              </label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-start gap-2 text-[11px] text-indigo-900">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <p>
              SkillGraph verifies project requirements to prevent spam. This invitation will be routed to{' '}
              <span className="font-semibold">{student.name}'s</span> Team Requests dashboard.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Team Invitation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
