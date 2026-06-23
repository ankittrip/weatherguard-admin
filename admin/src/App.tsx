import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AuthCallback from './pages/AuthCallback';
import Status from './pages/Status';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'ankittripathi559@gmail.com';

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <p className="text-white">Loading...</p>
      </div>
    );
  }

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : isAdmin ? <Navigate to="/dashboard" /> : <Navigate to="/status" />}
        />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/dashboard"
          element={!user ? <Navigate to="/login" /> : isAdmin ? <Dashboard /> : <Navigate to="/status" />}
        />
        <Route
          path="/status"
          element={!user ? <Navigate to="/login" /> : <Status />}
        />
        <Route
          path="/"
          element={!user ? <Navigate to="/login" /> : isAdmin ? <Navigate to="/dashboard" /> : <Navigate to="/status" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;