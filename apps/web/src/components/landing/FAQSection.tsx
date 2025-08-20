import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQData {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  isDark: boolean;
  faqData: FAQData[];
  faqOpen: number | null;
  toggleFaq: (index: number) => void;
}

const FAQSection: React.FC<FAQSectionProps> = ({ isDark, faqData, faqOpen, toggleFaq }) => {
  return (
    <section id="faq" className="relative">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className={`text-3xl sm:text-4xl tracking-tight font-quicksand font-medium ${
            isDark ? 'text-emerald-50' : 'text-emerald-950'
          }`}>
            Questions, meet clarity
          </h2>
          <div className={`mt-8 divide-y rounded-2xl border ${
            isDark 
              ? 'divide-slate-800 border-slate-800 bg-slate-900/60' 
              : 'divide-emerald-900/10 border-emerald-900/10 bg-white'
          }`}>
            {faqData.map((faq, index) => (
              <details 
                key={index} 
                className="group p-5"
                open={faqOpen === index}
                onClick={(e) => {
                  e.preventDefault();
                  toggleFaq(index);
                }}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between">
                  <div className={`text-sm font-medium font-quicksand ${
                    isDark ? 'text-emerald-100' : 'text-emerald-900'
                  }`}>
                    {faq.question}
                  </div>
                  <ChevronDown className={`h-4 w-4 transition ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  } ${faqOpen === index ? 'rotate-180' : ''}`} />
                </summary>
                <p className={`mt-3 text-sm font-quicksand ${
                  isDark ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
