"use client";
import React from 'react';
import { 
  Shield, Menu, Bell, UserCircle, Home, FileText, 
  Calendar, MessageSquare, Package, Settings, 
  Users, AlertTriangle, Car, MoreHorizontal, 
  ChevronRight, Download, Activity, LogOut, CheckCircle2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Authority() {
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
        <div className="flex items-center justify-between px-4 md:px-6 h-16 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button className="text-slate-300 hover:text-white md:hidden p-1 rounded-md hover:bg-slate-800 transition-colors">
              <Menu size={24} />
            </button>
            <Shield className="text-blue-400 hidden sm:block" size={28} />
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">UP POLICE</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-slate-300 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white border-2 border-slate-700 overflow-hidden cursor-pointer">
              <UserCircle size={32} className="text-blue-200" />
            </div>
            <button onClick={handleLogout} className="text-slate-300 hover:text-red-400 p-2 rounded-full hover:bg-slate-800 transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col py-6 shrink-0 z-10 shadow-sm">
          <div className="px-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                <Shield size={24} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 leading-tight">DGP Headquarters</h2>
                <p className="text-xs text-green-600 font-semibold mt-0.5">Active Service</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">ID: 7729-UPP</p>
              </div>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto px-4 space-y-1">
            <Link className="flex items-center gap-3 bg-blue-50 text-blue-700 font-semibold rounded-lg px-4 py-3 transition-colors" href="/authority">
              <Home size={18} /> Home
            </Link>
            <Link className="flex items-center gap-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg px-4 py-3 transition-colors" href="/authority">
              <FileText size={18} /> Service Records
            </Link>
            <Link className="flex items-center gap-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg px-4 py-3 transition-colors" href="/authority">
              <Calendar size={18} /> Duty Roster
            </Link>
            <Link className="flex items-center gap-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg px-4 py-3 transition-colors" href="/authority">
              <MessageSquare size={18} /> Internal Comms
            </Link>
            <Link className="flex items-center gap-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg px-4 py-3 transition-colors" href="/authority">
              <Package size={18} /> Resources
            </Link>
            <Link className="flex items-center gap-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-lg px-4 py-3 transition-colors mt-auto" href="/authority">
              <Settings size={18} /> Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 space-y-8 pb-24 md:pb-8">
          
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Strategic Overview</h2>
              <p className="text-sm text-slate-500 mt-1">Live metrics from all zones. High alert status in 2 districts.</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-xs font-bold border border-red-100">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              LIVE SYNC
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            
            {/* Card 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                  <Users size={20} />
                </div>
                <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-100">OPTIMAL</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Force Readiness</p>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-slate-900">94.2%</h3>
                <span className="text-xs font-bold text-green-600 mb-1.5 flex items-center"><Activity size={12} className="mr-1"/> 1.2%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full w-[94.2%]"></div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-red-50 text-red-600 rounded-xl">
                  <AlertTriangle size={20} />
                </div>
                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">ELEVATED</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Active Operations</p>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-slate-900">14</h3>
                <span className="text-xs font-bold text-red-600 mb-1.5">↑ 3 new</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-red-500 h-full rounded-full w-[60%]"></div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl">
                  <Car size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">STABLE</span>
              </div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Resource Allocation</p>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-slate-900">82%</h3>
                <span className="text-xs font-bold text-slate-500 mb-1.5">Deployed</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
                <div className="bg-slate-700 h-full rounded-full w-[82%]"></div>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Priority Tasks */}
            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Top Priority Tasks</h3>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              <div className="divide-y divide-slate-100 flex-1">
                
                <div className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-slate-900 truncate pr-2">Deploy QRT to Zone B</h4>
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 shrink-0">CRITICAL</span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">Escalating situation requires immediate deployment of Quick Response Teams to secure key infrastructure.</p>
                    <div className="flex gap-2">
                      <span className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold px-2 py-1 rounded">Action Req</span>
                      <span className="bg-orange-50 text-orange-700 text-[10px] uppercase font-bold px-2 py-1 rounded">ETA: 15m</span>
                    </div>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors self-center ml-2" />
                </div>

                <div className="p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-slate-900 truncate pr-2">Review Daily Intel Brief</h4>
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 shrink-0">PENDING</span>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2">Consolidated intelligence report from central dispatch regarding upcoming public gatherings.</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-600 transition-colors self-center ml-2" />
                </div>

              </div>
              <div className="p-3 border-t border-slate-100 text-center bg-slate-50 mt-auto">
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider transition-colors">View All Tasks</button>
              </div>
            </section>

            {/* Bulletins */}
            <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
              <div className="bg-slate-50 px-5 py-4 border-b border-slate-200 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Statewide Bulletins</h3>
                <MessageSquare size={18} className="text-slate-400" />
              </div>
              <div className="p-5 flex-1 space-y-6">
                
                <div className="relative pl-4">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-full"></div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">Today, 0800 HRS</p>
                  <h4 className="font-semibold text-slate-900 mb-1">Protocol Update: Convoy Security</h4>
                  <p className="text-sm text-slate-600">New routing protocols for VIP movement taking effect immediately. All units review attached documentation.</p>
                </div>

                <div className="relative pl-4">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 rounded-full"></div>
                  <p className="text-xs font-semibold text-slate-400 mb-1">Yesterday, 1430 HRS</p>
                  <h4 className="font-semibold text-slate-900 mb-1">Weather Advisory: Heavy Rain</h4>
                  <p className="text-sm text-slate-600">Anticipate flooding in low-lying sectors. Patrol vehicles to carry emergency recovery kits.</p>
                </div>
                
              </div>
              <div className="p-5 pt-0 mt-auto">
                <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm">
                  <Download size={16} />
                  DOWNLOAD FULL REPORT
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>

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


