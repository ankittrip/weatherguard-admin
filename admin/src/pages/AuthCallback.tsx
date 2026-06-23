import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client'; // Import the client we created earlier

// Centralize the admin email constant outside the component
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'ankittripathi559@gmail.com';

/**
 * AuthCallback Component
 * Handles the redirect after authentication, extracts the token from the URL,
 * validates the user, and routes them to the appropriate dashboard based on role.
 */
const AuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const processAuthentication = async () => {
      const token = searchParams.get('token');

      // 1. No token found in URL -> Send back to login
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      // 2. Save token synchronously. 
      // Our apiClient request interceptor will automatically attach this to the next request.
      localStorage.setItem('token', token);

      try {
        // 3. Fetch user details to determine their role
        const response = await apiClient.get('/auth/me');
        const userEmail = response.data.email;

        // 4. Route based on role using replace to prevent going back to the callback URL
        if (userEmail === ADMIN_EMAIL) {
          navigate('/dashboard', { replace: true }); // Admin route
        } else {
          navigate('/status', { replace: true });    // User route
        }

      } catch (error) {
        // 5. Cleanup and redirect if the token is invalid or server fails
        console.error('Authentication verification failed:', error);
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    };

    processAuthentication();
  }, [searchParams, navigate]);

  // --------------------------------------------------------------------------
  // Render Loading State
  // --------------------------------------------------------------------------
  return (
    <div className="flex h-screen items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        {/* Simple Tailwind loading spinner */}
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-300 font-medium animate-pulse">Authenticating...</p>
      </div>
    </div>
  );
};

export default AuthCallback;