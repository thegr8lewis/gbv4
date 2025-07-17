import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Tabs,
  Tab,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  Snackbar,
  Paper,
  Select,
  MenuItem,
  InputLabel,
  FormControl
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';

const API_BASE_URL = 'http://localhost:8000';

function PsychologistDashboard() {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState(null);
  const [qualifications, setQualifications] = useState([]);
  const [rateCards, setRateCards] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    bio: '',
    location: '',
    specialization: '',
    years_of_experience: '',
    languages: '',
    therapy_approach: '',
    hourly_rate: '',
    license_number: '',
    phone_number: ''
  });

  const [qualificationForm, setQualificationForm] = useState({
    title: '',
    institution: '',
    year_obtained: '',
    document: null
  });

  const [rateCardForm, setRateCardForm] = useState({
    session_type: '',
    price: '',
    duration_minutes: ''
  });

  // Check if user has psychologist profile
  useEffect(() => {
    const checkProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/psychologists/`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('auth_token')}`
          }
        });
        
        if (response.data && response.data.length > 0) {
          const profileData = response.data[0];
          setProfile(profileData);
          setProfileForm({
            first_name: profileData.user?.first_name || '',
            last_name: profileData.user?.last_name || '',
            gender: profileData.user?.gender || '',
            bio: profileData.bio || '',
            location: profileData.location || '',
            specialization: profileData.specialization || '',
            years_of_experience: profileData.years_of_experience || '',
            languages: profileData.languages || '',
            therapy_approach: profileData.therapy_approach || '',
            hourly_rate: profileData.hourly_rate || '',
            license_number: profileData.license_number || '',
            phone_number: profileData.phone_number || ''
          });
          await fetchData();
        } else {
          setProfile(null);
        }
      } catch (err) {
        setError('Failed to check psychologist profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    checkProfile();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [qualsRes, ratesRes, availRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/qualifications/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('auth_token')}` }
        }),
        axios.get(`${API_BASE_URL}/api/rate-cards/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('auth_token')}` }
        }),
        axios.get(`${API_BASE_URL}/api/availabilities/`, {
          headers: { 'Authorization': `Token ${localStorage.getItem('auth_token')}` }
        })
      ]);
      
      // Ensure we always set arrays
      setQualifications(Array.isArray(qualsRes?.data) ? qualsRes.data : []);
      setRateCards(Array.isArray(ratesRes?.data) ? ratesRes.data : []);
      setAvailabilities(Array.isArray(availRes?.data) ? availRes.data : []);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
      // Reset to empty arrays on error
      setQualifications([]);
      setRateCards([]);
      setAvailabilities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE_URL}/api/psychologists/`, profileForm, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });
      setProfile(response.data);
      setSnackbar({ 
        open: true, 
        message: 'Profile created successfully', 
        severity: 'success' 
      });
      await fetchData();
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || 'Failed to create profile', 
        severity: 'error' 
      });
      console.error(err);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`${API_BASE_URL}/api/psychologists/${profile.id}/`, profileForm, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });
      setProfile(response.data);
      setSnackbar({ 
        open: true, 
        message: 'Profile updated successfully', 
        severity: 'success' 
      });
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || 'Failed to update profile', 
        severity: 'error' 
      });
      console.error(err);
    }
  };

  const handleQualificationSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', qualificationForm.title);
    formData.append('institution', qualificationForm.institution);
    formData.append('year_obtained', qualificationForm.year_obtained);
    if (qualificationForm.document) {
      formData.append('document', qualificationForm.document);
    }

    try {
      await axios.post(`${API_BASE_URL}/api/qualifications/`, formData, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSnackbar({ 
        open: true, 
        message: 'Qualification added successfully', 
        severity: 'success' 
      });
      setQualificationForm({
        title: '',
        institution: '',
        year_obtained: '',
        document: null
      });
      await fetchData();
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || 'Failed to add qualification', 
        severity: 'error' 
      });
      console.error(err);
    }
  };

  const handleRateCardSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/api/rate-cards/`, rateCardForm, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });
      setSnackbar({ 
        open: true, 
        message: 'Rate card added successfully', 
        severity: 'success' 
      });
      setRateCardForm({
        session_type: '',
        price: '',
        duration_minutes: ''
      });
      await fetchData();
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || 'Failed to add rate card', 
        severity: 'error' 
      });
      console.error(err);
    }
  };

  const handleDateSelect = async (selectInfo) => {
    try {
      await axios.post(`${API_BASE_URL}/api/availabilities/`, {
        start_time: selectInfo.startStr,
        end_time: selectInfo.endStr
      }, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      });
      setSnackbar({ 
        open: true, 
        message: 'Availability added successfully', 
        severity: 'success' 
      });
      await fetchData();
    } catch (err) {
      setSnackbar({ 
        open: true, 
        message: err.response?.data?.message || 'Failed to add availability', 
        severity: 'error' 
      });
      console.error(err);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading && !profile) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return (
      <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Create Psychologist Profile
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Please complete your professional profile to start using the platform.
          </Typography>
          
          <form onSubmit={handleProfileSubmit}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                value={profileForm.first_name}
                onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Last Name"
                value={profileForm.last_name}
                onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                margin="normal"
                required
              />
            </Box>

            <FormControl fullWidth margin="normal">
              <InputLabel>Gender</InputLabel>
              <Select
                value={profileForm.gender}
                label="Gender"
                onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                required
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
                <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={4}
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Location"
              value={profileForm.location}
              onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
              margin="normal"
              required
            />
            
            <TextField
              fullWidth
              label="Specialization"
              value={profileForm.specialization}
              onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Years of Experience"
              type="number"
              value={profileForm.years_of_experience}
              onChange={(e) => setProfileForm({ ...profileForm, years_of_experience: e.target.value })}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Languages (comma separated)"
              value={profileForm.languages}
              onChange={(e) => setProfileForm({ ...profileForm, languages: e.target.value })}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Therapy Approach"
              multiline
              rows={3}
              value={profileForm.therapy_approach}
              onChange={(e) => setProfileForm({ ...profileForm, therapy_approach: e.target.value })}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Hourly Rate ($)"
              type="number"
              value={profileForm.hourly_rate}
              onChange={(e) => setProfileForm({ ...profileForm, hourly_rate: e.target.value })}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="License Number"
              value={profileForm.license_number}
              onChange={(e) => setProfileForm({ ...profileForm, license_number: e.target.value })}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Phone Number"
              value={profileForm.phone_number}
              onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
              margin="normal"
              required
            />
            
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" color="primary">
                Create Profile
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Profile" />
          <Tab label="Qualifications" />
          <Tab label="Rate Cards" />
          <Tab label="Availability" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Profile
            </Typography>
            <form onSubmit={handleProfileUpdate}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={profileForm.first_name}
                  onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  value={profileForm.last_name}
                  onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
                  margin="normal"
                  required
                />
              </Box>

              <FormControl fullWidth margin="normal">
                <InputLabel>Gender</InputLabel>
                <Select
                  value={profileForm.gender}
                  label="Gender"
                  onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                  required
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                  <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Bio"
                multiline
                rows={4}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Location"
                value={profileForm.location}
                onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Specialization"
                value={profileForm.specialization}
                onChange={(e) => setProfileForm({ ...profileForm, specialization: e.target.value })}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Years of Experience"
                type="number"
                value={profileForm.years_of_experience}
                onChange={(e) => setProfileForm({ ...profileForm, years_of_experience: e.target.value })}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Languages (comma separated)"
                value={profileForm.languages}
                onChange={(e) => setProfileForm({ ...profileForm, languages: e.target.value })}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Therapy Approach"
                multiline
                rows={3}
                value={profileForm.therapy_approach}
                onChange={(e) => setProfileForm({ ...profileForm, therapy_approach: e.target.value })}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Hourly Rate ($)"
                type="number"
                value={profileForm.hourly_rate}
                onChange={(e) => setProfileForm({ ...profileForm, hourly_rate: e.target.value })}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="License Number"
                value={profileForm.license_number}
                onChange={(e) => setProfileForm({ ...profileForm, license_number: e.target.value })}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Phone Number"
                value={profileForm.phone_number}
                onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                margin="normal"
                required
              />
              
              <Box sx={{ mt: 2 }}>
                <Button type="submit" variant="contained" color="primary">
                  Update Profile
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add New Qualification
            </Typography>
            <form onSubmit={handleQualificationSubmit}>
              <TextField
                fullWidth
                label="Title"
                value={qualificationForm.title}
                onChange={(e) => setQualificationForm({ ...qualificationForm, title: e.target.value })}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Institution"
                value={qualificationForm.institution}
                onChange={(e) => setQualificationForm({ ...qualificationForm, institution: e.target.value })}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Year Obtained"
                type="number"
                value={qualificationForm.year_obtained}
                onChange={(e) => setQualificationForm({ ...qualificationForm, year_obtained: e.target.value })}
                margin="normal"
                required
              />
              
              <input
                type="file"
                onChange={(e) => setQualificationForm({ ...qualificationForm, document: e.target.files[0] })}
                style={{ margin: '16px 0' }}
              />
              
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
                Add Qualification
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Qualifications
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : qualifications.length > 0 ? (
              <List>
                {qualifications.map((qual) => (
                  <React.Fragment key={qual.id}>
                    <ListItem>
                      <ListItemText
                        primary={qual.title}
                        secondary={`${qual.institution} (${qual.year_obtained})`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No qualifications added yet.
              </Typography>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add New Rate Card
            </Typography>
            <form onSubmit={handleRateCardSubmit}>
              <TextField
                fullWidth
                label="Session Type"
                value={rateCardForm.session_type}
                onChange={(e) => setRateCardForm({ ...rateCardForm, session_type: e.target.value })}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={rateCardForm.price}
                onChange={(e) => setRateCardForm({ ...rateCardForm, price: e.target.value })}
                margin="normal"
                required
              />
              
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={rateCardForm.duration_minutes}
                onChange={(e) => setRateCardForm({ ...rateCardForm, duration_minutes: e.target.value })}
                margin="normal"
                required
              />
              
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 1 }}>
                Add Rate Card
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Rate Cards
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : rateCards.length > 0 ? (
              <List>
                {rateCards.map((rate) => (
                  <React.Fragment key={rate.id}>
                    <ListItem>
                      <ListItemText
                        primary={rate.session_type}
                        secondary={`$${rate.price} for ${rate.duration_minutes} minutes`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No rate cards added yet.
              </Typography>
            )}
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Set Your Availability
            </Typography>
            {loading ? (
              <CircularProgress />
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <Box sx={{ mt: 2 }}>
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  selectable={true}
                  select={handleDateSelect}
                  events={availabilities.map(a => ({
                    title: a.is_booked ? 'Booked' : 'Available',
                    start: a.start_time,
                    end: a.end_time,
                    backgroundColor: a.is_booked ? 'red' : 'green',
                  }))}
                  height="auto"
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default PsychologistDashboard;