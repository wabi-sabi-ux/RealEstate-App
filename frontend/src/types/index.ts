export interface Property {
  propId: number;
  configuration: string;
  offerType: 'SELL' | 'RENT';
  offerCost: number;
  areaSqft: number;
  address: string;
  street: string;
  city: string;
  status: boolean;
  imageUrls: string[];
  broker: Broker;
}

export interface Broker {
  broId: number;
  broName: string;
  user: User;
  avgRating: number;
  ratingCount: number;
}

export interface User {
  userId: number;
  email: string;
  role: string;
  city: string;
  mobile: string;
  brokerId?: number;
  customerId?: number;
}

export interface BrokerRating {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  customer: Customer;
}

export interface Customer {
  custId: number;
  custName: string;
  user: User;
}

export interface Deal {
  dealId: number;
  dealDate: string;
  dealCost: number;
  customer: Customer;
  property: Property;
}
