import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  BrainCircuit,
  Users,
  Award,
  FolderGit2,
  Inbox,
  UserCheck,
  Sparkles,
  Zap,
  Network
} from 'lucide-react';
import { Student } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: Student;
  pendingRequestsCount: number;
  openChat: () => void;
  openSkillGraphModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  pendingRequestsCount,
  openChat,
  openSkillGraphModal
}) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'ai-builder', icon: BrainCircuit, label: 'AI Team Builder', highlight: true },
    { id: 'create', icon: PlusCircle, label: 'Create Project' },
    { id: 'discover', icon: Users, label: 'Discover Students' },
    { id: 'my-skills', icon: Award, label: 'My Skills & Resume' },
    { id: 'my-projects', icon: FolderGit2, label: 'My Projects' },
    { id: 'requests', icon: Inbox, label: 'Team Requests', badge: pendingRequestsCount },
    { id: 'profile', icon: UserCheck, label: 'Profile & Privacy' }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0 z-20 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <Zap className="w-5 h-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">SkillGraph</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 uppercase tracking-wider">AI</span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">People You Need, Not Friends</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Workspace
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200 font-semibold'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white text-indigo-700' : 'bg-rose-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Quick Tools Box */}
        <div className="pt-4 mt-3 border-t border-slate-100">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            AI Tools
          </div>

          <button
            id="nav-visual-graph"
            onClick={openSkillGraphModal}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200/60 mb-2"
          >
            <div className="flex items-center gap-2.5">
              <Network className="w-4 h-4 text-indigo-600" />
              <span>Visual Skill Graph</span>
            </div>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.2 rounded">Interactive</span>
          </button>

          <button
            id="nav-chat-assistant"
            onClick={openChat}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 transition-all shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>SkillGraph AI Assistant</span>
            </div>
            <span className="text-[10px] bg-white/20 text-white font-bold px-1.5 py-0.5 rounded">Ask</span>
          </button>
        </div>
      </nav>

      {/* User Chip Bottom */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={() => setActiveTab('profile')}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors text-left"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {currentUser.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{currentUser.name}</p>
            <p className="text-[11px] text-slate-400 truncate">{currentUser.year}</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active & Discoverable" />
        </button>
      </div>
    </aside>
  );
};
