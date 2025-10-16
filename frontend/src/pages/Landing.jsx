import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import HowItWorks from '../components/Landing/HowItWorks';
import InstallCTA from '../components/Landing/InstallCta';
import Footer from '../components/common/Footer';
import { useTheme } from '../context/ThemeContext';

const Landing = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();

  // Smooth scrolling and viewport setup
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
      viewport.content =
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover';
    }

    // Detect if app is running as PWA
    const isPWA =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isPWA) {
      // Redirect PWA users directly to dashboard
      navigate('/dashboard', { replace: true });
    }

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [navigate]);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Web Landing Page Sections */}
      <main className="overflow-x-hidden">
        {/* Hero Section */}
        <Hero />

        {/* Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Install CTA Section */}
        <InstallCTA />

        {/* Stats Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '10K+', label: 'Active Users' },
                { number: '5K+', label: 'Issues Resolved' },
                { number: '100+', label: 'Cities Covered' },
                { number: '4.8★', label: 'User Rating' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
              What Citizens Say
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Priya Sharma',
                  location: 'Mumbai',
                  text: 'CivicMitra made reporting potholes so easy! Got it fixed in just 3 days.',
                },
                {
                  name: 'Rajesh Kumar',
                  location: 'Delhi',
                  text: 'The tracking feature is amazing. I can see real-time updates on my complaint.',
                },
                {
                  name: 'Anita Patel',
                  location: 'Bangalore',
                  text: 'Works perfectly offline too! Reported issues even without internet.',
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-500">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{testimonial.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <Footer />

        {/* Scroll to Top Button */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110 z-40"
          aria-label="Scroll to top"
        >
          <span className="text-xl">↑</span>
        </button>
      </main>
    </div>
  );
};

export default Landing;
