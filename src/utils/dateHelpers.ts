export function formatDateForDisplay(dateStr: string | null, locale = "es-ES") {
  if (!dateStr) return "Fecha no definida";

  const date = new Date(dateStr);
  const hoursUTC = date.getUTCHours();
  const minutesUTC = date.getUTCMinutes();
  const dateStrLocal = date.toLocaleDateString(locale);

  if (hoursUTC === 0 && minutesUTC === 0) {
    return `${dateStrLocal} (N/D)`;
  }

  // Mostrar fecha y hora local
  return date.toLocaleString(locale);
}
