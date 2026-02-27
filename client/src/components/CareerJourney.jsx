import { Link } from 'react-router-dom';
import {
  HiLightningBolt, HiMap, HiAcademicCap, HiBriefcase, HiFlag, HiBookOpen,
  HiCheckCircle, HiArrowRight,
} from 'react-icons/hi';

const steps = [
  { id: 'assess', label: 'Assess Skills', icon: HiLightningBolt, to: '/assess', desc: 'Discover your strengths', color: 'from-blue-500 to-indigo-600' },
  { id: 'explore', label: 'Explore Paths', icon: HiMap, to: '/explore', desc: 'Find your best fit', color: 'from-teal-500 to-emerald-600' },
  { id: 'learn', label: 'Learn & Grow', icon: HiAcademicCap, to: '/explore', desc: 'Build new skills', color: 'from-purple-500 to-violet-600' },
  { id: 'apply', label: 'Find Jobs', icon: HiBriefcase, to: '/jobs', desc: 'Apply with confidence', color: 'from-orange-500 to-red-500' },
  { id: 'land', label: 'Land the Role', icon: HiFlag, to: '/resources', desc: 'Ace your interviews', color: 'from-pink-500 to-rose-600' },
  { id: 'thrive', label: 'Thrive', icon: HiBookOpen, to: '/resources', desc: 'Grow in your new career', color: 'from-amber-500 to-yellow-600' },
];

export default function CareerJourney({ stats }) {
  const hasSkills = (stats?.skills || 0) > 0;
  const hasPaths = (stats?.career_paths || 0) > 0;
  const hasRoadmaps = (stats?.roadmaps || 0) > 0;
  const progress = stats?.learning_progress || 0;

  // Determine which step the user is on
  const completedSteps = new Set();
  let currentStep = 'assess';

  if (hasSkills) {
    completedSteps.add('assess');
    currentStep = 'explore';
  }
  if (hasPaths) {
    completedSteps.add('explore');
    currentStep = 'learn';
  }
  if (hasRoadmaps && progress > 0) {
    completedSteps.add('learn');
    currentStep = 'apply';
  }
  if (hasRoadmaps && progress >= 50) {
    currentStep = 'apply';
  }

  return (
    <div className="card !p-0 overflow-hidden">
      <div className="bg-gradient-to-r from-navy-800 to-teal-600 px-6 py-4">
        <h2 className="text-white font-bold text-lg">Your Career Journey</h2>
        <p className="text-white/70 text-sm">Follow the steps to transition into your dream role</p>
      </div>
      <div className="p-5">
        <div className="space-y-1">
          {steps.map((step, i) => {
            const isCompleted = completedSteps.has(step.id);
            const isCurrent = step.id === currentStep;
            return (
              <div key={step.id} className="flex items-stretch gap-3">
                {/* Timeline */}
                <div className="flex flex-col items-center w-8">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted ? 'bg-emerald-500' : isCurrent ? `bg-gradient-to-br ${step.color}` : 'bg-white/10'
                  }`}>
                    {isCompleted ? (
                      <HiCheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <step.icon className={`w-4 h-4 ${isCurrent ? 'text-white' : 'text-gray-400'}`} />
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-0.5 flex-1 my-1 ${isCompleted ? 'bg-emerald-300' : 'bg-white/10'}`} />
                  )}
                </div>
                {/* Content */}
                <Link
                  to={step.to}
                  className={`flex-1 flex items-center justify-between p-3 rounded-lg mb-1 transition-colors ${
                    isCurrent ? 'bg-teal-500/10 border border-teal-500/30' : isCompleted ? 'bg-emerald-500/10' : 'hover:bg-white/5'
                  }`}
                >
                  <div>
                    <p className={`text-sm font-semibold ${
                      isCurrent ? 'text-teal-300' : isCompleted ? 'text-emerald-400' : 'text-gray-400'
                    }`}>
                      {step.label}
                      {isCurrent && (
                        <span className="ml-2 text-xs bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full">Current</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">{step.desc}</p>
                  </div>
                  {isCurrent && <HiArrowRight className="w-4 h-4 text-teal-500" />}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
