import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { AuthProvider } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AppLayout } from '@/components/AppLayout';
import { isSupabaseConfigured, saveSupabaseConfig } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, Key, Settings, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

// Pages
import { Landing } from '@/pages/Landing';
import { Dashboard } from '@/pages/Dashboard';
import { Products } from '@/pages/Products';
import { Orders } from '@/pages/Orders';
import { Customers } from '@/pages/Customers';
import { Employees } from '@/pages/Employees';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const Unauthorized = () => (
  <div className="flex flex-col items-center justify-center h-screen space-y-4">
    <h1 className="text-4xl font-bold text-rose-600">403</h1>
    <p className="text-slate-500">You do not have permission to access this page.</p>
    <Navigate to="/" replace />
  </div>
);

const SetupGuide = () => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast.error('Please enter a valid Supabase URL.');
      return;
    }
    if (!key.trim()) {
      toast.error('Please enter a valid Supabase Anon Key.');
      return;
    }

    try {
      setIsSubmitting(true);
      saveSupabaseConfig(url, key);
      toast.success('Credentials saved! Initializing database connection...', {
        description: 'Page will reload to establish live connectivity.'
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      toast.error('Failed to configure database: ' + (err?.message || err));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <Card className="max-w-2xl w-full border border-slate-200 shadow-2xl rounded-3xl overflow-hidden bg-white">
        <div className="bg-gradient-to-tr from-blue-600 to-indigo-700 p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md font-bold">
              <Database className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Supabase Connection Required</h1>
          </div>
          <p className="text-blue-100 leading-relaxed text-sm">
            Please enter your Supabase project properties below. This allows the computer shop and careers management database system to persist real tables and records securely.
          </p>
        </div>
        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleConnect} className="space-y-4 bg-slate-50 border border-slate-100 p-6 rounded-2xl">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Key className="h-4 w-4 text-blue-500" />
              Configure Credentials
            </h3>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Supabase Project URL</label>
                <input
                  type="text"
                  placeholder="https://your-project.supabase.co"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Supabase Anon Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold shadow-md shadow-blue-500/15 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting && <RefreshCw className="h-4 w-4 animate-spin" />}
              {isSubmitting ? 'Verifying & Saving...' : 'Save & Connect'}
            </Button>
          </form>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Settings className="h-4 w-4 text-slate-400" />
              Optional: AI Studio Environment Settings
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              If you prefer to configure variables through the container environment, add these variables in your AI Studio Secrets configuration:
            </p>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm text-xs font-mono font-bold text-slate-700">
                <span>VITE_SUPABASE_URL</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm text-xs font-mono font-bold text-slate-700">
                <span>VITE_SUPABASE_ANON_KEY</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-900">Database Setup Tip</p>
                <p className="text-[10px] leading-relaxed text-amber-700">
                  After saving, please execute the SQL setup rules located in <code className="bg-amber-100 px-1 rounded font-bold">/database/schema.sql</code> in your Supabase SQL Editor to initiate the required system models.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

function App() {
  if (!isSupabaseConfigured) {
    return <SetupGuide />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/jobs" element={<Products />} />
                <Route path="/applications" element={<Orders />} />
                <Route path="/talent" element={<Customers />} />
                <Route path="/employees" element={<Employees />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        <Toaster position="top-right" richColors />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
