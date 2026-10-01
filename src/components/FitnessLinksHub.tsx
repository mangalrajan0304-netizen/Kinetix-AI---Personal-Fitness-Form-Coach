import React, { useState } from 'react';
import { ExternalLink, Link2, Globe, BookOpen, Dumbbell, Apple, Activity, Heart, Shield, CheckCircle2 } from 'lucide-react';

interface FitnessLinkItem {
  id: string;
  category: 'Scientific' | 'Nutrition' | 'Coaches' | 'Mobility';
  title: string;
  source: string;
  url: string;
  description: string;
  badge: string;
  icon: string;
}

export const FitnessLinksHub: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'Scientific' | 'Nutrition' | 'Coaches' | 'Mobility'>('all');

  const links: FitnessLinkItem[] = [
    {
      id: 'exrx',
      category: 'Scientific',
      title: 'ExRx.net Exercise Prescription Biomechanics Database',
      source: 'ExRx.net',
      url: 'https://exrx.net',
      description: 'Comprehensive kinesiology directory of joint angles, agonist/antagonist muscles, and kinematics.',
      badge: 'Academic Standard',
      icon: '📐',
    },
    {
      id: 'nasm',
      category: 'Scientific',
      title: 'NASM Kinetic Chain & Overhead Squat Assessments',
      source: 'NASM.org',
      url: 'https://www.nasm.org',
      description: 'National Academy of Sports Medicine clinical protocols for identifying muscle imbalances and compensation patterns.',
      badge: 'Clinical Sports Medicine',
      icon: '🏛️',
    },
    {
      id: 'acsm',
      category: 'Scientific',
      title: 'ACSM Exercise & Hypertrophy Guidelines',
      source: 'ACSM.org',
      url: 'https://www.acsm.org',
      description: 'Official position stands on resistance training volume, frequency, and time under tension (TUT).',
      badge: 'Peer-Reviewed',
      icon: '🔬',
    },
    {
      id: 'cronometer',
      category: 'Nutrition',
      title: 'Cronometer Comprehensive Micronutrient & Calorie Tracker',
      source: 'Cronometer.com',
      url: 'https://cronometer.com',
      description: 'Accurately tracks all 82 essential micronutrients, electrolytes, and leucine for muscle protein synthesis.',
      badge: 'Nutritional Gold Standard',
      icon: '🥗',
    },
    {
      id: 'pn_macro',
      category: 'Nutrition',
      title: 'Precision Nutrition Total Daily Energy Expenditure (TDEE)',
      source: 'PrecisionNutrition.com',
      url: 'https://www.precisionnutrition.com/nutrition-calculator',
      description: 'Evidence-based individualized calorie, protein, carbohydrate, and healthy fat targets.',
      badge: 'Dietary Calculator',
      icon: '⚖️',
    },
    {
      id: 'squat_uni',
      category: 'Coaches',
      title: 'Squat University: Physical Therapy & Technique',
      source: 'YouTube / @SquatUniversity',
      url: 'https://www.youtube.com/@SquatUniversity',
      description: 'Dr. Aaron Horschig shares practical physical therapy diagnostics for barbell and bodyweight form.',
      badge: 'Doctor of PT',
      icon: '🏋️',
    },
    {
      id: 'jeff_nip',
      category: 'Coaches',
      title: 'Jeff Nippard: Science-Applied Lifting',
      source: 'YouTube / @JeffNippard',
      url: 'https://www.youtube.com/@JeffNippard',
      description: 'Electromyography (EMG) studies and biomechanics explained for optimal hypertrophy.',
      badge: 'Science Lifting',
      icon: '📊',
    },
    {
      id: 'hybrid_cali',
      category: 'Coaches',
      title: 'Hybrid Calisthenics: Progressive Movement Guides',
      source: 'HybridCalisthenics.com',
      url: 'https://www.hybridcalisthenics.com',
      description: 'Accessible step-by-step calisthenic progressions from wall pushups to single-arm mastery.',
      badge: 'Calisthenics',
      icon: '🤸',
    },
    {
      id: 'ready_state',
      category: 'Mobility',
      title: 'The Ready State: Mobility & Tissue Recovery',
      source: 'TheReadyState.com',
      url: 'https://thereadystate.com',
      description: 'Dr. Kelly Starrett’s movement mechanics for resolving joint stiffness and maximizing hip capsule rotation.',
      badge: 'Joint Longevity',
      icon: '🧘',
    },
    {
      id: 'atg_knees',
      category: 'Mobility',
      title: 'Athletic Truth Group (ATG) Knees Over Toes System',
      source: 'YouTube / @TheKneesovertoesguy',
      url: 'https://www.youtube.com/@TheKneesovertoesguy',
      description: 'Revolutionary structural integrity drills for knees, hips, and ankles through full range of motion.',
      badge: 'Bulletproofing',
      icon: '🛡️',
    },
  ];

  const filtered = links.filter((l) => activeCategory === 'all' || l.category === activeCategory);

  return (
    <div className="bg-[#120d28] border border-violet-800/60 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-violet-900/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
            <Link2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Curated Fitness & Biomechanics Links
            </h3>
            <p className="text-xs text-violet-300/70">
              Authoritative scientific databases, nutrition calculators, and verified coaching channels
            </p>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {(['all', 'Scientific', 'Nutrition', 'Coaches', 'Mobility'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-lg font-bold transition-all border cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-violet-600 text-white border-violet-500 shadow-sm'
                  : 'bg-[#0e0920] text-violet-300/80 border-violet-900/60 hover:text-white hover:bg-violet-900/40'
              }`}
            >
              {cat === 'all' ? 'All Links' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Link Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filtered.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-[#0e0920] border border-violet-900/40 hover:border-violet-500/60 rounded-xl flex items-start gap-3 transition-all hover:bg-[#160e33] group"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-950/60 border border-violet-800/60 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
              {item.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-bold text-violet-400 bg-violet-950/80 border border-violet-800/80 px-1.5 py-0.5 rounded">
                  {item.badge}
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-300 transition-colors" />
              </div>

              <h4 className="text-xs font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                {item.title}
              </h4>

              <p className="text-[11px] text-slate-300/80 mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>

              <div className="text-[10px] font-mono text-violet-400/90 mt-1.5 font-semibold">
                {item.source}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
