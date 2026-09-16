import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { AIBuilderView } from './components/AIBuilderView';
import { CreateProjectView } from './components/CreateProjectView';
import { DiscoverStudentsView } from './components/DiscoverStudentsView';
import { MySkillsView } from './components/MySkillsView';
import { MyProjectsView } from './components/MyProjectsView';
import { TeamRequestsView } from './components/TeamRequestsView';
import { ProfileView } from './components/ProfileView';
import { StudentProfileModal } from './components/StudentProfileModal';
import { InviteModal } from './components/InviteModal';
import { AIChatDrawer } from './components/AIChatDrawer';
import { SkillGraphVisualization } from './components/SkillGraphVisualization';
import {
  CURRENT_USER,
  INITIAL_STUDENTS,
  INITIAL_PROJECTS,
  INITIAL_REQUESTS
} from './data/mockData';
import { Student, Project, TeamRequest } from './types';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

export function App() {
  const [currentUser, setCurrentUser] = useState<Student>(CURRENT_USER);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [activeProjectId, setActiveProjectId] = useState<string>(INITIAL_PROJECTS[0].id);
  const [allStudents, setAllStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [requests, setRequests] = useState<TeamRequest[]>(INITIAL_REQUESTS);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSkillGraphModalOpen, setIsSkillGraphModalOpen] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);
  const [studentForInviteModal, setStudentForInviteModal] = useState<Student | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Dynamic Toggle Team Member in active project
  const handleToggleTeamMember = (student: Student) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => {
        if (p.id !== activeProject.id) return p;

        const isMember = p.currentTeam.some((m) => m.studentId === student.id);
        if (isMember) {
          // Prevent removing the project creator/lead
          const member = p.currentTeam.find((m) => m.studentId === student.id);
          if (member?.isLead) {
            showToast('Cannot remove the project lead.');
            return p;
          }
          showToast(`Removed ${student.name} from proposed team.`);
          return {
            ...p,
            currentTeam: p.currentTeam.filter((m) => m.studentId !== student.id)
          };
        } else {
          if (p.currentTeam.length >= p.teamSize) {
            showToast(`Team is at maximum capacity (${p.teamSize} members). Expand team size to add more.`);
            return p;
          }
          const newMember = {
            studentId: student.id,
            name: student.name,
            avatar: student.avatar,
            role: `${student.skills[0]?.name || 'Core'} Engineer`,
            primarySkills: student.skills.slice(0, 3).map((s) => s.name)
          };
          showToast(`Added ${student.name} to proposed team! Completeness updated.`);
          return {
            ...p,
            currentTeam: [...p.currentTeam, newMember]
          };
        }
      })
    );
  };

  // Create Project
  const handleCreateProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
    setActiveProjectId(newProject.id);
    setActiveTab('ai-builder');
    showToast(`Created project "${newProject.name}". AI Team Builder launched!`);
  };

  // Send Invitation
  const handleSendInvite = (inviteData: {
    role: string;
    requiredSkills: string[];
    expectedContribution: string;
    deadline: string;
    timeCommitment: string;
  }) => {
    if (!studentForInviteModal) return;

    const newReq: TeamRequest = {
      id: `req-${Date.now()}`,
      projectId: activeProject.id,
      projectName: activeProject.name,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      receiverId: studentForInviteModal.id,
      receiverName: studentForInviteModal.name,
      role: inviteData.role,
      requiredSkills: inviteData.requiredSkills,
      expectedContribution: inviteData.expectedContribution,
      deadline: inviteData.deadline,
      timeCommitment: inviteData.timeCommitment,
      status: 'Pending',
      createdAt: 'Just now'
    };

    setRequests((prev) => [newReq, ...prev]);
    showToast(`Official team invitation sent to ${studentForInviteModal.name}.`);
    setStudentForInviteModal(null);
  };

  // Accept Request
  const handleAcceptRequest = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Accepted' as const } : r))
    );
    showToast('Accepted project invitation! You are now part of the team.');
  };

  // Decline Request
  const handleDeclineRequest = (requestId: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Declined' as const } : r))
    );
    showToast('Declined project invitation.');
  };

  // Submit Inquiry Question
  const handleInquirySubmit = (requestId: string, message: string) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === requestId ? { ...r, status: 'Inquiry' as const, inquiryMessage: message } : r
      )
    );
  };

  const pendingRequestsCount = requests.filter(
    (r) => r.receiverId === currentUser.id && r.status === 'Pending'
  ).length;

  return (
    <div className="min-h-screen bg-slate-100/60 font-sans text-slate-800 flex flex-col antialiased">
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          pendingRequestsCount={pendingRequestsCount}
          openChat={() => setIsChatOpen(true)}
          openSkillGraphModal={() => setIsSkillGraphModalOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            projects={projects}
            activeProjectId={activeProjectId}
            setActiveProjectId={setActiveProjectId}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            requests={requests}
            openChat={() => setIsChatOpen(true)}
            openSkillGraphModal={() => setIsSkillGraphModalOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {activeTab === 'dashboard' && (
              <DashboardView
                currentUser={currentUser}
                activeProject={activeProject}
                allProjects={projects}
                allStudents={allStudents}
                requests={requests}
                setActiveTab={setActiveTab}
                setActiveProjectId={setActiveProjectId}
                onOpenInvite={(student) => setStudentForInviteModal(student)}
                onViewStudent={(student) => setSelectedStudentForModal(student)}
                openSkillGraphModal={() => setIsSkillGraphModalOpen(true)}
              />
            )}

            {activeTab === 'ai-builder' && (
              <AIBuilderView
                activeProject={activeProject}
                allProjects={projects}
                setActiveProjectId={setActiveProjectId}
                allStudents={allStudents}
                onToggleTeamMember={handleToggleTeamMember}
                onOpenInvite={(student) => setStudentForInviteModal(student)}
                onViewStudent={(student) => setSelectedStudentForModal(student)}
                openSkillGraphModal={() => setIsSkillGraphModalOpen(true)}
                openChat={() => setIsChatOpen(true)}
              />
            )}

            {activeTab === 'create' && (
              <CreateProjectView
                currentUser={currentUser}
                onCreateProject={handleCreateProject}
              />
            )}

            {activeTab === 'discover' && (
              <DiscoverStudentsView
                allStudents={allStudents}
                activeProject={activeProject}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onViewStudent={(student) => setSelectedStudentForModal(student)}
                onOpenInvite={(student) => setStudentForInviteModal(student)}
                onToggleTeamMember={handleToggleTeamMember}
              />
            )}

            {activeTab === 'my-skills' && (
              <MySkillsView
                currentUser={currentUser}
                onUpdateCurrentUser={setCurrentUser}
                showToast={showToast}
              />
            )}

            {activeTab === 'my-projects' && (
              <MyProjectsView
                projects={projects}
                activeProjectId={activeProjectId}
                setActiveProjectId={setActiveProjectId}
                allStudents={allStudents}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'requests' && (
              <TeamRequestsView
                requests={requests}
                currentUser={currentUser}
                onAcceptRequest={handleAcceptRequest}
                onDeclineRequest={handleDeclineRequest}
                onInquirySubmit={handleInquirySubmit}
                showToast={showToast}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                currentUser={currentUser}
                onUpdateCurrentUser={setCurrentUser}
                showToast={showToast}
              />
            )}
          </main>
        </div>
      </div>

      {/* Student Profile Modal */}
      {selectedStudentForModal && (
        <StudentProfileModal
          student={selectedStudentForModal}
          project={activeProject}
          onClose={() => setSelectedStudentForModal(null)}
          onOpenInvite={() => setStudentForInviteModal(selectedStudentForModal)}
          onToggleTeamMember={handleToggleTeamMember}
          isInTeam={activeProject.currentTeam.some((m) => m.studentId === selectedStudentForModal.id)}
        />
      )}

      {/* Invite Modal */}
      {studentForInviteModal && (
        <InviteModal
          student={studentForInviteModal}
          project={activeProject}
          onClose={() => setStudentForInviteModal(null)}
          onSendInvite={handleSendInvite}
        />
      )}

      {/* Interactive Skill Graph Modal */}
      {isSkillGraphModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-5xl w-full">
            <SkillGraphVisualization
              project={activeProject}
              allStudents={allStudents}
              isModal={true}
              onClose={() => setIsSkillGraphModalOpen(false)}
              onSelectMissingSkill={(skill) => {
                setIsSkillGraphModalOpen(false);
                setActiveTab('ai-builder');
              }}
            />
          </div>
        </div>
      )}

      {/* AI Chat Assistant Drawer (Section 17) */}
      <AIChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        project={activeProject}
        allStudents={allStudents}
        onOpenInvite={(student) => setStudentForInviteModal(student)}
        onViewStudent={(student) => setSelectedStudentForModal(student)}
      />

      {/* Global Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
