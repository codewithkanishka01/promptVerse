export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface SkillItem {
  name: string;
  level: ProficiencyLevel;
  category?: 'Technical' | 'Design' | 'Soft' | 'Domain';
  verified?: boolean;
}

export interface StudentExperience {
  title: string;
  role: string;
  summary: string;
  duration?: string;
  link?: string;
}

export interface Student {
  id: string;
  name: string;
  avatar: string;
  department: string;
  year: string;
  bio: string;
  skills: SkillItem[];
  projectsCount: number;
  featuredProjects: string[];
  interests: string[];
  availability: 'Weekdays' | 'Weekends' | 'Evenings' | 'Flexible';
  hoursPerWeek: number;
  experience: StudentExperience[];
  privacy: {
    isDiscoverable: boolean;
    showContact: boolean;
    matchingOnly: boolean;
  };
}

export type ProjectType =
  | 'College Project'
  | 'Hackathon'
  | 'Research'
  | 'Startup'
  | 'Competition'
  | 'Club Activity'
  | 'Open Source';

export interface TeamMember {
  studentId: string;
  name: string;
  avatar: string;
  role: string;
  primarySkills: string[];
  joinedAt?: string;
  isLead?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: ProjectType;
  requiredSkills: string[];
  teamSize: number;
  deadline: string;
  availabilityRequirement: 'Weekdays' | 'Weekends' | 'Evenings' | 'Flexible';
  currentTeam: TeamMember[];
  status: 'Active' | 'Recruiting' | 'Completed';
  createdAt: string;
}

export interface MatchReasoning {
  finalScore: number;
  skillMatchCount: number;
  totalRequired: number;
  matchedSkills: Array<{
    skill: string;
    level: ProficiencyLevel;
    semanticMatch?: string; // e.g. "Computer Vision matched via OpenCV & CNN"
  }>;
  missingSkills: string[];
  experienceHighlight: string;
  availabilityMatch: boolean;
  whyRecommended: string[];
  potentialGap?: string;
  smartAlternative?: {
    requiredSkill: string;
    studentHasSkill: string;
    reasoning: string;
  };
}

export interface StudentRecommendation {
  student: Student;
  match: MatchReasoning;
}

export interface TeamCompositionAnalysis {
  technicalCoverage: number;
  designCoverage: number;
  researchCoverage: number;
  backendCoverage: number;
  overallBalance: number;
  potentialConcern: string;
  suggestedAction: string;
  coveredSkillsList: string[];
  missingSkillsList: string[];
  overlappingSkills: Array<{
    skill: string;
    members: string[];
  }>;
}

export interface TeamRequest {
  id: string;
  projectId: string;
  projectName: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  receiverId: string;
  receiverName: string;
  role: string;
  requiredSkills: string[];
  expectedContribution: string;
  deadline: string;
  timeCommitment: string;
  status: 'Pending' | 'Accepted' | 'Declined' | 'Inquiry';
  inquiryMessage?: string;
  createdAt: string;
}

export interface ExtractedProjectAI {
  name: string;
  description: string;
  type: ProjectType;
  requiredSkills: string[];
  suggestedTeamRoles: string[];
  teamSize: number;
  availabilityRequirement: 'Weekdays' | 'Weekends' | 'Evenings' | 'Flexible';
  rationale: string;
}

export interface ResumeExtractedSkills {
  technicalSkills: Array<{ name: string; level: ProficiencyLevel; evidence: string }>;
  designSkills: Array<{ name: string; level: ProficiencyLevel; evidence: string }>;
  softSkills: Array<{ name: string; level: ProficiencyLevel; evidence: string }>;
  experience: Array<{ title: string; role: string; summary: string }>;
  interests: string[];
  rawSummary: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: Array<{
    label: string;
    actionType: 'invite' | 'view_student' | 'view_project' | 'filter_skill';
    payload: string;
  }>;
  candidateCards?: StudentRecommendation[];
}
