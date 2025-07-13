
import { Link, useLocation } from 'react-router-dom';
import { Home, Send, AlertTriangle, Info, Bell } from 'lucide-react';
import kenyanFlag from "/src/assets/kenyanflag.png";
import { useState, useEffect, useRef } from 'react';

export default function Layout({ children }) {
  const [headerVisible, setHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const location = useLocation();

  // Function to determine if a route is active
  const isActiveRoute = (path) => {
    if (path === '/' || path === '/home') {
      return location.pathname === '/' || location.pathname === '/home';
    }
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setHeaderVisible(false);
      } else if (currentScrollY < lastScrollY.current) {
        setHeaderVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Header - Animated based on scroll */}
      <header className="fixed top-0 left-0 right-0 py-5 px-4 text-white z-20 bg-gradient-to-b from-[#0E3692] to-transparent opacity-90">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <img 
              src={kenyanFlag} 
              alt="Kenyan Flag" 
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold">SafeSpace</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-16 pb-20 max-w-4xl mx-auto w-full relative z-0">
        {children}
      </main>

      {/* Fixed Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-around py-3 px-4">
            <Link 
              to="/"
              className={`flex flex-col items-center p-2 transition-all duration-200 ${
                isActiveRoute('/') 
                  ? 'text-[#0E3692]' 
                  : 'text-gray-600 hover:text-[#0E3692]'
              }`}
            >
              <Home size={20} />
              <span className="text-xs mt-1 relative">
                Home
                {isActiveRoute('/') && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-[#0E3692] rounded-full"></span>
                )}
              </span>
            </Link>
            <Link 
              to="/report"
              className={`flex flex-col items-center p-2 transition-all duration-200 ${
                isActiveRoute('/report') 
                  ? 'text-[#0E3692]' 
                  : 'text-gray-600 hover:text-[#0E3692]'
              }`}
            >
              <Send size={20} />
              <span className="text-xs mt-1 relative">
                Report
                {isActiveRoute('/report') && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-[#0E3692] rounded-full"></span>
                )}
              </span>
            </Link>
            <Link 
              to="/emergency"
              className={`flex flex-col items-center p-2 transition-all duration-200 ${
                isActiveRoute('/emergency') 
                  ? 'text-[#0E3692]' 
                  : 'text-gray-600 hover:text-[#0E3692]'
              }`}
            >
              <AlertTriangle size={20} />
              <span className="text-xs mt-1 relative">
                Emergency
                {isActiveRoute('/emergency') && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-[#0E3692] rounded-full"></span>
                )}
              </span>
            </Link>
            <Link 
              to="/about"
              className={`flex flex-col items-center p-2 transition-all duration-200 ${
                isActiveRoute('/about') 
                  ? 'text-[#0E3692]' 
                  : 'text-gray-600 hover:text-[#0E3692]'
              }`}
            >
              <Info size={20} />
              <span className="text-xs mt-1 relative">
                About
                {isActiveRoute('/about') && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-[#0E3692] rounded-full"></span>
                )}
              </span>
            </Link>
            <Link 
              to="/updates"
              className={`flex flex-col items-center p-2 transition-all duration-200 ${
                isActiveRoute('/updates') 
                  ? 'text-[#0E3692]' 
                  : 'text-gray-600 hover:text-[#0E3692]'
              }`}
            >
              <Bell size={20} />
              <span className="text-xs mt-1 relative">
                Updates
                {isActiveRoute('/updates') && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-0.5 bg-[#0E3692] rounded-full"></span>
                )}
              </span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}