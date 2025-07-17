import { functions } from '/src/Firebase';

export async function sendBookingConfirmation({ to, psychologistName, startTime, endTime, meetLink }) {
  // In a real app, you would use Firebase Cloud Functions or a service like SendGrid


  // In production, you would call a Firebase Cloud Function:
  
  const sendEmail = httpsCallable(functions, 'sendEmail');
  try {
    await sendEmail({
      to,
      subject: `Your appointment with ${psychologistName}`,
      text: `Your appointment is scheduled for ${startTime.toLocaleString()}. Meeting link: ${meetLink}`,
      html: `<p>Your appointment with ${psychologistName} is scheduled for ${startTime.toLocaleString()}.</p>
             <p><a href="${meetLink}">Join Meeting</a></p>`,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
  
}