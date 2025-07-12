
import { AlertTriangle, Phone, Mail, ExternalLink, Shield } from 'lucide-react';

export default function EmergencyContacts() {
  const contacts = [
    { name: "Private Advisor for Sexual Assault", number: "0798 416091", urgent: true },
    { name: "Health Unit (24/7)", number: "0712 345678", urgent: true },
    { name: "Fire Emergency", number: "999", urgent: true },
    { name: "National GBV Hotline", number: "1195", urgent: true },
    { name: "Police Emergency", number: "999 / 112", urgent: true }
  ];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5 sm:space-y-6">
      {/* Page Header */}
      <div className="text-center mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center">
          <Shield className="h-6 w-6 sm:h-8 sm:w-8 mr-2 text-blue-600" />
          Emergency Support
        </h1>
        <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
          Access immediate help and support services. Your safety is our priority.
        </p>
      </div>

      {/* Emergency Alert Banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 h-24 w-24 sm:h-32 sm:w-32 bg-red-100 rounded-full transform translate-x-12 -translate-y-12 sm:translate-x-16 sm:-translate-y-16 opacity-50"></div>
        <div className="relative z-10">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="bg-red-100 p-2 sm:p-3 rounded-full">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-red-700 ml-2 sm:ml-3">
              Emergency Contacts
            </h2>
          </div>
          <p className="text-gray-700 mb-4 sm:mb-6 text-base sm:text-lg">
            If you're in immediate danger, please contact one of these emergency numbers immediately:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {contacts.filter(c => c.urgent).map((contact, index) => (
              <div 
                key={index} 
                className="bg-white p-3 sm:p-4 rounded-lg shadow-xs border-l-4 border-red-500 hover:shadow-sm transition-shadow duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base">{contact.name}</p>
                    <p className="text-gray-500 text-xs sm:text-sm">Direct call</p>
                  </div>
                  <a 
                    href={`tel:${contact.number}`} 
                    className="flex items-center justify-center bg-red-100 text-red-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-red-200 transition-colors text-sm sm:text-base min-w-[120px] sm:min-w-32"
                  >
                    <Phone size={14} className="mr-1 sm:mr-2" />
                    {contact.number}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Email Support & Additional Resources */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-200 shadow-sm">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
              <Mail size={20} className="text-blue-700" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-blue-800 ml-2 sm:ml-3">Email Support</h3>
          </div>
          <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">
            For non-emergency inquiries or follow-ups, you can reach us at:
          </p>
          <a 
            href="mailto:director-gender@kenya.ac.ke"
            className="block bg-white text-blue-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-center shadow-xs hover:bg-blue-50 hover:shadow-sm transition-all duration-300 font-medium text-sm sm:text-base"
          >
            director-gender@kenya.ac.ke
          </a>
        </div>

        <div className="bg-green-50 rounded-xl p-4 sm:p-6 border border-green-200 shadow-sm">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="bg-green-100 p-2 sm:p-3 rounded-full">
              <ExternalLink size={20} className="text-green-700" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-green-800 ml-2 sm:ml-3">Additional Resources</h3>
          </div>
          <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">
            Find more support information and resources on our dedicated help pages.
          </p>
          <a 
            href="#/resources"
            className="block bg-white text-green-700 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-center shadow-xs hover:bg-green-50 hover:shadow-sm transition-all duration-300 font-medium text-sm sm:text-base"
          >
            Browse Resources
          </a>
        </div>
      </div>

      {/* Quick Guidance */}
      <div className="bg-yellow-50 rounded-xl p-4 sm:p-6 border border-yellow-200 shadow-sm">
        <h3 className="text-lg sm:text-xl font-semibold text-yellow-800 mb-2 sm:mb-3">Quick Guidance</h3>
        <ul className="space-y-2 sm:space-y-3">
          <li className="flex items-start">
            <div className="bg-yellow-100 p-1 rounded-full mr-2 sm:mr-3 mt-1">
              <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-yellow-500 rounded-full"></div>
            </div>
            <p className="text-gray-700 text-sm sm:text-base">If you're in immediate danger, call emergency services first before anything else.</p>
          </li>
          <li className="flex items-start">
            <div className="bg-yellow-100 p-1 rounded-full mr-2 sm:mr-3 mt-1">
              <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-yellow-500 rounded-full"></div>
            </div>
            <p className="text-gray-700 text-sm sm:text-base">When possible, try to move to a safe location before making your call.</p>
          </li>
          <li className="flex items-start">
            <div className="bg-yellow-100 p-1 rounded-full mr-2 sm:mr-3 mt-1">
              <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 bg-yellow-500 rounded-full"></div>
            </div>
            <p className="text-gray-700 text-sm sm:text-base">All calls to support services are confidential and handled with care.</p>
          </li>
        </ul>
      </div>
    </div>
  );
}