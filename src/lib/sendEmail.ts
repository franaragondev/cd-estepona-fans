import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

type SendEmailParams = {
  to: string | string[];
  subject: string;
  html: string;
  bcc?: string | string[];
};

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  await transporter.sendMail({
    from: '"CD Estepona Fans" <noreply@cdesteponafans.com>',
    to,
    subject,
    html,
  });
}
