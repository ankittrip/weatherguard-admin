import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api/client';

// Fallback admin email if the environment variable is missing
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'ankittripathi559@gmail.com';

// ----------------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------------

/**
 * Represents the authenticated user's data structure.
 */
export interface User {
  userId: string;
  email: string;
  name: string;
  status: 'pending' | 'approved';
  role: 'user' | 'admin';
}

/**
 * Return type for the useAuth hook.
 */
export interface AuthState {
  user: User | null;
  loading: boolean;
  logout: () => void;
}

// ----------------------------------------------------------------------------
// Hook Implementation
// ----------------------------------------------------------------------------

/**
 * Custom hook to manage user authentication state.
 * Fetches the user profile on mount, assigns roles, and provides a logout utility.
 * * @returns {AuthState} The current user object, loading state, and logout function.
 */
export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Memoize the logout function to prevent unnecessary re-renders in child components
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      
      // If no token exists, immediately stop loading and exit
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get('/auth/me');
        
        // Construct the user object and assign the role dynamically
        const userData: User = {
          ...response.data,
          role: response.data.email === ADMIN_EMAIL ? 'admin' : 'user',
        };
        
        setUser(userData);
      } catch (error) {
        console.error('Authentication failed:', error);
        
        // If the token is invalid or expired, clean up the local state
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        // The finally block guarantees loading is turned off,
        // removing the need to call it in both try and catch blocks.
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Empty dependency array ensures this runs only once on mount

  return { user, loading, logout };
};