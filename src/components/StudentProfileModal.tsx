import React from 'react';
import {
  X,
  Award,
  CheckCircle2,
  Calendar,
  Briefcase,
  Clock,
  Send,
  UserPlus,
  UserMinus,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Student, Project } from '../types';
import { calculateStudentMatch } from '../utils/aiMatcher';

interface StudentProfileModalProps {
  student: Student;
  project: Project;
  onClose: () => void;
  onOpenInvite: () => void;
  onToggleTeamMember: (student: Student) => void;
  isInTeam: boolean;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  project,
  onClose,
  onOpenInvite,
  onToggleTeamMember,
  isInTeam
}) => {
  const match = calculateStudentMatch(student, project);

  const technicalSkills = student.skills.filter((s) => s.category === 'Technical' || !s.category);
  const designSkills = student.skills.filter((s) => s.category === 'Design');
  const softSkills = student.skills.filter((s) => s.category === 'Soft');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0">
              {student.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900">{student.name}</h3>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Active on Campus" />
              </div>
              <p className="text-xs font-semibold text-indigo-600 mt-0.5">{student.department}</p>
              <p className="text-xs text-slate-400">{student.year}</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Match Breakdown Card against Active Project */}
        <div className="mt-5 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                Compatibility for {project.name}
              </span>
            </div>
            <p className="text-xs text-indigo-800 mt-1">
              Covers <span className="font-bold">{match.skillMatchCount}</span> of {project.requiredSkills.length} required skills.
              {match.availabilityMatch && ' Availability aligns with project schedule.'}
            </p>
          </div>

          <div className="px-4 py-2 rounded-xl bg-white border border-indigo-200 shadow-sm text-center shrink-0">
            <span className="text-2xl font-black text-indigo-600">{match.finalScore}%</span>
            <span className="block text-[10px] font-bold text-slate-500 uppercase">Match Score</span>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">About</h4>
          <p className="text-xs text-slate-600 leading-relaxed">{student.bio}</p>
        </div>

        {/* Skills Section */}
        <div className="mt-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Skills & Proficiency</h4>

          {/* Technical Skills */}
          {technicalSkills.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-2">Technical & Engineering</span>
              <div className="flex flex-wrap gap-2">
                {technicalSkills.map((s) => (
                  <span
                    key={s.name}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                      s.level === 'Advanced'
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                        : s.level === 'Intermediate'
                        ? 'bg-slate-50 border-slate-200 text-slate-700'
                        : 'bg-slate-50 border-slate-200 text-slate-500'
                    }`}
                  >
                    {s.verified && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                    <span>{s.name}</span>
                    <span className="text-[10px] font-normal opacity-70">({s.level})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Design Skills */}
          {designSkills.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-2">Design & User Experience</span>
              <div className="flex flex-wrap gap-2">
                {designSkills.map((s) => (
                  <span
                    key={s.name}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border bg-fuchsia-50/70 border-fuchsia-200 text-fuchsia-800 flex items-center gap-1.5"
                  >
                    {s.verified && <CheckCircle2 className="w-3 h-3 text-fuchsia-600" />}
                    <span>{s.name}</span>
                    <span className="text-[10px] font-normal opacity-70">({s.level})</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Soft Skills */}
          {softSkills.length > 0 && (
            <div>
              <span className="text-xs font-semibold text-slate-700 block mb-2">Leadership & Soft Skills</span>
              <div className="flex flex-wrap gap-2">
                {softSkills.map((s) => (
                  <span
                    key={s.name}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg border bg-emerald-50/70 border-emerald-200 text-emerald-800 flex items-center gap-1.5"
                  >
                    <span>{s.name}</span>
                    <span className="text-[10px] font-normal opacity-70">({s.level})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Experience Timeline */}
        <div className="mt-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Experience & Projects</h4>
          <div className="space-y-3">
            {student.experience.map((exp, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{exp.title}</span>
                    <span className="text-slate-400 ml-2">• {exp.role}</span>
                  </div>
                  {exp.duration && <span className="text-[11px] text-slate-400 font-medium">{exp.duration}</span>}
                </div>
                <p className="text-slate-600 mt-1">{exp.summary}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Availability & Interests Footer */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Availability
            </span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-700">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {student.availability} (~{student.hoursPerWeek} hrs/week)
              </span>
            </div>
          </div>

          <div>
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block mb-1">
              Domain Interests
            </span>
            <div className="flex flex-wrap gap-1">
              {student.interests.map((int) => (
                <span key={int} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                  {int}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => onToggleTeamMember(student)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isInTeam
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
            }`}
          >
            {isInTeam ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{isInTeam ? 'Remove from Proposed Team' : 'Add to Proposed Team'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenInvite();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Invite to Team</span>
          </button>
        </div>
      </div>
    </div>
  );
};
