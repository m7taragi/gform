"use client";
import React from 'react';
import { 
  Shield, LogOut, FileText, Calendar, MessageSquare, 
  Package, Home, CheckCircle2, UserCircle, FolderOpen, 
  AlertTriangle, Users, MapPin, ChevronRight, Gavel, Megaphone 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Employee() {
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

      <main className="flex-grow w-full max-w-4xl mx-auto pb-24 px-4 md:px-6">
        
        <section className="pt-8 pb-6">
          <h1 className="text-xl text-slate-500 font-medium">Jai Hind,</h1>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mt-1">Inspector Kumar</h2>
          <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 bg-white border border-slate-200 shadow-sm rounded-full">
            <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]"></div>
            <p className="text-sm text-slate-600 font-semibold">Central Division • Duty Active</p>
          </div>
        </section>

        <section className="py-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Division Overview</h3>
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            
            {/* Active Cases Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between h-40">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FolderOpen className="text-blue-600" size={20} />
                </div>
                <span className="text-sm text-slate-600 font-semibold">Active Cases</span>
              </div>
              <div className="text-4xl font-bold text-slate-900 mt-2">124</div>
              <div className="mt-3 flex items-center gap-1.5 bg-red-50 text-red-700 px-2.5 py-1 rounded-md w-fit border border-red-100">
                <AlertTriangle size={14} />
                <span className="text-xs font-bold">12 Critical</span>
              </div>
            </div>

            {/* On Duty Card */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow flex flex-col justify-between h-40">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                  <Users className="text-yellow-600" size={20} />
                </div>
                <span className="text-sm text-slate-600 font-semibold">On Duty</span>
              </div>
              <div className="text-4xl font-bold text-slate-900 mt-2">
                45<span className="text-xl text-slate-400 ml-1 font-medium">/ 50</span>
              </div>
              <div className="mt-3 flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md w-fit border border-blue-100">
                <MapPin size={14} />
                <span className="text-xs font-bold">Central Sector</span>
              </div>
            </div>

          </div>
        </section>

        <section className="py-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <button className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md hover:bg-slate-800 transition-all active:scale-[0.98] h-32">
              <FileText size={32} className="text-blue-400" />
              <span className="text-sm font-bold">File Report</span>
            </button>
            
            <button className="bg-white border border-slate-200 text-slate-700 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all active:scale-[0.98] h-32">
              <Calendar size={32} className="text-blue-600" />
              <span className="text-sm font-bold">Duty Roster</span>
            </button>
            
            <button className="bg-white border border-slate-200 text-slate-700 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all active:scale-[0.98] h-32">
              <MessageSquare size={32} className="text-blue-600" />
              <span className="text-sm font-bold">Comms</span>
            </button>
            
            <button className="bg-white border border-slate-200 text-slate-700 rounded-2xl p-5 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all active:scale-[0.98] h-32">
              <Package size={32} className="text-blue-600" />
              <span className="text-sm font-bold">Resources</span>
            </button>

          </div>
        </section>

        <section className="py-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Circulars</h3>
            <button className="text-xs font-bold text-blue-600 uppercase hover:text-blue-800 transition-colors">View All</button>
          </div>
          <div className="flex flex-col gap-4">
            
            <div className="bg-white p-4 rounded-2xl flex items-center justify-between border border-red-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                  <Megaphone size={22} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">VVIP Movement Protocol Update</span>
                  <span className="text-xs font-bold text-red-600">Urgent • Today, 09:00 AM</span>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-colors" size={20} />
            </div>

            <div className="bg-white p-4 rounded-2xl flex items-center justify-between border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                  <Gavel size={22} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-800 line-clamp-1 mb-1">Revised IPC Guidelines Review</span>
                  <span className="text-xs font-medium text-slate-500">Legal Dept • Yesterday</span>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-blue-600 transition-colors" size={20} />
            </div>

          </div>
        </section>
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

