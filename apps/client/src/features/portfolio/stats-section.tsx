'use client';

import {
  Award,
  CheckCircle,
  TrendingUp,
  Users,
  Star,
  Heart,
  ShoppingBag,
  Globe,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const stats = [
  {
    label: 'Active Vendors',
    value: '500+',
    icon: Users,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    gradient: 'from-primary to-primary/80',
    description: 'Trusted sellers',
  },
  {
    label: 'Books Available',
    value: '10,000+',
    icon: ShoppingBag,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    gradient: 'from-primary to-primary/80',
    description: 'Quality items',
  },
  {
    label: 'Happy Customers',
    value: '50,000+',
    icon: Heart,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    gradient: 'from-primary to-primary/80',
    description: 'Satisfied buyers',
  },
  {
    label: 'Years of Trust',
    value: '5+',
    icon: Award,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    gradient: 'from-primary to-primary/80',
    description: 'Reliable service',
  },
];

export function StatsSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedValues, setAnimatedValues] = useState(stats.map(() => 0));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Animate numbers
          stats.forEach((stat, index) => {
            const targetValue = parseInt(stat.value.replace(/[^\d]/g, ''));
            const duration = 2000;
            const steps = 60;
            const increment = targetValue / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= targetValue) {
                current = targetValue;
                clearInterval(timer);
              }

              setAnimatedValues((prev) => {
                const newValues = [...prev];
                newValues[index] = Math.floor(current);
                return newValues;
              });
            }, duration / steps);
          });
        }
      },
      { threshold: 0.3 },
    );

    const element = document.getElementById('stats-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id='stats-section'
      className='py-20 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden'
    >
      {/* Background decorations */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.05),transparent_50%)] pointer-events-none' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.05),transparent_50%)] pointer-events-none' />

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6'>
            <Star className='h-4 w-4' />
            Trusted by Thousands
          </div>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-6'>
            Our Impact in Numbers
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            Join thousands of satisfied customers and vendors who trust ahmadin
            for their e-commerce needs
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8'>
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className='group relative'
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div
                className={`relative bg-white rounded-3xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
              >
                {/* Background gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}
                ></div>

                {/* Icon */}
                <div className='flex justify-center mb-6'>
                  <div
                    className={`relative p-4 ${stat.bgColor} rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-lg`}
                  >
                    <stat.icon
                      className={`h-8 w-8 ${stat.color} group-hover:scale-110 transition-transform duration-300`}
                    />
                    {/* Glow effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                    ></div>
                  </div>
                </div>

                {/* Value */}
                <div className='text-center mb-3'>
                  <h3 className='text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300'>
                    {isVisible
                      ? `${animatedValues[index]}${stat.value.replace(/[\d]/g, '')}`
                      : '0'}
                  </h3>
                  <p className='text-gray-600 font-semibold text-lg'>
                    {stat.label}
                  </p>
                  <p className='text-gray-500 text-sm mt-1'>
                    {stat.description}
                  </p>
                </div>

                {/* Progress bar */}
                <div className='w-full bg-gray-200 rounded-full h-1 mt-4'>
                  <div
                    className={`bg-gradient-to-r ${stat.gradient} h-1 rounded-full transition-all duration-2000 ease-out`}
                    style={{
                      width: isVisible ? '100%' : '0%',
                      transitionDelay: `${index * 200}ms`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Floating elements */}
              <div className='absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-300 animate-pulse'></div>
              <div className='absolute -bottom-1 -left-1 w-3 h-3 bg-gradient-to-r from-pink-400 to-yellow-400 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-300 animate-pulse delay-300'></div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className='mt-16 pt-8 border-t border-gray-200'>
          <div className='flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600'>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
              <span>Verified Vendors</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
              <span>Quality Books</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-purple-500 rounded-full animate-pulse'></div>
              <span>Secure Payments</span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-yellow-500 rounded-full animate-pulse'></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
