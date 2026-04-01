/**
 * EKAM Peher System — 8 three-hour time blocks
 * Based on the ancient Indian/Ayurvedic time division
 */

export interface Peher {
  index: number;
  name: string;
  meaning: string;
  startHour: number;
  endHour: number;
  timeLabel: string;
  color: string;
  icon: string;
}

export const PEHERS: Peher[] = [
  { index: 0, name: 'Usha', meaning: 'Dawn', startHour: 0, endHour: 3, timeLabel: '12 AM – 3 AM', color: '#1A237E', icon: '🌙' },
  { index: 1, name: 'Prabhat', meaning: 'Daybreak', startHour: 3, endHour: 6, timeLabel: '3 AM – 6 AM', color: '#9C27B0', icon: '🌅' },
  { index: 2, name: 'Poorvahna', meaning: 'Morning', startHour: 6, endHour: 9, timeLabel: '6 AM – 9 AM', color: '#FF7B00', icon: '☀️' },
  { index: 3, name: 'Madhyahna', meaning: 'Midday', startHour: 9, endHour: 12, timeLabel: '9 AM – 12 PM', color: '#48BFE3', icon: '🔵' },
  { index: 4, name: 'Aparahna', meaning: 'Afternoon', startHour: 12, endHour: 15, timeLabel: '12 PM – 3 PM', color: '#10B981', icon: '🌿' },
  { index: 5, name: 'Sayahna', meaning: 'Evening', startHour: 15, endHour: 18, timeLabel: '3 PM – 6 PM', color: '#00BCD4', icon: '🌤️' },
  { index: 6, name: 'Sandhya', meaning: 'Twilight', startHour: 18, endHour: 21, timeLabel: '6 PM – 9 PM', color: '#E91E63', icon: '🌆' },
  { index: 7, name: 'Nisha', meaning: 'Night', startHour: 21, endHour: 24, timeLabel: '9 PM – 12 AM', color: '#3F51B5', icon: '🌙' },
];

export function getPeherForHour(hour: number): Peher {
  const index = Math.floor(hour / 3);
  return PEHERS[index] ?? PEHERS[0];
}

export function getCurrentPeher(): Peher {
  return getPeherForHour(new Date().getHours());
}

export function getPeherProgress(): number {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const peher = getPeherForHour(currentHour);
  const minutesInto = (currentHour - peher.startHour) * 60 + currentMinute;
  return minutesInto / 180; // 180 minutes per Peher
}
