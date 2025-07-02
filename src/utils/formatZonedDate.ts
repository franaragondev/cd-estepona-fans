import { toZonedTime } from "date-fns-tz";

export function formatZonedDate(
  date: string | Date,
  locale: string = "es",
  options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" }
) {
  const timeZone = "Europe/Madrid";
  const zonedDate = toZonedTime(date, timeZone);
  return new Intl.DateTimeFormat(locale, {
    ...options,
    timeZone,
  }).format(zonedDate);
}
