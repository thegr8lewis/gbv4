
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, Calendar, Clock, Mail, Phone, Award, 
  MessageCircle, CheckCircle, ArrowLeft, ExternalLink, X 
} from 'lucide-react';
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';

const API_BASE_URL = 'http://localhost:8000';

function PsychologistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [psychologist, setPsychologist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [bookingForm, setBookingForm] = useState({ 
    contact_email: '', 
    contact_phone: '' 
  });
  const [reviewForm, setReviewForm] = useState({ 
    rating: 5, 
    comment: '' 
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Snackbar states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' // 'error', 'warning', 'info', 'success'
  });
  
  // Dialog states
  const [dialog, setDialog] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const fetchPsychologist = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/psychologists/${id}/`);
      if (!response.ok) {
        throw new Error('Failed to fetch psychologist');
      }
      const data = await response.json();
      setPsychologist(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching psychologist:', err);
      showSnackbar(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPsychologist();
  }, [id]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const showDialog = (title, message, onConfirm) => {
    setDialog({
      open: true,
      title,
      message,
      onConfirm
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleCloseDialog = () => {
    setDialog(prev => ({ ...prev, open: false }));
  };

  const handleBookingSubmit = async (availabilityId) => {
  if (!bookingForm.contact_email) {
    showSnackbar('Please provide your email address', 'error');
    return;
  }

  setIsSubmitting(true);
  try {
    const response = await fetch(`${API_BASE_URL}/api/bookings/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify({
        contact_email: bookingForm.contact_email,
        contact_phone: bookingForm.contact_phone || null,
        psychologist: psychologist.id,
        availability: availabilityId,
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'Booking failed');
    }

    showSnackbar(
      'Booking confirmed! Check your email for the Google Meet link. ' +
      'If you don\'t see it, please check your spam folder.',
      'success'
    );
    
    setBookingForm({ contact_email: '', contact_phone: '' });
    setSelectedTimeSlot(null);
    fetchPsychologist();
    
    // Optional: Show the meet link immediately in a dialog
    setDialog({
      open: true,
      title: 'Booking Confirmed',
      message: `Your Google Meet link: ${data.google_meet_link}`,
      onConfirm: null
    });
    
  } catch (err) {
    console.error('Booking error:', err);
    showSnackbar(
      `Booking failed: ${err.message}. Please try again or contact support.`,
      'error'
    );
  } finally {
    setIsSubmitting(false);
  }
};

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.comment.trim()) {
      showSnackbar('Please write a review comment', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          rating: reviewForm.rating,
          comment: reviewForm.comment,
          psychologist: psychologist.id,
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        // Handle validation errors from server
        if (data.rating) {
          throw new Error(data.rating.join(' '));
        }
        if (data.comment) {
          throw new Error(data.comment.join(' '));
        }
        throw new Error(data.detail || 'Review submission failed');
      }

      showSnackbar('Review submitted successfully!', 'success');
      setReviewForm({ rating: 5, comment: '' });
      // Refresh psychologist data to show new review
      fetchPsychologist();
    } catch (err) {
      console.error('Review submission error:', err);
      showSnackbar(`Failed to submit review: ${err.message}`, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <span className="text-red-600">⚠</span>
            </div>
            <div>
              <h3 className="font-semibold">Error loading psychologist</h3>
              <p className="text-sm">{error}</p>
              <button 
                onClick={() => navigate('/')}
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!psychologist) {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="bg-white rounded-xl p-6 shadow-xs border border-gray-100">
          <div className="text-gray-700 mb-4">Psychologist not found</div>
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Back to List
          </button>
        </div>
      </div>
    );
  }

  const availableSlots = psychologist.availabilities?.filter(a => !a.is_booked) || [];
  const averageRating = psychologist.reviews?.length > 0 
    ? (psychologist.reviews.reduce((sum, r) => sum + r.rating, 0) / psychologist.reviews.length).toFixed(1)
    : 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Star },
    { id: 'availability', label: 'Book Session', icon: Calendar },
    { id: 'reviews', label: 'Reviews', icon: MessageCircle },
    { id: 'qualifications', label: 'Credentials', icon: Award },
  ];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
      {/* Snackbar for notifications */}
<Snackbar
  open={snackbar.open}
  autoHideDuration={6000}
  onClose={handleCloseSnackbar}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  sx={{
    '&.MuiSnackbar-root': {
      bottom: 'calc(20px + 60px)', // 20px padding + navbar height (60px)
    }
  }}
>
  <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
    {snackbar.message}
  </Alert>
