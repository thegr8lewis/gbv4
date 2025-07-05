// import { Shield, Upload, ChevronRight, ChevronLeft, Check, Plus, AlertTriangle, Info } from 'lucide-react';
// import { useState, Suspense, lazy } from 'react';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
// import {  API_BASE_URL } from './apiConfig';

// // Create lazy-loaded components with error boundaries
// const InstructionsComponent = lazy(() => import('/src/pages/User/Instruction')
//   .catch(() => ({ 
//     default: () => <div className="text-red-500 p-4">Instructions component failed to load</div> 
//   })));

// const ReportResponse = lazy(() => import('/src/pages/User/ReportResponse')
//   .catch(() => ({ 
//     default: () => <div className="text-red-500 p-4">Report response component failed to load</div> 
//   })));

// const MySwal = withReactContent(Swal);

// export default function ReportForm() {
//   const [step, setStep] = useState(1);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState(null);
//   const [submittedReport, setSubmittedReport] = useState(null);
  
//   const initialFormData = {
//     category: localStorage.getItem('lastReportCategory') || '',
//     description: '',
//     gender: '',
//     location: '',
//     perpetratorDetails: '',
//     anonymous: false,
//     contactPhone: '',
//     contactEmail: '',
//     evidence: null
//   };
  
//   const [formData, setFormData] = useState(initialFormData);
  
//   const categories = [
//     "Sexual Harassment",
//     "Sexual Assault",
//     "Domestic Violence",
//     "Stalking",
//     "Verbal Abuse",
//     "Emotional Abuse",
//     "Other"
//   ];

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));

