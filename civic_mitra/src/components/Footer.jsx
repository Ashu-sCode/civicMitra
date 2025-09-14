import React from 'react';
import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: 'Report Issue', href: '/report' },
      { name: 'Track Status', href: '/track' },
      { name: 'Emergency Services', href: '/emergency' },
      { name: 'Citizen Portal', href: '/portal' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' }
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'Disclaimer', href: '/disclaimer' }
    ],
    resources: [
      { name: 'Help Center', href: '/help' },
      { name: 'FAQs', href: '/faqs' },
      { name: 'API Docs', href: '/api' },
      { name: 'Status', href: '/status' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'Youtube' }
  ];

  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-md flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">CivicMitra</h3>
                <p className="text-xs text-gray-400">सिविक मित्र</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Your digital companion for all citizen services. Making cities better, one report at a time.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <a href="mailto:support@civicmitra.gov.in" className="flex items-center space-x-2 text-gray-400 hover:text-white text-sm transition-colors">
                <Mail className="w-4 h-4" />
                <span>support@civicmitra.gov.in</span>
              </a>
              <a href="tel:1800-123-4567" className="flex items-center space-x-2 text-gray-400 hover:text-white text-sm transition-colors">
                <Phone className="w-4 h-4" />
                <span>1800-123-4567</span>
              </a>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>New Delhi, India</span>
              </div>
            </div>
          </div>
          
          {/* Links Sections */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:col-span-4 gap-8">
            {/* Services */}
            <div>
              <h4 className="font-semibold text-white mb-4">Services</h4>
              <ul className="space-y-2">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white text-sm transition-colors flex items-center space-x-1"
                    >
                      <span>{link.name}</span>
                      {link.name === 'API Docs' && <ExternalLink className="w-3 h-3" />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>
        
        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Copyright & Info */}
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm mb-2">
              © {currentYear} CivicMitra. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-gray-500">
              <span>Version 1.0.0</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <span>Made in India</span>
                <span>🇮🇳</span>
              </span>
              <span>•</span>
              <span>Digital India</span>
              <span>•</span>
              <span>आत्मनिर्भर भारत</span>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((social) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors group"
                >
                  <IconComponent className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              );
            })}
          </div>
        </div>
        
        {/* Government Links */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
            <a href="https://www.india.gov.in" className="hover:text-gray-400 transition-colors flex items-center space-x-1">
              <span>National Portal of India</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://www.digitalindia.gov.in" className="hover:text-gray-400 transition-colors flex items-center space-x-1">
              <span>Digital India</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://www.mygov.in" className="hover:text-gray-400 transition-colors flex items-center space-x-1">
              <span>MyGov</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;