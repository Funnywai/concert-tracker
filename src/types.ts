export type Currency = 'USD' | 'KRW' | 'HKD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'TWD';

export type TicketType = 'VIP Standing' | 'VIP Seating' | 'General Standing' | 'General Seating';

export const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: 'KRW', label: 'KRW (₩)', symbol: '₩' },
  { value: 'HKD', label: 'HKD ($)', symbol: 'HK$' },
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'JPY', label: 'JPY (¥)', symbol: '¥' },
  { value: 'CNY', label: 'CNY (¥)', symbol: '¥' },
  { value: 'TWD', label: 'TWD ($)', symbol: 'NT$' },
];

export const TICKET_TYPES: TicketType[] = [
  'VIP Standing',
  'VIP Seating',
  'General Standing',
  'General Seating',
];

export interface Concert {
  id: string;
  title: string;
  artist: string;
  date: string; // ISO string
  location: string;
  price: number;
  currency: Currency;
  ticketType: TicketType;
  seat: string;
  notes?: string;
}
