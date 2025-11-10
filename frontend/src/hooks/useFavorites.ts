import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { favorites } from '../lib/favoritesApi';
import { Property } from '../types';

export function useFavorites() {
  const { user, hasRole } = useAuth();
  const [favoriteProperties, setFavoriteProperties] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  // Load user's favorite properties
  const loadFavorites = useCallback(async () => {
    if (!hasRole('CUSTOMER') || !user?.customerId) return;
    
    try {
      setLoading(true);
      const response = await favorites.list(user.customerId);
      const properties: Property[] = response.data;
      const favoriteIds = new Set<number>(properties.map(prop => prop.propId));
      setFavoriteProperties(favoriteIds);
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [hasRole, user?.customerId]);

  // Check if a property is favorited
  const isFavorite = useCallback((propertyId: number) => {
    return favoriteProperties.has(propertyId);
  }, [favoriteProperties]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (propertyId: number, newState?: boolean) => {
    if (!hasRole('CUSTOMER') || !user?.customerId) {
      throw new Error('Please log in as a customer to manage favorites');
    }

    const currentState = favoriteProperties.has(propertyId);
    const targetState = newState !== undefined ? newState : !currentState;

    try {
      if (targetState && !currentState) {
        await favorites.add(user.customerId, propertyId);
        setFavoriteProperties(prev => new Set([...prev, propertyId]));
      } else if (!targetState && currentState) {
        await favorites.remove(user.customerId, propertyId);
        setFavoriteProperties(prev => {
          const next = new Set(prev);
          next.delete(propertyId);
          return next;
        });
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      throw error;
    }
  }, [hasRole, user?.customerId, favoriteProperties]);

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favoriteProperties,
    isFavorite,
    toggleFavorite,
    loadFavorites,
    loading,
  };
}