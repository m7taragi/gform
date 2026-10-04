"use client";
import React, { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';
import { Shield, User, Lock, Eye, EyeOff, LogIn } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setUser } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    let mockUser = null;
    if (email.includes('admin')) {
      mockUser = { name: "Director John", email, role: "authority", token: "mock-jwt-auth" };
    } else if (email.includes('inspector')) {
      mockUser = { name: "Inspector Jane", email, role: "employee", token: "mock-jwt-auth" };
    } else {
      mockUser = { name: "Constable Doe", email, role: "customer", token: "mock-jwt-auth" };
    }
    
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('token', mockUser.token || 'auth_token_' + Date.now());

    if (mockUser.role === 'authority') router.push('/authority');
    else if (mockUser.role === 'employee') router.push('/employee');
    else router.push('/customer');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-white/10">
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 border border-blue-400/30 shadow-inner">
              <Shield className="text-blue-400" size={40} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Officer Portal</h1>
            <p className="text-blue-200/70 mt-2 text-sm">Secure Authentication Required</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-blue-100 ml-1" htmlFor="email">Service ID / Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300/50 group-focus-within:text-blue-400 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  id="email"
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-500" 
                  placeholder="e.g. admin, inspector" 
                  type="text" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-blue-100 ml-1" htmlFor="password">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-300/50 group-focus-within:text-blue-400 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  id="password"
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="w-full bg-slate-900/50 border border-white/10 text-white rounded-xl py-3 pl-11 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-slate-500" 
                  placeholder="********" 
                  type={showPassword ? "text" : "password"} 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-blue-300/50 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="flex justify-end pt-1">
                <Link href="/signup" className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium">
                  Register as New User
                </Link>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl py-3.5 px-4 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all flex items-center justify-center gap-2 group mt-8"
            >
              <span>Secure Login</span>
              <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-slate-500 text-sm">Ac 2024 UP Police IT Cell. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
