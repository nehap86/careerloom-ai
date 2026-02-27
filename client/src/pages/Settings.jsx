import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import toast from 'react-hot-toast';
import { HiCog, HiUser, HiBriefcase, HiSave, HiShieldCheck, HiInformationCircle } from 'react-icons/hi';

export default function Settings() {
  const { user, login } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    current_role: user?.current_role || '',
    years_experience: user?.years_experience || 0,
  });
  const [saving, setSaving] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    try {
      const res = await api.patch('/api/user/settings', {
        name: form.name,
        current_role: form.current_role,
        years_experience: parseInt(form.years_experience) || 0,
      });
      // Update local auth state
      const updated = res.data.user;
      localStorage.setItem('user', JSON.stringify(updated));
      toast.success('Settings saved successfully');
      // Refresh page to update auth context
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <HiCog className="w-8 h-8 text-teal-500" />
          Settings
        </h1>
        <p className="text-gray-400 mt-2">Manage your profile and preferences</p>
      </div>

      {/* Profile Settings */}
      <form onSubmit={handleSave}>
        <div className="card mb-6">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <HiUser className="w-5 h-5 text-teal-500" />
            Profile Information
          </h2>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={update('name')}
                className="input-field"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-field !bg-white/5 !text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Current Role</label>
              <div className="relative">
                <HiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={form.current_role}
                  onChange={update('current_role')}
                  className="input-field !pl-10"
                  placeholder="e.g., Marketing Manager, Software Engineer"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">This helps AI generate more relevant career paths</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Years of Experience</label>
              <input
                type="number"
                value={form.years_experience}
                onChange={update('years_experience')}
                min="0"
                max="50"
                className="input-field w-32"
              />
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </p>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2"
            >
              {saving ? (
                <div className="spinner !w-5 !h-5 !border-white/30 !border-t-white" />
              ) : (
                <HiSave className="w-5 h-5" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>

      {/* App Info */}
      <div className="card mb-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <HiShieldCheck className="w-5 h-5 text-teal-500" />
          AI Configuration
        </h2>
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <HiInformationCircle className="w-5 h-5 text-teal-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-300">Mock Mode Active</p>
              <p className="text-sm text-gray-400 mt-1">
                The app is running with mock AI responses. All features work with realistic
                sample data. To enable live GPT-4o integration, add your OpenAI API key to
                the server <code className="bg-white/10 px-1.5 py-0.5 rounded text-xs">.env</code> file.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="card">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <HiInformationCircle className="w-5 h-5 text-teal-500" />
          About CareerLoom AI
        </h2>
        <div className="space-y-3 text-sm text-gray-400">
          <p>
            <span className="font-semibold text-white">Version:</span> 1.0.0
          </p>
          <p>
            <span className="font-semibold text-white">Platform:</span> CareerLoom Technologies Career Intelligence Engine
          </p>
          <p>
            <span className="font-semibold text-white">AI Model:</span> GPT-4o with RAG-style context assembly
          </p>
          <p>
            <span className="font-semibold text-white">Data Sources:</span> O*NET Occupational Database, Bureau of Labor Statistics, Industry Reports
          </p>
          <p className="text-xs text-gray-400 pt-3 border-t border-white/10">
            Your data is stored locally and is not shared with third parties. Skill assessments and career path
            explorations are processed securely.
          </p>
        </div>
      </div>
    </div>
  );
}
