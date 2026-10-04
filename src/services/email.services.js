
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});



// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


async function sendWelcomeEmail(userEmail, name) {
    const subject = 'Welcome to Our Service!';
    const text = `Hello, ${name}! Welcome to our service.`;
    const html = `<h1>Hello, ${name}!</h1><p>Welcome to our service.</p>`;
    await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionEmail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Notification';
    const text = `Hello, ${name}! You have received a transaction of ${amount} to ${toAccount}.`;
    const html = `<h1>Hello, ${name}!</h1><p>You have received a transaction of ${amount} to ${toAccount}.</p>`;
    await sendEmail(userEmail, subject, text, html);
}

module.exports = {sendWelcomeEmail,sendTransactionEmail};
