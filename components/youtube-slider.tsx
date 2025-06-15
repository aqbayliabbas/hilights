"use client";

import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  category?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor?: string;
  rating?: number;
  isNew?: boolean;
  isPopular?: boolean;
}

const videos: VideoItem[] = [
  // Coding
  {
    id: 'PkZNo7MFNFg',
    title: 'JavaScript Full Course for Beginners',
    thumbnail: 'https://i.ytimg.com/vi/PkZNo7MFNFg/maxresdefault.jpg',
    duration: '3:26:44',
    views: '12M',
    category: 'Coding',
    level: 'Beginner',
    instructor: 'freeCodeCamp',
    rating: 4.9,
    isPopular: true
  },
  {
    id: 'rfscVS0vtbw',
    title: 'Python for Beginners - Full Course',
    thumbnail: 'https://i.ytimg.com/vi/rfscVS0vtbw/maxresdefault.jpg',
    duration: '4:26:46',
    views: '45M',
    category: 'Coding',
    level: 'Beginner',
    instructor: 'freeCodeCamp',
    rating: 4.9,
    isPopular: true
  },
  
  // Branding & Design
  {
    id: 'Y-OhzQpdRoo',
    title: 'Graphic Design Fundamentals',
    thumbnail: 'https://i.ytimg.com/vi/Y-OhzQpdRoo/maxresdefault.jpg',
    duration: '1:03:05',
    views: '3.2M',
    category: 'Branding & Design',
    level: 'Beginner',
    instructor: 'Envato Tuts+',
    rating: 4.7,
    isNew: true
  },
  {
    id: 'WONZV3aqR7E',
    title: 'Logo Design Masterclass',
    thumbnail: 'https://i.ytimg.com/vi/WONZV3aqR7E/maxresdefault.jpg',
    duration: '1:53:07',
    views: '2.1M',
    category: 'Branding & Design',
    level: 'Intermediate',
    instructor: 'Envato Tuts+',
    rating: 4.8
  },
  
  // UI/UX
  {
    id: 'c9Wg6Cb_YlU',
    title: 'UI/UX Design Tutorial – Wireframe, Mockup & Design in Figma',
    thumbnail: 'https://i.ytimg.com/vi/c9Wg6Cb_YlU/maxresdefault.jpg',
    duration: '2:10:03',
    views: '3.2M',
    category: 'UI/UX',
    level: 'Beginner',
    instructor: 'freeCodeCamp',
    rating: 4.8,
    isPopular: true
  },
  {
    id: 'kLh1u9m0cF0',
    title: 'Figma UI Design Tutorial: Create a Dashboard',
    thumbnail: 'https://i.ytimg.com/vi/kLh1u9m0cF0/maxresdefault.jpg',
    duration: '1:25:34',
    views: '1.8M',
    category: 'UI/UX',
    level: 'Intermediate',
    instructor: 'DesignCourse',
    rating: 4.7,
    isNew: true
  },
  
  // Copywriting
  {
    id: '2HlT1KvYb2M',
    title: 'Copywriting Tutorial: 6 Steps to Writing a Great Copy',
    thumbnail: 'https://i.ytimg.com/vi/2HlT1KvYb2M/maxresdefault.jpg',
    duration: '1:12:45',
    views: '1.2M',
    category: 'Copywriting',
    level: 'Beginner',
    instructor: 'Ahrefs',
    rating: 4.6
  },
  {
    id: 'O2rkX1a5K1Y',
    title: 'Copywriting For Beginners: How To Write Copy That Sells',
    thumbnail: 'https://i.ytimg.com/vi/O2rkX1a5K1Y/maxresdefault.jpg',
    duration: '1:05:30',
    views: '890K',
    category: 'Copywriting',
    level: 'Intermediate',
    instructor: 'Alex Cattoni',
    rating: 4.7,
    isPopular: true
  },
  
  // Video Editing
  {
    id: 'VWf6X2r4LJ4',
    title: 'Premiere Pro Tutorial for Beginners 2024',
    thumbnail: 'https://i.ytimg.com/vi/VWf6X2r4LJ4/maxresdefault.jpg',
    duration: '1:48:22',
    views: '4.7M',
    category: 'Video Editing',
    level: 'Beginner',
    instructor: 'Brian Dean',
    rating: 4.8,
    isPopular: true
  },
  {
    id: 'JfZ4tG8G2GM',
    title: 'DaVinci Resolve 18 - Full Tutorial for Beginners',
    thumbnail: 'https://i.ytimg.com/vi/JfZ4tG8G2GM/maxresdefault.jpg',
    duration: '2:15:20',
    views: '3.2M',
    category: 'Video Editing',
    level: 'Beginner',
    instructor: 'Casey Faris',
    rating: 4.9,
    isNew: true
  },
  
  // Marketing
  {
    id: 'aP5NNne9u4s',
    title: 'Digital Marketing Course - Learn Everything in 8 Hours',
    thumbnail: 'https://i.ytimg.com/vi/aP5NNne9u4s/maxresdefault.jpg',
    duration: '8:39:00',
    views: '7.8M',
    category: 'Marketing',
    level: 'Beginner',
    instructor: 'Simplilearn',
    rating: 4.7,
    isPopular: true
  },
  {
    id: 'sX9A5a0ApKU',
    title: 'Social Media Marketing Tutorial - Complete Course',
    thumbnail: 'https://i.ytimg.com/vi/sX9A5a0ApKU/maxresdefault.jpg',
    duration: '3:25:15',
    views: '4.2M',
    category: 'Marketing',
    level: 'Beginner',
    instructor: 'HubSpot',
    rating: 4.8,
    isNew: true
  }
];

