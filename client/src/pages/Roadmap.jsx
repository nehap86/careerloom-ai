import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import { HiAcademicCap, HiClock, HiBookOpen, HiCheckCircle, HiChevronDown, HiChevronUp, HiArrowLeft, HiExternalLink } from 'react-icons/hi';

export default function Roadmap() {
  const { pathId } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [careerPath, setCareerPath] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedWeeks, setExpandedWeeks] = useState(new Set([0]));
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    api.get(`/api/roadmap/${pathId}`)
      .then(res => {
        setRoadmap(res.data.roadmap);
        setCareerPath(res.data.career_path);
      })
      .catch(err => {
        if (err.response?.status === 404) {
          toast.error('Roadmap not found. Generate one from Career Explorer.');
        } else {
          toast.error('Failed to load roadmap');
        }
      })
      .finally(() => setLoading(false));
  }, [pathId]);

  const toggleWeek = (index) => {
    setExpandedWeeks(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const toggleComplete = async (weekIndex) => {
    if (!roadmap) return;
    const newCompleted = !roadmap.progress[weekIndex];
    setUpdating(weekIndex);
    try {
      const res = await api.patch(`/api/roadmap/${roadmap.id}/progress`, {
        week_index: weekIndex,
        completed: newCompleted,
      });
      setRoadmap(prev => ({ ...prev, progress: res.data.progress }));
      toast.success(newCompleted ? `Week ${weekIndex + 1} completed!` : `Week ${weekIndex + 1} unmarked`);
    } catch {
      toast.error('Failed to update progress');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <Spinner size="lg" text="Loading your roadmap..." />;

  if (!roadmap) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <HiAcademicCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-300 mb-2">No Roadmap Found</h2>
        <p className="text-gray-400 mb-6">Generate a roadmap by selecting a career path in the Explorer.</p>
        <Link to="/explore" className="btn-primary">Go to Career Explorer</Link>
      </div>
    );
  }

  const completedCount = roadmap.progress.filter(Boolean).length;
  const totalWeeks = roadmap.weeks_data.length;
  const progressPercent = Math.round((completedCount / totalWeeks) * 100);
  const totalHours = roadmap.weeks_data.reduce((sum, w) => sum + (w.hours || 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <Link to="/explore" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-white mb-4 transition-colors">
        <HiArrowLeft className="w-4 h-4" /> Back to Career Explorer
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <HiAcademicCap className="w-8 h-8 text-teal-500" />
          {roadmap.title}
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl">{roadmap.description}</p>
      </div>

      {/* Progress card */}
      <div className="card !bg-gradient-to-br !from-navy-800 !to-teal-600 !text-white !border-0 mb-8">
        <div className="flex flex-wrap items-center gap-6 mb-4">
          <div>
            <p className="text-sm text-teal-200">Overall Progress</p>
            <p className="text-4xl font-extrabold">{progressPercent}%</p>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{completedCount}/{totalWeeks}</p>
              <p className="text-xs text-teal-200">Weeks Done</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{totalHours}</p>
              <p className="text-xs text-teal-200">Total Hours</p>
            </div>
            {careerPath && (
              <div>
                <p className="text-2xl font-bold">{careerPath.transition_time_months}mo</p>
                <p className="text-xs text-teal-200">Est. Timeline</p>
              </div>
            )}
          </div>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-white transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Career Path Info */}
      {careerPath && (
        <div className="card mb-8 !bg-white/5">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-semibold text-white">{careerPath.source_role}</span>
            <HiArrowLeft className="w-4 h-4 text-gray-400 rotate-180" />
            <span className="font-bold text-teal-400">{careerPath.target_role}</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-400">${(careerPath.median_salary / 1000).toFixed(0)}k salary</span>
            <span className="text-gray-400">|</span>
            <span className="text-emerald-400 font-medium">{careerPath.growth_rate}% growth</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-400">{careerPath.skill_overlap}% skill match</span>
          </div>
        </div>
      )}

      {/* Week cards */}
      <div className="space-y-4">
        {roadmap.weeks_data.map((week, i) => {
          const isExpanded = expandedWeeks.has(i);
          const isComplete = roadmap.progress[i];

          return (
            <div
              key={i}
              className={`card transition-all duration-300 ${
                isComplete ? '!border-emerald-500/30 !bg-emerald-500/10' : ''
              }`}
            >
              {/* Week header */}
              <div
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => toggleWeek(i)}
              >
                {/* Completion checkbox */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleComplete(i);
                  }}
                  disabled={updating === i}
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isComplete
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-white/10 text-gray-400 hover:bg-white/15'
                  }`}
                >
                  {updating === i ? (
                    <div className="spinner !w-5 !h-5 !border-white/20 !border-t-white" />
                  ) : isComplete ? (
                    <HiCheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-bold">{week.week}</span>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-teal-400 bg-teal-500/20 px-2 py-0.5 rounded-full">
                      Week {week.week}
                    </span>
                    {isComplete && (
                      <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                  <h3 className={`font-bold text-white mt-1 ${isComplete ? 'line-through text-gray-400' : ''}`}>
                    {week.topic}
                  </h3>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="hidden sm:flex items-center gap-1 text-sm text-gray-400">
                    <HiClock className="w-4 h-4" />
                    {week.hours}h
                  </div>
                  {isExpanded ? (
                    <HiChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <HiChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {week.description}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <HiBookOpen className="w-4 h-4 text-teal-500" />
                    <span className="text-sm font-semibold text-gray-300">Resources</span>
                  </div>
                  <ul className="space-y-2 ml-6">
                    {(week.resources || []).map((resource, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <HiExternalLink className="w-4 h-4 text-teal-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-400">{resource}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <HiClock className="w-4 h-4" /> Estimated: {week.hours} hours
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion message */}
      {completedCount === totalWeeks && (
        <div className="card !bg-gradient-to-r !from-emerald-500 !to-teal-500 !text-white !border-0 mt-8 text-center animate-fade-in">
          <h3 className="text-2xl font-extrabold mb-2">Congratulations! 🎉</h3>
          <p className="text-emerald-100">
            You've completed your entire learning roadmap. You're ready for your career transition!
          </p>
        </div>
      )}
    </div>
  );
}
