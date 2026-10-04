"use client";
import React from 'react';
import { 
  Shield, LogOut, UserCircle, MapPin, Clock, 
  CheckCircle2, Siren, FileWarning, Car, PhoneCall, 
  ChevronRight, Home, Package 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Customer() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Header */}
      <header className="bg-slate-900 w-full sticky top-0 z-50 shadow-md">
        <div className="flex items-center justify-between px-4 md:px-6 h-16 w-full max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-400" size={28} />
            <h1 className="text-xl font-bold text-white tracking-tight">UP POLICE</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white border-2 border-slate-700 overflow-hidden shadow-inner">
              <UserCircle size={32} className="text-blue-200" />
            </div>
            <button onClick={handleLogout} className="text-slate-300 hover:text-red-400 p-2 rounded-full hover:bg-slate-800 transition-colors ml-1">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-4xl mx-auto pb-24 px-4 md:px-6 pt-6">
        
        <div className="flex flex-col gap-6">
          
          {/* Top Info Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Current Assignment */}
            <div className="md:col-span-2 bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-800 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Current Assignment</h2>
                  <span className="bg-emerald-500/20 text-emerald-400 font-bold text-[10px] px-2 py-1 rounded-full uppercase border border-emerald-500/30">
                    Active
                  </span>
                </div>
                <p className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
                  <MapPin size={24} className="text-blue-400" />
                  Beat 4A - Hazratganj Crossing
                </p>
              </div>
              
              <div className="relative z-10 mt-6 pt-5 border-t border-slate-700/50 flex justify-between items-end">
                <div>
                  <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 mb-1">
                    <Clock size={14} /> REMAINING TIME
                  </p>
                  <p className="text-3xl font-bold text-white tracking-tight">03:45</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-sm">
                  View Details
                </button>
              </div>
            </div>

            {/* Attendance */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col items-center justify-center gap-4">
              <p className="text-xs font-bold text-slate-400 uppercase text-center w-full">Attendance</p>
              <button className="w-full h-14 border-2 border-blue-600 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                <CheckCircle2 size={20} />
                MARK PRESENT
              </button>
              <p className="text-xs font-semibold text-slate-500 text-center flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" /> Last marked: 08:00 AM
              </p>
            </div>
          </section>

          {/* Quick Actions Grid */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <button className="bg-red-600 text-white h-[90px] rounded-2xl shadow-sm shadow-red-600/20 flex flex-col items-center justify-center gap-2 hover:bg-red-500 transition-all active:scale-[0.98] border border-red-500">
              <Siren size={32} />
              <span className="font-bold text-sm tracking-wide">SOS</span>
            </button>
            
            <button className="bg-white border border-slate-200 h-[90px] rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-[0.98]">
              <FileWarning className="text-amber-500" size={28} />
              <span className="font-bold text-sm text-slate-700">INCIDENT</span>
            </button>
            
            <button className="bg-white border border-slate-200 h-[90px] rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-[0.98]">
              <Car className="text-blue-600" size={28} />
              <span className="font-bold text-sm text-slate-700">BACKUP</span>
            </button>
            
            <button className="bg-white border border-slate-200 h-[90px] rounded-2xl shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-[0.98]">
              <PhoneCall className="text-blue-600" size={28} />
              <span className="font-bold text-sm text-slate-700">CONTACTS</span>
            </button>
            
          </section>

          {/* Duty Schedule List */}
          <section className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-2">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Clock size={18} className="text-blue-600" />
                My Duty Schedule
              </h3>
            </div>
            <div className="flex flex-col">
              
              <div className="flex items-center justify-between p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div>
                  <p className="font-bold text-slate-900">Beat Patrol - Sector 4</p>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">08:00 AM - 12:00 PM</p>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-colors" size={20} />
              </div>
              
              <div className="flex items-center justify-between p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div>
                  <p className="font-bold text-slate-900">Traffic Duty - Main Circle</p>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">13:00 PM - 16:00 PM</p>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-colors" size={20} />
              </div>
              
              <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div>
                  <p className="font-bold text-slate-900">Station Reserve</p>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">16:00 PM - 20:00 PM</p>
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-colors" size={20} />
              </div>
              
            </div>
          </section>

        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden bg-white fixed bottom-0 w-full z-50 border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
        <div className="flex justify-around items-center h-16">
          <button className="flex flex-col items-center justify-center text-blue-600 w-full h-full relative">
            <div className="absolute top-0 w-8 h-1 bg-blue-600 rounded-b-full"></div>
            <Home size={22} className="mb-1 mt-1" />
            <span className="text-[10px] font-semibold">Home</span>
          </button>
          <button className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-900 w-full h-full transition-colors">
            <CheckCircle2 size={22} className="mb-1" />
            <span className="text-[10px] font-semibold">Tasks</span>
          </button>
          <button className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-900 w-full h-full transition-colors">
            <Package size={22} className="mb-1" />
            <span className="text-[10px] font-semibold">Services</span>
          </button>
          <button className="flex flex-col items-center justify-center text-slate-500 hover:text-slate-900 w-full h-full transition-colors">
            <UserCircle size={22} className="mb-1" />
            <span className="text-[10px] font-semibold">Profile</span>
          </button>
        </div>
      </nav>

    </div>
  );
}

