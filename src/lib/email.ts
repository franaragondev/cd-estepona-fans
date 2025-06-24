import prisma from "@/lib/prisma";
import { sendEmail } from "./sendEmail";

export async function notifySubscribersOfNewPost(newsId: string) {
  const subscribers = await prisma.subscriber.findMany();

  if (!subscribers || subscribers.length === 0) {
    console.warn("⚠️ No hay suscriptores en la base de datos");
    return;
  }

  const news = await prisma.news.findUnique({
    where: { id: newsId },
  });

  if (!news) {
    console.warn(`⚠️ No se encontró la noticia con ID ${newsId}`);
    return;
  }

  const excerpt =
    news.content.length > 120
      ? news.content.slice(0, 120) + "..."
      : news.content;

  const url = `https://cdesteponafans.com/noticias/${news.slug}`;
  const subject = `📰 Nueva noticia: ${news.title}`;

  const html = `
    <body style="margin:0; padding:0; background-color:#f4f7fa; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#333;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f4f7fa;">
        <tr>
          <td align="center" style="padding:30px 10px;">
            <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background:#ffffff; border-radius:12px; box-shadow:0px 4px 18px rgba(0,0,0,0.1); overflow:hidden;">
              <tr>
                <td align="center" style="padding:25px;" bgcolor="#f4f7fa">
                  <img src="https://cdesteponafans.com/logo.png" alt="CD Estepona Fans" style="max-width:180px;" />
                </td>
              </tr>
              <tr>
                <td style="padding:15px 30px; text-align:center;">
                  <h1 style="margin:0; font-size:26px; font-weight:600; color:#2c3e50;">
                    ${news.title}
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="padding:15px 40px; font-size:16px; line-height:1.6; color:#555;">
                  ${excerpt}
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:25px 30px;">
                  <a href="${url}" style="
                      font-size:16px;
                      font-weight:600;
                      text-decoration:none;
                      padding:14px 28px;
                      color:#ffffff;
                      background-color:#0070f3;
                      border-radius:30px;
                      display:inline-block;">
                    Leer noticia completa →
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 30px; font-size:12px; color:#999; text-align:center;">
                  Si no deseas recibir estos correos, simplemente ignora este mensaje.
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:10px 30px; font-size:12px; color:#bbb;">
                  &copy; 2025 CD Estepona Fans. Todos los derechos reservados.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  `;

  const batchSize = 10;
  const delayMs = 5000;

  for (let i = 0; i < subscribers.length; i += batchSize) {
    const batch = subscribers.slice(i, i + batchSize);

    await Promise.all(
      batch.map(async (subscriber) => {
        try {
          await sendEmail({
            to: subscriber.email,
            subject,
            html,
          });
          console.log(`✅ Email enviado a ${subscriber.email}`);
        } catch (error) {
          console.error(
            `❌ Error enviando email a ${subscriber.email}:`,
            error
          );
        }
      })
    );

    if (i + batchSize < subscribers.length) {
      console.log(`Esperando ${delayMs / 1000}s antes del siguiente batch...`);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}
