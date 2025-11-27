'use client';

import {
  CheckCircle,
  Clock,
  Shield,
  Truck,
  Star,
  Heart,
  Zap,
  Award,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const features = [
  {
    icon: Truck,
    title: 'Fast Shipping',
    description:
      'Free shipping on orders over $50 with quick delivery to your doorstep',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    gradient: 'from-primary to-primary/80',
    accent: 'bg-primary/20',
    stats: '1-3 days',
  },
  {
    icon: Shield,
    title: 'Secure Shopping',
    description:
      'Your data is protected with industry-standard security and encryption',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    gradient: 'from-primary to-primary/80',
    accent: 'bg-primary/20',
    stats: '100% Secure',
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description:
      'Round-the-clock customer support for all your needs and questions',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    gradient: 'from-primary to-primary/80',
    accent: 'bg-primary/20',
    stats: 'Always Online',
  },
  {
    icon: CheckCircle,
    title: 'Quality Guarantee',
    description:
      '30-day return policy on all books with satisfaction guarantee',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    gradient: 'from-primary to-primary/80',
    accent: 'bg-primary/20',
    stats: '30 Days',
  },
];

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 },
    );

    const element = document.getElementById('features-section');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id='features-section'
      className='py-20 bg-linear-to-br from-white via-blue-50 to-purple-50 relative overflow-hidden'
    >
      {/* Background decorations */}
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent_50%)] pointer-events-none' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,119,198,0.05),transparent_50%)] pointer-events-none' />

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='text-center mb-16'>
          <div className='inline-flex items-center gap-2 bg-linear-to-r from-blue-100 to-purple-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6'>
            <Award className='h-4 w-4' />
            Why Choose Us
          </div>
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-bold bg-linear-to-r from-gray-900 via-blue-900 to-gray-900 bg-clip-text text-transparent mb-6'>
            Why Choose ahmadin?
          </h2>
          <p className='text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed'>
            We provide the best shopping experience for both customers and
            vendors with our comprehensive platform designed for excellence
          </p>
        </div>

        {/* Features Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8'>
          {features.map((feature, index) => {
            const isHovered = hoveredFeature === feature.title;

            return (
              <div
                key={feature.title}
                className='group relative'
                style={{ animationDelay: `${index * 150}ms` }}
                onMouseEnter={() => setHoveredFeature(feature.title)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div
                  className={`relative bg-white rounded-3xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}
                >
                  {/* Background gradient */}
                  <div
                    className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}
                  ></div>

                  {/* Icon */}
                  <div className='flex justify-center mb-6'>
                    <div
                      className={`relative p-4 ${feature.bgColor} rounded-2xl group-hover:scale-110 transition-all duration-300 shadow-lg`}
                    >
                      <feature.icon
                        className={`h-10 w-10 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                      />
                      {/* Glow effect */}
                      <div
                        className={`absolute inset-0 bg-linear-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}
                      ></div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className='text-center'>
                    <h3 className='font-bold text-xl mb-3 text-gray-900 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:bg-clip-text transition-all duration-300'>
                      {feature.title}
                    </h3>
                    <p className='text-gray-600 leading-relaxed mb-4'>
                      {feature.description}
                    </p>

                    {/* Stats badge */}
                    <div
                      className={`inline-flex items-center gap-1 ${feature.accent} text-gray-700 px-3 py-1.5 rounded-full text-sm font-medium`}
                    >
                      <Zap className='h-3 w-3' />
                      <span>{feature.stats}</span>
                    </div>
                  </div>

                  {/* Floating elements */}
                  <div className='absolute -top-2 -right-2 w-4 h-4 bg-linear-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-300 animate-pulse'></div>
                  <div className='absolute -bottom-1 -left-1 w-3 h-3 bg-linear-to-r from-pink-400 to-yellow-400 rounded-full opacity-0 group-hover:opacity-60 transition-all duration-300 animate-pulse delay-300'></div>

                  {/* Progress indicator */}
                  <div className='absolute bottom-0 left-0 right-0 h-1 bg-gray-200'>
                    <div
                      className={`h-full bg-linear-to-r ${feature.gradient} transition-all duration-1000 ease-out`}
                      style={{
                        width: isVisible ? '100%' : '0%',
                        transitionDelay: `${index * 200}ms`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Trust Section */}
        <div className='mt-20 pt-16 border-t border-gray-200'>
          <div className='text-center mb-12'>
            <h3 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>
              Trusted by Thousands of Customers
            </h3>
            <p className='text-gray-600 max-w-2xl mx-auto'>
              Join our community of satisfied customers who rely on ahmadin for
              their shopping needs
            </p>
          </div>

          <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-linear-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
                <Star className='h-8 w-8 text-white' />
              </div>
              <h4 className='font-bold text-lg text-gray-900 mb-2'>
                5-Star Rating
              </h4>
              <p className='text-gray-600 text-sm'>Customer satisfaction</p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-linear-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
                <Heart className='h-8 w-8 text-white' />
              </div>
              <h4 className='font-bold text-lg text-gray-900 mb-2'>
                Customer Love
              </h4>
              <p className='text-gray-600 text-sm'>Loyal community</p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-linear-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
                <Award className='h-8 w-8 text-white' />
              </div>
              <h4 className='font-bold text-lg text-gray-900 mb-2'>
                Quality Assured
              </h4>
              <p className='text-gray-600 text-sm'>Premium books</p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 bg-linear-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg'>
                <Sparkles className='h-8 w-8 text-white' />
              </div>
              <h4 className='font-bold text-lg text-gray-900 mb-2'>
                Excellence
              </h4>
              <p className='text-gray-600 text-sm'>Best in class</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className='text-center mt-16'>
          <div className='inline-flex items-center gap-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200'>
            <span>Start Shopping Today</span>
            <ArrowRight className='h-5 w-5' />
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
