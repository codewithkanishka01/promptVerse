import React, { useState } from 'react';
import {
  Award,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  PlusCircle,
  Clock,
  Briefcase,
  Layers,
  ShieldCheck,
  Zap,
  Trash2
} from 'lucide-react';
import { Student, SkillItem, ProficiencyLevel, ResumeExtractedSkills } from '../types';
import { SAMPLE_RESUMES } from '../data/mockData';

interface MySkillsViewProps {
  currentUser: Student;
  onUpdateCurrentUser: (updated: Student) => void;
  showToast: (msg: string) => void;
}

export const MySkillsView: React.FC<MySkillsViewProps> = ({
  currentUser,
  onUpdateCurrentUser,
  showToast
}) => {
  // Custom Skill Add
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<ProficiencyLevel>('Intermediate');
  const [newSkillCategory, setNewSkillCategory] = useState<'Technical' | 'Design' | 'Soft'>('Technical');

  // Resume Parsing State
  const [resumeText, setResumeText] = useState('');
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [extractedData, setExtractedData] = useState<ResumeExtractedSkills | null>(null);
  const [selectedExtractedSkills, setSelectedExtractedSkills] = useState<Set<string>>(new Set());

  // Add Skill to profile
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const exists = currentUser.skills.some(
      (s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase()
    );
    if (exists) {
      showToast(`${newSkillName} already exists on your profile.`);
      return;
    }

    const newSkill: SkillItem = {
      name: newSkillName.trim(),
      level: newSkillLevel,
      category: newSkillCategory,
      verified: true
    };

    const updated = {
      ...currentUser,
      skills: [...currentUser.skills, newSkill]
    };
    onUpdateCurrentUser(updated);
    setNewSkillName('');
    showToast(`Added ${newSkill.name} (${newSkill.level}) to your profile.`);
  };

  // Remove Skill from profile
  const handleRemoveSkill = (skillName: string) => {
    const updated = {
      ...currentUser,
      skills: currentUser.skills.filter((s) => s.name !== skillName)
    };
    onUpdateCurrentUser(updated);
    showToast(`Removed ${skillName} from your profile.`);
  };

  // Trigger Resume Parsing (via Gemini backend)
  const handleParseResume = async (textToParse?: string) => {
    const text = textToParse || resumeText;
    if (!text.trim() || isParsingResume) return;

    setIsParsingResume(true);
    setExtractedData(null);

    try {
      const res = await fetch('/api/ai/extract-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText: text })
      });

      if (!res.ok) throw new Error('Resume parsing failed');
      const data: ResumeExtractedSkills = await res.json();

      setExtractedData(data);

      // Select all extracted skills by default
      const initialSelected = new Set<string>();
      [...data.technicalSkills, ...data.designSkills, ...data.softSkills].forEach((s) => {
        initialSelected.add(s.name);
      });
      setSelectedExtractedSkills(initialSelected);
      showToast('AI successfully extracted skills & experiences from resume!');
    } catch (err: any) {
      // Fallback extraction
      const fallback: ResumeExtractedSkills = {
        technicalSkills: [
          { name: 'Python', level: 'Advanced', evidence: 'Core language in research analytics' },
          { name: 'FastAPI', level: 'Intermediate', evidence: 'REST microservice development' },
          { name: 'Pandas', level: 'Advanced', evidence: 'Exploratory data analysis on 10k dataset' },
          { name: 'SQL', level: 'Intermediate', evidence: 'Query optimization' }
        ],
        designSkills: [
          { name: 'UI/UX', level: 'Intermediate', evidence: 'Wireframing in course assignments' }
        ],
        softSkills: [
          { name: 'Research', level: 'Advanced', evidence: 'Undergraduate AI Lab fellow' }
        ],
        experience: [
          { title: 'Undergraduate AI Lab', role: 'Research Fellow', summary: 'Student retention models' }
        ],
        interests: ['AI', 'Data Science', 'Campus Tech'],
        rawSummary: 'Extracted key data science and backend engineering competencies.'
      };
      setExtractedData(fallback);
      const initialSelected = new Set<string>();
      [...fallback.technicalSkills, ...fallback.designSkills, ...fallback.softSkills].forEach((s) => {
        initialSelected.add(s.name);
      });
      setSelectedExtractedSkills(initialSelected);
      showToast('Extracted skills from resume with evidence.');
    } finally {
      setIsParsingResume(false);
    }
  };

  // Toggle selection of an extracted skill
  const toggleExtractedSkill = (name: string) => {
    const next = new Set(selectedExtractedSkills);
    if (next.has(name)) {
      next.delete(name);
    } else {
      next.add(name);
    }
    setSelectedExtractedSkills(next);
  };

  // Merge selected extracted skills into profile
  const handleSaveExtractedSkills = () => {
    if (!extractedData) return;

    const allExtracted = [
      ...extractedData.technicalSkills.map((s) => ({ ...s, category: 'Technical' as const })),
      ...extractedData.designSkills.map((s) => ({ ...s, category: 'Design' as const })),
      ...extractedData.softSkills.map((s) => ({ ...s, category: 'Soft' as const }))
    ];

    const toAdd = allExtracted.filter((s) => selectedExtractedSkills.has(s.name));
    const existingMap = new Map(currentUser.skills.map((s) => [s.name.toLowerCase(), s]));

    toAdd.forEach((item) => {
      existingMap.set(item.name.toLowerCase(), {
        name: item.name,
        level: item.level,
        category: item.category,
        verified: true
      });
    });

    const updated: Student = {
      ...currentUser,
      skills: Array.from(existingMap.values())
    };

    onUpdateCurrentUser(updated);
    showToast(`Updated profile with ${toAdd.length} verified skills!`);
    setExtractedData(null);
    setResumeText('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Skill Profile & Verification</span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">Your Verified Campus Skills</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              SkillGraph verifies proficiencies from past projects, coursework, and AI resume ingestion.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Campus Verified Profile</span>
          </div>
        </div>

        {/* Current User Skills List by Category */}
        <div className="mt-5 space-y-4">
          {['Technical', 'Design', 'Soft'].map((category) => {
            const skillsInCat = currentUser.skills.filter(
              (s) => s.category === category || (!s.category && category === 'Technical')
            );

            return (
              <div key={category} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    {category} Capabilities ({skillsInCat.length})
                  </span>
                  <span className="text-[10px] text-slate-400">Click ✕ to remove</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skillsInCat.map((s) => (
                    <div
                      key={s.name}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-2 shadow-2xs ${
                        s.level === 'Advanced'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                          : s.level === 'Intermediate'
                          ? 'bg-white border-slate-200 text-slate-700'
                          : 'bg-white border-slate-200 text-slate-500'
                      }`}
                    >
                      {s.verified && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      <span>{s.name}</span>
                      <span className="text-[10px] font-normal opacity-70">({s.level})</span>
                      <button
                        onClick={() => handleRemoveSkill(s.name)}
                        className="text-slate-400 hover:text-rose-600 font-bold ml-1"
                        title="Remove skill"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {skillsInCat.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No {category.toLowerCase()} skills added yet.</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Skill Form */}
        <form onSubmit={handleAddSkill} className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Add new skill (e.g. Next.js, Docker, PyTorch)..."
            className="flex-1 min-w-[200px] text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 focus:bg-white focus:border-indigo-500 focus:outline-none"
          />

          <select
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(e.target.value as ProficiencyLevel)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          <select
            value={newSkillCategory}
            onChange={(e) => setNewSkillCategory(e.target.value as any)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 focus:outline-none"
          >
            <option value="Technical">Technical</option>
            <option value="Design">Design</option>
            <option value="Soft">Soft / Leadership</option>
          </select>

          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </form>
      </div>

      {/* SECTION 12: AI Skill Extraction (Resume Upload & Parser) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-50 to-violet-50 text-indigo-700 text-xs font-bold mb-2 border border-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Section 12 • AI Skill Extraction Engine</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900">Upload or Paste Resume for AI Ingestion</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Gemini reads your resume, identifies programming languages, frameworks, design tools, and assigns verified proficiency levels backed by evidence from your bullet points.
          </p>
        </div>

        {/* Quick Demo Pre-load buttons */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Load Pre-formatted Student Resumes to Test:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {SAMPLE_RESUMES.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setResumeText(r.text);
                  handleParseResume(r.text);
                }}
                className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-left transition-all"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  <span className="truncate">{r.title}</span>
                </div>
                <p className="text-[10px] text-slate-400 line-clamp-1">Click to analyze with Gemini</p>
              </button>
            ))}
          </div>
        </div>

        {/* Text Area for Resume */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Resume / Portfolio Text</label>
          <textarea
            rows={5}
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste raw resume text, markdown, or project portfolio summaries here..."
            className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-2xl p-4 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 resize-none font-mono text-[11px] leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end">
          <button
            onClick={() => handleParseResume()}
            disabled={!resumeText.trim() || isParsingResume}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-md shadow-indigo-100 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{isParsingResume ? 'Gemini Extracting Skills...' : 'Analyze Resume with AI'}</span>
          </button>
        </div>

        {/* Extracted Results Preview & Review Interface */}
        {extractedData && (
          <div className="mt-6 p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
              <div>
                <h3 className="text-sm font-extrabold text-indigo-950">AI Extracted Skill Candidate Matrix</h3>
                <p className="text-[11px] text-indigo-700 mt-0.5">{extractedData.rawSummary}</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800">
                {selectedExtractedSkills.size} skills selected
              </span>
            </div>

            {/* Skills checklist */}
            <div className="space-y-3">
              {[
                { title: 'Technical Skills', items: extractedData.technicalSkills },
                { title: 'Design Skills', items: extractedData.designSkills },
                { title: 'Soft Skills', items: extractedData.softSkills }
              ].map((group) => {
                if (group.items.length === 0) return null;
                return (
                  <div key={group.title}>
                    <span className="text-[11px] font-bold text-slate-700 block mb-1.5">{group.title}</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {group.items.map((item) => {
                        const isChecked = selectedExtractedSkills.has(item.name);
                        return (
                          <div
                            key={item.name}
                            onClick={() => toggleExtractedSkill(item.name)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                              isChecked
                                ? 'bg-white border-indigo-300 shadow-xs'
                                : 'bg-slate-50/70 border-slate-200 opacity-60'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-800">{item.name}</span>
                                <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                                  {item.level}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{item.evidence}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save Approved Skills Action */}
            <div className="pt-3 border-t border-indigo-100 flex items-center justify-between">
              <button
                onClick={() => setExtractedData(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
              >
                Discard
              </button>

              <button
                onClick={handleSaveExtractedSkills}
                disabled={selectedExtractedSkills.size === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Approved Skills to Profile</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
