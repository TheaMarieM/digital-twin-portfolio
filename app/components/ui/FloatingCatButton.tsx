'use client';

import { useState } from 'react';

export default function FloatingCatButton() {
  const [isHovered, setIsHovered] = useState(false);

  const scrollToAI = () => {
    const aiSection = document.getElementById('ai');
    if (aiSection) {
      aiSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      onClick={scrollToAI}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="fixed bottom-8 right-8 z-50 group"
      aria-label="Try my AI chat"
    >
      {/* Glow effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300 animate-pulse"></div>
      
      {/* Main button */}
      <div className="relative flex flex-col items-center gap-2">
        {/* Speech bubble */}
        <div
          className={`absolute -top-16 right-0 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg shadow-lg whitespace-nowrap text-sm font-semibold">
            Try my AI chat!
            {/* Arrow */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-pink-600 transform rotate-45"></div>
          </div>
        </div>

        {/* Cat container */}
        <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 group-active:scale-95 transition-all duration-300">
          {/* Animated tail */}
          <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-8 h-2 bg-gradient-to-r from-purple-500 to-transparent rounded-full origin-right group-hover:rotate-12 transition-transform duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-transparent rounded-full animate-pulse"></div>
          </div>
          
          {/* Cat face */}
          <div className="relative w-14 h-14">
            {/* Ears - Pointed triangular cat ears */}
            <div className="absolute -top-3 left-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[14px] border-b-white shadow-md group-hover:-translate-y-0.5 group-hover:-rotate-6 transition-all duration-300">
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[9px] border-b-pink-300"></div>
            </div>
            <div className="absolute -top-3 right-2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[14px] border-b-white shadow-md group-hover:-translate-y-0.5 group-hover:rotate-6 transition-all duration-300">
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[9px] border-b-pink-300"></div>
            </div>
            
            {/* Face - Oval cat face */}
            <div className="absolute inset-0 bg-white rounded-full shadow-lg" style={{ borderRadius: '50% 50% 45% 45%' }}>
              {/* Eyes - Cat-like almond shape */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 flex gap-4">
                <div className="relative">
                  <div className={`w-2.5 h-3 bg-gray-800 transition-all duration-200 ${isHovered ? 'scale-110' : ''}`} style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}>
                    <div className="absolute w-1 h-1 bg-white rounded-full top-0.5 left-0.5"></div>
                  </div>
                </div>
                <div className="relative">
                  <div className={`w-2.5 h-3 bg-gray-800 transition-all duration-200 ${isHovered ? 'scale-110' : ''}`} style={{ borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%' }}>
                    <div className="absolute w-1 h-1 bg-white rounded-full top-0.5 left-0.5"></div>
                  </div>
                </div>
              </div>
              
              {/* Nose and mouth - Cat-like features */}
              <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 flex flex-col items-center">
                {/* Pink triangle nose */}
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-pink-500 shadow-sm mb-0.5"></div>
                {/* W-shaped cat mouth */}
                <div className="flex items-start gap-0">
                  <svg width="20" height="8" viewBox="0 0 20 8" className={`transition-all duration-200 ${isHovered ? 'scale-110' : ''}`}>
                    <path d="M 2 2 Q 5 6, 10 2 Q 15 6, 18 2" stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              
              {/* Cheek spots */}
              <div className="absolute bottom-5 left-2 w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="absolute bottom-5 right-2 w-1 h-1 bg-gray-300 rounded-full"></div>
            </div>
            
            {/* Whiskers - Thin cat whiskers */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 group-hover:-translate-x-5 transition-transform duration-300">
              <div className="w-6 h-px bg-gray-700 mb-2 group-hover:rotate-3 transition-transform duration-300" style={{ transformOrigin: 'right center' }}></div>
              <div className="w-6 h-px bg-gray-700 mb-2 group-hover:rotate-1 transition-transform duration-300" style={{ transformOrigin: 'right center' }}></div>
              <div className="w-5 h-px bg-gray-700 group-hover:-rotate-2 transition-transform duration-300" style={{ transformOrigin: 'right center' }}></div>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 group-hover:translate-x-5 transition-transform duration-300">
              <div className="w-6 h-px bg-gray-700 mb-2 group-hover:-rotate-3 transition-transform duration-300" style={{ transformOrigin: 'left center' }}></div>
              <div className="w-6 h-px bg-gray-700 mb-2 group-hover:-rotate-1 transition-transform duration-300" style={{ transformOrigin: 'left center' }}></div>
              <div className="w-5 h-px bg-gray-700 group-hover:rotate-2 transition-transform duration-300" style={{ transformOrigin: 'left center' }}></div>
            </div>
            
            {/* Paws */}
            <div className="absolute -bottom-2 left-2 flex gap-1">
              <div className="w-2 h-2.5 bg-white rounded-full shadow-sm group-hover:translate-y-0.5 transition-transform duration-300"></div>
              <div className="w-2 h-2.5 bg-white rounded-full shadow-sm group-hover:translate-y-0.5 transition-transform duration-200"></div>
            </div>
          </div>

          {/* Notification dot */}
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full animate-bounce">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Label (always visible on mobile, hover on desktop) */}
        <div className="md:hidden text-xs font-semibold text-[rgb(var(--text))] bg-[rgb(var(--card))] px-3 py-1 rounded-full border border-[rgb(var(--border))] shadow-sm">
          Try AI Chat
        </div>
      </div>
    </button>
  );
}
