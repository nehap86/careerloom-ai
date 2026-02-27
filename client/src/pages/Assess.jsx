import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';
import { HiClipboardList, HiLightningBolt, HiArrowRight, HiRefresh, HiMap } from 'react-icons/hi';

const SAMPLE_RESUME = `Senior Marketing Manager with 8+ years of experience leading digital marketing campaigns for B2B SaaS companies. Skilled in data analysis, A/B testing, content strategy, and SEO/SEM optimization.

Key accomplishments:
- Led a team of 6 marketers, managing $2M annual budget with strategic planning and stakeholder management
- Increased organic traffic 180% through SEO optimization and content strategy
- Built and maintained marketing analytics dashboards using SQL and Python for data-driven decision making
- Managed cross-functional projects using Agile methodology and JIRA
- Created compelling presentations for C-level executives and board meetings
- Developed and executed digital marketing campaigns with strong ROI tracking
- Proficient in marketing automation, Google Analytics, and CRM tools
- Strong communication, leadership, and problem-solving skills`;

export default function Assess() {
  const [resumeText, setResumeText] = useState('');
  const [skills, setSkills] = useState(null);
  const [existingSkills, setExistingSkills] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    api.get('/api/skills/profile')
      .then(res => {
        if (res.data.count > 0) setExistingSkills(res.data);
      })
      .catch(() => {})
      .finally(() => setInitialLoading(false));
  }, []);

  const handleAssess = async () => {
    if (resumeText.trim().length < 20) {
      toast.error('Please enter at least 20 characters of experience text');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/api/skills/assess', { resume_text: resumeText });
      setSkills(res.data);
      setExistingSkills({ skills: res.data.skills, categories: {}, count: res.data.count });
      toast.success(`Extracted ${res.data.count} skills!`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Assessment failed');
    } finally {
      setLoading(false);
    }
  };

  const categoryColors = {
    Technical: 'bg-blue-500/20 text-blue-400',
    Management: 'bg-purple-500/20 text-purple-400',
    Analytical: 'bg-amber-500/20 text-amber-400',
    Interpersonal: 'bg-green-500/20 text-green-400',
    Design: 'bg-pink-500/20 text-pink-400',
    Marketing: 'bg-indigo-500/20 text-indigo-400',
  };

  if (initialLoading) return <Spinner size="lg" text="Loading..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
          <HiClipboardList className="w-8 h-8 text-teal-500" />
          AI Skill Assessment
        </h1>
        <p className="text-gray-400 mt-2">
          Paste your resume or describe your experience. Our AI will extract your transferable skills and map them to industry categories.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input */}
        <div>
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white">Your Experience</h2>
              <button
                onClick={() => setResumeText(SAMPLE_RESUME)}
                className="text-sm text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
              >
                <HiRefresh className="w-4 h-4" /> Load sample
              </button>
            </div>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume, LinkedIn summary, or describe your professional experience..."
              rows={14}
              className="input-field resize-none text-sm leading-relaxed"
            />
            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-gray-400">
                {resumeText.length} characters
              </span>
              <button
                onClick={handleAssess}
                disabled={loading || resumeText.trim().length < 20}
                className="btn-primary flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="spinner !w-5 !h-5 !border-white/30 !border-t-white" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <HiLightningBolt className="w-5 h-5" />
                    Assess Skills
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          {loading ? (
            <div className="card">
              <Spinner size="lg" text="AI is analyzing your experience..." />
            </div>
          ) : skills ? (
            <div className="space-y-4 animate-fade-in">
              <div className="card !bg-gradient-to-br !from-navy-800 !to-teal-600 !text-white !border-0">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-teal-200">Skills Detected</p>
                    <p className="text-4xl font-extrabold">{skills.count}</p>
                  </div>
                  {skills.mock_mode && (
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full">Mock Mode</span>
                  )}
                </div>
              </div>

              <div className="card max-h-[500px] overflow-y-auto">
                <h3 className="font-bold text-white mb-4">Extracted Skills</h3>
                <div className="space-y-3">
                  {skills.skills.map((skill, i) => (
                    <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-200">{skill.name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[skill.category] || 'bg-white/10 text-gray-400'}`}>
                            {skill.category}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-white">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${skill.proficiency}%`,
                            background: `linear-gradient(90deg, #1B4F72, #17A2B8)`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/explore"
                className="card flex items-center justify-between group hover:-translate-y-0.5 transition-all !border-teal-500/30 !bg-teal-500/10"
              >
                <div className="flex items-center gap-3">
                  <HiMap className="w-6 h-6 text-teal-400" />
                  <div>
                    <p className="font-bold text-white">Explore Career Paths</p>
                    <p className="text-sm text-gray-400">See matching careers based on your skills</p>
                  </div>
                </div>
                <HiArrowRight className="w-5 h-5 text-teal-400 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : existingSkills && existingSkills.count > 0 ? (
            <div className="space-y-4">
              <div className="card">
                <h3 className="font-bold text-white mb-4">
                  Current Skill Profile ({existingSkills.count} skills)
                </h3>
                <div className="space-y-3">
                  {existingSkills.skills.slice(0, 8).map((skill, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-gray-200">{skill.skill_name}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${categoryColors[skill.category] || 'bg-white/10 text-gray-400'}`}>
                            {skill.category}
                          </span>
                        </div>
                        <span className="text-sm text-gray-400">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-navy-800 to-teal-500"
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-400 mt-4">Submit new text to re-assess your skills</p>
              </div>
            </div>
          ) : (
            <div className="card text-center py-12">
              <HiClipboardList className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-300 mb-2">No Skills Yet</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                Paste your resume or experience on the left and click "Assess Skills" to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
