'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqItems = [
  {
    question: 'What is Hilights?',
    answer: 'Hilights is an AI-powered platform that transforms passive video watching into an active learning experience. It helps you extract key insights, take notes, and retain information more effectively from educational videos.'
  },
  {
    question: 'How does Hilights work?',
    answer: 'Simply paste a YouTube URL into Hilights, and our AI will process the video content to identify key concepts, generate summaries, and create interactive learning materials to help you better understand and remember the content.'
  },
  {
    question: 'What types of videos work with Hilights?',
    answer: 'Hilights works with most educational YouTube videos, including lectures, tutorials, conference talks, and more. The platform is optimized for content that contains speech and educational material.'
  },
  {
    question: 'How does Hilights help with learning retention?',
    answer: 'Hilights uses active recall and spaced repetition techniques, along with AI-generated quizzes and summaries, to help reinforce your learning and improve long-term retention of the material.'
  },
  {
    question: 'Is my data secure with Hilights?',
    answer: 'Absolutely. We take your privacy and data security seriously. All your notes and learning data are encrypted and stored securely. We never share your personal information with third parties.'
  },
  {
    question: 'What makes Hilights different from other note-taking apps?',
    answer: 'Unlike traditional note-taking apps, Hilights is specifically designed for video-based learning. Our AI automatically extracts key information, generates structured notes, and creates interactive learning materials tailored to your needs.'
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600">Find answers to common questions about Hilights</p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => toggleItem(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-${index}`}
              >
                <span className="font-medium text-gray-900">{item.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              <div
                id={`faq-${index}`}
                className={`px-6 overflow-hidden transition-all duration-300 ${openIndex === index ? 'py-4 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
                aria-hidden={openIndex !== index}
              >
                <p className="text-gray-600">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
