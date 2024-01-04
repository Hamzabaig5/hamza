const sgMail = require('@sendgrid/mail');

const apiKey =
  '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';

sgMail.setApiKey(apiKey);

class NotificationService {
  static async sendEmail(email, subject, text) {
    try {
      const msg = {
        to: email,
        from: 'Hamzabaig56625@gmail.com', // Replace with your email address
        subject: subject,
        text: text,
      };

      await sgMail.send(msg);
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = NotificationService;
