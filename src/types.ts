export type Currency = 'KRW' | 'HKD' | 'USD' | 'JPY' | 'EUR' | 'GBP' | 'CNY' | 'TWD' | 'SGD';

export type TicketType = 'VIP' | 'General' | 'Premium' | 'Standing' | 'Box Seat' | 'Balcony' | 'Other';

export interface Concert {
  id: string;
  artist: string;
  title?: string; // New: Title of the show
  date: string; // ISO string
  location: string;
  price: number;
  currency: Currency; // New: Currency selection
  ticketType: TicketType; // New: Ticket type selection
  seat: string;
  notes?: string;
}
