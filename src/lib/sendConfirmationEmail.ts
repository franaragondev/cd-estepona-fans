import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  name: "cdesteponafans.com",
});

export default async function sendConfirmationEmail(
  email: string,
  token: string
) {
  // Use your production domain and HTTPS in confirm URL
  const confirmUrl = `https://cdesteponafans.com/api/confirm?token=${token}`;

  const mailOptions = {
    from: '"CD Estepona Fans" <noreply@cdesteponafans.com>',
    to: email,
    subject: "Confirma tu suscripción",
    html: `
      <p>Gracias por suscribirte. Por favor, confirma tu email haciendo clic en el enlace:</p>
      <a href="${confirmUrl}">Confirmar suscripción</a>
      <p>Si no solicitaste esta suscripción, ignora este correo.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
}
