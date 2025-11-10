export type Role = "BROKER" | "CUSTOMER";

export interface User {
  userId: number;
  email: string;
  role: Role;
  mobile?: string;
  city?: string;
  brokerId?: number;
  customerId?: number;
}

export type OfferType = "SELL" | "RENT";
export type PropertyConfig = "FLAT" | "SHOP" | "PLOT";

export interface Property {
  propId: number;
  configuration: PropertyConfig;
  offerType: OfferType;
  offerCost: number;
  areaSqft: number;
  address: string;
  street: string;
  city: string;
  status: boolean;          // true = available
  imageUrls: string[];
  avgRating: number;
  reviewCount: number;
  broker?: {
    broId: number;
    broName: string;
  };
}

export interface LoginResponse extends User {}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface Broker {
  broId: number;
  broName: string;
  email: string;
  mobile?: string;
  city?: string;
  avgRating?: number;
  ratingCount?: number;
}
