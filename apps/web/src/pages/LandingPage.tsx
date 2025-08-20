import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Sprout, 
  LogIn, 
  Menu, 
  PlayCircle, 
  X
} from 'lucide-react';
import HeroVisual from '../components/landing/HeroVisual';
import BenefitsSection from '../components/landing/BenefitsSection';
import StorySection from '../components/landing/StorySection';
import CommunitySection from '../components/landing/CommunitySection';
import FAQSection from '../components/landing/FAQSection';
import FinalCTASection from '../components/landing/FinalCTASection';
import ThemeToggle from '../components/ThemeToggle';
import Logo from '../components/Logo';

interface LandingPageProps {
  theme?: 'light' | 'dark';
}

const LandingPage: React.FC<LandingPageProps> = ({ theme = 'light' }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(theme);

  const isDark = currentTheme === 'dark';

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const faqData = [
    {
      question: "How accurate is plant identification?",
      answer: "Our model recognizes thousands of species and improves with community feedback. Confidence scores are shown to guide care decisions."
    },
    {
      question: "Can schedules adapt to my climate?",
      answer: "Yes—we consider seasonality and local conditions so your reminders feel natural, not nagging."
    },
    {
      question: "Is there a free plan?",
      answer: "Start free with core features. Upgrade anytime for advanced insights and unlimited collections."
    }
  ];

  return (
    <div className={`min-h-screen antialiased selection:bg-emerald-200/60 selection:text-emerald-900 ${
      isDark 
        ? 'bg-slate-950 text-slate-100 selection:bg-emerald-400/30 selection:text-emerald-50' 
        : 'bg-[#F6F9F3] text-slate-800'
    }`}>
      {/* Decorative Background Blobs */}
      <div aria-hidden="true" className="fixed inset-0 pointer-events-none">
        {isDark ? (
          <>
            <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-800/25 blur-3xl animate-pulse"></div>
            <div className="absolute top-32 -right-16 h-72 w-72 rounded-full bg-emerald-700/20 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-teal-700/20 blur-3xl"></div>
          </>
        ) : (
          <>
            <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-emerald-300/40 blur-3xl"></div>
            <div className="absolute top-32 -right-16 h-72 w-72 rounded-full bg-green-200/60 blur-3xl"></div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-lime-200/50 blur-3xl"></div>
          </>
        )}
      </div>

             {/* Navigation */}
       <header className="sticky top-0 z-40">
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
           <div className={`mt-4 mb-4 flex items-center justify-between rounded-full px-6 py-3 backdrop-blur ${
             isDark 
               ? 'border border-emerald-500/15 bg-slate-900/60' 
               : 'border border-emerald-900/10 bg-white/60'
           }`}>
             <Link to="/" className="flex items-center gap-3">
               <Logo size="lg" isDark={isDark} />
             </Link>
             
             <nav className="hidden items-center gap-8 md:flex">
               {['Benefits', 'How it works', 'Community', 'FAQ'].map((item) => (
                 <a 
                   key={item}
                   href={`#${item.toLowerCase().replace(' ', '-')}`}
                   className={`text-sm font-medium transition-colors font-quicksand ${
                     isDark 
                       ? 'text-slate-300 hover:text-emerald-300' 
                       : 'text-slate-700 hover:text-emerald-700'
                   }`}
                 >
                   {item}
                 </a>
               ))}
             </nav>
             
             <div className="hidden items-center gap-3 md:flex">
               <ThemeToggle theme={currentTheme} onThemeChange={setCurrentTheme} />
               <Link to="/auth/signin" className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 font-quicksand ${
                 isDark 
                   ? 'border border-slate-700/60 bg-slate-900 text-slate-100 hover:border-slate-600' 
                   : 'border border-emerald-900/10 bg-white text-slate-800 hover:border-emerald-900/20'
               }`}>
                 <LogIn className="h-4 w-4" />
                 Sign in
               </Link>
               <Link to="/auth/signup" className={`inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 font-quicksand ${
                 isDark ? 'ring-1 ring-emerald-500/30 hover:bg-emerald-500' : 'ring-1 ring-emerald-900/20'
               }`}>
                 <Sprout className="h-4 w-4" />
                 Get started
               </Link>
             </div>
            
                         <button 
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
               className={`md:hidden inline-flex items-center justify-center rounded-full p-2 transition ${
                 isDark 
                   ? 'border border-slate-700/60 bg-slate-900/70 text-slate-300 hover:text-emerald-300' 
                   : 'border border-emerald-900/10 bg-white/70 text-slate-700 hover:text-emerald-700'
               }`}
               aria-label="Toggle mobile menu"
             >
               {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
             </button>
          </div>
        </div>
        
                 {/* Mobile menu */}
         {mobileMenuOpen && (
           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 md:hidden">
             <div className={`mb-4 rounded-2xl p-6 backdrop-blur ${
               isDark 
                 ? 'border border-slate-800 bg-slate-900/70' 
                 : 'border border-emerald-900/10 bg-white/70'
             }`}>
               <div className="flex items-center justify-center mb-6">
                 <Logo size="md" isDark={isDark} />
               </div>
               <nav className="flex flex-col gap-4">
                                 {['Benefits', 'How it works', 'Community', 'FAQ'].map((item) => (
                   <a 
                     key={item}
                     href={`#${item.toLowerCase().replace(' ', '-')}`}
                     className={`rounded-lg px-4 py-3 text-sm font-medium transition font-quicksand ${
                       isDark 
                         ? 'text-slate-100 hover:bg-emerald-900/30 hover:text-emerald-200' 
                         : 'text-slate-800 hover:bg-emerald-50 hover:text-emerald-800'
                     }`}
                     onClick={() => setMobileMenuOpen(false)}
                   >
                     {item}
                   </a>
                 ))}
                                 <div className="mt-2 flex gap-2">
                   <Link to="/auth/signin" className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md font-quicksand ${
                     isDark 
                       ? 'border border-slate-700/60 bg-slate-900 text-slate-100 hover:border-slate-600' 
                       : 'border border-emerald-900/10 bg-white text-slate-800 hover:border-emerald-900/20'
                   }`}>
                     <LogIn className="h-4 w-4" />
                     Sign in
                   </Link>
                   <Link to="/auth/signup" className={`inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 hover:-translate-y-0.5 hover:shadow-md font-quicksand ${
                     isDark ? 'ring-1 ring-emerald-500/30 hover:bg-emerald-500' : 'ring-1 ring-emerald-900/20'
                   }`}>
                     <Sprout className="h-4 w-4" />
                     Get started
                   </Link>
                 </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl sm:px-6 lg:px-8 sm:pt-16 lg:pt-20 mr-auto ml-auto pt-10 pr-4 pl-4">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h1 className={`sm:text-5xl lg:text-6xl text-4xl tracking-tight font-quicksand font-medium ${
                isDark ? 'text-emerald-50' : 'text-emerald-950'
              }`}>
                Grow smarter with an AI-guided plant companion
              </h1>
                             <p className={`mt-4 text-base sm:text-lg leading-relaxed font-quicksand ${
                 isDark ? 'text-slate-300' : 'text-slate-700'
               }`}>
                 Cultiva helps you identify plants in seconds, organize your collection, follow gentle care schedules, and learn together with a thriving community.
               </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/auth/signup" className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 font-quicksand ${
                  isDark 
                    ? 'bg-emerald-600 ring-emerald-500/30 hover:bg-emerald-500' 
                    : 'bg-emerald-700 ring-emerald-900/20 hover:bg-emerald-800'
                }`}>
                  <Leaf className="h-5 w-5" />
                  Start free
                </Link>
                <a href="#story" className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 font-quicksand ${
                  isDark 
                    ? 'border border-slate-700/60 bg-slate-900 text-slate-100 hover:border-slate-600' 
                    : 'border border-emerald-900/10 bg-white text-slate-800 hover:border-emerald-900/20'
                }`}>
                  <PlayCircle className="h-5 w-5" />
                  See how it works
                </a>
              </div>
                             <div className="mt-6 flex items-center gap-3">
                 <div className="flex items-center gap-2">
                   <div className={`h-2 w-2 rounded-full ${
                     isDark ? 'bg-emerald-400' : 'bg-emerald-600'
                   }`}></div>
                   <span className={`text-sm font-quicksand ${
                     isDark ? 'text-emerald-200/90' : 'text-emerald-900/90'
                   }`}>
                     Free to start • No credit card required
                   </span>
                 </div>
               </div>
            </div>

            {/* Hero Visual */}
            <HeroVisual isDark={isDark} />
          </div>

          {/* Subtle divider */}
          <div className={`mt-16 border-t ${
            isDark ? 'border-slate-800' : 'border-emerald-900/10'
          }`}></div>
        </div>
      </section>

      {/* Benefits Section */}
      <BenefitsSection isDark={isDark} />

      {/* Story Section */}
      <StorySection isDark={isDark} />

      {/* Community Section */}
      <CommunitySection isDark={isDark} />

      {/* FAQ Section */}
      <FAQSection isDark={isDark} faqData={faqData} faqOpen={faqOpen} toggleFaq={toggleFaq} />

      {/* Final CTA */}
      <FinalCTASection isDark={isDark} />
    </div>
  );
};

export default LandingPage;
