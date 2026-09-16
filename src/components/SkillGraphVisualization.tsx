import React, { useState } from 'react';
import {
  Network,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HelpCircle,
  X
} from 'lucide-react';
import { Project, Student } from '../types';
import { analyzeTeamComposition } from '../utils/aiMatcher';

interface SkillGraphVisualizationProps {
  project: Project;
  allStudents: Student[];
  onSelectMissingSkill?: (skill: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

interface DomainNode {
  id: string;
  name: string;
  category: 'AI/ML' | 'Frontend' | 'Backend' | 'Design' | 'Research' | 'Strategy';
  requiredSkills: string[];
  assignedMembers: Array<{ name: string; avatar: string; skill: string }>;
  missingSkills: string[];
  hasOverlap: boolean;
  status: 'Complete' | 'Partial' | 'Missing';
}

export const SkillGraphVisualization: React.FC<SkillGraphVisualizationProps> = ({
  project,
  allStudents,
  onSelectMissingSkill,
  onClose,
  isModal = false
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const analysis = analyzeTeamComposition(project, allStudents);

  // Group required skills into architectural domains
  const initialDomains: DomainNode[] = [
    {
      id: 'domain-aiml',
      name: 'AI & Data Science',
      category: 'AI/ML',
      requiredSkills: project.requiredSkills.filter((s) =>
        ['Python', 'Machine Learning', 'Data Science', 'Pandas', 'Statistics', 'Deep Learning', 'Computer Vision'].includes(s)
      ),
      assignedMembers: [],
      missingSkills: [],
      hasOverlap: false,
      status: 'Missing'
    },
    {
      id: 'domain-design',
      name: 'Design & UI/UX',
      category: 'Design',
      requiredSkills: project.requiredSkills.filter((s) =>
        ['UI/UX', 'Figma', 'Design', 'Prototyping', 'Canva'].includes(s)
      ),
      assignedMembers: [],
      missingSkills: [],
      hasOverlap: false,
      status: 'Missing'
    },
    {
      id: 'domain-frontend',
      name: 'Frontend Client',
      category: 'Frontend',
      requiredSkills: project.requiredSkills.filter((s) =>
        ['React', 'Next.js', 'Tailwind', 'HTML', 'JavaScript', 'TypeScript', 'Flutter'].includes(s)
      ),
      assignedMembers: [],
      missingSkills: [],
      hasOverlap: false,
      status: 'Missing'
    },
    {
      id: 'domain-backend',
      name: 'Backend & Database',
      category: 'Backend',
      requiredSkills: project.requiredSkills.filter((s) =>
        ['Backend', 'Database', 'Node.js', 'SQL', 'MongoDB', 'FastAPI', 'Java', 'Docker', 'Spring Boot'].includes(s)
      ),
      assignedMembers: [],
      missingSkills: [],
      hasOverlap: false,
      status: 'Missing'
    }
  ];

  const domains: DomainNode[] = initialDomains.filter((d) => d.requiredSkills.length > 0);

  // If no skills matched the standard domains, add a General Domain
  if (domains.length === 0) {
    domains.push({
      id: 'domain-general',
      name: 'Core Capabilities',
      category: 'Strategy',
      requiredSkills: project.requiredSkills,
      assignedMembers: [],
      missingSkills: [],
      hasOverlap: false,
      status: 'Partial'
    });
  }

  // Populate assigned members & missing per domain
  domains.forEach((dom) => {
    dom.requiredSkills.forEach((req) => {
      const isCovered = analysis.coveredSkillsList.includes(req);
      if (isCovered) {
        // Find who covers it
        project.currentTeam.forEach((member) => {
          const full = allStudents.find((s) => s.id === member.studentId);
          const skills = full ? full.skills.map((s) => s.name) : member.primarySkills;
          if (skills.some((sk) => sk.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(sk.toLowerCase()))) {
            if (!dom.assignedMembers.some((am) => am.name === member.name && am.skill === req)) {
              dom.assignedMembers.push({ name: member.name, avatar: member.avatar, skill: req });
            }
          }
        });
      } else {
        dom.missingSkills.push(req);
      }
    });

    if (dom.assignedMembers.length > 1) {
      dom.hasOverlap = true;
    }

    if (dom.missingSkills.length === 0) {
      dom.status = 'Complete';
    } else if (dom.assignedMembers.length > 0) {
      dom.status = 'Partial';
    } else {
      dom.status = 'Missing';
    }
  });

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col ${isModal ? 'max-h-[85vh]' : ''}`}>
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900">Interactive Team Skill Graph</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                Live Topology
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Visual dependency map linking project objectives, core domains, team roles, and critical skill gaps.
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Graph Visual Canvas */}
      <div className="p-6 overflow-x-auto">
        <div className="min-w-[680px] flex flex-col items-center">
          {/* LEVEL 1: Root Project Node */}
          <div className="flex flex-col items-center">
            <div className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-lg shadow-indigo-950/20 border border-slate-800 text-center max-w-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Project Target</span>
              <h4 className="text-sm font-bold truncate">{project.name}</h4>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {project.currentTeam.length}/{project.teamSize} Members • {analysis.overallBalance}% Balance
              </p>
            </div>

            {/* Connecting Vertical Stem */}
            <div className="w-0.5 h-8 bg-slate-300 my-1 relative">
              <div className="w-2 h-2 rounded-full bg-indigo-500 absolute -bottom-1 -left-[3px]" />
            </div>
          </div>

          {/* LEVEL 2 & 3: Domains & Assigned Members */}
          <div className="w-full relative">
            {/* Horizontal Bus Bar */}
            <div className="h-0.5 bg-slate-300 mx-16 relative">
              {domains.map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-slate-400 absolute -top-[3px]"
                  style={{ left: `${(i / (domains.length - 1 || 1)) * 100}%` }}
                />
              ))}
            </div>

            {/* Domain Branches */}
            <div className="grid grid-cols-4 gap-4 mt-4">
              {domains.map((domain) => {
                const isSelected = selectedNode === domain.id;
                return (
                  <div key={domain.id} className="flex flex-col items-center">
                    {/* Stem from bus to domain node */}
                    <div className="w-0.5 h-4 bg-slate-300 -mt-4 mb-1" />

                    {/* Domain Node Card */}
                    <div
                      onClick={() => setSelectedNode(isSelected ? null : domain.id)}
                      className={`w-full p-4 rounded-2xl border transition-all cursor-pointer text-center ${
                        domain.status === 'Complete'
                          ? 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300'
                          : domain.status === 'Partial'
                          ? 'bg-amber-50/60 border-amber-200 hover:border-amber-300'
                          : 'bg-rose-50/60 border-rose-200 hover:border-rose-300'
                      } ${isSelected ? 'ring-2 ring-indigo-500 shadow-md' : 'shadow-sm'}`}
                    >
                      <div className="flex items-center justify-center gap-1.5 mb-1">
                        {domain.status === 'Complete' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        {domain.status === 'Partial' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                        {domain.status === 'Missing' && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                        <span className="text-xs font-bold text-slate-800">{domain.name}</span>
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                        <span>{domain.requiredSkills.length} Required Skills</span>
                      </div>

                      {/* Covered Skills Pills */}
                      <div className="flex flex-wrap gap-1 justify-center mt-2.5">
                        {domain.requiredSkills.map((req) => {
                          const isCovered = analysis.coveredSkillsList.includes(req);
                          return (
                            <span
                              key={req}
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                                isCovered
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                                  : 'bg-rose-100/80 text-rose-700 border-rose-200/80'
                              }`}
                            >
                              {req} {isCovered ? '✓' : '⚠️'}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Assigned Team Member Nodes under Domain */}
                    <div className="w-full mt-3 space-y-2">
                      {domain.assignedMembers.length > 0 ? (
                        domain.assignedMembers.map((member, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-left shadow-xs"
                          >
                            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                              {member.avatar}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-800 truncate">{member.name}</p>
                              <p className="text-[10px] text-indigo-600 font-medium truncate">Covers {member.skill}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-3 rounded-xl border border-dashed border-rose-300 bg-rose-50/40 text-center">
                          <p className="text-[11px] font-bold text-rose-700">No Member Assigned</p>
                          <p className="text-[10px] text-rose-500 mt-0.5">Critical Domain Gap</p>
                          {onSelectMissingSkill && domain.missingSkills.length > 0 && (
                            <button
                              onClick={() => onSelectMissingSkill(domain.missingSkills[0])}
                              className="mt-1.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 underline inline-flex items-center gap-0.5"
                            >
                              <span>Match Candidates</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </div>
                      )}

                      {/* Missing skills quick badge */}
                      {domain.missingSkills.length > 0 && domain.assignedMembers.length > 0 && (
                        <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-center">
                          <p className="text-[10px] font-bold text-amber-800">
                            Missing: {domain.missingSkills.join(', ')}
                          </p>
                          {onSelectMissingSkill && (
                            <button
                              onClick={() => onSelectMissingSkill(domain.missingSkills[0])}
                              className="text-[10px] font-bold text-indigo-600 hover:underline mt-0.5 inline-block"
                            >
                              Find student for {domain.missingSkills[0]} →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Legend & Summary Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Domain Fully Covered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Partial Skill Gaps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Unassigned Role (High Risk)</span>
          </div>
        </div>

        <div className="text-right">
          <span className="font-semibold text-slate-700">Team Completeness: </span>
          <span className="font-black text-indigo-600">
            {analysis.coveredSkillsList.length}/{project.requiredSkills.length} Skills (
            {Math.round((analysis.coveredSkillsList.length / (project.requiredSkills.length || 1)) * 100)}%)
          </span>
        </div>
      </div>
    </div>
  );
};
