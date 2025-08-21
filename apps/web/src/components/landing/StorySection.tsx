import React from 'react';
import { Scan, Droplet, Send } from 'lucide-react';

interface StorySectionProps {
  isDark: boolean;
}

const StorySection: React.FC<StorySectionProps> = ({ isDark }) => {
  const steps = [
    {
      number: 1,
      title: "Identify your plant",
      description: "Snap a photo or upload from your gallery. Our model recognizes species and suggests essentials.",
      visual: "identify"
    },
    {
      number: 2,
      title: "Add to your collection",
      description: "Save details, location, and notes. Your greenhouse, beautifully organized.",
      visual: "collection"
    },
    {
      number: 3,
      title: "Receive seasonal care",
      description: "Schedules adapt to daylight, temperature, and your habits. Gentle, timely, never overwhelming.",
      visual: "care"
    },
    {
      number: 4,
      title: "Share and grow together",
      description: "Celebrate new leaves, ask for help, and discover creative setups from growers like you.",
      visual: "community"
    }
  ];

  const renderVisual = (type: string) => {
    switch (type) {
      case 'identify':
        return (
          <div className={`overflow-hidden rounded-2xl border ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-emerald-900/10 bg-white'
          }`}>
            <div className="grid grid-cols-3 gap-2 p-3">
              <img className="h-24 w-full rounded-xl object-cover ring-1 ring-emerald-900/10" src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop" alt="Leaf close-up" />
              <img className="h-24 w-full rounded-xl object-cover ring-1 ring-emerald-900/10" src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop" alt="Plant in room" />
              <div className="relative h-24 w-full rounded-xl ring-1 ring-emerald-900/10">
                <img className="h-full w-full rounded-xl object-cover" src="https://images.unsplash.com/photo-1635151227785-429f420c6b9d?w=1080&q=80" alt="Plant macro" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium text-white shadow-sm ring-1 transition font-quicksand ${
                    isDark 
                      ? 'bg-emerald-600 ring-emerald-500/30 hover:bg-emerald-500' 
                      : 'bg-emerald-700 ring-emerald-900/20 hover:bg-emerald-800'
                  }`}>
                    <Scan className="h-4 w-4" />
                    Identify
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'collection':
        return (
          <div className={`overflow-hidden rounded-2xl border p-4 ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-emerald-900/10 bg-white'
          }`}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className={`rounded-xl border p-3 ${
                isDark ? 'border-slate-800' : 'border-emerald-900/10'
              }`}>
                <img className="h-28 w-full rounded-lg object-cover ring-1 ring-emerald-900/10" src="https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80" alt="Snake plant" />
                <p className={`mt-2 text-sm font-medium font-quicksand ${
                  isDark ? 'text-emerald-100' : 'text-emerald-900'
                }`}>Snake Plant</p>
                <p className={`text-xs font-quicksand ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>Bedroom · Low light</p>
              </div>
              <div className={`rounded-xl border p-3 ${
                isDark ? 'border-slate-800' : 'border-emerald-900/10'
              }`}>
                <img className="h-28 w-full rounded-lg object-cover ring-1 ring-emerald-900/10" src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1400&auto=format&fit=crop" alt="ZZ plant" />
                <p className={`mt-2 text-sm font-medium font-quicksand ${
                  isDark ? 'text-emerald-100' : 'text-emerald-900'
                }`}>ZZ Plant</p>
                <p className={`text-xs font-quicksand ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>Hallway · Easy</p>
              </div>
              <div className={`rounded-xl border p-3 ${
                isDark ? 'border-slate-800' : 'border-emerald-900/10'
              }`}>
                <img className="h-28 w-full rounded-lg object-cover ring-1 ring-emerald-900/10" src="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=1080&q=80" alt="Pothos" />
                <p className={`mt-2 text-sm font-medium font-quicksand ${
                  isDark ? 'text-emerald-100' : 'text-emerald-900'
                }`}>Golden Pothos</p>
                <p className={`text-xs font-quicksand ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>Kitchen · Trailing</p>
              </div>
            </div>
          </div>
        );

      case 'care':
        return (
          <div className={`rounded-2xl border p-4 ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-emerald-900/10 bg-white'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ring-1 ${
                  isDark 
                    ? 'bg-emerald-900/40 ring-emerald-700/40' 
                    : 'bg-emerald-50 ring-emerald-900/10'
                }`}>
                  <Droplet className={`h-5 w-5 ${
                    isDark ? 'text-emerald-300' : 'text-emerald-700'
                  }`} />
                </div>
                <div>
                  <p className={`text-sm font-medium font-quicksand ${
                    isDark ? 'text-emerald-100' : 'text-emerald-900'
                  }`}>Water in 2 days</p>
                  <p className={`text-xs font-quicksand ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>Adjusts for warmer weeks</p>
                </div>
              </div>
              <button className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition font-quicksand ${
                isDark 
                  ? 'border border-slate-700/60 bg-slate-900 text-slate-100 hover:-translate-y-0.5 hover:shadow-sm' 
                  : 'border border-emerald-900/10 bg-white text-slate-800 hover:-translate-y-0.5 hover:shadow-sm'
              }`}>
                <i className="h-4 w-4" />
                Customize
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className={`rounded-xl border p-3 ${
                isDark 
                  ? 'border-slate-800 bg-emerald-900/30' 
                  : 'border-emerald-900/10 bg-emerald-50/70'
              }`}>
                <p className={`text-xs font-medium font-quicksand ${
                  isDark ? 'text-emerald-100' : 'text-emerald-900'
                }`}>Humidity</p>
                <p className={`text-xs font-quicksand ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>Ideal 60–70%</p>
              </div>
              <div className={`rounded-xl border p-3 ${
                isDark 
                  ? 'border-slate-800 bg-emerald-900/30' 
                  : 'border-emerald-900/10 bg-emerald-50/70'
              }`}>
                <p className={`text-xs font-medium font-quicksand ${
                  isDark ? 'text-emerald-100' : 'text-emerald-900'
                }`}>Light</p>
                <p className={`text-xs font-quicksand ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>6–8h indirect</p>
              </div>
              <div className={`rounded-xl border p-3 ${
                isDark 
                  ? 'border-slate-800 bg-emerald-900/30' 
                  : 'border-emerald-900/10 bg-emerald-50/70'
              }`}>
                <p className={`text-xs font-medium font-quicksand ${
                  isDark ? 'text-emerald-100' : 'text-emerald-900'
                }`}>Feeding</p>
                <p className={`text-xs font-quicksand ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>Monthly in spring</p>
              </div>
            </div>
          </div>
        );

      case 'community':
        return (
          <div className={`rounded-2xl border p-4 ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-emerald-900/10 bg-white'
          }`}>
            <div className="flex items-center gap-3">
              <img className="h-10 w-10 rounded-full object-cover ring-1 ring-emerald-900/10" src="https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=256&auto=format&fit=crop" alt="User avatar" />
              <input 
                type="text" 
                placeholder="Share a tip or story..." 
                className={`w-full rounded-full border px-4 py-2 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                  isDark 
                    ? 'border-slate-700/60 bg-emerald-950/40 text-slate-100' 
                    : 'border-emerald-900/10 bg-emerald-50/50 text-slate-800'
                }`}
              />
              <button className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-medium text-white ring-1 transition font-quicksand ${
                isDark 
                  ? 'bg-emerald-600 ring-emerald-500/30 hover:bg-emerald-500' 
                  : 'bg-emerald-700 ring-emerald-900/20 hover:bg-emerald-800'
              }`}>
                <Send className="h-4 w-4" />
                Post
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <img className="h-28 w-full rounded-xl object-cover ring-1 ring-emerald-900/10" src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?q=80&w=800&auto=format&fit=crop" alt="Community plant 1" />
              <img className="h-28 w-full rounded-xl object-cover ring-1 ring-emerald-900/10" src="https://images.unsplash.com/photo-1697125453575-0376d00f6e1f?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Community plant 2" />
              <img className="h-28 w-full rounded-xl object-cover ring-1 ring-emerald-900/10" src="https://images.unsplash.com/photo-1643730508670-9e4804f59eb9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Community plant 3" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="story" className="relative">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className={`text-3xl sm:text-4xl tracking-tight font-quicksand font-medium ${
            isDark ? 'text-emerald-50' : 'text-emerald-950'
          }`}>
            From "what is this plant?" to "look how it thrives"
          </h2>
          <p className={`mt-3 text-base font-quicksand ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}>
            A simple, joyful journey that grows with you.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ring-1 font-quicksand ${
                isDark 
                  ? 'bg-emerald-600 ring-emerald-500/30' 
                  : 'bg-emerald-600 ring-emerald-900/20'
              }`}>
                <span className="text-sm font-medium">{step.number}</span>
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-semibold tracking-tight font-quicksand ${
                  isDark ? 'text-emerald-100' : 'text-emerald-950'
                }`}>
                  {step.title}
                </h3>
                <p className={`mt-1 text-sm font-quicksand ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {step.description}
                </p>
                <div className="mt-4">
                  {renderVisual(step.visual)}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className={`mt-16 border-t ${
          isDark ? 'border-slate-800' : 'border-emerald-900/10'
        }`}></div>
      </div>
    </section>
  );
};

export default StorySection;
