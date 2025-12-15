const BRASILIA_TIMEZONE = "America/Sao_Paulo";
const BRASILIA_OFFSET = "-03:00";

export const brasiliaTimezoneHelperText =
  "Os horários são exibidos e devem ser informados no fuso horário de Brasília (UTC-03).";

const datetimeFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: BRASILIA_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const displayDateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: BRASILIA_TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function parseBrasiliaDatetimeLocal(datetimeLocal: string | undefined | null): Date | null {
  if (!datetimeLocal) return null;

  const normalized = datetimeLocal.includes(":") && datetimeLocal.length === 16
    ? `${datetimeLocal}:00`
    : datetimeLocal;

  const isoWithOffset = `${normalized}${BRASILIA_OFFSET}`;
  const date = new Date(isoWithOffset);
  return isNaN(date.getTime()) ? null : date;
}

export function utcToBrasiliaDatetimeLocal(isoDate: string | undefined | null): string {
  if (!isoDate) return "";

  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "";

  const parts = datetimeFormatter.formatToParts(date);
  const partMap = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  const year = partMap.year ?? "";
  const month = partMap.month ?? "";
  const day = partMap.day ?? "";
  const hour = partMap.hour ?? "";
  const minute = partMap.minute ?? "";

  if (!year || !month || !day || !hour || !minute) return "";
  return `${year}-${month}-${day}T${hour}:${minute}`;
}

export function brasiliaDatetimeLocalToUtcIso(datetimeLocal: string | undefined | null): string | undefined {
  if (!datetimeLocal) return undefined;

  const date = parseBrasiliaDatetimeLocal(datetimeLocal);
  return date?.toISOString();
}

export function compareBrasiliaDatetimes(a: string, b: string): number {
  const dateA = parseBrasiliaDatetimeLocal(a);
  const dateB = parseBrasiliaDatetimeLocal(b);

  if (!dateA || !dateB) return 0;
  return dateA.getTime() - dateB.getTime();
}

export function formatBrasiliaDateTime(raw: string | Date | null | undefined): string {
  if (!raw) return "";

  const date = raw instanceof Date ? raw : new Date(raw);
  if (isNaN(date.getTime())) return "";

  return displayDateTimeFormatter.format(date);
}

export function getCurrentBrasiliaDateOnly(): string {
  const now = new Date();
  const parts = datetimeFormatter.formatToParts(now);
  const partMap = Object.fromEntries(parts.map(({ type, value }) => [type, value]));

  const year = partMap.year ?? "";
  const month = partMap.month ?? "";
  const day = partMap.day ?? "";

  return `${year}-${month}-${day}`;
}
