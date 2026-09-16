import {
  Project,
  Student,
  StudentRecommendation,
  MatchReasoning,
  TeamCompositionAnalysis,
  ProficiencyLevel
} from '../types';
import { SEMANTIC_KNOWLEDGE_BASE, SMART_ALTERNATIVES_MAP } from '../data/mockData';

export function calculateStudentMatch(
  student: Student,
  project: Project
): MatchReasoning {
  const currentTeamMemberIds = new Set(project.currentTeam.map((m) => m.studentId));
  // If student is already in the team, they are not a candidate
  const isAlreadyInTeam = currentTeamMemberIds.has(student.id);

  // Covered skills in current team
  const coveredByCurrentTeam = new Set<string>();
  project.currentTeam.forEach((member) => {
    member.primarySkills.forEach((s) => coveredByCurrentTeam.add(s.toLowerCase()));
  });

  // Calculate missing skills for the project
  const missingSkills = project.requiredSkills.filter((req) => {
    const reqLower = req.toLowerCase();
    if (coveredByCurrentTeam.has(reqLower)) return false;

    // Check semantic coverage in current team
    const relatives = SEMANTIC_KNOWLEDGE_BASE[req] || [];
    const isRelativelyCovered = relatives.some((rel) =>
      coveredByCurrentTeam.has(rel.toLowerCase())
    );
    return !isRelativelyCovered;
  });

  const matchedSkills: Array<{
    skill: string;
    level: ProficiencyLevel;
    semanticMatch?: string;
  }> = [];

  const studentSkillsMap = new Map<string, { level: ProficiencyLevel; originalName: string }>();
  student.skills.forEach((s) => {
    studentSkillsMap.set(s.name.toLowerCase(), { level: s.level, originalName: s.name });
  });

  let rawScore = 0;
  const whyRecommended: string[] = [];
  let smartAlternative: MatchReasoning['smartAlternative'] = undefined;

  // Evaluate against all required skills, with extra weight for currently MISSING skills
  project.requiredSkills.forEach((req) => {
    const reqLower = req.toLowerCase();
    const isMissingFromTeam = missingSkills.some((m) => m.toLowerCase() === reqLower);
    const missingMultiplier = isMissingFromTeam ? 1.3 : 1.0;

    // Direct match
    if (studentSkillsMap.has(reqLower)) {
      const match = studentSkillsMap.get(reqLower)!;
      matchedSkills.push({
        skill: match.originalName,
        level: match.level
      });

      const levelScore =
        match.level === 'Advanced' ? 26 : match.level === 'Intermediate' ? 18 : 10;
      rawScore += levelScore * missingMultiplier;
      return;
    }

    // Semantic match check
    const relatives = SEMANTIC_KNOWLEDGE_BASE[req] || [];
    const matchedRelatives: string[] = [];
    let bestLevel: ProficiencyLevel = 'Intermediate';

    for (const rel of relatives) {
      if (studentSkillsMap.has(rel.toLowerCase())) {
        const item = studentSkillsMap.get(rel.toLowerCase())!;
        matchedRelatives.push(item.originalName);
        if (item.level === 'Advanced') {
          bestLevel = 'Advanced';
        }
      }
    }

    if (matchedRelatives.length > 0) {
      matchedSkills.push({
        skill: req,
        level: bestLevel,
        semanticMatch: `Semantic match via ${matchedRelatives.slice(0, 2).join(' + ')}`
      });

      const semanticScore =
        bestLevel === 'Advanced' ? 22 : bestLevel === 'Intermediate' ? 15 : 9;
      rawScore += semanticScore * missingMultiplier;
      return;
    }

    // Smart alternative check
    if (SMART_ALTERNATIVES_MAP[req] && !smartAlternative) {
      const altInfo = SMART_ALTERNATIVES_MAP[req];
      const altRel = altInfo.alternative.split('/')[0].trim().toLowerCase();
      if (
        studentSkillsMap.has(altRel) ||
        student.skills.some((s) => s.name.toLowerCase().includes(altRel))
      ) {
        smartAlternative = {
          requiredSkill: req,
          studentHasSkill: altInfo.alternative,
          reasoning: altInfo.reason
        };
        rawScore += 12;
      }
    }
  });

  // Project experience bonus
  if (student.projectsCount >= 5) {
    rawScore += 12;
    whyRecommended.push(`${student.projectsCount} verified campus projects with strong delivery track record`);
  } else if (student.projectsCount >= 3) {
    rawScore += 8;
    whyRecommended.push(`${student.projectsCount} previous projects in related domains`);
  } else if (student.projectsCount >= 1) {
    rawScore += 4;
  }

  // Availability alignment
  let availabilityMatch = false;
  if (
    project.availabilityRequirement === 'Flexible' ||
    student.availability === 'Flexible' ||
    project.availabilityRequirement === student.availability
  ) {
    availabilityMatch = true;
    rawScore += 10;
    whyRecommended.push(`Availability matches schedule (${student.availability}, ~${student.hoursPerWeek} hrs/wk)`);
  } else {
    rawScore += 2;
  }

  // Domain interests bonus
  const matchedInterests = student.interests.filter(
    (int) =>
      project.description.toLowerCase().includes(int.toLowerCase()) ||
      project.name.toLowerCase().includes(int.toLowerCase())
  );
  if (matchedInterests.length > 0) {
    rawScore += 8;
    whyRecommended.push(`Direct interest in ${matchedInterests.join(' & ')}`);
  }

  // Synthesize top whyRecommended bullets
  if (matchedSkills.length > 0) {
    const topSkills = matchedSkills.slice(0, 3).map((s) => `${s.skill} (${s.level})`).join(', ');
    whyRecommended.unshift(`High proficiency in target roles: ${topSkills}`);
  }

  // Calculate final percentage score bounded between 15% and 98%
  const maxPossible = Math.max(project.requiredSkills.length * 28 + 30, 80);
  let finalScore = Math.round((rawScore / maxPossible) * 100);
  finalScore = Math.min(Math.max(finalScore, 20), 96);

  // Remaining skills candidate lacks
  const remainingMissing = project.requiredSkills.filter(
    (req) => !matchedSkills.some((m) => m.skill.toLowerCase() === req.toLowerCase())
  );

  let potentialGap: string | undefined;
  if (remainingMissing.length > 0) {
    potentialGap = `Limited background in ${remainingMissing.slice(0, 2).join(', ')}`;
  } else {
    potentialGap = 'No major technical skill gaps identified for assigned scope';
  }

  return {
    finalScore,
    skillMatchCount: matchedSkills.length,
    totalRequired: project.requiredSkills.length,
    matchedSkills,
    missingSkills: remainingMissing,
    experienceHighlight: student.experience[0]?.summary || `${student.projectsCount} projects on campus`,
    availabilityMatch,
    whyRecommended,
    potentialGap,
    smartAlternative
  };
}

