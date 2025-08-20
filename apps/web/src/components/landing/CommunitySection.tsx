import React from 'react';
import { Users, Sprout, Heart, Leaf } from 'lucide-react';

interface CommunitySectionProps {
  isDark: boolean;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({ isDark }) => {
  const testimonials = [
    {
      name: "Maya",
      location: "Brooklyn",
      plants: "24 plants",
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=256&auto=format&fit=crop",
      quote: "The seasonal tips are gold. I stopped overwatering and my Calathea finally looks happy.",
      stat: "Care success +38%",
      statIcon: Sprout
    },
    {
      name: "Leo",
      location: "Lisbon",
      plants: "New to plants",
      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=256&auto=format&fit=crop",
      quote: "I love how friendly everyone is. I posted my first monstera and got great advice within minutes.",
      stat: "320 favorites this month",
      statIcon: Heart
    },
    {
      name: "Anika",
      location: "Berlin",
      plants: "40+ plants",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop",
      quote: "Tracking growth milestones is surprisingly motivating. My balcony feels like a tiny jungle now.",
      stat: "12 new leaves this spring",
      statIcon: Leaf
    }
  ];

  const communityPhotos = [
    "https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1400&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1621619856624-42fd193a0661?w=1080&q=80",
    "https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=1080&q=80",
    "https://images.unsplash.com/photo-1635151227785-429f420c6b9d?w=1080&q=80"
  ];

  return (
    <section id="community" className="relative">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <h2 className={`text-3xl sm:text-4xl tracking-tight font-quicksand font-medium ${
              isDark ? 'text-emerald-50' : 'text-emerald-950'
            }`}>
              A welcoming greenhouse of people and plants
            </h2>
            <p className={`mt-3 max-w-2xl text-base font-quicksand ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Stories, questions, and quiet celebrations—growing together is better.
            </p>
          </div>
          <a href="#" className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md font-quicksand ${
            isDark 
              ? 'border border-slate-700/60 bg-slate-900 text-slate-100 hover:border-slate-600' 
              : 'border border-emerald-900/10 bg-white text-slate-800 hover:border-emerald-900/20'
          }`}>
            <Users className="h-4 w-4" />
            Explore community
          </a>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className={`rounded-3xl border p-6 shadow-sm ${
              isDark 
                ? 'border-slate-800 bg-slate-900/60' 
                : 'border-emerald-900/10 bg-white'
            }`}>
              <div className="flex items-center gap-3">
                <img className={`h-10 w-10 rounded-full object-cover ring-1 ${
                  isDark ? 'ring-slate-800' : 'ring-emerald-900/10'
                }`} src={testimonial.avatar} alt="Profile" />
                <div>
                  <p className={`text-sm font-medium font-quicksand ${
                    isDark ? 'text-emerald-100' : 'text-emerald-900'
                  }`}>{testimonial.name}</p>
                  <p className={`text-xs font-quicksand ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>{testimonial.location} · {testimonial.plants}</p>
                </div>
              </div>
              <p className={`mt-4 text-sm font-quicksand ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                "{testimonial.quote}"
              </p>
              <div className={`mt-4 flex items-center gap-3 text-xs font-quicksand ${
                isDark ? 'text-emerald-300' : 'text-emerald-800'
              }`}>
                <testimonial.statIcon className="h-4 w-4" /> {testimonial.stat}
              </div>
            </div>
          ))}
        </div>

        {/* Photo strip */}
        <div className={`mt-10 overflow-hidden rounded-3xl ring-1 ${
          isDark ? 'ring-slate-800' : 'ring-emerald-900/10'
        }`}>
          <div className="grid grid-cols-2 sm:grid-cols-4">
            {communityPhotos.map((photo, index) => (
              <img 
                key={index}
                className="h-40 w-full object-cover" 
                src={photo} 
                alt={`Community ${index + 1}`} 
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className={`mt-16 border-t ${
          isDark ? 'border-slate-800' : 'border-emerald-900/10'
        }`}></div>
      </div>
    </section>
  );
};

export default CommunitySection;
