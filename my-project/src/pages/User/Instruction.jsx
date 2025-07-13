import React, { useState, useEffect } from 'react';
import { AlertTriangle, LocateFixed, Info, ShieldAlert } from 'lucide-react';
import { API_BASE_URL } from './apiConfig';

export default function InstructionsComponent({ category }) {
    const [instructions, setInstructions] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        const fetchInstructions = async () => {
            if (!category) return;
            
            setIsLoading(true);
            setError(null);
            setShowError(false);
            
            try {
                const response = await fetch(`${API_BASE_URL}/instructions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ category })
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    let errorMessage = data.error || 'Failed to load instructions';
                    
                    switch (response.status) {
                        case 401:
                            errorMessage = "API authentication failed. Please contact support.";
                            break;
                        case 402:
                            errorMessage = "API usage limit reached. Please try again later.";
                            break;
                        case 429:
                            errorMessage = "Too many requests. Please try again later.";
                            break;
                        case 503:
                            errorMessage = "Service is currently unavailable. Please try again later.";
                            break;
                        default:
                            break;
                    }
                    
                    throw new Error(errorMessage);
                }
                
                setInstructions(data.instructions);
                
            } catch (err) {
                console.error("Error fetching instructions:", err);
                
                let errorMessage = err.message;
                
                if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
                    errorMessage = 'Network error. Please check your connection and try again.';
                }
                
                setError(errorMessage);
                setShowError(true);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchInstructions();
    }, [category]);

    const dismissError = () => {
        setShowError(false);
    };

    const instructionsList = instructions ? instructions.split('\n').filter(item => item.trim() !== '') : [];

    const renderErrorAlert = () => (
        <div className="mb-4 sm:mb-6 rounded-lg sm:rounded-xl bg-red-50/80 backdrop-blur-sm p-3 sm:p-4 border border-red-100 shadow-sm animate-fade-in">
            <div className="flex items-start gap-2 sm:gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                </div>
                <div className="flex-1 space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-red-900 font-medium">{error}</p>
                    <button 
                        onClick={dismissError}
                        className="text-xs font-medium text-red-600 hover:text-red-800 transition-colors px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-red-100 hover:bg-red-200"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        </div>
    );

    const renderLoadingState = () => (
        <div className="flex flex-col items-center justify-center py-6 sm:py-12 space-y-3 sm:space-y-4">
            <div className="relative">
                <div className="h-10 w-10 sm:h-14 sm:w-14 rounded-full border-2 border-indigo-100"></div>
                <div className="absolute top-0 left-0 h-10 w-10 sm:h-14 sm:w-14 rounded-full border-t-2 border-indigo-600 animate-spin"></div>
            </div>
            <p className="text-sm sm:text-base text-indigo-600 font-medium tracking-wide">Loading safety instructions...</p>
            <p className="text-xs sm:text-sm text-gray-500 max-w-xs text-center">Preparing the best safety practices for {category}</p>
        </div>
    );

    const renderErrorState = () => (
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border border-red-100 shadow-inner">
            <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center mb-3 sm:mb-4">
                <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <p className="text-xs sm:text-sm sm:text-base text-red-800 font-medium mb-2 sm:mb-3">Unable to load safety instructions</p>
            <button 
                onClick={() => setShowError(true)} 
                className="text-xs sm:text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg transition-colors"
            >
                Show details
            </button>
        </div>
    );

    const renderInstructionsList = () => (
        <div className="space-y-2 sm:space-y-3">
            {instructionsList.map((item, index) => (
                <div key={index} className="flex items-start group rounded-lg sm:rounded-xl p-3 sm:p-4 hover:bg-white transition-colors duration-200 shadow-sm hover:shadow-md bg-white/50 backdrop-blur-sm">
                    <div className="flex-shrink-0 bg-white border border-indigo-100 text-indigo-600 rounded-md sm:rounded-lg w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center mr-2 sm:mr-3 shadow-sm group-hover:shadow transition-all duration-200 font-medium sm:font-bold text-xs sm:text-sm">
                        {index + 1}
                    </div>
                    <div className="text-xs sm:text-sm sm:text-base text-gray-800 leading-relaxed font-medium">{item.replace(/^\d+\.\s*/, '')}</div>
                </div>
            ))}
        </div>
    );

    const renderNoInstructions = () => (
        <div className="text-center py-6 sm:py-8 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
            <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex items-center justify-center mb-3 sm:mb-4 text-gray-500">
                <Info className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">No safety instructions available for this category.</p>
            <p className="text-xs text-gray-500 mt-1">Please check back later or contact support</p>
        </div>
    );

    const renderEmergencyNotice = () => (
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200/70">
            <div className="flex items-start gap-2 sm:gap-3 bg-amber-50/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-amber-100">
                <div className="flex-shrink-0 mt-0.5">
                    <ShieldAlert className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                </div>
                <p className="text-xs sm:text-sm text-amber-900">
                    <strong className="font-semibold">Emergency notice:</strong> These are general recommendations. In case of immediate danger, please contact your local emergency services immediately.
                </p>
            </div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-indigo-600/10">
                    <Info className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                </div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Safety Instructions</h1>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg sm:shadow-xl border border-gray-100 overflow-hidden relative">
                {/* Decorative elements */}
                <div className="absolute -top-16 -right-16 sm:-top-20 sm:-right-20 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-indigo-100/50 blur-xl sm:blur-2xl"></div>
                <div className="absolute -bottom-16 -left-16 sm:-bottom-20 sm:-left-20 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-purple-100/50 blur-xl sm:blur-2xl"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-indigo-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                            Safety procedures for <span className="text-indigo-600">{category}</span>
                        </h3>
                    </div>
                    
                    {error && showError && renderErrorAlert()}
                    
                    {isLoading ? renderLoadingState() : 
                     error && !showError ? renderErrorState() : 
                     instructionsList.length > 0 ? renderInstructionsList() : 
                     renderNoInstructions()}
                    
                    {renderEmergencyNotice()}
                </div>
            </div>
        </div>
    );
}