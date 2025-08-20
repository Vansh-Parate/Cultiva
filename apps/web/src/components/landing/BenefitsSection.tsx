import React from 'react';
import { Camera, Boxes, CalendarClock, Users, ArrowRight, Sparkles } from 'lucide-react';

interface BenefitsSectionProps {
  isDark: boolean;
}

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ isDark }) => {
  const benefits = [
    {
      icon: Camera,
      title: "AI Identification",
      description: "Point and know. Identify thousands of species with high accuracy, including care basics on the spot.",
      linkText: "Learn more",
      blurPosition: "right",
      sparklePosition: "top-right"
    },
    {
      icon: Boxes,
      title: "Collection Tracking",
      description: "Create a living library with photos, notes, locations, and growth milestones.",
      linkText: "See collections",
      blurPosition: "left",
      sparklePosition: "bottom-right"
    },
    {
      icon: CalendarClock,
      title: "Smart Care",
      description: "Personalized schedules adapt to your climate, season, and routine—gentle reminders included.",
      linkText: "Explore care",
      blurPosition: "right",
      sparklePosition: "bottom-left"
    },
    {
      icon: Users,
      title: "Community",
      description: "Share progress, ask questions, and learn from fellow growers in a supportive space.",
      linkText: "Visit community",
      blurPosition: "left",
      sparklePosition: "top-right"
    }
  ];

  return (
    <section id="benefits" className="relative">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        <div className="max-w-2xl">
          <h2 className={`text-3xl sm:text-4xl tracking-tight font-quicksand font-medium ${
            isDark ? 'text-emerald-50' : 'text-emerald-950'
          }`}>
            Everything you need for happy, thriving plants
          </h2>
          <p className={`mt-3 text-base font-quicksand ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            Four pillars that balance intelligence with care.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className={`group relative overflow-hidden rounded-3xl p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                isDark 
                  ? 'border border-slate-800 bg-slate-900/60 hover:ring-1 hover:ring-emerald-600/30' 
                  : 'border border-emerald-900/10 bg-white hover:shadow-md'
              }`}
            >
              {/* Background blur effects */}
              <div className={`absolute h-28 w-28 rounded-full blur-2xl animate-pulse ${
                benefit.blurPosition === 'right' 
                  ? '-right-8 -top-8' 
                  : '-left-10 -bottom-10'
              } ${
                index === 0 ? 'bg-emerald-800/30' :
                index === 1 ? 'bg-emerald-800/30' :
                index === 2 ? 'bg-teal-800/30' :
                'bg-emerald-700/30'
              }`}></div>
              
              {/* Animated ping dots */}
              <span className={`pointer-events-none absolute h-2 w-2 rounded-full animate-ping ${
                benefit.sparklePosition === 'top-right' ? 'right-6 top-6' :
                benefit.sparklePosition === 'bottom-right' ? 'right-6 bottom-6' :
                benefit.sparklePosition === 'bottom-left' ? 'left-8 bottom-8' :
                'left-6 top-6'
              } ${
                index === 0 ? 'bg-emerald-400' :
                index === 1 ? 'bg-teal-400' :
                index === 2 ? 'bg-emerald-400' :
                'bg-teal-400'
              }`}></span>

              {/* Icon */}
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-1 transition group-hover:scale-105 group-hover:ring-emerald-500/50 ${
                isDark 
                  ? 'bg-emerald-900/40 ring-emerald-700/40' 
                  : 'bg-emerald-50 ring-emerald-900/10'
              }`}>
                <benefit.icon className={`h-5 w-5 transition group-hover:rotate-3 ${
                  isDark ? 'text-emerald-300' : 'text-emerald-700'
                }`} />
              </div>

              {/* Content */}
              <h3 className={`mt-4 text-xl font-semibold tracking-tight font-quicksand ${
                isDark ? 'text-emerald-100' : 'text-emerald-950'
              }`}>
                {benefit.title}
              </h3>
              <p className={`mt-2 text-sm font-quicksand ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {benefit.description}
              </p>
              <div className={`mt-4 inline-flex items-center gap-1 text-sm font-medium font-quicksand ${
                isDark ? 'text-emerald-300' : 'text-emerald-800'
              }`}>
                {benefit.linkText} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>

              {/* Sparkle effects */}
              <div className={`pointer-events-none absolute ${
                benefit.sparklePosition === 'top-right' ? 'right-6 top-6' :
                benefit.sparklePosition === 'bottom-right' ? 'right-6 bottom-6' :
                benefit.sparklePosition === 'bottom-left' ? 'left-6 top-6' :
                'right-6 top-6'
              }`}>
                <Sparkles className={`w-5 h-5 animate-pulse ${
                  isDark ? 'text-emerald-300/70' : 'text-emerald-300/70'
                }`} />
              </div>

              {/* Additional blur effects */}
              <div className={`pointer-events-none absolute -bottom-10 -left-10 h-20 w-20 rounded-full blur-2xl ${
                index === 0 ? 'bg-emerald-700/20' : 'bg-transparent'
              }`}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
