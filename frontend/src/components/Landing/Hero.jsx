import React, { useEffect, useState } from 'react';
import { ArrowRight, Shield, Sparkles } from 'lucide-react';

const Hero = ({ 
  headline = "CivicMitra – Your Digital Citizen Companion",
  subtext = "Report issues, track status, access citizen services, all in one place.",
  ctaPrimary = { text: "Report an Issue", href: "/report" },
  ctaSecondary = { text: "Learn More", href: "/about" },
  illustration
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Text Content - Mobile First */}
          <div className={`order-2 lg:order-1 text-center lg:text-left transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                Digital India Initiative
              </span>
            </div>
            
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600">
                CivicMitra
              </span>
              <br />
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                Your Digital Citizen Companion
              </span>
            </h1>
            
            {/* Subtext */}
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              {subtext}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href={ctaPrimary.href}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>{ctaPrimary.text}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              
              <a
                href={ctaSecondary.href}
                className="px-8 py-4 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-gray-700 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center"
              >
                <span>{ctaSecondary.text}</span>
              </a>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-8 flex flex-wrap gap-6 justify-center lg:justify-start text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>100% Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🇮🇳</span>
                <span>Made in India</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Works Offline</span>
              </div>
            </div>
          </div>
          
          {/* Illustration/Image - Stacked on Mobile */}
          <div className={`order-1 lg:order-2 transition-all duration-1000 delay-300 transform ${
            isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
          }`}>
            <div className="relative">
              {/* Mobile Device Mockup */}
              <div className="relative mx-auto w-64 sm:w-72 lg:w-96">
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] p-2 shadow-2xl">
                  <div className="absolute top-1/2 left-0 w-1 h-12 bg-gray-700 rounded-r-lg -translate-y-1/2"></div>
                  <div className="absolute top-1/2 right-0 w-1 h-20 bg-gray-700 rounded-l-lg -translate-y-1/2"></div>
                  <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-4 h-[500px] lg:h-[600px] overflow-hidden">
                    {/* App Screenshot or Illustration */}
                    {illustration ? (
                      <img src={illustration} alt="CivicMitra App" className="w-full h-full object-cover rounded-[2rem]" />
                    ) : (
                      <div className="h-full bg-gradient-to-br from-blue-100 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-[2rem] p-6 flex flex-col items-center justify-center">
                        <Shield className="w-20 h-20 text-blue-600 dark:text-blue-400 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">CivicMitra</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 text-center">Your civic companion for all citizen services</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-bounce">
                Live Status
              </div>
              <div className="absolute -bottom-4 -right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                24/7 Support
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;