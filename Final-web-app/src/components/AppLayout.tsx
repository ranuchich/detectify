import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase,
  FileText,
  Users, 
  Settings, 
  LogOut, 
  Monitor,
  Menu,
  X,
  PlusSquare,
  BarChart3,
  ChevronRight,
  Search,
  Shield,
  Database
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { clearSupabaseConfig } from '@/lib/supabase';

const sidebarItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'manager', 'staff'] },
  { name: 'Job Listings', icon: Briefcase, path: '/jobs', roles: ['admin', 'manager', 'staff'] },
  { name: 'Applications', icon: FileText, path: '/applications', roles: ['admin', 'manager', 'staff'] },
  { name: 'Talent Pool', icon: Users, path: '/talent', roles: ['admin', 'manager', 'staff'] },
  { name: 'Internal Team', icon: Shield, path: '/employees', roles: ['admin'] },
];

export const AppLayout: React.FC = () => {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = sidebarItems.filter(item => 
    !item.roles || (profile && item.roles.includes(profile.role))
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Mobile Sidebar Overlay */}
      <div className={cn(
        "fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity lg:hidden",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      )} onClick={() => setIsOpen(false)} />

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-slate-900 text-slate-100 transition-transform lg:static lg:block",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-6 border-b border-slate-800">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center p-1 group transition-colors hover:bg-white/10">
              <Logo className="w-full h-full" />
            </div>
            <h1 className="text-white font-bold text-lg tracking-tight">Detectify <span className="text-blue-400">Jobs</span></h1>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <div className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-3 px-3 mt-2">Management</div>
          {filteredItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                location.pathname === item.path 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
              )}
              onClick={() => setIsOpen(false)}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                location.pathname === item.path ? "text-blue-400" : "text-slate-500 group-hover:text-slate-200"
              )} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3">
            <div className="h-10 w-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold overflow-hidden">
               {profile?.avatar_url ? (
                 <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
               ) : (
                 profile?.full_name?.charAt(0) || 'U'
               )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-medium truncate">{profile?.full_name || 'Admin User'}</p>
              <p className="text-[10px] text-slate-500 truncate lowercase">{profile?.email || 'admin@detectify.com'}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => {
                if (window.confirm("Disconnect from your current Supabase database and clear configuration keys?")) {
                  clearSupabaseConfig();
                  localStorage.removeItem('sandbox_session');
                  window.location.reload();
                }
              }} 
              className="text-slate-500 hover:text-amber-400 hover:bg-slate-850 h-8 w-8"
              title="Disconnect Database"
            >
              <Database className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut} className="text-slate-500 hover:text-white hover:bg-slate-800 h-8 w-8" title="Sign Out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-sm text-slate-500">
             <Button variant="ghost" size="icon" className="lg:hidden -ml-2 mr-2" onClick={() => setIsOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <span>Admin</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-900 font-medium capitalize">
              {location.pathname === '/' ? 'Dashboard Overview' : location.pathname.substring(1).split('/')[0]}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search jobs or candidates..." 
                className="bg-slate-100 border-none rounded-full px-4 py-1.5 pl-9 text-xs w-64 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 h-9 px-4 rounded-full text-xs font-semibold shadow-lg shadow-blue-600/20">
               <PlusSquare className="h-4 w-4 mr-2" />
               Post a Job
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
