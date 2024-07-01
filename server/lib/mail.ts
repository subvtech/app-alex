import { readFileSync } from 'node:fs';
import { createTransport } from 'nodemailer';

import { template } from '../../utils/template';
import { User } from '../modules/users/users.schema';

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

// TODO: Limitar o envio de e-mails por X horas.
export const sendResetPasswordEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const html = readFileSync('./templates/reset-password.html', 'utf-8');
  const link = `${NUXT_BASE_URL}/auth/reset-password?token=${token}`;

  await mailer.sendMail({
    from: SENDGRID_FROM,
    to: email,
    subject: 'Redefinição de senha', // TODO: I18n
    html: template(html, { link }),
  });
};

// TODO: Limitar o envio de e-mails por X horas.
export const sendConfirmationEmail = async ({
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
    subject: 'Confirmação de e-mail', // TODO: I18n
    html: template(html, { link, user }),
  });
};
