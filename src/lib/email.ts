import prisma from "@/lib/prisma";
import { sendEmail } from "./sendEmail";

export async function notifySubscribersOfNewPost(newsId: string) {
  const subscribers = await prisma.subscriber.findMany();

  if (!subscribers || subscribers.length === 0) {
    console.warn("⚠️ No hay suscriptores en la base de datos");
    return;
  }

  const news = await prisma.news.findUnique({ where: { id: newsId } });
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
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8" /></head>
    <body style="margin:0; padding:0; background-color:#f9fafb; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#2c3e50; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
      <div style="background-color:#f9fafb; padding:40px 10px; text-align:center;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background:#ffffff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.07); overflow:hidden; margin:0 auto; border:1px solid #e3e8ee;">
          <tr>
            <td style="background:#ffffff; padding:30px 0 20px; text-align:center;">
              <img src="https://cdesteponafans.com/logo.png" alt="CD Estepona Fans" style="max-width:150px; filter:drop-shadow(0 0 3px rgba(0,0,0,0.05));" />
            </td>
          </tr>
          <tr>
            <td>
              <h1 style="font-size:28px; font-weight:700; color:#1a1a1a; margin:0 30px 20px; letter-spacing:0.02em;">${news.title}</h1>
            </td>
          </tr>
          <tr>
            <td style="font-size:16px; line-height:1.6; color:#4a5568; padding:0 40px 30px; margin:0 auto; max-width:520px;">
              ${excerpt}
            </td>
          </tr>
          <tr>
            <td>
              <hr style="height:1px; background:#e3e8ee; margin:0 40px 30px; border:none;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <a href="${url}" style="font-size:16px; font-weight:600; text-decoration:none; padding:14px 36px; color:#ffffff; background-color:#344e86; border-radius:30px; display:inline-block; box-shadow:0 8px 20px rgba(52,78,134,0.25); transition:background-color 0.3s ease;">
                Leer noticia completa →
              </a>
            </td>
          </tr>
          <tr>
            <td style="font-size:13px; color:#a0aec0; text-align:center; padding:0 40px 10px; line-height:1.4; max-width:520px; margin:0 auto 10px;">
              Si no deseas recibir estos correos, simplemente ignora este mensaje.
            </td>
          </tr>
          <tr>
            <td style="font-size:12px; color:#cbd5e0; padding:0 40px 30px; max-width:520px; margin:0 auto; text-align:center;">
              &copy; 2025 CD Estepona Fans. Todos los derechos reservados.
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;

  const delayMs = 1000;

  for (const subscriber of subscribers) {
    try {
      await sendEmail({
        to: subscriber.email,
        subject,
        html,
      });
    } catch (error) {
      console.error(error);
    }
    await new Promise((res) => setTimeout(res, delayMs));
  }
}

export async function notifySubscribersOfMatchUpdate(
  match: any,
  isUpdate: boolean
) {
  const subscribers = await prisma.subscriber.findMany();

  if (!subscribers || subscribers.length === 0) {
    console.warn("⚠️ No hay suscriptores para enviar email");
    return;
  }

  const url = "https://www.cdesteponafans.com/es/partidos";
  const subject = isUpdate
    ? "⚽️ Partido actualizado del CD Estepona"
    : "⚽️ Nuevo partido añadido al calendario del CD Estepona";

  const matchDate = new Date(match.date);
  const hours = matchDate.getHours();
  const minutes = matchDate.getMinutes();

  const dateFormatted =
    hours === 0 && minutes === 0
      ? matchDate.toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })
      : matchDate.toLocaleString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZoneName: "short",
        });

  const homeTeam = match.isHome ? "CD Estepona" : match.team.name;
  const awayTeam = match.isHome ? match.team.name : "CD Estepona";
  const location = match.isHome
    ? "Estadio Francisco Muñoz Pérez"
    : match.team.location ?? "Ubicación no disponible";

  const excerpt = isUpdate
    ? `Se han actualizado los detalles del partido ${homeTeam} vs ${awayTeam} el ${dateFormatted}.`
    : `Se ha añadido un nuevo partido: ${homeTeam} vs ${awayTeam} el ${dateFormatted}.`;

  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head><meta charset="UTF-8" /></head>
    <body style="margin:0; padding:0; background-color:#f9fafb; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#2c3e50; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
      <div style="background-color:#f9fafb; padding:40px 10px; text-align:center;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="600" style="background:#ffffff; border-radius:16px; box-shadow:0 4px 24px rgba(0,0,0,0.07); overflow:hidden; margin:0 auto; border:1px solid #e3e8ee;">
          <tr>
            <td style="background:#ffffff; padding:30px 0 20px; text-align:center;">
              <img src="https://cdesteponafans.com/logo.png" alt="CD Estepona Fans" style="max-width:150px; filter:drop-shadow(0 0 3px rgba(0,0,0,0.05));" />
            </td>
          </tr>
          <tr>
            <td>
              <h1 style="font-size:28px; font-weight:700; color:#1a1a1a; margin:0 30px 20px; letter-spacing:0.02em;">${
                isUpdate ? "Partido actualizado" : "Nuevo partido añadido"
              }</h1>
            </td>
          </tr>
          <tr>
            <td style="font-size:16px; line-height:1.6; color:#4a5568; padding:0 40px 30px; margin:0 auto; max-width:520px;">
              <p>${excerpt}</p>
              <p><strong>Fecha:</strong> ${dateFormatted}</p>
              <p><strong>Competición:</strong> ${match.competition}</p>
              <p><strong>Lugar:</strong> ${location}</p>
            </td>
          </tr>
          <tr>
            <td>
              <hr style="height:1px; background:#e3e8ee; margin:0 40px 30px; border:none;" />
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:40px;">
              <a href="${url}" style="font-size:16px; font-weight:600; text-decoration:none; padding:14px 36px; color:#ffffff; background-color:#344e86; border-radius:30px; display:inline-block; box-shadow:0 8px 20px rgba(52,78,134,0.25); transition:background-color 0.3s ease;">
                Ver todos los partidos →
              </a>
            </td>
          </tr>
          <tr>
            <td style="font-size:13px; color:#a0aec0; text-align:center; padding:0 40px 10px; line-height:1.4; max-width:520px; margin:0 auto 10px;">
              Si no deseas recibir estos correos, simplemente ignora este mensaje.
            </td>
          </tr>
          <tr>
            <td style="font-size:12px; color:#cbd5e0; padding:0 40px 30px; max-width:520px; margin:0 auto; text-align:center;">
              &copy; 2025 CD Estepona Fans. Todos los derechos reservados.
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;

  const delayMs = 1000;

  for (const subscriber of subscribers) {
    try {
      await sendEmail({
        to: subscriber.email,
        subject,
        html,
      });
    } catch (error) {
      console.error(error);
    }
    await new Promise((res) => setTimeout(res, delayMs));
  }
}
