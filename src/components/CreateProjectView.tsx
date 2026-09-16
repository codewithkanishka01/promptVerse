import React, { useState } from 'react';
import {
  Sparkles,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  Calendar,
  Users,
  Clock,
  Send,
  Zap,
  Tag
} from 'lucide-react';
import { Project, ProjectType, Student } from '../types';

interface CreateProjectViewProps {
  currentUser: Student;
  onCreateProject: (project: Project) => void;
}

const COMMON_SKILL_SUGGESTIONS = [
  'Python',
  'Machine Learning',
  'React',
  'UI/UX',
  'Figma',
  'Node.js',
  'Database',
  'SQL',
  'Data Analysis',
  'FastAPI',
  'Flutter',
  'Cybersecurity',
  'Computer Vision',
  'Statistics',
  'Deep Learning',
  'Leadership',
  'Research'
];

const SAMPLE_AI_IDEAS = [
  'I want to build an AI-powered platform that predicts student dropout risk using academic and behavioral data.',
  'Building an offline-first mobile app for campus shuttle GPS tracking with crowd-sourced occupancy updates.',
  'Creating a collaborative design system & UI component library for campus hackathons and club websites.',
  'Developing a micro-lending and student grant risk evaluation engine using graph algorithms and FastAPI.'
];

export const CreateProjectView: React.FC<CreateProjectViewProps> = ({
  currentUser,
  onCreateProject
}) => {
  const [activeMode, setActiveMode] = useState<'ai' | 'wizard'>('ai');

  // AI Prompt State
  const [naturalInput, setNaturalInput] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [aiRationale, setAiRationale] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ProjectType>('College Project');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['Python', 'Machine Learning', 'React']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [teamSize, setTeamSize] = useState(4);
  const [deadline, setDeadline] = useState('May 30, 2026');
  const [availabilityRequirement, setAvailabilityRequirement] = useState<'Weekdays' | 'Weekends' | 'Evenings' | 'Flexible'>('Flexible');

  // AI Extraction handler
  const handleAIExtract = async (textToExtract?: string) => {
    const text = textToExtract || naturalInput;
    if (!text.trim() || isExtracting) return;

    setIsExtracting(true);
    setAiRationale(null);

    try {
      const res = await fetch('/api/ai/extract-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!res.ok) throw new Error('Failed to extract project details');
      const data = await res.json();

      setName(data.name || 'AI Student Platform');
      setDescription(data.description || text);
      if (data.type) setType(data.type);
      if (Array.isArray(data.requiredSkills) && data.requiredSkills.length > 0) {
        setRequiredSkills(data.requiredSkills);
      }
      if (data.teamSize) setTeamSize(data.teamSize);
      if (data.availabilityRequirement) setAvailabilityRequirement(data.availabilityRequirement);
      if (data.rationale) setAiRationale(data.rationale);

      setActiveMode('wizard');
    } catch (err) {
      // Client-side fallback if server offline
      setName('Dropout Risk Predictor Platform');
      setDescription(text);
      setType('Research');
      setRequiredSkills(['Machine Learning', 'Python', 'Data Analysis', 'Pandas', 'Statistics', 'UI/UX']);
      setTeamSize(4);
      setAvailabilityRequirement('Flexible');
      setAiRationale('Extracted core predictive modeling, data pipeline, and UI/UX requirements.');
      setActiveMode('wizard');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (!requiredSkills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setRequiredSkills([...requiredSkills, trimmed]);
    }
    setCustomSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name,
      description,
      type,
      requiredSkills,
      teamSize,
      deadline,
      availabilityRequirement,
      currentTeam: [
        {
          studentId: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          role: 'Project Creator & Lead',
          primarySkills: currentUser.skills.slice(0, 3).map((s) => s.name),
          isLead: true
        }
      ],
      status: 'Recruiting',
      createdAt: 'Just now'
    };

    onCreateProject(newProject);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Mode Selector Tabs */}
      <div className="flex items-center justify-between bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            id="tab-mode-ai"
            onClick={() => setActiveMode('ai')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'ai'
                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Natural Language AI Input</span>
          </button>

          <button
            id="tab-mode-wizard"
            onClick={() => setActiveMode('wizard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'wizard'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Structured Project Form</span>
          </button>
        </div>

        <span className="text-[11px] text-slate-400 font-medium px-3 hidden sm:inline">
          {activeMode === 'ai' ? 'Describe your idea naturally' : 'Fine-tune skill requirements'}
        </span>
      </div>

      {/* Mode 1: Natural Language AI Input (Section 13) */}
      {activeMode === 'ai' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5 animate-in fade-in">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Section 13 • Semantic Project Decomposition</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Describe Your Project in Plain English</h2>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              SkillGraph's AI decomposes your description into technical requirements, domain roles, and skill tags automatically.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Project Vision</label>
            <textarea
              rows={4}
              value={naturalInput}
              onChange={(e) => setNaturalInput(e.target.value)}
              placeholder="e.g. I want to build an AI-powered platform that predicts student dropout risk using academic and behavioral data..."
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none transition-all leading-relaxed"
            />
          </div>

          {/* Quick Idea Starters */}
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Try a Sample Student Prompt:
            </span>
            <div className="space-y-2">
              {SAMPLE_AI_IDEAS.map((idea, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setNaturalInput(idea);
                    handleAIExtract(idea);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-100 text-xs text-slate-700 font-medium transition-colors flex items-center justify-between group"
                >
                  <span className="truncate pr-2">"{idea}"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              onClick={() => handleAIExtract()}
              disabled={!naturalInput.trim() || isExtracting}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-100 transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{isExtracting ? 'Analyzing Requirements with Gemini...' : 'Decompose & Extract Skills'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Mode 2: Structured Project Wizard (Section 6) */}
      {activeMode === 'wizard' && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in"
        >
          {aiRationale && (
            <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-start gap-3 text-xs text-indigo-900">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">AI Skill Extraction Rationale:</span>
                <p className="text-indigo-800 leading-relaxed">{aiRationale}</p>
              </div>
            </div>
          )}

          {/* Project Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Project Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. AI Campus Navigation, Student Dropout Risk Predictor"
              required
              className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Project Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Project Objective & Summary</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline what problem your project solves and what key milestones are needed..."
              required
              className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none"
            />
          </div>

          {/* Type & Team Size & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Project Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ProjectType)}
                className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="College Project">College Project</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Research">Research</option>
                <option value="Startup">Startup</option>
                <option value="Competition">Competition</option>
                <option value="Club Activity">Club Activity</option>
                <option value="Open Source">Open Source</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Target Team Size</label>
              <input
                type="number"
                min={2}
                max={8}
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Schedule Availability</label>
              <select
                value={availabilityRequirement}
                onChange={(e) => setAvailabilityRequirement(e.target.value as any)}
                className="w-full text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="Flexible">Flexible (Anytime)</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Weekends">Weekends</option>
                <option value="Evenings">Evenings</option>
              </select>
            </div>
          </div>

          {/* Required Skills Management */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Required Skills ({requiredSkills.length})
              </label>
              <span className="text-[11px] text-slate-400">Click to remove or select suggestions</span>
            </div>

            {/* Selected Skills Chips */}
            <div className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 min-h-[50px]">
              {requiredSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:text-rose-600 font-bold"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            {/* Add Custom Skill Input */}
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill(customSkillInput);
                  }
                }}
                placeholder="Type custom skill and press Enter..."
                className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus:bg-white focus:border-indigo-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(customSkillInput)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
              >
                Add Skill
              </button>
            </div>

            {/* Suggestions Strip */}
            <div className="mt-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Quick Add Suggestions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SKILL_SUGGESTIONS.filter((s) => !requiredSkills.includes(s)).slice(0, 10).map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleAddSkill(skill)}
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveMode('ai')}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              ← Back to AI Prompt
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create & Launch AI Team Builder</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
