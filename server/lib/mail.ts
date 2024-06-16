import { createTransport } from 'nodemailer';

const baseUrl = process.env.NUXT_BASE_URL;

// const mailer = createTransport({
//   sendmail: true,
//   newline: 'unix',
//   path: '/usr/sbin/sendmail',
// });

const mailer = createTransport({
  host: 'smtp.sendgrid.net',
  secure: true,
  port: 465,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_KEY,
  },
});

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  const info = await mailer.sendMail({
    from: process.env.SENDGRID_FROM,
    to: email,
    subject: '2FA Code',
    html: `<p>Your 2FA code: ${token}</p>`,
  });

  console.log(info);
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${baseUrl}/auth/new-password?token=${token}`;

  const info = await mailer.sendMail({
    from: process.env.SENDGRID_FROM,
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });

  console.log(info);
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${baseUrl}/auth/new-verification?token=${token}`;

  const info = await mailer.sendMail({
    from: process.env.SENDGRID_FROM,
    to: email,
    subject: 'Confirm your email',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });

  console.log(info);
};
