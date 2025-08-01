// src/components/Psychologists/PsychologistsDirectory.jsx
import { useState, useEffect } from 'react';
import { User, Globe, Award, RefreshCw, Search, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './apiConfig'; // Adjust path if needed

const PsychologistsDirectory = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchPsychologists = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/psychologists/`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const psychologistsArray = Array.isArray(data)
        ? data
        : data.results || data.psychologists || [];
      setPsychologists(psychologistsArray);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching psychologists:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPsychologists();
  }, []);

  const formatLanguages = (languages) => {
    return languages?.join(', ') || 'Not specified';
  };

  const getGenderIcon = (gender) => {
    if (!gender) return '👤';
    switch (gender.toLowerCase()) {
      case 'male':
        return '👨';
      case 'female':
        return '👩';
      default:
        return '👤';
    }
  };

  const filteredPsychologists = psychologists.filter((psychologist) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    return (
      psychologist.username?.toLowerCase().includes(term) ||
      psychologist.specializations?.toLowerCase().includes(term) ||
      psychologist.languages?.some((lang) => lang.toLowerCase().includes(term)) ||
      psychologist.gender?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="text-center py-12">
          <div className="relative inline-block">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <User className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
            </div>
          </div>
          <p className="mt-4 text-gray-600 font-medium text-sm sm:text-base">
            Loading psychologists...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
        <div className="text-center">
          <div className="bg-white border border-red-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <RefreshCw className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <h2 className="text-red-800 font-bold text-lg sm:text-xl mb-1 sm:mb-2">
              Connection Error
            </h2>
            <p className="text-red-600 mb-4 sm:mb-6 text-sm sm:text-base">{error}</p>
            <button
              onClick={fetchPsychologists}
              className="bg-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-xl hover:bg-red-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md text-sm sm:text-base"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2 flex items-center justify-center">
                    Psychologists Directory
        </h1>
        <p className="text-gray-600 text-xs sm:text-base max-w-2xl mx-auto">
          Find qualified mental health professionals to support your needs
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4 sm:mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm sm:text-base"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute right-0 top-0 flex items-center h-full pr-2 sm:pr-3">
          <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
             <User className="h-3 w-3 sm:h-4 sm:w-4" />
            {filteredPsychologists.length} 
            {filteredPsychologists.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="mb-4 sm:mb-8">
        {filteredPsychologists.length === 0 ? (
          <div className="text-center py-6 sm:py-8 bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <User className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
              No psychologists found
            </h3>
            <p className="text-gray-500 mb-4 sm:mb-6 max-w-md mx-auto text-xs sm:text-sm">
              {searchTerm
                ? 'Try adjusting your search terms or clear the search to see all professionals.'
                : 'There are no psychologists in the directory yet.'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-6">
            {filteredPsychologists.map((psychologist) => (
              <div
                key={psychologist.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className="p-4 sm:p-6">
                  {/* Header */}
                  <div className="flex items-start mb-3 sm:mb-6">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                      <span className="text-xl sm:text-2xl">
                        {getGenderIcon(psychologist.gender)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 break-words">
                        {psychologist.username}
                      </h3>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-medium">
                          {psychologist.gender
                            ? psychologist.gender.charAt(0).toUpperCase() +
                              psychologist.gender.slice(1)
                            : 'Not specified'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Languages */}
                  <div className="mb-3 sm:mb-5">
                    <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                      <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-indigo-600 flex-shrink-0" />
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-900">
                        Languages
                      </h4>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg break-words">
                      {formatLanguages(psychologist.languages)}
                    </div>
                  </div>

                  {/* Specializations */}
                  {psychologist.specializations && (
                    <div className="mb-4 sm:mb-6">
                      <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                        <Award className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                        <h4 className="text-xs sm:text-sm font-semibold text-gray-900">
                          Specializations
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {psychologist.specializations.split(',').map((spec, i) => (
                          <span
                            key={i}
                            className="text-xs bg-green-100 text-green-800 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full font-medium break-words"
                          >
                            {spec.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Profile Link */}
                  <div className="mt-3 sm:mt-4">
                    <button
                      onClick={() => navigate(`/psychologists/${psychologist.uid}`)}
                      className="w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 sm:py-3 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md text-sm sm:text-base"
                    >
                      View Profile & Book
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PsychologistsDirectory;