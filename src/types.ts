export interface Concert {
  id: string;
  artist: string;
  date: string; // ISO string
  location: string;
  price: number;
  seat: string;
  notes?: string;
}
