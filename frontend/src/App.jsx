import React, { useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Authority from './pages/Authority';
import Employee from './pages/Employee';
import Customer from './pages/Customer';
import { LogOut, Layout } from 'lucide-react';
import { defaultAppProps } from './config/initialProps';

function NavigationBar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="bg-white shadow-xs border-b border-gray-200 px-6 py-3.5 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Layout className="text-blue-600" size={22} />
        <div>
          <h1 className="text-lg font-bold tracking-tight text-gray-800 leading-none">Corporate Insights Portal</h1>
          <span className="text-[10px] text-gray-400 font-mono">Google Forms Clone Engine</span>
        </div>
      </div>
      {user && (
        <div className="flex items-center gap-4">
          {user.picture ? (
            <img src={user.picture} alt={user.name} className="w-7 h-7 rounded-full border border-gray-300" />
          ) : (
            <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">
              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </span>
          )}
          <span className="text-xs text-gray-600 font-medium">
            <b>{user.name}</b> <span className="text-gray-400">({user.role})</span>
          </span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-semibold transition-colors cursor-pointer"
          >
            <LogOut size={14} /> Exit Portal
          </button>
        </div>
      )}
    </nav>
  );
}

// Protected Route HOC Layer mapping SOLID layout constraints
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  return children;
};

function AppContent({ appProps = defaultAppProps }) {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <NavigationBar />
        <main className="max-w-6xl mx-auto p-6">
          <Routes>
            <Route path="/login" element={<Login authProps={appProps.auth} />} />
            <Route path="/authority" element={
              <ProtectedRoute allowedRoles={['authority']}>
                <Authority initialForm={appProps.form} initialReport={appProps.report} />
              </ProtectedRoute>
            } />
            <Route path="/employee" element={
              <ProtectedRoute allowedRoles={['employee']}>
                <Employee initialForm={appProps.form} />
              </ProtectedRoute>
            } />
            <Route path="/customer" element={
              <ProtectedRoute allowedRoles={['customer']}>
                <Customer />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <GoogleOAuthProvider clientId={defaultAppProps.auth.googleClientId}>
      <AuthProvider>
        <AppContent appProps={defaultAppProps} />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
