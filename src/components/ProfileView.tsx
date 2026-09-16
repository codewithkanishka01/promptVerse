import React, { useState } from 'react';
import {
  UserCheck,
  Shield,
  Eye,
  Lock,
  CheckCircle2,
  Clock,
  Award,
  Sparkles,
  Save,
  Globe
} from 'lucide-react';
import { Student } from '../types';

interface ProfileViewProps {
  currentUser: Student;
  onUpdateCurrentUser: (updated: Student) => void;
  showToast: (msg: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  onUpdateCurrentUser,
  showToast
}) => {
  const [bio, setBio] = useState(currentUser.bio);
  const [availability, setAvailability] = useState(currentUser.availability);
  const [hoursPerWeek, setHoursPerWeek] = useState(currentUser.hoursPerWeek);
  const [isDiscoverable, setIsDiscoverable] = useState(currentUser.privacy.isDiscoverable);
  const [showContact, setShowContact] = useState(currentUser.privacy.showContact);
  const [matchingOnly, setMatchingOnly] = useState(currentUser.privacy.matchingOnly);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: Student = {
      ...currentUser,
      bio,
      availability,
      hoursPerWeek,
      privacy: {
        isDiscoverable,
        showContact,
        matchingOnly
      }
    };
    onUpdateCurrentUser(updated);
    showToast('Saved profile and privacy settings.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
            {currentUser.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">{currentUser.name}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                Verified Student
              </span>
            </div>
            <p className="text-xs text-indigo-600 font-semibold">{currentUser.department}</p>
            <p className="text-xs text-slate-400">{currentUser.year}</p>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 mb-1">Personal Bio</h2>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-3.5 focus:bg-white focus:border-indigo-500 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Availability Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Availability Cadence</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value as any)}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-700 focus:outline-none"
            >
              <option value="Flexible">Flexible (Anytime)</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Weekends">Weekends</option>
              <option value="Evenings">Evenings</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Weekly Hours Cap</label>
            <input
              type="number"
              min={2}
              max={40}
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Privacy Controls (Section 25) */}
        <div className="pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-extrabold text-slate-900">Privacy & Campus Discoverability</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <input
                type="checkbox"
                checked={isDiscoverable}
                onChange={(e) => setIsDiscoverable(e.target.checked)}
                className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Campus Discoverable</span>
                <span className="text-slate-500 text-[11px]">
                  Allow project leads on your campus to view your verified skills and invite you.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <input
                type="checkbox"
                checked={matchingOnly}
                onChange={(e) => setMatchingOnly(e.target.checked)}
                className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Matching-Only Mode</span>
                <span className="text-slate-500 text-[11px]">
                  Hide profile from general search directories; only recommend when an AI project directly matches your skills.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
              <input
                type="checkbox"
                checked={showContact}
                onChange={(e) => setShowContact(e.target.checked)}
                className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Show Direct Campus Email</span>
                <span className="text-slate-500 text-[11px]">
                  Allow accepted teammates to see your verified campus email handle.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
