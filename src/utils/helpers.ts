import i18n from '../languages';

const pad = (n: number) => n.toString().padStart(2, '0');

export const getList = (key: string) =>
  i18n.t(key, { returnObjects: true }) as unknown as string[];

export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return i18n.t('greeting.morning');
  }
  return hour < 18 ? i18n.t('greeting.afternoon') : i18n.t('greeting.evening');
}

export const formatDateISO = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const formatClock = (date: Date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}`;

export function parseDate(isoDate: string) {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatTimer(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = pad(Math.floor((totalSeconds % 3600) / 60));
  const seconds = pad(totalSeconds % 60);
  return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
}

export function formatDuration(totalSeconds: number) {
  const minutes = Math.max(1, Math.round(totalSeconds / 60));
  return `${minutes} ${i18n.t('common.min')}`;
}

export function getDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDateNice(isoDate: string) {
  const date = parseDate(isoDate);
  const weekday = getList('weekdays')[date.getDay()];
  const month = getList('monthsGen')[date.getMonth()];
  return `${weekday}, ${date.getDate()} ${month}`;
}
