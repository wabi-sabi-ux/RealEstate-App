import api from './api';

export const favorites = {
  // Add a property to favorites
  add: (customerId: number, propertyId: number) =>
    api.post(`/api/customers/${customerId}/favorites/${propertyId}`),

  // Remove a property from favorites
  remove: (customerId: number, propertyId: number) =>
    api.delete(`/api/customers/${customerId}/favorites/${propertyId}`),

  // Check if a property is in favorites
  check: (customerId: number, propertyId: number) =>
    api.get<boolean>(`/api/customers/${customerId}/favorites/${propertyId}`),

  // Get all favorite properties for a customer
  list: (customerId: number) =>
    api.get(`/api/customers/${customerId}/properties`),
};