'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  });

  const [pw, setPw] = useState({
    current: '',
    newPw: '',
    confirm: '',
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    projectUpdates: true,
    invoiceReminders: true,
    weeklyReports: false,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handlePwSave = () => {
    setPwError('');
    if (!pw.current || !pw.newPw || !pw.confirm) {
      setPwError('All fields are required'); return;
    }
    if (pw.newPw !== pw.confirm) {
      setPwError('Passwords do not match'); return;
    }
    if (pw.newPw.length < 6) {
      setPwError('Password must be at least 6 characters'); return;
    }
    setPwSaved(true);
    setPw({ current: '', newPw: '', confirm: '' });
    setTimeout(() => setPwSaved(false), 3000);
  };

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">⚙️ Settings</h1>
        <p className="text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col gap-6">

        {/* ── Profile ── */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-6">👤 Profile Settings</h2>
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                placeholder="Your full name"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={e => setProfile({ ...profile, phone: e.target.value })}
                placeholder="+91 9876543210"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Business Name</label>
              <input
                type="text"
                value={profile.business}
                onChange={e => setProfile({ ...profile, business: e.target.value })}
                placeholder="Your business name"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Currency</label>
              <select
                value={profile.currency}
                onChange={e => setProfile({ ...profile, currency: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="INR">INR — Indian Rupee</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="AED">AED — UAE Dirham</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Timezone</label>
              <select
                value={profile.timezone}
                onChange={e => setProfile({ ...profile, timezone: e.target.value })}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST +5:30)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST +4)</option>
                <option value="Asia/Singapore">Asia/Singapore (SGT +8)</option>
              </select>
            </div>

          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
            >
              💾 Save Profile
            </button>
            {saved && (
              <span className="text-green-400 font-medium">✓ Profile saved!</span>
            )}
          </div>
        </div>

        {/* ── Notifications ── */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-6">🔔 Notification Preferences</h2>
          <div className="space-y-3">
            {([
              { key: 'emailAlerts'      as const, label: 'Email Alerts',       desc: 'Receive email notifications for important updates' },
              { key: 'projectUpdates'   as const, label: 'Project Updates',    desc: 'Get notified when project status changes' },
              { key: 'invoiceReminders' as const, label: 'Invoice Reminders',  desc: 'Reminders for pending and overdue invoices' },
              { key: 'weeklyReports'    as const, label: 'Weekly Reports',     desc: 'Weekly summary of your productivity and earnings' },
            ]).map(item => (
              <div key={item.key}
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <div className="text-white font-medium">{item.label}</div>
                  <div className="text-gray-400 text-sm">{item.desc}</div>
                </div>
                <button
                  onClick={() => toggleNotif(item.key)}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications[item.key] ? 'bg-purple-600' : 'bg-gray-600'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notifications[item.key] ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ── Change Password ── */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-6">🔒 Change Password</h2>

          {pwError && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm">
              ⚠️ {pwError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Current Password</label>
              <input
                type="password"
                value={pw.current}
                onChange={e => setPw({ ...pw, current: e.target.value })}
                placeholder="Enter current password"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">New Password</label>
              <input
                type="password"
                value={pw.newPw}
                onChange={e => setPw({ ...pw, newPw: e.target.value })}
                placeholder="Min 6 characters"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={pw.confirm}
                onChange={e => setPw({ ...pw, confirm: e.target.value })}
                placeholder="Repeat new password"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handlePwSave}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
              >
                🔑 Update Password
              </button>
              {pwSaved && (
                <span className="text-green-400 font-medium">✓ Password updated!</span>
              )}
            </div>
          </div>
        </div>

        {/* ── App Info ── */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-4">ℹ️ App Information</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'App Name',    value: 'FlowDesk' },
              { label: 'Version',     value: 'v1.0.0' },
              { label: 'Backend',     value: 'FastAPI + PostgreSQL' },
              { label: 'Frontend',    value: 'Next.js 14' },
              { label: 'AI Engine',   value: 'Groq — Llama 3.3' },
              { label: 'Auth',        value: 'JWT Token' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between p-3 bg-gray-700 rounded-lg">
                <span className="text-gray-400 text-sm">{item.label}</span>
                <span className="text-white text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Danger Zone ── */}
        <div className="bg-gray-800 rounded-xl p-6 border border-red-900 mb-8">
          <h2 className="text-lg font-semibold text-red-400 mb-4">⚠️ Danger Zone</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-medium">Delete Account</div>
              <div className="text-gray-400 text-sm">
                Permanently delete your account and all associated data
              </div>
            </div>
            <button
              onClick={() => window.confirm('Are you sure? This cannot be undone!') && alert('Feature coming soon')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}