</Snackbar>

      {/* Confirmation Dialog */}
      <Dialog
        open={dialog.open}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialog.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={() => {
              if (dialog.onConfirm) dialog.onConfirm();
              handleCloseDialog();
            }} 
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rest of your component */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-500 opacity-10 rounded-full scale-150 translate-x-1/2 -translate-y-1/4"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <button 
                onClick={() => navigate('/')}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <ArrowLeft size={20} />
              </button>
              <button 
                onClick={() => navigate('/')}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-xl">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/30 rounded-full flex items-center justify-center">
                  <span className="text-xl sm:text-2xl font-bold">
                    {psychologist.user?.first_name?.[0]}{psychologist.user?.last_name?.[0]}
                  </span>
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
                  {psychologist.user?.first_name} {psychologist.user?.last_name}
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white/90 text-sm sm:text-base">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{psychologist.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} />
                    <span>{psychologist.specialization}</span>
                  </div>
                  {psychologist.reviews?.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      <span>{averageRating} ({psychologist.reviews.length} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">About</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{psychologist.bio}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-5 shadow-xs">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
                    <Star size={16} className="mr-2 text-blue-600" />
                    Specialization
                  </h3>
                  <p className="text-gray-700 text-sm sm:text-base">{psychologist.specialization}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 sm:p-5 shadow-xs">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
                    <Clock size={16} className="mr-2 text-purple-600" />
                    Session Rates
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {psychologist.rate_cards?.map(r => (
                      <div key={r.id} className="bg-white/80 p-2 sm:p-3 rounded-lg shadow-xs">
                        <p className="font-medium text-gray-800 text-sm sm:text-base">{r.session_type}</p>
                        <p className="text-xs sm:text-sm text-gray-600">${r.price} • {r.duration_minutes} minutes</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'availability' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Book a Session</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">
                  Choose an available time slot and provide your contact information.
                </p>
              </div>

              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {availableSlots.map(slot => (
                    <div 
                      key={slot.id} 
                      className={`border-2 rounded-lg p-3 sm:p-4 transition-all cursor-pointer ${
                        selectedTimeSlot === slot.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTimeSlot(slot.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm sm:text-base">
                            {new Date(slot.start_time).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                          <p className="text-gray-600 text-xs sm:text-sm">
                            {new Date(slot.start_time).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })} - {new Date(slot.end_time).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                        {selectedTimeSlot === slot.id && (
                          <CheckCircle size={16} className="text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Calendar size={32} className="text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-500 text-sm sm:text-base">No available time slots at the moment</p>
                </div>
              )}

              {selectedTimeSlot && (
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5 mt-4 sm:mt-6">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Contact Information</h4>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="relative">
                      <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        placeholder="Your email address"
                        value={bookingForm.contact_email}
                        onChange={(e) => setBookingForm({...bookingForm, contact_email: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                        required
                      />
                    </div>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        placeholder="Phone number (optional)"
                        value={bookingForm.contact_phone}
                        onChange={(e) => setBookingForm({...bookingForm, contact_phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      />
                    </div>
                    <button
                      onClick={() => handleBookingSubmit(selectedTimeSlot)}
                      disabled={isSubmitting || !bookingForm.contact_email}
                      className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 text-white py-2 sm:py-3 px-4 sm:px-5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center text-sm sm:text-base"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent"></div>
                      ) : (
                        <>
                          <CheckCircle size={16} className="mr-1 sm:mr-2" />
                          Confirm Booking
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Reviews & Ratings</h3>
                {psychologist.reviews?.length > 0 && (
                  <div className="flex items-center gap-2 mb-4 sm:mb-5">
                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-base sm:text-lg font-semibold">{averageRating}</span>
                    <span className="text-gray-600 text-sm sm:text-base">({psychologist.reviews.length} reviews)</span>
                  </div>
                )}
              </div>

              {psychologist.reviews?.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {psychologist.reviews.map(review => (
                    <div key={review.id} className="bg-gray-50 rounded-xl p-4 sm:p-5">
                      <div className="flex items-center gap-1 mb-2 sm:mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                          />
                        ))}
                        <span className="ml-2 text-xs sm:text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <MessageCircle size={32} className="text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-500 text-sm sm:text-base">No reviews yet</p>
                </div>
              )}

              {/* Leave Review Form */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 sm:p-5 mt-4 sm:mt-6">
                <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Leave a Review</h4>
                <form onSubmit={handleReviewSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Rating</label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({...reviewForm, rating: star})}
                          className="transition-colors"
                        >
                          <Star 
                            size={20} 
                            className={star <= reviewForm.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-gray-600 text-sm sm:text-base">
                        {reviewForm.rating} star{reviewForm.rating !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1 sm:mb-2">Your Review</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({...reviewForm, comment: e.target.value})}
                      placeholder="Share your experience..."
                      className="w-full p-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      rows="4"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-2 sm:py-3 px-4 sm:px-5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-white border-t-transparent mr-1 sm:mr-2"></div>
                    ) : (
                      <MessageCircle size={16} className="mr-1 sm:mr-2" />
                    )}
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'qualifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Professional Qualifications</h3>
                <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6">Verified credentials and certifications</p>
              </div>

              {psychologist.qualifications?.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {psychologist.qualifications.map(qualification => (
                    <div key={qualification.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 sm:p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-1 sm:mb-2">{qualification.title}</h4>
                          <p className="text-gray-600 text-sm sm:text-base mb-1">{qualification.institution}</p>
                          <p className="text-xs sm:text-sm text-gray-500">Year: {qualification.year_obtained}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-green-100 p-1 sm:p-2 rounded-full">
                            <Award size={14} className="text-green-600" />
                          </div>
                          {qualification.document && (
                            <a 
                              href={qualification.document} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 transition-colors"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Award size={32} className="text-gray-400 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-500 text-sm sm:text-base">No qualifications listed</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PsychologistDetail;