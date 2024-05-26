import * as dayjs from 'dayjs';

export function datef(date: Date, format?: string): string {
  return dayjs(date).format(format ?? 'DD/MM/YYYY HH:mm:ss');
}

export function addDays(date: Date, days: number) {
  const nDate = new Date(date.valueOf());
  nDate.setDate(date.getDate() + days);
  return nDate;
}
