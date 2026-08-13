import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, User, ShieldCheck } from 'lucide-react';
import GoogleSSOLogin from '../components/GoogleSSOLogin';
import { initialAuthProps } from '../config/initialProps';

function Login({ authProps = initialAuthProps }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setSelectedRole] = useState(authProps.defaultRole || 'employee');
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

        completeAuthentication(mockUser);
    };

    const handleGoogleSSOSuccess = (googleUser) => {
        // Ensure user assigned chosen role
        const authenticatedUser = {
            ...googleUser,
            role: selectedRole
        };
        completeAuthentication(authenticatedUser);
    };

    const completeAuthentication = (userObj) => {
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('token', userObj.token || 'auth_token_' + Date.now());

        // Redirect to target route based on role
        if (userObj.role === 'authority') navigate('/authority');
        else if (userObj.role === 'employee') navigate('/employee');
        else navigate('/customer');
    };

    return (
        <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl border border-gray-200 shadow-md space-y-6">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center p-2.5 bg-blue-50 text-blue-600 rounded-full mb-1">
                    <ShieldCheck size={26} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Enterprise Login Portal</h2>
                <p className="text-xs text-gray-500">Sign in to access corporate forms, nested trackers, and live reporting engines.</p>
            </div>

            {/* Persona Role Selection */}
            <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-gray-600 uppercase">Target Persona Role</label>
                <div className="grid grid-cols-3 gap-2">
                    {authProps.roleOptions.map(roleOpt => (
                        <button
                            key={roleOpt.id}
                            type="button"
                            onClick={() => setSelectedRole(roleOpt.id)}
                            className={`py-1.5 px-2 text-xs font-medium rounded-md border transition-all ${
                                selectedRole === roleOpt.id
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {roleOpt.id.charAt(0).toUpperCase() + roleOpt.id.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Google Single Sign-On (SSO) Section */}
            <GoogleSSOLogin
                selectedRole={selectedRole}
                onGoogleSuccess={handleGoogleSSOSuccess}
            />

            {/* Standard Credentials Form */}
            <form onSubmit={handleLogin} className="space-y-4 pt-2">
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
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md text-sm shadow-sm transition-colors"
                >
                    Sign In With Credentials
                </button>
            </form>

            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center space-y-1">
                <p className="text-xs font-semibold text-gray-500"> Testing Accounts:</p>
                {authProps.mockAccounts.map(acc => (
                    <p key={acc.email} className="text-[11px] text-gray-600 font-mono">
                        <span className="bg-white px-1 py-0.5 border border-gray-200 rounded">{acc.email}</span> ({acc.role})
                    </p>
                ))}
            </div>
        </div>
    );
}

export default Login;
