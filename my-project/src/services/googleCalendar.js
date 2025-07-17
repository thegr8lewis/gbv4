import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export async function createGoogleMeetEvent(authToken, { psychologistEmail, clientEmail, startTime, endTime }) {
  const calendar = google.calendar({ version: 'v3', auth: authToken });

  const event = {
    summary: 'Psychology Session',
    description: `Session between psychologist ${psychologistEmail} and client ${clientEmail}`,
    start: {
      dateTime: startTime.toISOString(),
      timeZone: 'UTC',
    },
    end: {
      dateTime: endTime.toISOString(),
      timeZone: 'UTC',
    },
    conferenceData: {
      createRequest: {
        requestId: Math.random().toString(36).substring(7),
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
    attendees: [
      { email: psychologistEmail },
      { email: clientEmail },
    ],
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 },
        { method: 'popup', minutes: 10 },
      ],
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    });

    return {
      meetLink: response.data.hangoutLink,
      calendarEventId: response.data.id,
    };
  } catch (error) {
    console.error('Error creating Google Meet event:', error);
    throw error;
  }
}