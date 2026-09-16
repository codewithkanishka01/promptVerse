import React, { useState } from 'react';
import {
  Search,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  Send,
  Sparkles,
  Award,
  Layers,
  ShieldCheck,
  UserPlus,
  UserMinus
} from 'lucide-react';
import { Student, Project } from '../types';
import { calculateStudentMatch } from '../utils/aiMatcher';

interface DiscoverStudentsViewProps {
  allStudents: Student[];
  activeProject: Project;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onViewStudent: (student: Student) => void;
  onOpenInvite: (student: Student) => void;
  onToggleTeamMember: (student: Student) => void;
}

export const DiscoverStudentsView: React.FC<DiscoverStudentsViewProps> = ({
  allStudents,
  activeProject,
  searchQuery,
  setSearchQuery,
  onViewStudent,
  onOpenInvite,
  onToggleTeamMember
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedProficiency, setSelectedProficiency] = useState<string>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');

  const currentTeamIds = new Set(activeProject.currentTeam.map((m) => m.studentId));

  const filteredStudents = allStudents.filter((student) => {
    // Search query matches name, department, bio, skills, or interests
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = student.name.toLowerCase().includes(q);
      const matchesDept = student.department.toLowerCase().includes(q);
      const matchesSkill = student.skills.some((s) => s.name.toLowerCase().includes(q));
      const matchesInterest = student.interests.some((i) => i.toLowerCase().includes(q));
      if (!matchesName && !matchesDept && !matchesSkill && !matchesInterest) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory !== 'All') {
      const hasCat = student.skills.some((s) => {
        if (selectedCategory === 'Technical') return s.category === 'Technical' || !s.category;
        if (selectedCategory === 'Design') return s.category === 'Design' || ['Figma', 'UI/UX', 'Canva'].includes(s.name);
        if (selectedCategory === 'Soft') return s.category === 'Soft' || ['Leadership', 'Research', 'Public Speaking', 'Pitching'].includes(s.name);
        return true;
      });
      if (!hasCat) return false;
    }

    // Proficiency filter
    if (selectedProficiency !== 'All') {
      const hasProf = student.skills.some((s) => s.level === selectedProficiency);
      if (!hasProf) return false;
    }

    // Availability filter
    if (selectedAvailability !== 'All') {
      if (student.availability !== selectedAvailability && student.availability !== 'Flexible') {
        return false;
      }
    }

    return student.privacy.isDiscoverable;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Campus Talent Network</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">Discover Student Collaborators</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified skills and campus project records. No social vanity metrics or popularity bias.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Targeting: <strong className="text-slate-800">{activeProject.name}</strong></span>
          </div>
        </div>

        {/* Search & Multi-Filters Strip */}
        <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by skill (e.g. React, OpenCV, Figma, SQL), name, or department..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none"
            >
              <option value="All">All Skill Domains</option>
              <option value="Technical">Technical & Code</option>
              <option value="Design">Design & UI/UX</option>
              <option value="Soft">Leadership & Soft Skills</option>
            </select>

            {/* Proficiency */}
            <select
              value={selectedProficiency}
              onChange={(e) => setSelectedProficiency(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none"
            >
              <option value="All">Any Proficiency</option>
              <option value="Advanced">Advanced Level</option>
              <option value="Intermediate">Intermediate Level</option>
              <option value="Beginner">Beginner Level</option>
            </select>

            {/* Availability */}
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none"
            >
              <option value="All">Any Availability</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Weekends">Weekends</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.map((student) => {
          const match = calculateStudentMatch(student, activeProject);
          const isInTeam = currentTeamIds.has(student.id);

          return (
            <div
              key={student.id}
              className={`bg-white rounded-3xl border transition-all shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden ${
                isInTeam ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200/80 hover:border-indigo-200'
              }`}
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-extrabold text-sm flex items-center justify-center shadow-sm shrink-0">
                      {student.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">{student.name}</h3>
                      <p className="text-[11px] font-semibold text-indigo-600">{student.department}</p>
                      <p className="text-[10px] text-slate-400">{student.year}</p>
                    </div>
                  </div>

                  {/* Active Project Compatibility */}
                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-indigo-600 px-2 py-1 rounded-lg bg-indigo-50 border border-indigo-100 block">
                      {match.finalScore}%
                    </span>
                    <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Project Fit</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">{student.bio}</p>

                {/* Primary Skills */}
                <div className="mt-3.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Skills ({student.skills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {student.skills.slice(0, 5).map((s) => (
                      <span
                        key={s.name}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                          s.level === 'Advanced'
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        {s.name} ({s.level[0]})
                      </span>
                    ))}
                    {student.skills.length > 5 && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 text-slate-400">
                        +{student.skills.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Availability & Projects Badge */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{student.availability}</span>
                  </div>
                  <span className="font-semibold text-slate-700">{student.projectsCount} campus projects</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onViewStudent(student)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                >
                  View Profile
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onToggleTeamMember(student)}
                    className={`p-1.5 rounded-xl text-xs font-bold transition-all ${
                      isInTeam
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                    title={isInTeam ? 'Remove from proposed team' : 'Add to proposed team'}
                  >
                    {isInTeam ? <UserMinus className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => onOpenInvite(student)}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-2xs transition-all flex items-center gap-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Invite</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
