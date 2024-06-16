import { readFileSync } from 'node:fs';
import { createTransport } from 'nodemailer';

import { User } from '@/server/modules/users/users.schema';
import { template } from '@/utils/template';

const { NUXT_BASE_URL, SENDGRID_FROM, SENDGRID_KEY } = process.env;

const mailer = createTransport({
  host: 'smtp.sendgrid.net',
  secure: true,
  port: 465,
  auth: {
    user: 'apikey',
    pass: SENDGRID_KEY,
  },
});

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await mailer.sendMail({
    from: SENDGRID_FROM,
    to: email,
    subject: '2FA Code',
    html: `<p>Your 2FA code: ${token}</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${NUXT_BASE_URL}/auth/new-password?token=${token}`;

  await mailer.sendMail({
    from: SENDGRID_FROM,
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
};

export const sendVerificationEmail = async ({
  email,
  token,
  user,
}: {
  email: string;
  token: string;
  user: User;
}) => {
  const html = readFileSync('./templates/email-confirmation.html', 'utf-8');
  const link = `${NUXT_BASE_URL}/auth/email-confirmation?token=${token}`;

  await mailer.sendMail({
    from: SENDGRID_FROM,
    to: email,
    subject: 'Confirm your email',
    html: template(html, { link, user }),
  });
};
