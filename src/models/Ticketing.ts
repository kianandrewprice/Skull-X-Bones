export interface Event {
  id: string;
  organizerId: string;
  title: string;
  description: string;
  type: 'concert' | 'tournament' | 'stream' | 'meet_and_greet' | 'other';
  venue?: Venue;
  isVirtual: boolean;
  startDate: Date;
  endDate: Date;
  capacity?: number;
  ticketsSold: number;
  status: 'draft' | 'published' | 'ongoing' | 'completed' | 'cancelled';
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Venue {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  seatingChart?: string; // URL to seating chart image
}

export interface TicketType {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  quantity: number;
  sold: number;
  salesStart: Date;
  salesEnd: Date;
  maxPerOrder: number;
  isActive: boolean;
  benefits?: string[];
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  eventId: string;
  ticketTypeId: string;
  orderId: string;
  holderId: string;
  holderName: string;
  holderEmail: string;
  price: number;
  currency: string;
  status: 'valid' | 'used' | 'cancelled' | 'refunded';
  qrCode: string;
  seatNumber?: string;
  section?: string;
  purchasedAt: Date;
  usedAt?: Date;
}

export interface TicketOrder {
  id: string;
  orderNumber: string;
  eventId: string;
  customerId: string;
  tickets: string[]; // Ticket IDs
  total: number;
  currency: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}
