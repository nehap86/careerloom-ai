import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white/5 backdrop-blur-sm text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="text-lg font-bold">
                Career<span className="text-teal-400">Loom</span> AI
              </span>
            </div>
            <p className="text-gray-300 text-sm max-w-md leading-relaxed">
              Empowering mid-career professionals to navigate career transitions with
              AI-powered skill assessment, career path exploration, and personalized
              learning roadmaps.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3 text-teal-400">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><Link to="/assess" className="hover:text-white transition-colors">Skill Assessment</Link></li>
              <li><Link to="/explore" className="hover:text-white transition-colors">Career Explorer</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-teal-400">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><span className="cursor-default">About CareerLoom Technologies</span></li>
              <li><span className="cursor-default">Careers</span></li>
              <li><span className="cursor-default">Privacy Policy</span></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} CareerLoom Technologies. All rights reserved. Built with AI-powered career intelligence.
        </div>
      </div>
    </footer>
  );
}
