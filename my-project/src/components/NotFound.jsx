import React from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import notFoundAnimation from '../assets/animations/404-animation.json';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/home');
  };

  const handleContactSupport = () => {
    navigate('/about');
  };

  const handleHelpCenter = () => {
    navigate('/about');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="text-center max-w-md mx-auto">
        {/* Lottie Animation */}
        <div className="w-64 h-64 mx-auto mb-8">
          <Lottie 
            animationData={notFoundAnimation}
            loop={true}
            autoplay={true}
            className="w-full h-full"
          />
        </div>

        {/* Error Message */}
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist. It might have been moved, 
          deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button
            onClick={handleGoHome}
            className="inline-block w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center"
          >
            Go Home
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Still can't find what you're looking for?
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button 
              onClick={handleContactSupport}
              className="text-blue-600 hover:text-blue-800 underline bg-transparent border-none cursor-pointer"
            >
              Contact Support
            </button>
            <span className="text-gray-300">|</span>
            <button 
              onClick={handleHelpCenter}
              className="text-blue-600 hover:text-blue-800 underline bg-transparent border-none cursor-pointer"
            >
              Help Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;