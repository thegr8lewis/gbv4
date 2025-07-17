const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');

admin.initializeApp();

// Configure email transporter (using Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().gmail.email,
    pass: functions.config().gmail.password,
  },
});

// Google Calendar API setup
const oauth2Client = new google.auth.OAuth2(
  functions.config().google.client_id,
  functions.config().google.client_secret,
  functions.config().google.redirect_uri
);

oauth2Client.setCredentials({
  refresh_token: functions.config().google.refresh_token
});

const calendar = google.calendar({
  version: 'v3',
  auth: oauth2Client
});

// 1. Email Notification System
exports.sendBookingNotification = functions.firestore
  .document('bookings/{bookingId}')
  .onCreate(async (snap, context) => {
    const booking = snap.data();
    const psychologist = await admin.firestore()
      .collection('psychologists')
      .doc(booking.psychologistId)
      .get();

    const mailOptions = {
      from: 'Booking System <noreply@yourdomain.com>',
      to: booking.clientEmail,
      subject: `Your Appointment with ${psychologist.data().username}`,
      html: `
        <h2>Appointment Confirmed</h2>
        <p>Your session with ${psychologist.data().username} is scheduled for:</p>
        <p><strong>${booking.start.toDate().toLocaleString()}</strong></p>
        ${booking.meetLink ? `
          <p>Meeting Link: <a href="${booking.meetLink}">Join Google Meet</a></p>
        ` : ''}
        <p>Contact: ${psychologist.data().phoneNumber || 'No phone provided'}</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Confirmation email sent to:', booking.clientEmail);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  });

// 2. Psychologist Verification
exports.verifyPsychologist = functions.https
  .onCall(async (data, context) => {
    if (!context.auth.token.admin) {
      throw new functions.https.HttpsError(
        'permission-denied', 
        'Only admins can verify psychologists'
      );
    }

    await admin.firestore()
      .collection('psychologists')
      .doc(data.userId)
      .update({
        verified: true,
        verifiedAt: admin.firestore.FieldValue.serverTimestamp()
      });

    return { success: true };
  });

// 3. Google Meet Link Generator
exports.generateMeetLink = functions.https
  .onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated', 
        'Authentication required'
      );
    }

    try {
      const event = {
        summary: 'Psychology Session',
        start: { dateTime: data.startTime, timeZone: 'UTC' },
        end: { dateTime: data.endTime, timeZone: 'UTC' },
        conferenceData: {
          createRequest: {
            requestId: context.auth.uid + Date.now(),
            conferenceSolutionKey: { type: 'hangoutsMeet' }
          }
        }
      };

      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
        conferenceDataVersion: 1
      });

      return {
        meetLink: response.data.hangoutLink,
        eventId: response.data.id
      };
    } catch (error) {
      console.error('Google Calendar error:', error);
      throw new functions.https.HttpsError(
        'internal', 
        'Failed to create meeting'
      );
    }
  });

// 4. Data Validation
exports.validateProfile = functions.firestore
  .document('psychologists/{userId}')
  .onWrite(async (change, context) => {
    const data = change.after.data();
    
    if (data.username.length < 3) {
      await change.after.ref.update({
        username: admin.firestore.FieldValue.delete()
      });
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Username must be at least 3 characters'
      );
    }

    if (data.bio && data.bio.length > 500) {
      await change.after.ref.update({
        bio: data.bio.substring(0, 500)
      });
    }
  });