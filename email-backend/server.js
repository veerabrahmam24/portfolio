const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/send', (req, res) => {
  const { from_email, from_name, subject, message } = req.body;

  const mailOptionsToSelf = {
    from: from_email,
    to: process.env.EMAIL_USER,
    subject: subject,
    text: `From: ${from_name}\nEmail: ${from_email}\n\n${message}`,
  };

  const mailOptionsToUser = {
    from: process.env.EMAIL_USER,
    to: from_email,
    subject: `Copy of your message: ${subject}`,
    text: `Hello ${from_name},\n\nThank you for reaching out!\n\n${message}\n\nBest regards,\n[Your Name]`,
  };

  transporter.sendMail(mailOptionsToSelf, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    transporter.sendMail(mailOptionsToUser, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).send('Emails sent: ' + info.response);
    });
  });
});

module.exports = app;
