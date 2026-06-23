import React from 'react';

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

/**
 * Login Component
 * Handles user authentication by redirecting to the Google OAuth backend route.
 * Serves as the public entry point for the invite-only application.
 */
const Login: React.FC = () => {
  
  /**
   * Initiates the Google OAuth flow.
   * * NOTE: We use `window.location.href` here instead of React Router's `useNavigate`.
   * This is because OAuth requires us to completely leave the Single Page Application (SPA)
   * and navigate to the backend server (which then redirects to Google's servers).
   */
  const handleGoogleLogin = () => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    // Added px-4 to the main container so it doesn't touch the screen edges on mobile devices
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 w-full max-w-md text-center shadow-xl">
        
        {/* Logo / Icon */}
        <div className="text-5xl mb-6 select-none" aria-hidden="true">
          🛡️
        </div>
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
          WeatherGuard
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          Invite-only weather alert service
        </p>
        
        {/* Login Action */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 active:scale-[0.98]"
          aria-label="Sign in with Google"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google Logo"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>
        
        {/* Footer Disclaimer */}
        <p className="text-gray-500 text-xs mt-8 px-4 leading-relaxed">
          Access is strictly invite-only. Administrators must manually approve your request before you can enter the dashboard.
        </p>
        
      </div>
    </div>
  );
};

export default Login;