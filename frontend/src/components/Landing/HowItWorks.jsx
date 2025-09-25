import React, { useEffect, useState, useRef } from 'react';
import { LogIn, FileText, Search, CheckCircle, ArrowRight } from 'lucide-react';

const HowItWorks = ({ 
  steps = [
    {
      title: "Login",
      description: "Quick and secure login with mobile number or Aadhaar",
      icon: LogIn,
      color: "blue"
    },
    {
      title: "Report",
      description: "Submit your complaint with photos and location details",
      icon: FileText,
      color: "purple"
    },
    {
      title: "Track",
      description: "Monitor real-time status updates on your complaint",
      icon: Search,
      color: "orange"
    },
    {
      title: "Resolved",
      description: "Get notified when your issue is successfully resolved",
      icon: CheckCircle,
      color: "green"
    }
  ]
}) => {
  const [visibleSteps, setVisibleSteps] = useState([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            steps.forEach((_, index) => {
              setTimeout(() => {
                setVisibleSteps(prev => [...prev, index]);
              }, index * 200);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [steps]);

  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600 border-blue-500 bg-blue-50 dark:bg-blue-900/20",
      purple: "from-purple-500 to-purple-600 border-purple-500 bg-purple-50 dark:bg-purple-900/20",
      orange: "from-orange-500 to-orange-600 border-orange-500 bg-orange-50 dark:bg-orange-900/20",
      green: "from-green-500 to-green-600 border-green-500 bg-green-50 dark:bg-green-900/20"
    };
    return colors[color] || colors.blue;
  };

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600">Works</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Four simple steps to report and resolve civic issues in your area
          </p>
        </div>

        {/* Desktop: Horizontal Steps */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>
            
            {/* Steps */}
            <div className="relative grid grid-cols-4 gap-4 z-10">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                const colorClasses = getColorClasses(step.color);
                
                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center transition-all duration-700 transform ${
                      visibleSteps.includes(index) 
                        ? 'opacity-100 translate-y-0' 
                        : 'opacity-0 translate-y-10'
                    }`}
                  >
                    {/* Step Number & Icon */}
                    <div className="relative mb-6">
                      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${colorClasses.split(' ').slice(0, 2).join(' ')} p-1 shadow-xl`}>
                        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                        </div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100 dark:border-gray-600">
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{index + 1}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-center text-sm max-w-xs">
                      {step.description}
                    </p>
                    
                    {/* Arrow (except last) */}
                    {index < steps.length - 1 && (
                      <ArrowRight className="absolute top-10 -right-6 w-6 h-6 text-gray-400 dark:text-gray-600 hidden xl:block" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tablet: 2x2 Grid */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:hidden gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            const colorClasses = getColorClasses(step.color);
            
            return (
              <div
                key={index}
                className={`flex items-start space-x-4 transition-all duration-700 transform ${
                  visibleSteps.includes(index) 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 -translate-x-10'
                }`}
              >
                {/* Icon */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-2xl ${colorClasses.split(' ').slice(2).join(' ')} flex items-center justify-center`}>
                  <IconComponent className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`text-sm font-bold px-2 py-1 rounded-full bg-gradient-to-r ${colorClasses.split(' ').slice(0, 2).join(' ')} text-white`}>
                      Step {index + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="sm:hidden">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
            
            {/* Steps */}
            <div className="space-y-8">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                const colorClasses = getColorClasses(step.color);
                
                return (
                  <div
                    key={index}
                    className={`relative flex items-start transition-all duration-700 transform ${
                      visibleSteps.includes(index) 
                        ? 'opacity-100 translate-x-0' 
                        : 'opacity-0 translate-x-10'
                    }`}
                  >
                    {/* Icon */}
                    <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${colorClasses.split(' ').slice(0, 2).join(' ')} p-0.5`}>
                      <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <IconComponent className="w-7 h-7 text-gray-700 dark:text-gray-300" />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="ml-6 flex-1 pb-8">
                      <div className="bg-white dark:bg-gray-700 rounded-2xl p-4 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {step.title}
                          </h3>
                          <span className="text-xs font-bold px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded-full text-gray-600 dark:text-gray-300">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <a
            href="/report"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
          >
            <span>Start Reporting Now</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;