//     if (field === 'category') {
//       localStorage.setItem('lastReportCategory', value);
//     }
//   };

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 10 * 1024 * 1024) {
//         setSubmitError('File size must be less than 10MB');
//         return;
//       }
      
//       const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
//       if (!validTypes.includes(file.type)) {
//         setSubmitError('Only JPG, PNG, or PDF files are allowed');
//         return;
//       }
      
//       handleInputChange('evidence', file);
//       setSubmitError(null);
//     }
//   };

//   const handleSubmitReport = async () => {
//     setIsSubmitting(true);
//     setSubmitError(null);
    
//     try {
//       const formDataToSend = new FormData();
      
//       Object.entries(formData).forEach(([key, value]) => {
//         if (value !== null && value !== undefined && value !== '') {
//           let backendKey = key;
//           if (key === 'perpetratorDetails') backendKey = 'perpetrator_details';
//           if (key === 'anonymous') backendKey = 'is_anonymous';
//           if (key === 'contactPhone') backendKey = 'contact_phone';
//           if (key === 'contactEmail') backendKey = 'contact_email';
          
//           formDataToSend.append(backendKey, value);
//         }
//       });

//       const response = await fetch(`${API_BASE_URL}/reports/`, {
//         method: 'POST',
//         body: formDataToSend,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to submit report');
//       }

//       const responseData = await response.json();
//       setSubmittedReport(responseData);
//       setStep(3);
//     } catch (error) {
//       console.error('Submission error:', error);
//       setSubmitError(error.message || 'An error occurred while submitting the report');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleContinue = () => {
//     if (step === 1) {
//       setStep(2);
//       return;
//     }
  
//     if (step === 2) {
//       if (!formData.category || !formData.description || (!formData.anonymous && (!formData.contactPhone && !formData.contactEmail))) {
//         setSubmitError('Please fill in all required fields or choose to remain anonymous.');
//         MySwal.fire({
//           title: 'Submission Failed',
//           text: 'Please fill in all required details before submitting.',
//           icon: 'error',
//           confirmButtonText: 'Try Again'
//         });
//         return;
//       }
      
//       handleSubmitReport();
//     }
//   };
  
//   const resetForm = () => {
//     setFormData(initialFormData);
//     setStep(1);
//     setSubmittedReport(null);
//     setSubmitError(null);
//   };
  
//   const renderStepContent = () => {
//     switch (step) {
//       case 1:
//         return (
//           <div className="space-y-5">
//             <h3 className="text-lg font-semibold text-gray-800">Incident Details</h3>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Category of Incident*
//               </label>
//               <select 
//                 className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-gray-50 transition-all duration-200 hover:bg-white"
//                 value={formData.category}
//                 onChange={(e) => handleInputChange('category', e.target.value)}
//                 required
//               >
//                 <option value="">Select a category</option>
//                 {categories.map((cat, index) => (
//                   <option key={index} value={cat}>{cat}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Description of Incident*
//               </label>
//               <textarea
//                 className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-gray-50 transition-all duration-200 h-32 hover:bg-white"
//                 placeholder="Please describe what happened..."
//                 value={formData.description}
//                 onChange={(e) => handleInputChange('description', e.target.value)}
//                 required
//               ></textarea>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Gender of Affected Person
//               </label>
//               <div className="flex flex-wrap gap-2">
//                 {['female', 'male', 'other'].map((gender) => (
//                   <label key={gender} className="relative flex items-center">
//                     <input
//                       type="radio"
//                       name="gender"
//                       value={gender}
//                       checked={formData.gender === gender}
//                       onChange={() => handleInputChange('gender', gender)}
//                       className="absolute opacity-0 w-0 h-0"
//                     />
//                     <span className={`px-3 py-1 rounded-full cursor-pointer transition-all duration-200 border ${
//                       formData.gender === gender 
//                         ? 'bg-blue-100 border-blue-500 text-blue-800 font-medium' 
//                         : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
//                     }`}>
//                       {gender.charAt(0).toUpperCase() + gender.slice(1)}
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Location of Incident
//               </label>
//               <input
//                 type="text"
//                 className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-gray-50 transition-all duration-200 hover:bg-white"
//                 placeholder="Where did this happen?"
//                 value={formData.location}
//                 onChange={(e) => handleInputChange('location', e.target.value)}
//               />
//             </div>
            
//             <div className="flex justify-end pt-2">
//               <button
//                 onClick={() => setStep(2)}
//                 className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
//               >
//                 <span>Continue</span>
//                 <ChevronRight className="h-5 w-5" />
//               </button>
//             </div>
//           </div>
//         );
//       case 2:
//         return (
//           <div className="space-y-4">
//             <h3 className="text-lg font-semibold text-gray-800">Additional Information</h3>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Perpetrator Details (Optional)
//               </label>
//               <textarea
//                 className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-gray-50 transition-all duration-200 h-24 hover:bg-white"
//                 placeholder="Any details about the perpetrator that might be helpful..."
//                 value={formData.perpetratorDetails}
//                 onChange={(e) => handleInputChange('perpetratorDetails', e.target.value)}
//               ></textarea>
//             </div>
            
//             <div className="p-4 bg-blue-50 rounded-lg">
//               <div className="flex items-start mb-3">
//                 <div className="flex items-center h-5">
//                   <input
//                     type="checkbox"
//                     id="anonymous"
//                     checked={formData.anonymous}
//                     onChange={(e) => handleInputChange('anonymous', e.target.checked)}
//                     className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                   />
//                 </div>
//                 <div className="ml-3">
//                   <label htmlFor="anonymous" className="font-medium text-sm">
//                     Submit this report anonymously
//                   </label>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Your identity will be kept confidential. However, providing contact details helps us follow up if needed.
//                   </p>
//                 </div>
//               </div>
              
//               {!formData.anonymous && (
//                 <div className="space-y-3 mt-3 pl-5">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Contact Phone (Optional)
//                     </label>
//                     <input
//                       type="tel"
//                       className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white transition-all duration-200"
//                       placeholder="Your phone number"
//                       value={formData.contactPhone}
//                       onChange={(e) => handleInputChange('contactPhone', e.target.value)}
//                     />
//                   </div>
                  
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Contact Email (Optional)
//                     </label>
//                     <input
//                       type="email"
//                       className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white transition-all duration-200"
//                       placeholder="Your email address"
//                       value={formData.contactEmail}
//                       onChange={(e) => handleInputChange('contactEmail', e.target.value)}
//                     />
//                   </div>
//                 </div>
//               )}
//             </div>
            
//             <div className="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 relative cursor-pointer group">
//               <input
//                 type="file"
//                 accept=".png,.jpg,.jpeg,.pdf"
//                 onChange={handleFileUpload}
//                 className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
//               />
//               <div className="text-center">
//                 <div className="w-12 h-12 mx-auto mb-2 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
//                   <Upload className="text-blue-500" size={20} />
//                 </div>
//                 <p className="font-medium text-gray-700 text-sm">Upload Evidence</p>
//                 <p className="text-xs text-gray-500 mt-1">Click to upload or drag and drop</p>
//                 <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 10MB</p>
//               </div>
//               {formData.evidence && (
//                 <div className="mt-3 py-2 px-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
//                   <p className="text-xs text-blue-700 font-medium truncate">
//                     {formData.evidence.name}
//                   </p>
//                   <span className="text-xs bg-blue-600 text-white py-0.5 px-1.5 rounded-full">Selected</span>
//                 </div>
//               )}
//             </div>
            
//             <div className="flex justify-between pt-3">
//               <button
//                 onClick={() => setStep(1)}
//                 className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2 text-sm"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//                 <span>Back</span>
//               </button>
//               <button
//                 onClick={handleContinue}
//                 disabled={isSubmitting}
//                 className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm"
//               >
//                 {isSubmitting ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     <span>Submitting...</span>
//                   </>
//                 ) : (
//                   <>
//                     <span>Submit</span>
//                     <Check className="h-4 w-4" />
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
//         );
//       case 3:
//         return (
//           <div className="space-y-0">
//             <div className="bg-green-50 rounded-lg p-6 text-center">
//               <div className="flex items-center justify-center p-3 rounded-full bg-green-100 w-16 h-16 mx-auto mb-3 shadow-inner border border-green-200">
//                 <Shield className="text-green-600" size={24} />
//               </div>
//               <h3 className="text-xl font-bold text-green-800 mb-2">Report Submitted</h3>
//               <p className="text-green-700 mb-3">
//                 Thank you for your report. It has been submitted securely.
//               </p>
//             </div>
            
//             {formData.category && (
//               <Suspense fallback={<div className="text-center py-4">Loading instructions...</div>}>
//                 <InstructionsComponent category={formData.category} />
//               </Suspense>
//             )}
            
//             <div className="mt-4">
//               <Suspense fallback={<div className="text-center py-4">Loading response...</div>}>
//                 <ReportResponse reportId={submittedReport?.id} />
//               </Suspense>
//             </div>
          
//             <div className="flex justify-center pt-3">
//               <button
//                 onClick={resetForm}
//                 className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 text-sm"
//               >
//                 <Plus className="h-4 w-4" />
//                 <span>Report Another Incident</span>
//               </button>
//             </div>
//           </div>
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <div className="bg-white rounded-lg p-6 shadow-lg">
//         {step < 3 && (
//           <div className="mb-6">
//             <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
//               <Info className="h-6 w-6 mr-2 text-blue-600" />
//               Report an Incident
//             </h2>
//             <div className="relative">
//               <div className="flex items-center justify-between mb-3 relative z-10">
//                 {[1, 2].map((stepNumber) => (
//                   <div key={stepNumber} className="flex flex-col items-center">
//                     <div 
//                       className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 transition-all duration-300 ${
//                         step >= stepNumber 
//                           ? 'bg-blue-600 text-white shadow-md' 
//                           : 'bg-gray-200 text-gray-600'
//                       }`}
//                     >
//                       {stepNumber}
//                     </div>
//                     <span className={`text-xs font-medium ${step >= stepNumber ? 'text-blue-600' : 'text-gray-500'}`}>
//                       {stepNumber === 1 ? 'Incident Details' : 'Additional Info'}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//               <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
//                 <div 
//                   className="h-full bg-blue-600 transition-all duration-300"
//                   style={{ width: step === 1 ? '0%' : '100%' }}
//                 ></div>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {submitError && (
//           <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-center">
//             <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
//             {submitError}
//           </div>
//         )}
        
//         {renderStepContent()}
//       </div>
//     </div>
//   );
// }

import { Shield, Upload, ChevronRight, ChevronLeft, Check, Plus, AlertTriangle, Info } from 'lucide-react';
import { useState, Suspense, lazy } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {  API_BASE_URL } from './apiConfig';

// Create lazy-loaded components with error boundaries
const InstructionsComponent = lazy(() => import('/src/pages/User/Instruction')
  .catch(() => ({ 
    default: () => <div className="text-red-500 p-4">Instructions component failed to load</div> 
  })));

const ReportResponse = lazy(() => import('/src/pages/User/ReportResponse')
  .catch(() => ({ 
    default: () => <div className="text-red-500 p-4">Report response component failed to load</div> 
  })));

const MySwal = withReactContent(Swal);

export default function ReportForm() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submittedReport, setSubmittedReport] = useState(null);
  
  const initialFormData = {
    category: localStorage.getItem('lastReportCategory') || '',
    description: '',
    gender: '',
    location: '',
    perpetratorDetails: '',
    anonymous: false,
    contactPhone: '',
    contactEmail: '',
    evidence: null
  };
  
  const [formData, setFormData] = useState(initialFormData);
  
  const categories = [
    "Sexual Harassment",
    "Sexual Assault",
    "Domestic Violence",
    "Stalking",
    "Verbal Abuse",
    "Emotional Abuse",
    "Other"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'category') {
      localStorage.setItem('lastReportCategory', value);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setSubmitError('File size must be less than 10MB');
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setSubmitError('Only JPG, PNG, or PDF files are allowed');
        return;
      }
      
      handleInputChange('evidence', file);
      setSubmitError(null);
    }
  };

  const handleSubmitReport = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          let backendKey = key;
          if (key === 'perpetratorDetails') backendKey = 'perpetrator_details';
          if (key === 'anonymous') backendKey = 'is_anonymous';
          if (key === 'contactPhone') backendKey = 'contact_phone';
          if (key === 'contactEmail') backendKey = 'contact_email';
          
          formDataToSend.append(backendKey, value);
        }
      });

      const response = await fetch(`${API_BASE_URL}/reports/`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit report');
      }

      const responseData = await response.json();
      setSubmittedReport(responseData);
      setStep(3);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError(error.message || 'An error occurred while submitting the report');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
      return;
    }
  
    if (step === 2) {
      if (!formData.category || !formData.description || (!formData.anonymous && (!formData.contactPhone && !formData.contactEmail))) {
        setSubmitError('Please fill in all required fields or choose to remain anonymous.');
        MySwal.fire({
          title: 'Submission Failed',
          text: 'Please fill in all required details before submitting.',
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
        return;
      }
      
      handleSubmitReport();
    }
  };
  
  const resetForm = () => {
    setFormData(initialFormData);
    setStep(1);
    setSubmittedReport(null);
    setSubmitError(null);
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Incident Details</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Category of Incident*
              </label>
              <select 
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-gray-50 transition-all duration-200 hover:bg-white text-sm sm:text-base"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Description of Incident*
              </label>
              <textarea
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-gray-50 transition-all duration-200 h-32 hover:bg-white text-sm sm:text-base"
                placeholder="Please describe what happened..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                required
              ></textarea>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Gender of Affected Person
              </label>
              <div className="flex flex-wrap gap-2">
                {['female', 'male', 'other'].map((gender) => (
                  <label key={gender} className="relative flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value={gender}
                      checked={formData.gender === gender}
                      onChange={() => handleInputChange('gender', gender)}
                      className="absolute opacity-0 w-0 h-0"
                    />
                    <span className={`px-2 sm:px-3 py-1 rounded-full cursor-pointer transition-all duration-200 border text-xs sm:text-sm ${
                      formData.gender === gender 
                        ? 'bg-blue-100 border-blue-500 text-blue-800 font-medium' 
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}>
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Location of Incident
              </label>
              <input
                type="text"
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-gray-50 transition-all duration-200 hover:bg-white text-sm sm:text-base"
                placeholder="Where did this happen?"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setStep(2)}
                className="bg-blue-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
              >
                <span>Continue</span>
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Additional Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Perpetrator Details (Optional)
              </label>
              <textarea
                className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-gray-50 transition-all duration-200 h-24 hover:bg-white text-sm sm:text-base"
                placeholder="Any details about the perpetrator that might be helpful..."
                value={formData.perpetratorDetails}
                onChange={(e) => handleInputChange('perpetratorDetails', e.target.value)}
              ></textarea>
            </div>
            
            <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
              <div className="flex items-start mb-2 sm:mb-3">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={formData.anonymous}
                    onChange={(e) => handleInputChange('anonymous', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="anonymous" className="font-medium text-xs sm:text-sm">
                    Submit this report anonymously
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Your identity will be kept confidential. However, providing contact details helps us follow up if needed.
                  </p>
                </div>
              </div>
              
              {!formData.anonymous && (
                <div className="space-y-2 sm:space-y-3 mt-2 sm:mt-3 pl-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Contact Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white transition-all duration-200 text-sm sm:text-base"
                      placeholder="Your phone number"
                      value={formData.contactPhone}
                      onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Contact Email (Optional)
                    </label>
                    <input
                      type="email"
                      className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none bg-white transition-all duration-200 text-sm sm:text-base"
                      placeholder="Your email address"
                      value={formData.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="border border-dashed border-gray-300 rounded-lg p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 relative cursor-pointer group">
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <div className="text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
                  <Upload className="text-blue-500" size={16} />
                </div>
                <p className="font-medium text-gray-700 text-xs sm:text-sm">Upload Evidence</p>
                <p className="text-xs text-gray-500 mt-1">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, PDF up to 10MB</p>
              </div>
              {formData.evidence && (
                <div className="mt-2 sm:mt-3 py-1.5 px-2 sm:py-2 sm:px-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
                  <p className="text-xs text-blue-700 font-medium truncate">
                    {formData.evidence.name}
                  </p>
                  <span className="text-xs bg-blue-600 text-white py-0.5 px-1.5 rounded-full">Selected</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between pt-2 sm:pt-3">
              <button
                onClick={() => setStep(1)}
                className="border border-gray-300 text-gray-700 px-3 sm:px-4 py-1.5 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Back</span>
              </button>
              <button
                onClick={handleContinue}
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Submit</span>
                    <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-0">
            <div className="bg-green-50 rounded-lg p-4 sm:p-6 text-center">
              <div className="flex items-center justify-center p-2 sm:p-3 rounded-full bg-green-100 w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-3 shadow-inner border border-green-200">
                <Shield className="text-green-600" size={20} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-1 sm:mb-2">Report Submitted</h3>
              <p className="text-green-700 text-sm sm:text-base mb-2 sm:mb-3">
                Thank you for your report. It has been submitted securely.
              </p>
            </div>
            
            {formData.category && (
              <Suspense fallback={<div className="text-center py-3 sm:py-4">Loading instructions...</div>}>
                <InstructionsComponent category={formData.category} />
              </Suspense>
            )}
            
            <div className="mt-3 sm:mt-4">
              <Suspense fallback={<div className="text-center py-3 sm:py-4">Loading response...</div>}>
                <ReportResponse reportId={submittedReport?.id} />
              </Suspense>
            </div>
          
            <div className="flex justify-center pt-2 sm:pt-3">
              <button
                onClick={resetForm}
                className="bg-blue-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Report Another Incident</span>
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
      <div className="bg-white rounded-lg">
        {step < 3 && (
          <div className="mb-4 sm:mb-6 px-3 sm:px-6 pt-3 sm:pt-6">
            <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 flex items-center">
              <Info className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-blue-600" />
              Report an Incident
            </h2>
            <div className="relative">
              <div className="flex items-center justify-between mb-2 sm:mb-3 relative z-10">
                {[1, 2].map((stepNumber) => (
                  <div key={stepNumber} className="flex flex-col items-center">
                    <div 
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mb-1 transition-all duration-300 ${
                        step >= stepNumber 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {stepNumber}
                    </div>
                    <span className={`text-xs font-medium ${step >= stepNumber ? 'text-blue-600' : 'text-gray-500'}`}>
                      {stepNumber === 1 ? 'Incident Details' : 'Additional Info'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute top-4 sm:top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ width: step === 1 ? '0%' : '100%' }}
                ></div>
              </div>
            </div>
          </div>
        )}
        
        {submitError && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-center text-xs sm:text-sm">
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 flex-shrink-0" />
            {submitError}
          </div>
        )}
        
        <div className="px-3 sm:px-6 pb-3 sm:pb-6">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}