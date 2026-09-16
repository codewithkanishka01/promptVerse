import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserPlus,
  UserMinus,
  Send,
  HelpCircle,
  Network,
  Filter,
  Layers,
  Search,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Info
} from 'lucide-react';
import { Project, Student, StudentRecommendation } from '../types';
import { rankCandidatesForProject, analyzeTeamComposition } from '../utils/aiMatcher';

interface AIBuilderViewProps {
  activeProject: Project;
  allProjects: Project[];
  setActiveProjectId: (id: string) => void;
  allStudents: Student[];
  onToggleTeamMember: (student: Student) => void;
  onOpenInvite: (student: Student) => void;
  onViewStudent: (student: Student) => void;
  openSkillGraphModal: () => void;
  openChat: () => void;
}

export const AIBuilderView: React.FC<AIBuilderViewProps> = ({
  activeProject,
  allProjects,
  setActiveProjectId,
  allStudents,
  onToggleTeamMember,
  onOpenInvite,
  onViewStudent,
  openSkillGraphModal,
  openChat
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'missing' | 'high_match' | 'available'>('all');
  const [skillFilter, setSkillFilter] = useState<string | null>(null);

  const recommendations = rankCandidatesForProject(activeProject, allStudents);
  const composition = analyzeTeamComposition(activeProject, allStudents);
  const currentTeamMemberIds = new Set(activeProject.currentTeam.map((m) => m.studentId));

  // Filter recommendations based on active tabs / skill filter
  const filteredCandidates = recommendations.filter(({ student, match }) => {
    if (skillFilter) {
      const hasSkill =
        student.skills.some((s) => s.name.toLowerCase().includes(skillFilter.toLowerCase())) ||
        match.matchedSkills.some((ms) => ms.skill.toLowerCase().includes(skillFilter.toLowerCase()));
      if (!hasSkill) return false;
    }

    if (filterMode === 'missing') {
      // Must cover at least one missing skill
      return match.matchedSkills.some((ms) => composition.missingSkillsList.includes(ms.skill));
    }
    if (filterMode === 'high_match') {
      return match.finalScore >= 75;
    }
    if (filterMode === 'available') {
      return match.availabilityMatch;
    }
    return true;
  });

  const completenessPercentage = Math.round(
    (composition.coveredSkillsList.length / (activeProject.requiredSkills.length || 1)) * 100
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Project Context Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                <BrainCircuit className="w-3 h-3" />
                AI Team Matching Engine
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                {activeProject.type}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{activeProject.name}</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">{activeProject.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="builder-view-skill-graph-btn"
              onClick={openSkillGraphModal}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 transition-colors"
            >
              <Network className="w-3.5 h-3.5" />
              <span>Interactive Skill Graph</span>
            </button>

            <button
              id="builder-ask-ai-btn"
              onClick={openChat}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-indigo-950 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ask SkillGraph AI</span>
            </button>
          </div>
        </div>

        {/* 2. Team Completeness & Health (Section 8) */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Bar & Skills Checklist */}
          <div className="lg:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-800">Team Completeness</span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {composition.coveredSkillsList.length} of {activeProject.requiredSkills.length} required skills covered
                </span>
              </div>
              <span className="text-sm font-black text-indigo-600">{completenessPercentage}%</span>
            </div>

            {/* Progress track */}
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completenessPercentage}%` }}
              />
            </div>

            {/* Covered vs Missing */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Covered Skills ({composition.coveredSkillsList.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {composition.coveredSkillsList.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200"
                    >
                      {skill} ✓
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  Missing Skills ({composition.missingSkillsList.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {composition.missingSkillsList.length > 0 ? (
                    composition.missingSkillsList.map((skill) => (
                      <button
                        key={skill}
                        onClick={() => setSkillFilter(skillFilter === skill ? null : skill)}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
                          skillFilter === skill
                            ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
                            : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                        }`}
                        title="Click to filter candidates for this missing skill"
                      >
                        {skill} {skillFilter === skill ? '✕' : '⚠️'}
                      </button>
                    ))
                  ) : (
                    <span className="text-xs font-bold text-emerald-600">Zero skill gaps remaining!</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Composition Analysis (Section 9) */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Composition Balance
                </span>
                <span className="text-xs font-black text-indigo-600">{composition.overallBalance}%</span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-600">
                  <span>Technical Coverage</span>
                  <span className="font-bold">{composition.technicalCoverage}%</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Design Coverage</span>
                  <span className="font-bold">{composition.designCoverage}%</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Backend Coverage</span>
                  <span className="font-bold">{composition.backendCoverage}%</span>
                </div>
              </div>

              {/* Overlapping alert if any */}
              {composition.overlappingSkills.length > 0 && (
                <div className="mt-3 p-2 rounded-lg bg-white/80 border border-indigo-100 text-[10px] text-slate-600">
                  <span className="font-bold text-indigo-900">Overlapping skill: </span>
                  {composition.overlappingSkills[0].skill} covered by {composition.overlappingSkills[0].members.join(' & ')}
                </div>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-indigo-100 text-[11px] text-indigo-900 font-medium">
              💡 {composition.suggestedAction}
            </div>
          </div>
        </div>

        {/* Current Team Member Roster Strip */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-slate-700">
              Active Proposed Team ({activeProject.currentTeam.length}/{activeProject.teamSize} Members)
            </span>
            <span className="text-[11px] text-slate-400">Click a member or candidate to modify</span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {activeProject.currentTeam.map((member) => (
              <div
                key={member.studentId}
                className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-2 text-xs"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                  {member.avatar}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-slate-800">{member.name}</span>
                    {member.isLead && (
                      <span className="text-[9px] bg-indigo-200 text-indigo-800 px-1 rounded font-bold">Lead</span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">{member.role}</span>
                </div>

                {!member.isLead && (
                  <button
                    onClick={() => {
                      const student = allStudents.find((s) => s.id === member.studentId);
                      if (student) onToggleTeamMember(student);
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    title="Remove from proposed team"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Candidate Matching Filter Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          {[
            { id: 'all', label: `All Candidates (${recommendations.length})` },
            { id: 'missing', label: `Covers Missing Skills (${composition.missingSkillsList.length} open)` },
            { id: 'high_match', label: 'High Compatibility (>75%)' },
            { id: 'available', label: 'Availability Match' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterMode(tab.id as any)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all ${
                filterMode === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {skillFilter && (
            <button
              onClick={() => setSkillFilter(null)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1"
            >
              <span>Skill: {skillFilter}</span>
              <span>✕</span>
            </button>
          )}
        </div>

        <div className="text-[11px] text-slate-500 font-medium">
          Showing {filteredCandidates.length} evaluated student profiles
        </div>
      </div>

      {/* 4. Candidate Recommendation Cards (Section 7, 18, 19) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCandidates.map(({ student, match }) => {
          const isInTeam = currentTeamMemberIds.has(student.id);

          return (
            <div
              key={student.id}
              id={`candidate-card-${student.id}`}
              className={`bg-white rounded-3xl border transition-all shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden ${
                isInTeam
                  ? 'border-emerald-300 ring-2 ring-emerald-100'
                  : match.finalScore >= 80
                  ? 'border-indigo-200/90'
                  : 'border-slate-200/80'
              }`}
            >
              <div className="p-5 sm:p-6">
                {/* Top Row: Candidate Avatar, Name, Department & Compatibility */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-extrabold text-base flex items-center justify-center shadow-md shadow-indigo-100 shrink-0">
                      {student.avatar}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900">{student.name}</h3>
                        {isInTeam && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            On Team
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-indigo-600 font-semibold">{student.department}</p>
                      <p className="text-[11px] text-slate-400">
                        {student.year} • {student.projectsCount} campus projects
                      </p>
                    </div>
                  </div>

                  {/* Match Percentage Badge */}
                  <div className="text-right shrink-0">
                    <div className="inline-flex flex-col items-end px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100">
                      <span className="text-lg font-black text-indigo-700 leading-none">{match.finalScore}%</span>
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                        Match Score
                      </span>
                    </div>
                  </div>
                </div>

                {/* Matched Skills with Proficiency & Semantic Badges */}
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Verified Skill Alignment ({match.skillMatchCount} of {match.totalRequired})
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {match.matchedSkills.map((ms) => (
                      <div
                        key={ms.skill}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                          ms.level === 'Advanced'
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        <span>{ms.skill}</span>
                        <span className="text-[10px] font-normal opacity-75">({ms.level})</span>
                      </div>
                    ))}
                  </div>

                  {/* Semantic match inferences */}
                  {match.matchedSkills.some((ms) => ms.semanticMatch) && (
                    <div className="mt-2 text-[10px] text-indigo-700 bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.2" />
                      <span>
                        {match.matchedSkills.find((ms) => ms.semanticMatch)?.semanticMatch}
                      </span>
                    </div>
                  )}

                  {/* Smart Alternative Notice (Section 15) */}
                  {match.smartAlternative && (
                    <div className="mt-2 text-[10px] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.2" />
                      <div>
                        <span className="font-bold">Smart Alternative: </span>
                        Has {match.smartAlternative.studentHasSkill} for {match.smartAlternative.requiredSkill} — {match.smartAlternative.reasoning}
                      </div>
                    </div>
                  )}
                </div>

                {/* Explainable AI (XAI) Box: WHY RECOMMENDED? (Section 7) */}
                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 mb-2">
                    <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="text-[11px] uppercase tracking-wider text-slate-700">Why Recommended?</span>
                  </div>

                  <ul className="space-y-1 text-[11px] text-slate-600 list-disc list-inside">
                    {match.whyRecommended.map((reason, idx) => (
                      <li key={idx} className="leading-snug">
                        {reason}
                      </li>
                    ))}
                  </ul>

                  {/* Potential Gap note */}
                  {match.potentialGap && (
                    <div className="mt-2 pt-2 border-t border-slate-200/60 text-[10px] text-slate-500">
                      <span className="font-semibold text-slate-600">Coverage Note: </span>
                      {match.potentialGap}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Action Buttons */}
              <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onViewStudent(student)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                >
                  View Profile
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleTeamMember(student)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isInTeam
                        ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                    }`}
                  >
                    {isInTeam ? <UserMinus className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                    <span>{isInTeam ? 'Remove' : 'Add to Team'}</span>
                  </button>

                  <button
                    onClick={() => onOpenInvite(student)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-all"
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
