import React from 'react';

// ----------------------------------------------------------------------------
// Types & Interfaces
// ----------------------------------------------------------------------------

/**
 * Represents a single user's data structure.
 */
export interface User {
  _id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | string; // Suggesting specific string literals for better intellisense
  avatar?: string;
  telegramChatId?: string;
}

/**
 * Props for the UserTable component.
 */
export interface UserTableProps {
  users: User[];
  onApprove: (id: string) => void;
  approving?: string | null;
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

/**
 * UserTable Component
 * Displays a responsive, styled table of users with an action column for approvals.
 */
const UserTable: React.FC<UserTableProps> = ({ users, onApprove, approving }) => {
  
  // Helper function to gracefully hide broken avatar images without using 'any'
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = 'none';
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800 shadow-sm">
      <table className="min-w-full divide-y divide-gray-800">
        
        {/* Table Header */}
        <thead className="bg-gray-800">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-300">User</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Email</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Telegram</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-300">Status</th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-300">Action</th>
          </tr>
        </thead>
        
        {/* Table Body */}
        <tbody className="divide-y divide-gray-800 bg-gray-900">
          {users.length === 0 ? (
            // Empty State
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-gray-500">
                No users found.
              </td>
            </tr>
          ) : (
            // User Rows
            users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-800/50 transition-colors duration-200">
                
                {/* User Info & Avatar */}
                <td className="py-4 pl-4 pr-3 text-sm">
                  <div className="flex items-center gap-3">
                    {user.avatar && (
                      <img
                        src={user.avatar}
                        alt={`${user.name}'s avatar`}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={handleImageError}
                      />
                    )}
                    <span className="font-medium text-white">{user.name}</span>
                  </div>
                </td>
                
                {/* Email */}
                <td className="px-3 py-4 text-sm text-gray-300">{user.email}</td>
                
                {/* Telegram Link Status */}
                <td className="px-3 py-4 text-sm">
                  {user.telegramChatId ? (
                    <span className="text-green-400 font-medium">✅ Linked</span>
                  ) : (
                    <span className="text-gray-500">Not linked</span>
                  )}
                </td>
                
                {/* Account Status */}
                <td className="px-3 py-4 text-sm">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold
                    ${
                      user.status === 'approved'
                        ? 'bg-green-900/50 text-green-400'
                        : 'bg-yellow-900/50 text-yellow-400'
                    }`}
                  >
                    {/* Capitalize the first letter for better UI presentation */}
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                
                {/* Actions */}
                <td className="px-3 py-4 text-right">
                  {user.status === 'pending' && (
                    <button
                      onClick={() => onApprove(user._id)}
                      disabled={approving === user._id}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs px-3 py-1.5 rounded-lg transition-colors duration-200"
                      aria-label={`Approve ${user.name}`}
                    >
                      {approving === user._id ? 'Approving...' : 'Approve ✓'}
                    </button>
                  )}
                </td>
                
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;