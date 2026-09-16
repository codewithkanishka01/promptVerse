import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  Menu,
  X,
  ChevronDown,
  Layers,
  CheckCircle2,
  Clock,
  ArrowRight,
  Zap,
  Network
} from 'lucide-react';
import { Project, TeamRequest } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  projects: Project[];
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  requests: TeamRequest[];
  openChat: () => void;
  openSkillGraphModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  projects,
  activeProjectId,
  setActiveProjectId,
  searchQuery,
  setSearchQuery,
  requests,
  openChat,
  openSkillGraphModal
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const pendingRequests = requests.filter((r) => r.status === 'Pending');

  return (
    <>
      <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
        {/* Left Side: Mobile Menu Button & Brand */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="lg:hidden flex items-center gap-2 text-indigo-600 font-extrabold text-lg">
            <Zap className="w-5 h-5 fill-indigo-600" />
            <span className="text-slate-900">SkillGraph</span>
          </div>

          {/* Active Project Dropdown Switcher */}
          <div className="relative hidden sm:block">
            <button
              id="header-project-switcher"
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span className="max-w-[170px] truncate">{activeProject?.name || 'Select Project'}</span>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">
                {activeProject?.teamSize - activeProject?.currentTeam.length} seats open
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showProjectDropdown && (
              <div className="absolute left-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-40 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Active Project Context
                </div>
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveProjectId(p.id);
                      setShowProjectDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 hover:bg-slate-50 flex items-center justify-between transition-colors ${
                      p.id === activeProjectId ? 'bg-indigo-50/70 text-indigo-900 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-semibold truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-400">
                        {p.currentTeam.length}/{p.teamSize} members • {p.type}
                      </p>
                    </div>
                    {p.id === activeProjectId && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-1 pt-1 px-2">
                  <button
                    onClick={() => {
                      setActiveTab('create');
                      setShowProjectDropdown(false);
                    }}
                    className="w-full text-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 py-1.5"
                  >
                    + Create New Project
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="global-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'discover' && e.target.value.trim().length > 0) {
                  setActiveTab('discover');
                }
              }}
              placeholder="Search by skill (e.g. OpenCV, React, UI/UX, Python) or student..."
              className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-xs text-slate-800 rounded-full pl-9 pr-4 py-2 border border-transparent focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Skill Graph Quick Button */}
          <button
            id="header-open-graph-btn"
            onClick={openSkillGraphModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors"
            title="Interactive Team Balance Skill Graph"
          >
            <Network className="w-3.5 h-3.5" />
            <span>Skill Graph</span>
          </button>

          {/* Ask AI Assistant Button */}
          <button
            id="header-ask-ai-btn"
            onClick={openChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-sm shadow-indigo-200 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Ask</span>
            <span>SkillGraph AI</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              id="header-notifications-bell"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {pendingRequests.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-40 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="text-xs font-bold text-slate-800">Team Requests & Alerts</span>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold">
                    {pendingRequests.length} new
                  </span>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {requests.slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setActiveTab('requests');
                        setShowNotifications(false);
                      }}
                      className="p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-slate-100"
                    >
                      <div className="flex items-start justify-between">
                        <p className="text-xs font-bold text-slate-800">{r.projectName}</p>
                        <span className="text-[10px] text-slate-400">{r.createdAt}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        <span className="font-semibold text-indigo-600">{r.senderName}</span> invited you as{' '}
                        <span className="font-semibold">{r.role}</span>
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setActiveTab('requests');
                    setShowNotifications(false);
                  }}
                  className="w-full mt-2 text-center text-xs font-bold text-indigo-600 hover:text-indigo-800 py-1.5 flex items-center justify-center gap-1"
                >
                  <span>View All Requests</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-slate-900/40 backdrop-blur-sm">
          <div className="w-72 bg-white h-full p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-left">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 text-indigo-600 font-extrabold text-xl">
                  <Zap className="w-6 h-6 fill-indigo-600" />
                  <span className="text-slate-900">SkillGraph</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                {[
                  { id: 'dashboard', label: 'Dashboard' },
                  { id: 'ai-builder', label: 'AI Team Builder' },
                  { id: 'create', label: 'Create Project' },
                  { id: 'discover', label: 'Discover Students' },
                  { id: 'my-skills', label: 'My Skills & Resume' },
                  { id: 'my-projects', label: 'My Projects' },
                  { id: 'requests', label: 'Team Requests', badge: pendingRequests.length },
                  { id: 'profile', label: 'Profile & Privacy' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                      activeTab === item.id ? 'bg-indigo-600 text-white font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  openSkillGraphModal();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 rounded-xl"
              >
                <Network className="w-4 h-4" />
                <span>Open Skill Graph</span>
              </button>
              <button
                onClick={() => {
                  openChat();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-white bg-slate-900 rounded-xl"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Ask SkillGraph AI</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
