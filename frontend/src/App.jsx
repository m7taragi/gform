import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Authority from './pages/Authority';
import Employee from './pages/Employee';
import Customer from './pages/Customer';
import { LogOut, Layout } from 'lucide-react';

function NavigationBar() {
  const { user, logout } = useContext(AuthContext);
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Layout className="text-blue-600" size={20} />
        <h1 className="text-lg font-bold tracking-tight text-gray-800">Corporate Portal</h1>
      </div>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 font-medium">Hello, <b>{user.name}</b> ({user.role})</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 font-semibold transition-colors"
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

function AppContent() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <NavigationBar />
        <main className="max-w-6xl mx-auto p-6">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/authority" element={<ProtectedRoute allowedRoles={['authority']}><Authority /></ProtectedRoute>} />
            <Route path="/employee" element={<ProtectedRoute allowedRoles={['employee']}><Employee /></ProtectedRoute>} />
            <Route path="/customer" element={<ProtectedRoute allowedRoles={['customer']}><Customer /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
