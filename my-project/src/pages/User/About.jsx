
import { Shield, Info, BookOpen, Scale, Heart, FileText, Award, ExternalLink } from 'lucide-react';
import ContactSection from './ContactSection';

export default function InformationScreen() {
  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Hero Section */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
          <Shield className="h-6 w-6 sm:h-8 sm:w-8 mr-2 text-blue-600" />
          About SafeSpace
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          Empowering our community to create a safer environment for everyone
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-xl p-5 sm:p-6 text-white shadow-sm sm:shadow-md mb-6 sm:mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-500 opacity-10 rounded-full scale-150 translate-x-1/2 -translate-y-1/4"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="bg-white/20 p-2 sm:p-3 rounded-full">
              <Shield size={20} className="text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold ml-2 sm:ml-3">Our Mission</h2>
          </div>
          <p className="text-base sm:text-lg mb-3 sm:mb-4 opacity-90">
            SafeSpace is a secure platform developed by the Centre for Gender Equity & Empowerment to help university community members report cases of Sexual and Gender-Based Violence (SGBV) securely and anonymously.
          </p>
          <p className="text-base sm:text-lg opacity-90">
            We are committed to creating a safe, equitable environment free from all forms of gender-based violence and discrimination through support services, educational resources, and confidential reporting mechanisms.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <ContactSection />

      {/* What is SGBV Section */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-xs sm:shadow-sm mb-6 sm:mb-8 border border-gray-100">
        <div className="flex items-center mb-4 sm:mb-5">
          <div className="bg-blue-50 p-2 sm:p-3 rounded-full">
            <Info size={20} className="text-blue-700" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold ml-2 sm:ml-3">What is SGBV?</h3>
        </div>
        
        <p className="text-gray-700 text-sm sm:text-base mb-4 sm:mb-6">
          Sexual and Gender-Based Violence (SGBV) refers to any act that is perpetrated against a person's will and is based on gender norms and unequal power relationships. These acts can cause physical, sexual, psychological, or economic harm.
        </p>
        
        <div className="bg-blue-50 p-3 sm:p-4 rounded-xl border border-blue-100">
          <h4 className="font-medium text-blue-800 mb-2 sm:mb-3 text-base sm:text-lg">Forms of SGBV include:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-xs">
              <div className="flex items-center">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500 rounded-full mr-2"></div>
                <h5 className="font-medium text-sm sm:text-base">Sexual harassment and assault</h5>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 pl-3 sm:pl-4">Unwanted sexual advances or contact</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-xs">
              <div className="flex items-center">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500 rounded-full mr-2"></div>
                <h5 className="font-medium text-sm sm:text-base">Physical violence</h5>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 pl-3 sm:pl-4">Hitting, slapping, punching, or other physical harm</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-xs">
              <div className="flex items-center">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500 rounded-full mr-2"></div>
                <h5 className="font-medium text-sm sm:text-base">Emotional and psychological abuse</h5>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 pl-3 sm:pl-4">Threats, intimidation, and controlling behavior</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-xs">
              <div className="flex items-center">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500 rounded-full mr-2"></div>
                <h5 className="font-medium text-sm sm:text-base">Verbal abuse</h5>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 pl-3 sm:pl-4">Humiliation, insults, and degrading language</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-xs">
              <div className="flex items-center">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500 rounded-full mr-2"></div>
                <h5 className="font-medium text-sm sm:text-base">Stalking and cyber harassment</h5>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 pl-3 sm:pl-4">Unwanted attention, monitoring, online harassment</p>
            </div>
            <div className="bg-white p-3 sm:p-4 rounded-lg shadow-xs">
              <div className="flex items-center">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500 rounded-full mr-2"></div>
                <h5 className="font-medium text-sm sm:text-base">Economic abuse</h5>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mt-1 pl-3 sm:pl-4">Controlling access to finances and resources</p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Commitment Section */}
      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-xs sm:shadow-sm mb-6 sm:mb-8 border border-gray-100">
        <div className="flex items-center mb-4 sm:mb-5">
          <div className="bg-purple-50 p-2 sm:p-3 rounded-full">
            <Award size={20} className="text-purple-700" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold ml-2 sm:ml-3">Our Commitment</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 rounded-xl shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="bg-blue-200 p-1 sm:p-2 rounded-full">
                <Shield size={16} className="text-blue-700" />
              </div>
              <h4 className="font-medium ml-2 sm:ml-3 text-blue-800 text-sm sm:text-base">Confidentiality</h4>
            </div>
            <p className="text-gray-700 text-xs sm:text-sm">All reports are handled with strict confidentiality to protect the identity of those involved. Your privacy is our utmost concern.</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 sm:p-4 rounded-xl shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="bg-green-200 p-1 sm:p-2 rounded-full">
                <Heart size={16} className="text-green-700" />
              </div>
              <h4 className="font-medium ml-2 sm:ml-3 text-green-800 text-sm sm:text-base">Support</h4>
            </div>
            <p className="text-gray-700 text-xs sm:text-sm">We provide comprehensive support services including counseling, medical assistance, and legal advice for all affected individuals.</p>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 sm:p-4 rounded-xl shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="bg-amber-200 p-1 sm:p-2 rounded-full">
                <Scale size={16} className="text-amber-700" />
              </div>
              <h4 className="font-medium ml-2 sm:ml-3 text-amber-800 text-sm sm:text-base">Justice</h4>
            </div>
            <p className="text-gray-700 text-xs sm:text-sm">We are committed to fair investigation and appropriate action against perpetrators to ensure justice is served.</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-xl shadow-xs hover:shadow-sm transition-shadow">
            <div className="flex items-center mb-2 sm:mb-3">
              <div className="bg-purple-200 p-1 sm:p-2 rounded-full">
                <BookOpen size={16} className="text-purple-700" />
              </div>
              <h4 className="font-medium ml-2 sm:ml-3 text-purple-800 text-sm sm:text-base">Education</h4>
            </div>
            <p className="text-gray-700 text-xs sm:text-sm">We provide ongoing education to prevent SGBV and promote gender equity through workshops, seminars and awareness campaigns.</p>
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="bg-gray-50 rounded-xl p-4 sm:p-6 shadow-xs sm:shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center">
            <div className="bg-indigo-50 p-2 sm:p-3 rounded-full">
              <FileText size={20} className="text-indigo-700" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold ml-2 sm:ml-3">Resources</h3>
          </div>
          <a href="#/resources" className="text-blue-700 text-xs sm:text-sm font-medium hover:underline flex items-center">
            View all resources
            <ExternalLink size={12} className="ml-1" />
          </a>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <a href="#" className="group block bg-white p-3 sm:p-4 rounded-xl shadow-xs hover:shadow-sm transition-all border-l-4 border-blue-500">
            <h4 className="font-medium text-gray-800 group-hover:text-blue-700 transition-colors text-sm sm:text-base">SGBV Prevention Guide</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Learn how to recognize warning signs and protect yourself</p>
            <div className="mt-3 sm:mt-4 flex justify-end">
              <div className="bg-blue-50 p-1 sm:p-2 rounded-full group-hover:bg-blue-100 transition-colors">
                <ExternalLink size={14} className="text-blue-700" />
              </div>
            </div>
          </a>
          
          <a href="#" className="group block bg-white p-3 sm:p-4 rounded-xl shadow-xs hover:shadow-sm transition-all border-l-4 border-green-500">
            <h4 className="font-medium text-gray-800 group-hover:text-green-700 transition-colors text-sm sm:text-base">Support Services Directory</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Comprehensive list of available support services on and off campus</p>
            <div className="mt-3 sm:mt-4 flex justify-end">
              <div className="bg-green-50 p-1 sm:p-2 rounded-full group-hover:bg-green-100 transition-colors">
                <ExternalLink size={14} className="text-green-700" />
              </div>
            </div>
          </a>
          
          <a href="#" className="group block bg-white p-3 sm:p-4 rounded-xl shadow-xs hover:shadow-sm transition-all border-l-4 border-purple-500">
            <h4 className="font-medium text-gray-800 group-hover:text-purple-700 transition-colors text-sm sm:text-base">Legal Rights Information</h4>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">Know your legal rights regarding SGBV cases and reporting processes</p>
            <div className="mt-3 sm:mt-4 flex justify-end">
              <div className="bg-purple-50 p-1 sm:p-2 rounded-full group-hover:bg-purple-100 transition-colors">
                <ExternalLink size={14} className="text-purple-700" />
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}