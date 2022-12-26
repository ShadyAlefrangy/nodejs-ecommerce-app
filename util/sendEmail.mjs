import nodemailer from "nodemailer";
/* eslint-disable import/prefer-default-export */
export const sendEmail = async (options) => {
  // 1. Create transporter for sending email such as (Gmail, Mailtrap)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  // 2. Define email options like (from, to, content, subject)
  const emailOptions = {
    from: "E-commerce App <example@example.com>",
    to: options.to,
    subject: options.subject,
    text: options.body,
  };
  // 3. Send Email
  await transporter.sendMail(emailOptions);
};
