import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Spinner from '../components/Spinner';
import CareerJourney from '../components/CareerJourney';
import {
  HiLightningBolt, HiMap, HiAcademicCap, HiChartBar, HiArrowRight,
  HiClipboardList, HiBriefcase, HiTrendingUp, HiClock, HiCheckCircle,
  HiBookOpen, HiUserGroup,
} from 'react-icons/hi';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const activityIcons = {
  skill_assessment: HiLightningBolt,
  career_exploration: HiMap,
  roadmap_generation: HiAcademicCap,
  roadmap_progress: HiCheckCircle,
  login: HiUserGroup,
};

export default function Dashboard() {
  const { user } = useAuth();
  const [skills, setSkills] = useState(null);
  const [paths, setPaths] = useState(null);
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/api/skills/profile').catch(() => ({ data: { skills: [], count: 0 } })),
      api.get('/api/careers/saved').catch(() => ({ data: { paths: [] } })),
      api.get('/api/user/stats').catch(() => ({ data: { skills: 0, career_paths: 0, roadmaps: 0, learning_progress: 0 } })),
      api.get('/api/user/activity').catch(() => ({ data: { activity: [] } })),
    ]).then(([skillsRes, pathsRes, statsRes, activityRes]) => {
      setSkills(skillsRes.data);
      setPaths(pathsRes.data.paths || []);
      setStats(statsRes.data);
      setActivity(activityRes.data.activity || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner size="lg" text="Loading your dashboard..." />;

  const hasSkills = skills && skills.count > 0;
  const topSkills = skills?.skills?.slice(0, 5) || [];

  const statCards = [
    { label: 'Skills Mapped', value: stats?.skills || 0, icon: HiChartBar, color: 'text-blue-400 bg-blue-500/20' },
    { label: 'Career Paths', value: stats?.career_paths || 0, icon: HiMap, color: 'text-teal-400 bg-teal-500/20' },
    { label: 'Roadmaps', value: stats?.roadmaps || 0, icon: HiBookOpen, color: 'text-purple-400 bg-purple-500/20' },
    { label: 'Progress', value: `${stats?.learning_progress || 0}%`, icon: HiTrendingUp, color: 'text-emerald-400 bg-emerald-500/20' },
  ];

  const quickActions = [
    {
      icon: HiLightningBolt,
      title: 'Assess Skills',
      desc: hasSkills ? 'Re-assess or update your profile' : 'Start your AI skill assessment',
      to: '/assess',
      color: 'from-blue-500 to-indigo-600',
      highlight: !hasSkills,
    },
    {
      icon: HiMap,
      title: 'Explore Careers',
      desc: 'Discover career transition paths',
      to: '/explore',
      color: 'from-teal-500 to-emerald-600',
      highlight: hasSkills && paths.length === 0,
    },
    {
      icon: HiBriefcase,
      title: 'Job Board',
      desc: 'Browse AI-matched job listings',
      to: '/jobs',
      color: 'from-orange-500 to-red-500',
      highlight: hasSkills && paths.length > 0,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-gray-400 mt-1">
          {user?.current_role ? `${user.current_role} · ${user.years_experience || 0} years experience` : 'Ready to explore your career options?'}
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="card !py-4 !px-5 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {quickActions.map((a, i) => (
          <Link
            key={i}
            to={a.to}
            className={`card group hover:-translate-y-1 transition-all duration-300 ${
              a.highlight ? 'ring-2 ring-teal-400/50 ring-offset-0' : ''
            }`}
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${a.color} flex items-center justify-center mb-4 shadow-lg`}>
              <a.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              {a.title}
              {a.highlight && (
                <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full font-medium">Start here</span>
              )}
            </h3>
            <p className="text-gray-400 text-sm">{a.desc}</p>
            <div className="mt-4 flex items-center text-teal-400 text-sm font-semibold group-hover:text-teal-300">
              Get started <HiArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Career Journey Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          <CareerJourney stats={stats} />
        </div>
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <HiClock className="w-5 h-5 text-teal-500" />
              Recent Activity
            </h2>
          </div>
          {activity.length > 0 ? (
            <div className="space-y-3">
              {activity.slice(0, 5).map((log, i) => {
                const Icon = activityIcons[log.action] || HiCheckCircle;
                return (
                  <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-300 truncate">{log.details || log.action.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-gray-400">{timeAgo(log.created_at)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <HiClock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No activity yet. Start by assessing your skills!</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skill Summary */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <HiChartBar className="w-5 h-5 text-teal-500" />
              Skill Profile
            </h2>
            {hasSkills && (
              <span className="text-sm text-gray-400">{skills.count} skills</span>
            )}
          </div>
          {hasSkills ? (
            <div className="space-y-4">
              {topSkills.map((skill, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-300">{skill.skill_name}</span>
                    <span className="text-sm text-gray-400">{skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full bg-gradient-to-r from-navy-800 to-teal-500 transition-all duration-1000"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              ))}
              {skills.count > 5 && (
                <Link to="/assess" className="text-sm text-teal-400 font-medium hover:text-teal-300">
                  View all {skills.count} skills →
                </Link>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <HiClipboardList className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">No skills assessed yet</p>
              <Link to="/assess" className="btn-secondary !py-2 !px-4 text-sm">
                Start Assessment
              </Link>
            </div>
          )}
        </div>

        {/* Career Paths */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <HiMap className="w-5 h-5 text-teal-500" />
              Career Paths
            </h2>
            {paths.length > 0 && (
              <Link to="/explore" className="text-sm text-teal-400 font-medium hover:text-teal-300">
                Explore all →
              </Link>
            )}
          </div>
          {paths.length > 0 ? (
            <div className="space-y-3">
              {paths.slice(0, 4).map((path, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                    path.feasibility_score >= 75 ? 'bg-emerald-500' : path.feasibility_score >= 50 ? 'bg-amber-500' : 'bg-gray-400'
                  }`}>
                    {path.feasibility_score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{path.target_role}</p>
                    <p className="text-xs text-gray-400">
                      ${(path.median_salary / 1000).toFixed(0)}k · {path.growth_rate}% growth
                    </p>
                  </div>
                  <Link to="/explore" className="text-teal-400 hover:text-teal-300 p-1">
                    <HiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <HiMap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 mb-4">
                {hasSkills ? 'Explore career paths matched to your skills' : 'Complete skill assessment first'}
              </p>
              <Link to={hasSkills ? '/explore' : '/assess'} className="btn-secondary !py-2 !px-4 text-sm">
                {hasSkills ? 'Explore Careers' : 'Assess Skills'}
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
