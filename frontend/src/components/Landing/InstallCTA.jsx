import React, { useState, useEffect } from "react";

import { Download, Smartphone, Check, Wifi, Shield, Zap } from "lucide-react";

const InstallCTA = ({ isPWA }) => {
  // receive isPWA from Landing
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    if (isPWA) return; // skip all logic if PWA installed

    // Check if iOS
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isPWA]);

  if (isPWA) return null; // hide entirely in PWA

  const benefits = [
    { icon: Wifi, text: "Works Offline" },
    { icon: Zap, text: "Lightning Fast" },
    { icon: Shield, text: "Secure & Safe" },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Install CivicMitra
              <span className="block text-2xl md:text-3xl lg:text-4xl mt-2 text-blue-100">
                Access Services Anytime
              </span>
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Install our PWA for the best experience. Access offline anytime,
              anywhere.
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">
                      {benefit.text}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Install Button */}
            <div className="space-y-4">
              {!isInstalled && (
                <>
                  {isInstallable && (
                    <button
                      onClick={async () => {
                        deferredPrompt.prompt();
                        const { outcome } = await deferredPrompt.userChoice;
                        if (outcome === "accepted") setIsInstalled(true);
                        setIsInstallable(false);
                        setDeferredPrompt(null);
                      }}
                      className="group relative inline-flex items-center space-x-3 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-200"
                    >
                      <Download className="w-6 h-6 group-hover:animate-bounce" />
                      <span>Install CivicMitra Now</span>
                    </button>
                  )}

                  {isIOS && !isInstallable && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto lg:mx-0">
                      <p className="text-white text-sm mb-2">
                        <strong>iOS Users:</strong> Tap the share button{" "}
                        <span className="inline-block">⬆️</span> in Safari and
                        select "Add to Home Screen"
                      </p>
                    </div>
                  )}

                  {!isIOS && !isInstallable && !isInstalled && (
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-md mx-auto lg:mx-0">
                      <p className="text-white text-sm">
                        Visit this page in Chrome, Edge, or Safari to install
                        CivicMitra
                      </p>
                    </div>
                  )}
                </>
              )}

              {isInstalled && (
                <div className="inline-flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-xl">
                  <span className="font-semibold">
                    App Installed Successfully!
                  </span>
                </div>
              )}
            </div>
          </div>
          {/* Device Mockup - Desktop Only */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Phone Mockup */}
              <div className="relative mx-auto w-80">
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-[2.5rem] p-2 shadow-2xl transform hover:rotate-1 transition-transform duration-500">
                  {/* Side Bars */}
                  <div className="absolute top-1/2 left-0 w-1 h-12 bg-gray-700 rounded-r-lg -translate-y-1/2"></div>
                  <div className="absolute top-1/2 right-0 w-1 h-20 bg-gray-700 rounded-l-lg -translate-y-1/2"></div>

                  <div className="bg-white dark:bg-gray-900 rounded-[2.25rem] overflow-hidden relative">
                    {/* Status Bar */}
                    <div className="bg-gray-900 text-white px-6 py-1 flex justify-between items-center text-xs">
                      <span>9:41</span>
                      <div className="flex space-x-1">
                        <div className="w-4 h-3 bg-white rounded-sm"></div>
                        <div className="w-4 h-3 bg-white rounded-sm"></div>
                        <div className="w-4 h-3 bg-white rounded-sm"></div>
                      </div>
                    </div>

                    {/* App Screen */}
                    <div className="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-700 min-h-[480px] p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-3 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                            <Shield className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">
                              CivicMitra
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Digital Citizen Services
                            </p>
                          </div>
                        </div>

                        {/* Mock Content */}
                        <div className="space-y-4">
                          {[
                            {
                              title: "Report Issue",
                              status: "Quick",
                              color: "blue",
                            },
                            {
                              title: "Track Status",
                              status: "Live",
                              color: "green",
                            },
                            {
                              title: "My Reports",
                              status: "3 Active",
                              color: "orange",
                            },
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              className="bg-white dark:bg-gray-600 rounded-xl p-4 shadow-sm"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {item.title}
                                </span>
                                <span
                                  className={`text-xs bg-${item.color}-100 dark:bg-${item.color}-900 text-${item.color}-600 dark:text-${item.color}-300 px-2 py-1 rounded-full`}
                                >
                                  {item.status}
                                </span>
                              </div>
                              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bottom Navigation Mock */}
                      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-3 rounded-b-[2.25rem] flex justify-around">
                        <div className="w-6 h-6 bg-blue-600 rounded"></div>
                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optional floating badges */}
              <div className="hidden lg:flex absolute top-6 -left-8 bg-white text-blue-600 px-4 py-2 rounded-full shadow-lg items-center space-x-2 animate-bounce">
                <Smartphone className="w-4 h-4" />
                <span className="text-sm font-semibold">PWA Ready</span>
              </div>
              <div className="hidden lg:flex absolute bottom-6 -right-8 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg animate-pulse">
                <span className="text-sm font-semibold">Install Now</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstallCTA;
