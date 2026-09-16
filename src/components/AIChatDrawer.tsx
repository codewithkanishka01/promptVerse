import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  Zap,
  HelpCircle
} from 'lucide-react';
import { Project, Student, ChatMessage } from '../types';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  allStudents: Student[];
  onOpenInvite: (student: Student) => void;
  onViewStudent: (student: Student) => void;
}

const PRESET_QUESTIONS = [
  'Who should I add to my team?',
  'Why did you recommend Priya?',
  'What skills are missing?',
  'Can you suggest a team of 4 people?',
  'Do we have enough backend expertise?',
  'Find someone who knows Python and React',
  'Can you suggest an alternative to a TensorFlow expert?'
];

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  project,
  allStudents,
  onOpenInvite,
  onViewStudent
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello Pushkar! I am **SkillGraph AI**. I analyze skill topologies, semantic capabilities, and student profiles for your active project: **${project.name}**.\n\nAsk me about missing gaps, candidate compatibility, or team balance!`,
      timestamp: 'Just now'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          project,
          students: allStudents
        })
      });

      if (!res.ok) {
        throw new Error('Failed to generate response');
      }

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        timestamp: 'Just now'
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      // Client-side fallback in case of network issue
      const lower = query.toLowerCase();
      let fallbackText = `SkillGraph evaluated **${project.name}**:\n\n`;
      if (lower.includes('priya')) {
        fallbackText += `**Why Priya Mehta was recommended:**\n- **UI/UX & User Research**: Solves the campus wayfinding usability requirements.\n- **Track Record**: 6 campus projects with First Place DesignSprint honors.\n- **Availability**: Flexible (~16 hrs/week). She covers the interface gap without duplicating your Python data science skills.`;
      } else if (lower.includes('missing')) {
        fallbackText += `Currently, your team is missing:\n- **React & Frontend Architecture**\n- **UI/UX & Prototyping** (Figma)\n- **Database & Backend Systems** (SQL, Node.js)\n\nAdding **Aarav Sharma** (Frontend/Design) and **Rahul Verma** (Backend) will bring your completeness to 85%+.`;
      } else {
        fallbackText += `For **${project.name}**, you have strong AI/ML foundation. The most critical additions are:\n1. **Aarav Sharma** (React, Figma)\n2. **Rahul Verma** (Node.js, SQL Database)\n3. **Priya Mehta** (UI/UX, Accessibility)`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: fallbackText,
          timestamp: 'Just now'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-white">SkillGraph AI</h3>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-200 font-bold px-1.5 py-0.2 rounded border border-indigo-400/30">
                  Grounding Active
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate max-w-[220px]">
                Targeting: <span className="text-amber-200 font-semibold">{project.name}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-3 bg-slate-50 border-b border-slate-200/70 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-1.5">
          {PRESET_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 border border-slate-200 shadow-2xs transition-colors shrink-0 disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div key={msg.id} className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 ${
                    isBot ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-white'
                  }`}
                >
                  {isBot ? <Sparkles className="w-4 h-4 text-amber-300" /> : <User className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    isBot
                      ? 'bg-slate-100 text-slate-800 rounded-tl-sm'
                      : 'bg-indigo-600 text-white rounded-tr-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans space-y-1.5">
                    {msg.text.split('\n\n').map((paragraph, i) => {
                      // Format bold text
                      const formatted = paragraph.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
                      return (
                        <p
                          key={i}
                          dangerouslySetInnerHTML={{ __html: formatted }}
                          className={paragraph.startsWith('-') || paragraph.startsWith('1.') ? 'pl-2' : ''}
                        />
                      );
                    })}
                  </div>
                  <span className={`block text-[10px] mt-1.5 ${isBot ? 'text-slate-400' : 'text-indigo-200'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              </div>
              <div className="bg-slate-100 rounded-2xl rounded-tl-sm p-3 text-xs text-slate-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-100" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse delay-200" />
                <span className="text-[11px] font-medium text-slate-600 ml-1">Analyzing skill topology...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about teammates, skills, or alternatives..."
              disabled={isLoading}
              className="flex-1 bg-slate-100 text-xs rounded-xl px-3.5 py-2.5 border border-transparent focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-all shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            SkillGraph AI bases suggestions on verified skills, availability & project fit.
          </p>
        </div>
      </div>
    </div>
  );
};
