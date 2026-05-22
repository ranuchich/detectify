import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, Globe, Users, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'motion/react';

export const Landing: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="w-10 h-10" />
            <span className="font-bold text-xl tracking-tight text-slate-900">
              Detectify <span className="text-blue-600 font-extrabold uppercase text-[10px] tracking-widest ml-1 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 align-middle">Jobs</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500 uppercase tracking-wider">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#about" className="hover:text-blue-600 transition-colors">About</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="font-bold text-slate-600 text-xs uppercase tracking-widest hover:bg-slate-50">Log In</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-widest px-6 h-10 rounded-xl shadow-lg transition-transform active:scale-95">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-20 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 -z-10 w-[300px] h-[300px] bg-slate-50 rounded-full blur-[80px] -translate-x-1/2 translate-y-1/2" />

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">Global Talent Network</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter leading-[0.9] lg:max-w-lg">
              Find your next <br />
              <span className="text-blue-600">career</span> move.
            </h1>
            
            <p className="text-lg text-slate-500 font-medium max-w-md leading-relaxed">
              Detectify Jobs connects the most ambitious talent with internship and job opportunities world-wide.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/register" className="w-full sm:w-auto">
                <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm uppercase tracking-widest px-8 rounded-2xl shadow-xl shadow-blue-600/20 group">
                  Find Jobs
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/login" className="w-full sm:w-auto text-center font-bold text-slate-500 text-xs uppercase tracking-widest hover:text-slate-900 transition-colors">
                Corporate Login
              </Link>
            </div>

            <div className="pt-4 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400 overflow-hidden">
                    <div className="bg-slate-200 w-full h-full" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span className="text-slate-900">800+</span> companies hiring now
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-[80px] scale-150 rotate-45 animate-pulse" />
              <div className="relative z-10 w-96 h-96 transition-transform duration-700 group-hover:scale-105">
                <Logo className="w-full h-full drop-shadow-2xl" />
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Stats / Features Strip */}
      <section id="features" className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between gap-12">
          {[
            { label: 'Verified Partners', value: '250+', icon: ShieldCheck },
            { label: 'Active Listings', value: '1.2k', icon: Briefcase },
            { label: 'Applications Today', value: '450+', icon: Globe },
            { label: 'User Rating', value: '4.9/5', icon: Users },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                <stat.icon className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 opacity-50 grayscale">
            <Logo className="w-6 h-6" />
            <span className="font-bold text-sm tracking-tight text-slate-900">Detectify</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2026 Detectify Jobs Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
             <a href="#" className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Privacy</a>
             <a href="#" className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Terms</a>
             <a href="#" className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
