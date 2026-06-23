import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client'; // Import our centralized Axios client
import UserTable from '../components/UserTable'; 

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------
export interface User {
  _id: string;
  name: string;
  email: string;
  status: string;
  avatar?: string;
  telegramChatId?: string;
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

/**
 * Admin Dashboard Component
 * Displays pending user requests and allows administrators to approve them.
 */
export default function Dashboard() {
  // State Management
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [approving, setApproving] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // --------------------------------------------------------------------------
  // API Methods
  // --------------------------------------------------------------------------

  /**
   * Fetches the list of users currently pending approval.
   * Wrapped in useCallback to stabilize the function reference.
   */
  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      // apiClient already has the token attached via the request interceptor!
      const res = await apiClient.get<User[]>('/admin/pending');
      setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch pending requests:', error);
      navigate('/login', { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Initial fetch on mount
  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  /**
   * Approves a specific user by ID.
   */
  const approve = async (id: string) => {
    setApproving(id);
    try {
      await apiClient.patch(`/admin/approve/${id}`);
      
      // Optimistically remove the user from the UI
      setUsers((prevUsers) => prevUsers.filter((u) => u._id !== id));
    } catch (error) {
      console.error('Approval failed:', error);
      alert('Failed to approve user. Please try again.');
    } finally {
      setApproving(null);
    }
  };

  /**
   * Clears local storage and redirects to the login page.
   */
  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
  };

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-purple-400">🛡️ WeatherGuard Admin</h1>
          <p className="text-xs text-gray-400">Manage access requests</p>
        </div>
        <button
          onClick={logout}
          className="text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 px-3 py-1.5 rounded transition-colors duration-200"
        >
          Logout
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="p-8 max-w-7xl mx-auto">
        
        {/* Header Actions */}
        <header className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center">
            Pending Requests
            <span className="ml-3 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {users.length}
            </span>
          </h2>
          <button 
            onClick={fetchPending} 
            disabled={loading}
            className="text-sm text-purple-400 hover:text-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          >
            <span className={loading ? 'animate-spin' : ''}>↻</span> Refresh
          </button>
        </header>

        {/* Dynamic State Rendering */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400 animate-pulse">Loading requests...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-20 text-gray-500 border border-dashed border-gray-800 rounded-xl bg-gray-900/50">
            <p className="text-5xl mb-4">✅</p>
            <p className="text-lg font-medium text-gray-300">Inbox Zero!</p>
            <p className="text-sm">No pending requests at the moment.</p>
          </div>
        ) : (
          <UserTable users={users} onApprove={approve} approving={approving} />
        )}
      </main>
    </div>
  );
}