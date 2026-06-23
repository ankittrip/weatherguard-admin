import React from 'react';
import { useAuth } from '../hooks/useAuth';

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

/**
 * Status Component
 * Displays the current account status for standard users.
 * Shows either a pending instruction screen or an approved welcome screen.
 */
const Status: React.FC = () => {
  // Extract 'loading' to prevent flashing incorrect states before the API responds
  const { user, loading, logout } = useAuth();
  
  const isApproved = user?.status === 'approved';

  // Prevent rendering the UI until we actually know who the user is
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    // Added px-4 so the card doesn't touch the edges on mobile devices
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center items-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 w-full max-w-md text-center shadow-xl">

        {/* ------------------------------------------------------------------ */}
        {/* State: APPROVED                                                    */}
        {/* ------------------------------------------------------------------ */}
        {isApproved ? (
          <>
            <div className="text-5xl mb-6 select-none" aria-hidden="true">✅</div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Account Approved!</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Hi <strong className="text-white">{user?.name}</strong>, you have been approved! You will now receive automated weather alerts on your Telegram account every 6 hours.
            </p>
            
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 mb-8 text-left">
              <p className="text-xs text-gray-400 mb-1 font-medium">Connected Telegram</p>
              <p className="text-green-400 text-sm font-medium flex items-center gap-2">
                <span aria-hidden="true">✅</span> Active — alerts enabled
              </p>
            </div>
          </>
        ) : (
        /* ------------------------------------------------------------------ */
        /* State: PENDING                                                     */
        /* ------------------------------------------------------------------ */
          <>
            <div className="text-5xl mb-6 select-none animate-pulse" aria-hidden="true">⏳</div>
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Approval Pending</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Hi <strong className="text-white">{user?.name}</strong>, your request to join WeatherGuard is currently in our queue. An admin will review your access request shortly.
            </p>
            
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 mb-8 text-left">
              <p className="text-xs text-gray-400 mb-3 font-semibold uppercase tracking-wider">While you wait:</p>
              <ol className="text-gray-300 text-sm space-y-2">
                <li>1. Open Telegram</li>
                <li>2. Search <strong className="text-purple-400">@WeatherGuardAlertBot</strong></li>
                <li>
                  3. Send: <code className="bg-gray-900 text-purple-400 px-2 py-0.5 rounded font-mono text-xs">/start {user?.email}</code>
                </li>
              </ol>
            </div>
          </>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Actions                                                            */}
        {/* ------------------------------------------------------------------ */}
        <button
          onClick={logout}
          className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-gray-700 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:border-gray-500 hover:bg-gray-800 transition-all duration-200"
          aria-label="Log out of your account"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Status;