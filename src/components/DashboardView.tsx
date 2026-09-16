import React from 'react';
import {
  PlusCircle,
  Users,
  Award,
  Inbox,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Zap,
  TrendingUp,
  UserPlus,
  ShieldCheck,
  ChevronRight,
  Network
} from 'lucide-react';
import { Project, Student, TeamRequest } from '../types';
import { rankCandidatesForProject, analyzeTeamComposition } from '../utils/aiMatcher';

interface DashboardViewProps {
  currentUser: Student;
  activeProject: Project;
  allProjects: Project[];
  allStudents: Student[];
  requests: TeamRequest[];
  setActiveTab: (tab: string) => void;
  setActiveProjectId: (id: string) => void;
  onOpenInvite: (student: Student) => void;
  onViewStudent: (student: Student) => void;
  openSkillGraphModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  activeProject,
  allProjects,
  allStudents,
  requests,
  setActiveTab,
  setActiveProjectId,
  onOpenInvite,
  onViewStudent,
  openSkillGraphModal
}) => {
  const recommendations = rankCandidatesForProject(activeProject, allStudents);
  const composition = analyzeTeamComposition(activeProject, allStudents);
  const pendingRequests = requests.filter((r) => r.status === 'Pending');

  const completenessPercentage = Math.round(
    (composition.coveredSkillsList.length / (activeProject.requiredSkills.length || 1)) * 100
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Welcome & Brand Statement Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Campus Skill Matching System</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Good morning, {currentUser.name.split(' ')[0]} 👋
          </h1>

          <p className="text-slate-300 text-sm sm:text-base mt-2 font-medium">
            Build the right team for your next idea. Don't settle for friends who don't fit the requirements—SkillGraph analyzes project needs to match students with verified skills.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              id="dashboard-btn-create-project"
              onClick={() => setActiveTab('create')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-900/30 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Project</span>
            </button>

            <button
              id="dashboard-btn-find-teammates"
              onClick={() => setActiveTab('ai-builder')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>AI Team Builder</span>
            </button>

            <button
              id="dashboard-btn-open-graph"
              onClick={openSkillGraphModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all"
            >
              <Network className="w-4 h-4 text-indigo-300" />
              <span>View Skill Graph</span>
            </button>
          </div>
        </div>

        {/* Decorative background visual */}
        <div className="absolute -right-12 -bottom-12 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 2. Quick Actions Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {[
          {
            id: 'qa-create',
            title: 'Create Project',
            desc: 'Start new project or hackathon',
            icon: PlusCircle,
            color: 'text-indigo-600 bg-indigo-50',
            action: () => setActiveTab('create')
          },
          {
            id: 'qa-builder',
            title: 'AI Team Builder',
            desc: 'Match students to missing skills',
            icon: Users,
            color: 'text-violet-600 bg-violet-50',
            action: () => setActiveTab('ai-builder')
          },
          {
            id: 'qa-skills',
            title: 'Update Skills & Resume',
            desc: 'Upload resume for AI parsing',
            icon: Award,
            color: 'text-amber-600 bg-amber-50',
            action: () => setActiveTab('my-skills')
          },
          {
            id: 'qa-requests',
            title: 'Team Requests',
            desc: `${pendingRequests.length} pending invitations`,
            icon: Inbox,
            color: 'text-emerald-600 bg-emerald-50',
            action: () => setActiveTab('requests'),
            badge: pendingRequests.length
          }
        ].map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={item.id}
              onClick={item.action}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                {item.title}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">{item.desc}</p>
            </button>
          );
        })}
      </div>

      {/* 3. Main Split: Active Project Health & Team Completeness */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Project Detailed Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 uppercase tracking-wider">
                    {activeProject.type}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700">
                    Status: {activeProject.status}
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1">{activeProject.name}</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="dashboard-find-missing-skills-btn"
                  onClick={() => setActiveTab('ai-builder')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-100 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Find Missing Skills</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-3 leading-relaxed">{activeProject.description}</p>

            {/* Team Completeness Visual Progress Bar (Section 8) */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-800">Team Completeness</span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    ({composition.coveredSkillsList.length} of {activeProject.requiredSkills.length} skills covered)
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

              {/* Covered vs Missing Skills Grid */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Covered Skills */}
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Covered by Current Team ({composition.coveredSkillsList.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {composition.coveredSkillsList.length > 0 ? (
                      composition.coveredSkillsList.map((skill) => (
                        <span
                          key={skill}
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200"
                        >
                          {skill} ✓
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400">No skills covered yet</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div>
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Missing Required Skills ({composition.missingSkillsList.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {composition.missingSkillsList.length > 0 ? (
                      composition.missingSkillsList.map((skill) => (
                        <button
                          key={skill}
                          onClick={() => setActiveTab('ai-builder')}
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                          title="Click to find candidates for this skill"
                        >
                          {skill} ⚠️
                        </button>
                      ))
                    ) : (
                      <span className="text-[11px] font-bold text-emerald-600">All required skills covered! 🎉</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Current Team Roster */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">
                  Current Team Members ({activeProject.currentTeam.length} of {activeProject.teamSize} seats filled)
                </span>
                <span className="text-[11px] text-slate-400">
                  Deadline: <span className="font-semibold text-slate-600">{activeProject.deadline}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {activeProject.currentTeam.map((member) => (
                  <div
                    key={member.studentId}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {member.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-800 truncate">{member.name}</span>
                        {member.isLead && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700">
                            Lead
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{member.role}</p>
                    </div>
                  </div>
                ))}

                {/* Empty Seats */}
                {Array.from({ length: Math.max(0, activeProject.teamSize - activeProject.currentTeam.length) }).map(
                  (_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTab('ai-builder')}
                      className="p-3 rounded-xl border border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all flex items-center justify-center gap-2 text-slate-500 hover:text-indigo-600 text-xs font-semibold"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Open Seat — Match with AI</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Top Recommended Talent Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Recommended Teammates for {activeProject.name}</h3>
                <p className="text-xs text-slate-500">
                  Ranked by skill compatibility and domain experience, not friendships.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('ai-builder')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View All Candidates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {recommendations.slice(0, 3).map(({ student, match }) => (
                <div
                  key={student.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm">
                      {student.avatar}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">{student.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                          {match.finalScore}% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {student.department} • {student.year}
                      </p>

                      {/* Matched skills */}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {match.matchedSkills.slice(0, 3).map((ms) => (
                          <span
                            key={ms.skill}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700"
                          >
                            {ms.skill} ({ms.level})
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onViewStudent(student)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => onOpenInvite(student)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
                    >
                      Invite
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Team Composition & Quick Requests */}
        <div className="space-y-6">
          {/* Team Composition Analysis Widget (Section 9) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Team Composition Analysis
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                AI Health
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {[
                { label: 'Technical Coverage', value: composition.technicalCoverage, color: 'bg-indigo-500' },
                { label: 'Design Coverage', value: composition.designCoverage, color: 'bg-fuchsia-500' },
                { label: 'Backend Coverage', value: composition.backendCoverage, color: 'bg-emerald-500' },
                { label: 'Research Coverage', value: composition.researchCoverage, color: 'bg-amber-500' }
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-slate-600">{stat.label}</span>
                    <span className="font-bold text-slate-800">{stat.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${stat.color} rounded-full transition-all duration-500`}
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* AI Potential Concern */}
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200/70 text-xs">
              <span className="font-bold text-amber-900 block mb-0.5">⚠️ Potential Concern</span>
              <p className="text-amber-800 text-[11px] leading-relaxed">{composition.potentialConcern}</p>
            </div>

            {/* AI Suggested Action */}
            <div className="mt-2.5 p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs">
              <span className="font-bold text-indigo-900 block mb-0.5">💡 Suggested Action</span>
              <p className="text-indigo-800 text-[11px] leading-relaxed">{composition.suggestedAction}</p>
            </div>

            <button
              onClick={() => setActiveTab('ai-builder')}
              className="w-full mt-4 py-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              Analyze in AI Team Builder →
            </button>
          </div>

          {/* Pending Requests Preview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Recent Team Requests
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700">
                {pendingRequests.length} Pending
              </span>
            </div>

            <div className="mt-3 space-y-2.5">
              {requests.slice(0, 2).map((req) => (
                <div key={req.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-slate-800 truncate max-w-[150px]">{req.projectName}</span>
                    <span className="text-[10px] text-slate-400">{req.createdAt}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Role: <span className="font-semibold text-slate-700">{req.role}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    From: <span className="font-semibold text-indigo-600">{req.senderName}</span>
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('requests')}
              className="w-full mt-3 py-2 text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 block"
            >
              Manage All Invitations →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