export function rankCandidatesForProject(
  project: Project,
  allStudents: Student[]
): StudentRecommendation[] {
  const currentMemberIds = new Set(project.currentTeam.map((m) => m.studentId));

  return allStudents
    .filter((s) => !currentMemberIds.has(s.id) && s.privacy.isDiscoverable)
    .map((student) => ({
      student,
      match: calculateStudentMatch(student, project)
    }))
    .sort((a, b) => b.match.finalScore - a.match.finalScore);
}

export function analyzeTeamComposition(
  project: Project,
  allStudents: Student[]
): TeamCompositionAnalysis {
  // Collect all skills from current team members
  const teamMemberSkills = new Map<string, string[]>();
  const allCoveredSkills = new Set<string>();

  project.currentTeam.forEach((member) => {
    // Find full student profile if available
    const fullStudent = allStudents.find((s) => s.id === member.studentId);
    const skills = fullStudent
      ? fullStudent.skills.map((s) => s.name)
      : member.primarySkills;
    teamMemberSkills.set(member.name, skills);
    skills.forEach((s) => allCoveredSkills.add(s.toLowerCase()));
  });

  // Calculate domain coverages
  const technicalTerms = ['python', 'c++', 'java', 'sql', 'machine learning', 'data science', 'docker', 'database'];
  const designTerms = ['figma', 'ui/ux', 'canva', 'prototyping', 'wireframing', 'user testing'];
  const researchTerms = ['research', 'statistics', 'user testing', 'data analysis', 'documentation'];
  const backendTerms = ['node.js', 'backend', 'database', 'sql', 'mongodb', 'fastapi', 'spring boot', 'express'];

  const calcCoverage = (terms: string[]) => {
    const hits = terms.filter((t) => allCoveredSkills.has(t));
    const ratio = hits.length / Math.min(terms.length, 4);
    return Math.min(Math.round(ratio * 100), 96);
  };

  const technicalCoverage = Math.max(calcCoverage(technicalTerms), project.currentTeam.length > 0 ? 60 : 0);
  const designCoverage = calcCoverage(designTerms);
  const researchCoverage = calcCoverage(researchTerms);
  const backendCoverage = calcCoverage(backendTerms);

  // Missing required skills
  const missingSkillsList: string[] = [];
  const coveredSkillsList: string[] = [];

  project.requiredSkills.forEach((req) => {
    const reqLower = req.toLowerCase();
    const isDirect = allCoveredSkills.has(reqLower);
    const relatives = SEMANTIC_KNOWLEDGE_BASE[req] || [];
    const isSemantic = relatives.some((rel) => allCoveredSkills.has(rel.toLowerCase()));

    if (isDirect || isSemantic) {
      coveredSkillsList.push(req);
    } else {
      missingSkillsList.push(req);
    }
  });

  // Overlapping skills detection
  const skillFrequency = new Map<string, string[]>();
  teamMemberSkills.forEach((skills, memberName) => {
    skills.forEach((skill) => {
      const list = skillFrequency.get(skill) || [];
      list.push(memberName);
      skillFrequency.set(skill, list);
    });
  });

  const overlappingSkills: Array<{ skill: string; members: string[] }> = [];
  skillFrequency.forEach((members, skill) => {
    if (members.length > 1) {
      overlappingSkills.push({ skill, members });
    }
  });

  // Potential concern and suggested action
  let potentialConcern = 'Team composition is well-balanced across current project domains.';
  let suggestedAction = 'Proceed with sprint planning or invite a documentation/QA lead.';

  if (designCoverage < 40 && project.requiredSkills.some((s) => ['UI/UX', 'Figma', 'Design'].includes(s))) {
    potentialConcern = 'Team has limited dedicated UI/UX design capacity. User experience and wireframes may face bottlenecks.';
    suggestedAction = 'Consider adding Aarav Sharma or Priya Mehta to handle design systems and user journey flows.';
  } else if (backendCoverage < 40 && project.requiredSkills.some((s) => ['Backend', 'Database', 'SQL', 'Node.js'].includes(s))) {
    potentialConcern = 'Database schema and backend API coverage is currently below recommended threshold.';
    suggestedAction = 'Invite Rahul Verma or Kabir Gupta to architect the server endpoints and data storage.';
  } else if (overlappingSkills.length >= 2) {
    potentialConcern = `Multiple members have overlapping ${overlappingSkills[0].skill} skills while remaining specialized roles are still open.`;
    suggestedAction = 'Ensure distinct role delegation (e.g. Lead Developer vs Interface Engineer) to avoid redundant efforts.';
  }

  const overallBalance = Math.round(
    (technicalCoverage * 0.35 +
      designCoverage * 0.25 +
      backendCoverage * 0.25 +
      researchCoverage * 0.15)
  );

  return {
    technicalCoverage,
    designCoverage,
    researchCoverage,
    backendCoverage,
    overallBalance: Math.min(overallBalance, 96),
    potentialConcern,
    suggestedAction,
    coveredSkillsList,
    missingSkillsList,
    overlappingSkills
  };
}

export function calculateTeamCompleteness(project: Project, allStudents: Student[]): number {
  const analysis = analyzeTeamComposition(project, allStudents);
  if (project.requiredSkills.length === 0) return 0;
  const ratio = analysis.coveredSkillsList.length / project.requiredSkills.length;
  return Math.round(ratio * 100);
}
