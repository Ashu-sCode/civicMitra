import React, { useEffect, useRef, useState } from 'react';
import { FileText, Search, Shield, Zap, Globe, Clock, Users, Award } from 'lucide-react';

const Features = ({ 
  features = [
    {
      title: "Report Civic Issues",
      description: "File complaints about civic problems in your city, upload photos, and get updates.",
      icon: FileText,
      color: "blue"
    },
    {
      title: "Track Status",
      description: "Monitor the progress of your complaints in real-time and know when they are resolved.",
      icon: Search,
      color: "green"
    },
    {
      title: "Secure & Private",
      description: "Your personal information is protected and encrypted according to government standards.",
      icon: Shield,
      color: "purple"
    },
    {
      title: "Earn Rewards",
      description: "Active citizens earn points and rewards for reporting and contributing to community well-being.",
      icon: Award,
      color: "yellow"
    },
    {
      title: "Lightning Fast",
      description: "Optimized reporting workflow lets you submit issues in seconds.",
      icon: Zap,
      color: "orange"
    },
    {
      title: "Multi-lingual Support",
      description: "Available in multiple Indian languages for easy access by everyone.",
      icon: Globe,
      color: "indigo"
    },
    {
      title: "24/7 Citizen Access",
      description: "Submit and track requests anytime, ensuring timely government response.",
      icon: Clock,
      color: "pink"
    },
    {
      title: "Community Driven",
      description: "Collaborate with other citizens to improve your city, neighborhood by neighborhood.",
      icon: Users,
      color: "teal"
    }
  ]
}) => {
  const [visibleCards, setVisibleCards] = useState([]);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target);
            if (index !== -1 && !visibleCards.includes(index)) {
              setTimeout(() => {
                setVisibleCards(prev => [...prev, index]);
              }, index * 100); // stagger animation
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      green: "from-green-500 to-green-600 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      purple: "from-purple-500 to-purple-600 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      orange: "from-orange-500 to-orange-600 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
      yellow: "from-yellow-500 to-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
      indigo: "from-indigo-500 to-indigo-600 bg-indigo-100 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400",
      pink: "from-pink-500 to-pink-600 bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
      teal: "from-teal-500 to-teal-600 bg-teal-100 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400"
    };
    return colors[color] || colors.blue;
  };

  return (
    <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600">CivicMitra</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Empowering citizens to improve governance, earn rewards, and actively participate in building better communities.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const colorClasses = getColorClasses(feature.color);

            return (
              <div
                key={index}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  visibleCards.includes(index) 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-10'
                }`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${colorClasses.split(' ').slice(2).join(' ')} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-7 h-7 ${colorClasses.split(' ').slice(4).join(' ')}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Line */}
                <div className={`h-1 w-0 bg-gradient-to-r ${colorClasses.split(' ').slice(0, 2).join(' ')} mt-4 group-hover:w-full transition-all duration-500 rounded-full`}></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Join thousands of active citizens contributing to better governance and rewards.
          </p>
          <a
            href="/features"
            className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <span>Learn More</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;
