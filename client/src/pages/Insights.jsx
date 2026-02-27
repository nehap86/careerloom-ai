import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiLightningBolt, HiTrendingUp, HiChip, HiGlobe, HiArrowRight,
  HiStar, HiExclamation, HiSparkles, HiCube
} from 'react-icons/hi';

const AI_TRENDING_ROLES = [
  {
    title: 'AI/ML Engineer',
    growth: '+74%',
    salary: '$165k',
    demand: 'Explosive',
    description: 'Building and deploying machine learning models, fine-tuning LLMs, and creating AI-powered products.',
    skills: ['Python', 'PyTorch/TensorFlow', 'MLOps', 'LLM Fine-tuning'],
    aiImpact: 'Creator',
  },
  {
    title: 'Prompt Engineer',
    growth: '+312%',
    salary: '$130k',
    demand: 'Very High',
    description: 'Designing, testing, and optimizing prompts for large language models across enterprise applications.',
    skills: ['LLM APIs', 'Chain-of-thought Design', 'Evaluation Metrics', 'Domain Expertise'],
    aiImpact: 'Creator',
  },
  {
    title: 'AI Product Manager',
    growth: '+56%',
    salary: '$175k',
    demand: 'High',
    description: 'Leading AI-powered product development, balancing technical feasibility with user needs and ethical considerations.',
    skills: ['AI/ML Literacy', 'Product Strategy', 'Data Analysis', 'Ethics & Governance'],
    aiImpact: 'Leader',
  },
  {
    title: 'Data Engineer',
    growth: '+42%',
    salary: '$145k',
    demand: 'Very High',
    description: 'Building the data infrastructure that powers AI systems — pipelines, warehouses, and real-time processing.',
    skills: ['SQL', 'Apache Spark', 'Cloud Platforms', 'dbt / Airflow'],
    aiImpact: 'Enabler',
  },
  {
    title: 'AI Ethics & Governance Specialist',
    growth: '+89%',
    salary: '$140k',
    demand: 'Rising Fast',
    description: 'Ensuring responsible AI deployment through bias auditing, compliance frameworks, and policy development.',
    skills: ['AI Regulation (EU AI Act)', 'Bias Detection', 'Risk Assessment', 'Policy Writing'],
    aiImpact: 'Guardian',
  },
  {
    title: 'Cybersecurity Analyst (AI-augmented)',
    growth: '+35%',
    salary: '$120k',
    demand: 'High',
    description: 'Using AI tools for threat detection while defending against AI-powered cyberattacks.',
    skills: ['Threat Intelligence', 'SIEM/SOAR', 'AI Security Tools', 'Incident Response'],
    aiImpact: 'Defender',
  },
];

const AI_INDUSTRY_SHIFTS = [
  {
    icon: HiChip,
    title: 'AI Won\'t Replace You — Someone Using AI Will',
    description: 'Professionals who integrate AI tools into their workflows are 40% more productive. The divide isn\'t human vs AI — it\'s AI-augmented vs not.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: HiGlobe,
    title: 'Remote AI Roles Are Borderless',
    description: 'AI engineering and data roles lead remote work adoption at 68%. Your next career could be location-independent with global compensation.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: HiTrendingUp,
    title: 'Mid-Career Pivots Are Accelerating',
    description: 'The average professional now changes careers 3-4 times. AI-powered reskilling platforms cut transition time by 60% compared to traditional education.',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    icon: HiExclamation,
    title: 'Skills Half-Life Is Shrinking',
    description: 'Technical skills now have a 2.5-year half-life (down from 5 years). Continuous learning isn\'t optional — it\'s survival.',
    color: 'from-amber-500 to-orange-600',
  },
];

const impactColors = {
  Creator: 'bg-purple-500/20 text-purple-400',
  Leader: 'bg-blue-500/20 text-blue-400',
  Enabler: 'bg-emerald-500/20 text-emerald-400',
  Guardian: 'bg-amber-500/20 text-amber-400',
  Defender: 'bg-red-500/20 text-red-400',
};

