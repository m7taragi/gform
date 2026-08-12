import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // Simulated Role-Based Authentication Routing for Testing
        let mockUser = null;
        if (email.includes('admin')) {
            mockUser = { name: "Director John", email, role: "authority", token: "mock-jwt-auth" };
        } else if (email.includes('factory') || email.includes('office')) {
            mockUser = { name: "Operator Alex", email, role: "employee", trackerId: "factory_floor_2" };
        } else {
            mockUser = { name: "Client Acme Corp", email, role: "customer", trackerId: "CUST_9874" };
        }

        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));

        // Redirect to the appropriate dashboard instantly
        if (mockUser.role === 'authority') navigate('/authority');
        else if (mockUser.role === 'employee') navigate('/employee');
        else navigate('/customer');
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-lg border border-gray-200 shadow-sm space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-800">Enterprise Login Portal</h2>
                <p className="text-xs text-gray-500">Enter your corporate credentials to access your secure workspace node.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Email Address</label>
                    <div className="relative">
                        <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input
                            type="email"
                            required
                            placeholder="e.g., admin@company.com, factory@co.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md text-sm shadow-sm transition-colors"
                >
                    Sign In Secured Node
                </button>
            </form>

            <div className="p-3 bg-gray-50 rounded text-center space-y-1">
                <p className="text-xs font-semibold text-gray-500">💡 Testing Account Hints:</p>
                <p className="text-[11px] text-gray-500">Type <span className="font-mono bg-white px-1 border">admin@co.com</span> for Senior Dashboard</p>
                <p className="text-[11px] text-gray-500">Type <span className="font-mono bg-white px-1 border">factory@co.com</span> for Factory Entry Panel</p>
                <p className="text-[11px] text-gray-500">Type <span className="font-mono bg-white px-1 border">client@co.com</span> for Customer Complaint Hub</p>
            </div>
        </div>
    );
}

export default Login;
