import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Spinner from '../components/Spinner';
import {
  HiDocumentText, HiAcademicCap, HiUserGroup, HiClipboardCheck,
  HiTrendingUp, HiHeart, HiBookOpen, HiTemplate, HiLightningBolt,
  HiChevronRight, HiStar, HiGlobe,
} from 'react-icons/hi';

const categoryIcons = {
  'Resume & Portfolio': HiDocumentText,
  'Interview Prep': HiAcademicCap,
  'Networking': HiUserGroup,
  'First 90 Days': HiClipboardCheck,
  'Career Growth': HiTrendingUp,
  'Community & Support': HiHeart,
};

const typeColors = {
  guide: 'bg-blue-500/20 text-blue-400',
  template: 'bg-purple-500/20 text-purple-400',
  checklist: 'bg-emerald-500/20 text-emerald-400',
  practice: 'bg-amber-500/20 text-amber-400',
  tool: 'bg-teal-500/20 text-teal-400',
  directory: 'bg-orange-500/20 text-orange-400',
  program: 'bg-pink-500/20 text-pink-400',
  inspiration: 'bg-rose-500/20 text-rose-400',
};

export default function Resources() {
  const [resources, setResources] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pre');

  useEffect(() => {
    api.get('/api/resources')
      .then(res => setResources(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="lg" text="Loading resources..." />;
  if (!resources) return null;

  const tabs = [
    { id: 'pre', label: 'Job Search & Prep', icon: HiLightningBolt, desc: 'Get ready to land your dream role' },
    { id: 'post', label: 'After You Land', icon: HiStar, desc: 'Thrive in your new career' },
  ];

  const currentResources = activeTab === 'pre' ? resources.pre_landing : resources.post_landing;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <HiBookOpen className="w-5 h-5 text-white" />
          </div>
          Career Resources
        </h1>
        <p className="text-gray-400 mt-2">
          Everything you need from job search to thriving in your new role
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 sm:flex-none card !p-4 sm:!px-6 transition-all text-left ${
              activeTab === tab.id
                ? 'ring-2 ring-teal-400/50 ring-offset-0 bg-teal-500/10'
                : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                activeTab === tab.id ? 'bg-teal-500 text-white' : 'bg-white/10 text-gray-400'
              }`}>
                <tab.icon className="w-5 h-5" />
              </div>
              <div>
                <p className={`font-bold text-sm ${activeTab === tab.id ? 'text-teal-300' : 'text-white'}`}>{tab.label}</p>
                <p className="text-xs text-gray-400 hidden sm:block">{tab.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentResources.map(section => {
          const Icon = categoryIcons[section.category] || HiBookOpen;
          return (
            <div key={section.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-navy-800 to-teal-500 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">{section.title}</h3>
                  <p className="text-xs text-gray-400">{section.category}</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4">{section.description}</p>
              <div className="space-y-2">
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
                  >
                    <HiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors flex-shrink-0" />
                    <span className="text-sm text-gray-300 flex-1">{item.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${typeColors[item.type] || 'bg-white/10 text-gray-400'}`}>
                      {item.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <div className="card !bg-gradient-to-br !from-navy-800 !to-teal-600 !text-white max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-3">
            <HiGlobe className="w-6 h-6" />
            <h3 className="text-lg font-bold">Need Personalized Guidance?</h3>
          </div>
          <p className="text-white/80 text-sm mb-4">
            Complete your skill assessment and explore career paths to get AI-powered recommendations tailored to your transition.
          </p>
          <div className="flex justify-center gap-3">
            <Link to="/assess" className="px-5 py-2.5 bg-white text-navy-800 rounded-lg text-sm font-semibold hover:bg-white/90 transition-colors">
              Assess Skills
            </Link>
            <Link to="/jobs" className="px-5 py-2.5 bg-white/20 text-white rounded-lg text-sm font-semibold hover:bg-white/30 transition-colors">
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
