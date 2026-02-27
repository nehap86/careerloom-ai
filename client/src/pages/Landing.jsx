import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiLightningBolt, HiMap, HiAcademicCap, HiChartBar, HiArrowRight, HiCheck } from 'react-icons/hi';

export default function Landing() {
  const { user } = useAuth();

  const features = [
    {
      icon: HiLightningBolt,
      title: 'AI Skill Assessment',
      description: 'Paste your resume and our AI extracts transferable skills, maps them to O*NET categories, and reveals hidden competencies.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: HiMap,
      title: 'Career Path Explorer',
      description: 'Interactive D3.js visualization shows viable career transitions with skill overlap, salary data, and market demand.',
      color: 'from-teal-500 to-emerald-600',
    },
    {
      icon: HiAcademicCap,
      title: 'Learning Roadmaps',
      description: 'AI-generated 12-week personalized learning plans with curated resources, weekly goals, and progress tracking.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: HiChartBar,
      title: 'Market Intelligence',
      description: 'Real-time career data including salary ranges, growth rates, and market demand to inform your decisions.',
      color: 'from-orange-500 to-red-600',
    },
  ];

  const steps = [
    { step: '01', title: 'Assess Your Skills', desc: 'Paste your resume or describe your experience. Our AI identifies your transferable skills.' },
    { step: '02', title: 'Explore Career Paths', desc: 'Discover viable career transitions ranked by feasibility, salary potential, and market demand.' },
    { step: '03', title: 'Follow Your Roadmap', desc: 'Get a personalized 12-week learning plan and track your progress week by week.' },
  ];

  const stats = [
    { value: '73%', label: 'of professionals consider career changes' },
    { value: '12 wks', label: 'average transition with structured plan' },
    { value: '40%+', label: 'salary increase in successful pivots' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-800 via-navy-800 to-teal-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-teal-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <HiLightningBolt className="w-4 h-4" />
              Powered by AI Career Intelligence
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Your Career Pivot
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-teal-100">
                Starts Here
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              AI-powered platform that identifies your transferable skills, reveals
              hidden career paths, and creates personalized reskilling roadmaps for
              mid-career professionals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to={user ? '/dashboard' : '/register'}
                className="btn-secondary !px-8 !py-4 text-lg flex items-center gap-2 group"
              >
                {user ? 'Go to Dashboard' : 'Start Free Assessment'}
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to={user ? '/explore' : '/login'}
                className="px-8 py-4 text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-white/10 transition-all text-lg"
              >
                {user ? 'Explore Careers' : 'Sign In'}
              </Link>
            </div>
          </div>
        </div>
        {/* Wave */}
        <div className="absolute bottom-0 w-full">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40L60 36C120 32 240 24 360 28C480 32 600 48 720 52C840 56 960 48 1080 40C1200 32 1320 24 1380 20L1440 16V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V40Z" fill="#0a1e33"/>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-white">{s.value}</p>
                <p className="text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Intelligent Career Navigation
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Four powerful tools working together to chart your career transition
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="card group hover:-translate-y-1 transition-transform duration-300">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-400">Three steps to your new career</p>
          </div>
          <div className="space-y-8">
            {steps.map((s, i) => (
              <div key={i} className="flex items-start gap-6 group">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-navy-800 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">{s.step}</span>
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-white mb-1">{s.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-navy-800 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Pivot Your Career?
          </h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have successfully navigated their career
            transitions with CareerLoom AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to={user ? '/assess' : '/register'} className="bg-white text-navy-800 px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/90 transition-colors shadow-lg flex items-center gap-2">
              <HiCheck className="w-5 h-5" />
              {user ? 'Assess Your Skills' : 'Create Free Account'}
            </Link>
          </div>
          <p className="text-gray-300 text-sm mt-4">No credit card required. Works without API key.</p>
        </div>
      </section>
    </div>
  );
}