export function YouTubeSlider() {
  const sliderRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const position = useRef(0);
  const animationRef = useRef<number>();
  const speed = 0.5;
  const [duplicatedVideos] = useState(() => [...videos, ...videos, ...videos]);

  useEffect(() => {
    if (!rowRef.current) return;
    
    const animate = (timestamp: number) => {
      if (!rowRef.current) return;
      
      position.current -= speed;
      
      // Reset position before it goes off screen to create seamless loop
      if (position.current <= -rowRef.current.scrollWidth / 3) {
        position.current = 0;
      }
      
      if (rowRef.current) {
        rowRef.current.style.transform = `translateX(${position.current}px)`;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full py-8 bg-transparent" ref={sliderRef}>
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-6">Popular Tutorials</h2>
        <div className="relative w-full overflow-hidden py-2">
          <div 
            ref={rowRef} 
            className="flex items-center gap-6 w-max"
          >
            {duplicatedVideos.map((video, index) => (
              <VideoCard key={`video-${video.id}-${index}`} video={video} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Video Card Component
function VideoCard({ video }: { video: VideoItem }) {
  // Determine level color
  const getLevelColor = () => {
    switch(video.level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div 
      className="w-[280px] flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg youtube-slide"
      onClick={() => window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')}
    >
      <div className="relative">
        <div className="relative pb-[56.25%] bg-gray-100">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center">
              <Play className="h-6 w-6 ml-1 text-white" fill="currentColor" />
            </div>
          </div>
          <div className="absolute top-2 left-2 flex gap-2">
            {video.isNew && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                New
              </span>
            )}
            {video.isPopular && (
              <span className="bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full">
                Popular
              </span>
            )}
          </div>
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded">
            {video.duration}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900 line-clamp-2 leading-tight text-[15px] pr-2">
            {video.title}
          </h3>
          {video.rating && (
            <div className="flex items-center bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded">
              <svg className="w-3 h-3 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {video.rating}
            </div>
          )}
        </div>
        
        {video.instructor && (
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <span className="truncate">By {video.instructor}</span>
          </div>
        )}
        
        <div className="flex flex-wrap gap-2 mt-3">
          {video.category && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              {video.category}
            </span>
          )}
          {video.level && (
            <span className={`${getLevelColor()} text-xs px-2 py-1 rounded`}>
              {video.level}
            </span>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-3 text-xs text-gray-500">
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {video.views} views
          </span>
          <button 
            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
            }}
          >
            Watch Now
          </button>
        </div>
      </div>
    </div>
  );
}
