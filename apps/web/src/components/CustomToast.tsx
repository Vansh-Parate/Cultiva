import React from 'react';

export default function CustomToast({ show, title, message }) {
  if (!show) return null;
  return (
    <div
      className="fixed left-260 -translate-x-1/2 top-6 z-50 rounded-xl shadow-md px-5 py-3 flex items-start gap-3 min-w-[320px] max-w-xs animate-toast-in overflow-hidden"
      style={{ background: '#052814' }}
    >
      {/* Shining/gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(116,223,162,0.18) 0%, rgba(5,40,20,0.0) 70%)',
          zIndex: 1,
        }}
      />
      <span className="flex items-center justify-center w-6 h-6 rounded-full" style={{ background: '#5FBD87', marginRight: '0.5rem', marginTop: '0.25rem', zIndex: 2 }}>
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="10" fill="#5FBD87"/>
          <path d="M6 10.5L9 13.5L14 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
      <div className="flex flex-col" style={{ zIndex: 2 }}>
        <span className="font-semibold text-base leading-tight" style={{ color: '#5FBD87' }}>{title}</span>
        <span className="text-sm leading-tight mt-0.5" style={{ color: '#74DFA2' }}>{message}</span>
      </div>
      <style>{`
        @keyframes toast-in {
          0% { opacity: 0; transform: translate(-50%, -32px) scale(0.98); }
          60% { opacity: 1; transform: translate(-50%, 8px) scale(1.02); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        .animate-toast-in {
          animation: toast-in 0.5s cubic-bezier(.4,1.4,.6,1) both;
        }
      `}</style>
    </div>
  );
} 