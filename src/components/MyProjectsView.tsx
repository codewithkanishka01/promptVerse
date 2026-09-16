import React from 'react';
import {
  FolderGit2,
  PlusCircle,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';
import { Project, Student } from '../types';
import { analyzeTeamComposition } from '../utils/aiMatcher';

interface MyProjectsViewProps {
  projects: Project[];
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  allStudents: Student[];
  setActiveTab: (tab: string) => void;
}

export const MyProjectsView: React.FC<MyProjectsViewProps> = ({
  projects,
  activeProjectId,
  setActiveProjectId,
  allStudents,
  setActiveTab
}) => {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>Project Hub</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">Your Campus Projects</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage requirements, monitor team completeness, and launch AI matching.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('create')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Project</span>
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((project) => {
          const isActive = project.id === activeProjectId;
          const composition = analyzeTeamComposition(project, allStudents);
          const completenessPercentage = Math.round(
            (composition.coveredSkillsList.length / (project.requiredSkills.length || 1)) * 100
          );

          return (
            <div
              key={project.id}
              className={`bg-white rounded-3xl border p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
                isActive ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-200/80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase">
                        {project.type}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Active Context
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">{project.name}</h3>
                  </div>

                  <span className="text-xs font-black text-indigo-600 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200">
                    {completenessPercentage}% Complete
                  </span>
                </div>

                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">{project.description}</p>

                {/* Completeness Bar */}
                <div className="mt-4">
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${completenessPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      {composition.coveredSkillsList.length}/{project.requiredSkills.length} Required Skills
                    </span>
                    <span>
                      {project.currentTeam.length}/{project.teamSize} Members
                    </span>
                  </div>
                </div>

                {/* Required Skills Tags */}
                <div className="mt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Skills:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {project.requiredSkills.map((req) => {
                      const isCovered = composition.coveredSkillsList.includes(req);
                      return (
                        <span
                          key={req}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                            isCovered
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {req} {isCovered ? '✓' : '⚠️'}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Team Roster Avatars */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center -space-x-2">
                    {project.currentTeam.map((m) => (
                      <div
                        key={m.studentId}
                        className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white"
                        title={`${m.name} (${m.role})`}
                      >
                        {m.avatar}
                      </div>
                    ))}
                  </div>

                  <span className="text-[11px] text-slate-400">
                    Deadline: <strong className="text-slate-700">{project.deadline}</strong>
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {!isActive ? (
                  <button
                    onClick={() => setActiveProjectId(project.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    Select as Active
                  </button>
                ) : (
                  <span className="text-xs font-bold text-indigo-600">Active</span>
                )}

                <button
                  onClick={() => {
                    setActiveProjectId(project.id);
                    setActiveTab('ai-builder');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-2xs transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Launch AI Matcher</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
