'use client';

import { Brain, TrendingUp } from 'lucide-react';

export function SolutionSection() {
  return (
    <section className="py-16 md:py-24 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-0 md:mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The Solution</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Transform your learning experience with our AI-powered platform</p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-6xl mx-auto">
          {/* Problem Section */}
          <div className="w-full lg:w-[48%] max-w-sm">
            <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-50 text-blue-600 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">The Problem</h3>
                <p className="text-gray-600 text-xs md:text-sm mb-4 line-clamp-3">
                  We've all been there - watching an educational video, only to realize we've zoned out and missed key information. Traditional video learning is passive, making it hard to retain information and stay engaged.
                </p>
              </div>
              <div className="mt-auto h-80 w-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-3">
                <img 
                  src="/problem.png" 
                  alt="The Problem" 
                  className="h-full w-auto object-contain"
                />
              </div>
            </div>
          </div>
          
          {/* Solution Section */}
          <div className="w-full lg:w-[48%] max-w-sm">
            <div className="bg-gray-900 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full">
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-amber-900/20 text-amber-400 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-amber-50 mb-2">The Solution</h3>
                <p className="text-amber-50/80 text-xs md:text-sm mb-4 line-clamp-3">
                  Our platform transforms passive video watching into an active learning experience. With AI-powered insights and interactive features, you'll engage with content on a deeper level and retain more of what you learn.
                </p>
              </div>
              <div className="mt-auto h-80 w-full rounded-lg overflow-hidden bg-gradient-to-br from-amber-900/20 to-amber-800/10 flex items-center justify-center p-3">
                <img 
                  src="/solution.png" 
                  alt="The Solution" 
                  className="h-full w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
