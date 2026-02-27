import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import Spinner from '../components/Spinner';
import toast from 'react-hot-toast';
import {
  HiBriefcase, HiLocationMarker, HiCurrencyDollar, HiClock, HiStar,
  HiBookmark, HiExternalLink, HiFilter, HiSearch, HiChevronDown,
  HiCheckCircle, HiBadgeCheck, HiX,
} from 'react-icons/hi';

function MatchBadge({ score }) {
  const color = score >= 70 ? 'bg-emerald-500/20 text-emerald-400' : score >= 40 ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-gray-400';
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${color}`}>
      <HiBadgeCheck className="w-3.5 h-3.5" />
      {score}% match
    </span>
  );
}

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState(new Set());
  const [filterRole, setFilterRole] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedJob, setExpandedJob] = useState(null);

  useEffect(() => {
    loadJobs();
    loadSaved();
  }, []);

  const loadJobs = async (role) => {
    setLoading(true);
    try {
      const params = role ? `?role=${encodeURIComponent(role)}` : '';
      const res = await api.get(`/api/jobs${params}`);
      setJobs(res.data.jobs);
      setTargetRole(res.data.target_role || '');
    } catch {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const loadSaved = async () => {
    try {
      const res = await api.get('/api/jobs/saved');
      setSavedIds(new Set(res.data.saved.map(s => s.job_id)));
    } catch {}
  };

  const toggleSave = async (job) => {
    if (savedIds.has(job.id)) {
      await api.delete(`/api/jobs/save/${job.id}`);
      setSavedIds(prev => { const n = new Set(prev); n.delete(job.id); return n; });
      toast.success('Job removed from saved');
    } else {
      await api.post('/api/jobs/save', { job_id: job.id, job_title: job.title, company: job.company });
      setSavedIds(prev => new Set(prev).add(job.id));
      toast.success('Job saved!');
    }
  };

  const handleFilterRole = (role) => {
    setFilterRole(role);
    if (role) {
      loadJobs(role);
    } else {
      loadJobs();
    }
  };

  const roles = ['Product Manager', 'Data Analyst', 'UX Designer', 'Software Developer', 'Marketing Manager', 'DevOps Engineer', 'Business Analyst'];

  const filteredJobs = searchQuery
    ? jobs.filter(j => j.title.toLowerCase().includes(searchQuery.toLowerCase()) || j.company.toLowerCase().includes(searchQuery.toLowerCase()))
    : jobs;

  if (loading) return <Spinner size="lg" text="Finding jobs matched to your skills..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
            <HiBriefcase className="w-5 h-5 text-white" />
          </div>
          Job Board
        </h1>
        <p className="text-gray-400 mt-2">
          {targetRole
            ? `AI-matched listings for ${targetRole} based on your skill profile`
            : 'Jobs matched to your skills and career goals'}
        </p>
      </div>

      {/* Filters */}
      <div className="card !p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or company..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-field !pl-10"
            />
          </div>
          <div className="relative">
            <select
              value={filterRole}
              onChange={e => handleFilterRole(e.target.value)}
              className="input-field !pr-10 appearance-none cursor-pointer"
            >
              <option value="">All Roles</option>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <HiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">
          {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          {savedIds.size > 0 && <span className="ml-2">· {savedIds.size} saved</span>}
        </p>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map(job => (
          <div
            key={job.id}
            className={`card hover:shadow-md transition-all cursor-pointer ${expandedJob === job.id ? 'ring-2 ring-teal-400' : ''}`}
            onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Match Score */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${
                job.match_score >= 70 ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                job.match_score >= 40 ? 'bg-gradient-to-br from-amber-500 to-amber-600' :
                'bg-gradient-to-br from-gray-400 to-gray-500'
              }`}>
                {job.match_score}%
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">{job.title}</h3>
                    <p className="text-teal-400 font-medium">{job.company}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleSave(job); }}
                    className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                      savedIds.has(job.id) ? 'bg-teal-500/20 text-teal-400' : 'hover:bg-white/10 text-gray-400'
                    }`}
                  >
                    <HiBookmark className={`w-5 h-5 ${savedIds.has(job.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-400">
                  <span className="flex items-center gap-1"><HiLocationMarker className="w-4 h-4" />{job.location}</span>
                  <span className="flex items-center gap-1"><HiCurrencyDollar className="w-4 h-4" />${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k</span>
                  <span className="flex items-center gap-1"><HiClock className="w-4 h-4" />{job.posted_days_ago}d ago</span>
                  <span className="flex items-center gap-1"><HiStar className="w-4 h-4" />{job.experience}</span>
                </div>

                {/* Skills pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {job.matching_skills?.map(s => (
                    <span key={s} className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400 font-medium flex items-center gap-1">
                      <HiCheckCircle className="w-3 h-3" />{s}
                    </span>
                  ))}
                  {job.missing_skills?.map(s => (
                    <span key={s} className="px-2 py-0.5 text-xs rounded-full bg-white/10 text-gray-400">{s}</span>
                  ))}
                </div>

                {/* Expanded details */}
                {expandedJob === job.id && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <p className="text-gray-400 text-sm leading-relaxed">{job.description}</p>
                    <div className="mt-4 flex items-center gap-3">
                      <MatchBadge score={job.match_score} />
                      <span className="text-xs text-gray-400">{job.type}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-16">
          <HiBriefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">No jobs found</h3>
          <p className="text-gray-400">Try adjusting your filters or complete a skill assessment first.</p>
          <Link to="/assess" className="btn-primary mt-4 inline-flex">Assess Skills</Link>
        </div>
      )}
    </div>
  );
}