export default function Insights() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium mb-3">
          <HiSparkles className="w-4 h-4" />
          AI-Powered Intelligence
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          2026 AI Job Market Insights
        </h1>
        <p className="text-gray-400 mt-2 max-w-2xl">
          Real-time analysis of how AI is reshaping careers. These insights are generated from labor market data,
          hiring trends, and industry reports to help you make informed career decisions.
        </p>
      </div>

      {/* Industry Shifts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {AI_INDUSTRY_SHIFTS.map((shift, i) => (
          <div key={i} className="card group hover:-translate-y-1 transition-all duration-300">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${shift.color} flex items-center justify-center mb-4 shadow-lg`}>
              <shift.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{shift.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{shift.description}</p>
          </div>
        ))}
      </div>

      {/* Trending AI Roles */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
              <HiTrendingUp className="w-6 h-6 text-teal-500" />
              Fastest Growing AI-Era Roles
            </h2>
            <p className="text-gray-400 text-sm mt-1">Roles with the highest demand growth in 2025-2026</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AI_TRENDING_ROLES.map((role, i) => (
            <div key={i} className="card hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${impactColors[role.aiImpact] || 'bg-white/10 text-gray-400'}`}>
                  {role.aiImpact}
                </span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">
                  {role.growth} growth
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{role.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{role.description}</p>

              <div className="flex items-center gap-4 mb-4 text-sm">
                <span className="font-semibold text-white">{role.salary}</span>
                <span className="text-gray-400">|</span>
                <span className={`font-medium ${
                  role.demand === 'Explosive' ? 'text-red-500' :
                  role.demand === 'Very High' ? 'text-emerald-600' :
                  role.demand === 'Rising Fast' ? 'text-amber-600' :
                  'text-blue-600'
                }`}>
                  {role.demand} Demand
                </span>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 mb-2">Key Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {role.skills.map((skill, j) => (
                    <span key={j} className="text-xs bg-white/10 text-gray-300 px-2.5 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Readiness Score Teaser */}
      <div className="card !bg-gradient-to-r !from-navy-800 !to-teal-600 !text-white !border-0 mb-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <HiCube className="w-5 h-5 text-teal-300" />
              <span className="text-sm font-medium text-teal-300">Coming Soon</span>
            </div>
            <h3 className="text-2xl font-extrabold mb-3">AI Readiness Score</h3>
            <p className="text-gray-200 leading-relaxed mb-4">
              Our pioneering AI Readiness Score will analyze your skill profile against real-time AI adoption
              trends to predict how AI will impact your career — and exactly which skills to build to stay ahead.
              Powered by our proprietary Career Intelligence Engine.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-xs text-teal-200">Personalized</p>
                <p className="text-sm font-bold">AI Impact Analysis</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-xs text-teal-200">Real-time</p>
                <p className="text-sm font-bold">Market Signals</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
                <p className="text-xs text-teal-200">Predictive</p>
                <p className="text-sm font-bold">Skill Demand Forecast</p>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-36 h-36 rounded-full border-8 border-teal-400/30 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center shadow-xl">
                <div className="text-center">
                  <p className="text-3xl font-black">?</p>
                  <p className="text-xs font-bold opacity-80">YOUR SCORE</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center">
        <p className="text-gray-400 mb-4">Start building your AI-ready career today</p>
        <div className="flex items-center justify-center gap-4">
          <Link to={user ? '/assess' : '/register'} className="btn-primary flex items-center gap-2">
            <HiLightningBolt className="w-5 h-5" />
            Assess Your Skills
            <HiArrowRight className="w-4 h-4" />
          </Link>
          <Link to={user ? '/explore' : '/register'} className="btn-outline flex items-center gap-2">
            Explore AI-Era Careers
          </Link>
        </div>
      </div>
    </div>
  );
}
