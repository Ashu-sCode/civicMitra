import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Search,
  File,
  CreditCard,
  Download,
  MessageCircle,
  Megaphone,
  MapPin,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Phone,
  Home,
  HelpCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  const announcements = [
    {
      id: 1,
      title: "Water Supply Maintenance",
      message: "Scheduled maintenance on Oct 15, 2024. Water supply will be affected from 6 AM to 12 PM in Sector 5.",
      type: "warning",
      urgent: true
    },
    {
      id: 2,
      title: "New Digital Services",
      message: "Apply for birth certificates and other documents online. No need to visit offices.",
      type: "info",
      urgent: false
    },
    {
      id: 3,
      title: "Road Construction Update",
      message: "Main Road construction near City Mall is 80% complete. Expected completion by Nov 30.",
      type: "success",
      urgent: false
    }
  ];

  const services = [
    {
      id: 'report-issue',
      title: 'Report an Issue',
      description: 'Report potholes, garbage, or other civic problems',
      icon: FileText,
      route: '/report',
      color: 'bg-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900',
      textColor: 'text-red-700 dark:text-red-300'
    },
    {
      id: 'track-complaint',
      title: 'Track Complaint',
      description: 'Check status of your submitted reports',
      icon: Search,
      route: '/track-report',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900',
      textColor: 'text-blue-700 dark:text-blue-300'
    },
    {
      id: 'civic-certificate',
      title: 'Apply Civic Certificate',
      description: 'Birth, death, marriage certificates online',
      icon: File,
      route: '/apply-certificate',
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900',
      textColor: 'text-green-700 dark:text-green-300'
    },
    {
      id: 'pay-bills',
      title: 'Pay Utility Bills',
      description: 'Water, electricity, property tax payments',
      icon: CreditCard,
      route: '/pay-bills',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900',
      textColor: 'text-purple-700 dark:text-purple-300'
    },
    {
      id: 'download-forms',
      title: 'Download Forms',
      description: 'Get application forms and documents',
      icon: Download,
      route: '/download-forms',
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900',
      textColor: 'text-indigo-700 dark:text-indigo-300'
    },
    {
      id: 'feedback',
      title: 'Feedback & Suggestions',
      description: 'Share your thoughts to improve services',
      icon: MessageCircle,
      route: '/feedback',
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50 dark:bg-orange-900',
      textColor: 'text-orange-700 dark:text-orange-300'
    },
    {
      id: 'public-notices',
      title: 'Public Notices',
      description: 'View important announcements and updates',
      icon: Megaphone,
      route: '/public-notices',
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900',
      textColor: 'text-yellow-700 dark:text-yellow-300'
    },
    {
      id: 'locate-office',
      title: 'Locate Office',
      description: 'Find government offices and contact info',
      icon: MapPin,
      route: '/locate-office',
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50 dark:bg-teal-900',
      textColor: 'text-teal-700 dark:text-teal-300'
    }
  ];

  const quickStats = [
    {
      id: 1,
      title: 'My Reports',
      value: '3',
      subtitle: 'Active Issues',
      icon: BarChart3,
      color: 'bg-blue-500'
    },
    {
      id: 2,
      title: 'Pending',
      value: '2',
      subtitle: 'Awaiting Response',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      id: 3,
      title: 'Resolved',
      value: '5',
      subtitle: 'This Month',
      icon: CheckCircle2,
      color: 'bg-green-500'
    },
    {
      id: 4,
      title: 'Urgent',
      value: '1',
      subtitle: 'High Priority',
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  const handleServiceClick = (route) => {
    navigate(route);
  };

  const getAnnouncementIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />;
      default:
        return <Megaphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
    }
  };

  const getAnnouncementStyles = (type, urgent) => {
    const baseStyle = "flex-shrink-0 w-80 p-4 rounded-lg border-l-4 ";
    if (urgent) {
      return baseStyle + "bg-red-50 dark:bg-red-900 border-red-400 dark:border-red-600 shadow-md";
    }
    switch (type) {
      case 'warning':
        return baseStyle + "bg-yellow-50 dark:bg-yellow-900 border-yellow-400 dark:border-yellow-600";
      case 'success':
        return baseStyle + "bg-green-50 dark:bg-green-900 border-green-400 dark:border-green-600";
      default:
        return baseStyle + "bg-blue-50 dark:bg-blue-900 border-blue-400 dark:border-blue-600";
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-900'}`}>
      {/* Welcome Section */}
      <div className={`px-4 py-6 ${isDarkMode ? 'bg-gradient-to-r from-blue-800 to-blue-900 text-white' : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'}`}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Welcome to Civic Mitra</h1>
          <p className={isDarkMode ? 'text-blue-200' : 'text-blue-100'}>
            Your gateway to government services in Jharkhand
          </p>
        </div>
      </div>

      {/* Announcements Banner */}
      <div className={`px-4 py-4 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-semibold mb-3">Important Announcements</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-500">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className={getAnnouncementStyles(announcement.type, announcement.urgent)}
              >
                <div className="flex items-start gap-3">
                  {getAnnouncementIcon(announcement.type)}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold mb-1">
                      {announcement.urgent && (
                        <span className="inline-block bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-200 text-xs px-2 py-1 rounded-full mr-2">
                          URGENT
                        </span>
                      )}
                      {announcement.title}
                    </h3>
                    <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {announcement.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Services Grid */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Government Services</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceClick(service.route)}
                  className={`${service.bgColor} p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1`}
                >
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className={`${service.color} p-3 rounded-full shadow-sm`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-semibold text-sm ${service.textColor} mb-1`}>
                        {service.title}
                      </h3>
                      <p className={`text-xs leading-tight ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {service.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Your Activity</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-500">
            {quickStats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.id}
                  className={`flex-shrink-0 p-4 rounded-lg min-w-[140px] shadow-sm border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`${stat.color} p-2 rounded-lg`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold">{stat.value}</span>
                  </div>
                  <h3 className="font-semibold text-sm">{stat.title}</h3>
                  <p className="text-xs text-gray-400">{stat.subtitle}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className={`px-4 py-6 mt-8 border-t ${isDarkMode ? 'border-gray-700 bg-gray-800 text-gray-200' : 'border-gray-200 bg-white text-gray-900'}`}>
        <div className="max-w-7xl mx-auto flex justify-center space-x-8">
          {[{icon: Home, label: 'Home', route: '/'}, {icon: FileText, label: 'My Reports', route: '/my-reports'}, {icon: Phone, label: 'Contact', route: '/contact-support'}, {icon: HelpCircle, label: 'Help', route: '/help'}].map((btn, i) => (
            <button key={i} onClick={() => navigate(btn.route)} className="flex flex-col items-center space-y-1 hover:text-blue-500 transition-colors">
              <btn.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{btn.label}</span>
            </button>
          ))}
        </div>
        <div className="text-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs">{`© 2024 Government of Jharkhand | Civic Mitra v2.0`}</p>
        </div>
      </footer>
    </div>
  );
};

export default CitizenDashboard;
