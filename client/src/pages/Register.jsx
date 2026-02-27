import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { HiUser, HiMail, HiLockClosed, HiBriefcase, HiEye, HiEyeOff, HiLightningBolt } from 'react-icons/hi';

export default function Register() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    current_role: '',
    years_experience: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const demoLogin = async (demoEmail) => {
    setLoading(true);
    try {
      await login(demoEmail, 'demo1234');
      toast.success('Welcome back! Signed in with demo account');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in required fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register({
        ...form,
        years_experience: form.years_experience ? parseInt(form.years_experience) : 0,
      });
      toast.success('Account created! Welcome to CareerLoom AI');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white">Create Account</h1>
          <p className="text-gray-400 mt-2">Start your career transformation today</p>
        </div>

        <div className="card !p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name *</label>
              <div className="relative">
                <HiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={update('name')}
                  placeholder="Jane Smith"
                  className="input-field !pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Email *</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="you@example.com"
                  className="input-field !pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Password *</label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="Min. 6 characters"
                  className="input-field !pl-10 !pr-10"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Current Role</label>
              <div className="relative">
                <HiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={form.current_role}
                  onChange={update('current_role')}
                  placeholder="e.g., Marketing Manager"
                  className="input-field !pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Years of Experience</label>
              <input
                type="number"
                value={form.years_experience}
                onChange={update('years_experience')}
                placeholder="e.g., 8"
                min="0"
                max="50"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 !mt-6"
            >
              {loading ? <div className="spinner !w-5 !h-5 !border-white/30 !border-t-white" /> : null}
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 text-gray-400">Or try a demo account</span>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {[
                { email: 'sarah@demo.com', name: 'Sarah Chen', role: 'Marketing Manager' },
                { email: 'james@demo.com', name: 'James Rodriguez', role: 'Financial Analyst' },
                { email: 'emily@demo.com', name: 'Emily Watson', role: 'Project Manager' },
              ].map((demo) => (
                <button
                  key={demo.email}
                  onClick={() => demoLogin(demo.email)}
                  disabled={loading}
                  className="w-full text-left px-3 py-2.5 rounded-lg border border-white/10 hover:bg-teal-500/10 hover:border-teal-500/30 transition-colors text-sm flex items-center gap-2"
                >
                  <HiLightningBolt className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium text-white">{demo.name}</span>
                    <span className="text-gray-400 ml-1.5">· {demo.role}</span>
                  </div>
                </button>
              ))}
              <p className="text-xs text-gray-400 text-center mt-2">One-click sign in with pre-loaded data</p>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-400 font-semibold hover:text-teal-300">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
