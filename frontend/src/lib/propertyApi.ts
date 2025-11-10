import api from "./api";
import type { Property } from "../types";

// GET /api/properties
export async function listAllProperties(): Promise<Property[]> {
  const { data } = await api.get<Property[]>("/api/properties");
  return data;
}

// GET /api/properties/search?... (all params optional)
export async function searchProperties(params: {
  city?: string;
  config?: "FLAT" | "SHOP" | "PLOT";
  offer?: "SELL" | "RENT";
  minCost?: number;
  maxCost?: number;
  minArea?: number;
  maxArea?: number;
  minRating?: number;
  availableOnly?: boolean;
}): Promise<Property[]> {
  const { data } = await api.get<Property[]>("/api/properties/search", { params });
  return data;
}

// GET /api/properties/:id
export async function getProperty(id: number): Promise<Property> {
  const { data } = await api.get<Property>(`/api/properties/${id}`);
  return data;
}

// POST /api/deals?propertyId=...&price=... (requires CUSTOMER auth)
export async function createDeal(propertyId: number, price: number) {
  const customerId = 1; // This should come from auth context
  const { data } = await api.post("/api/deals", null, { params: { propertyId, customerId, price } });
  return data;
}
