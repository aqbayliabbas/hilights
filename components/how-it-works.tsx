'use client';

import { Play, BookOpen, CheckCircle } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <Play className="h-8 w-8 text-blue-600" />,
      title: "Paste Video URL",
      description: "Start by pasting the YouTube video URL you want to learn from. Our platform supports any public YouTube video.",
      bg: "bg-blue-50"
    },
    {
      icon: <BookOpen className="h-8 w-8 text-purple-600" />,
      title: "AI Processes Content",
      description: "Our AI analyzes the video content, extracts key concepts, and creates interactive learning materials just for you.",
      bg: "bg-purple-50"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      title: "Learn & Track Progress",
      description: "Access your personalized learning dashboard, track your progress, and master the content at your own pace.",
      bg: "bg-green-50"
    }
  ];

  return (
    <section className="pt-12 pb-16 md:pt-16 bg-gray-50/50 backdrop-blur-sm mb-12 md:mb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">Transform any YouTube video into a powerful learning experience in just three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="group">
              <div className={`${step.bg} w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 group-hover:scale-110`}>
                {step.icon}
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center h-full transition-all duration-300 hover:shadow-lg">
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600 text-sm md:text-base">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
