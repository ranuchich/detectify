import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Monitor, Lock, Mail, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Logo } from '@/components/Logo';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      
      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (email: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', 'password123', { shouldValidate: true });
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: 'password123',
      });

      if (error) throw error;
      
      toast.success('Successfully logged in as demo user!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-600/10 ring-1 ring-slate-100 p-2">
              <Logo className="w-full h-full" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 font-medium">Log in to your Detectify Jobs account</p>
        </div>

        <Card className="border border-slate-200 shadow-xl rounded-2xl overflow-hidden bg-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader className="border-b border-slate-50 pb-6">
              <CardTitle className="text-xl font-bold">Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-9 h-11 border-slate-200 rounded-xl focus:ring-blue-500"
                    {...register('email')}
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-9 h-11 border-slate-200 rounded-xl focus:ring-blue-500"
                    {...register('password')}
                  />
                </div>
                {errors.password && <p className="text-xs text-rose-500 font-medium">{errors.password.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-6 p-6 pt-2">
              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 uppercase tracking-widest text-xs" disabled={isLoading}>
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="w-full space-y-4">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Sandbox Quick Access</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@detectify.com')}
                    disabled={isLoading}
                    className="flex items-center gap-3 w-full p-3 text-left border border-slate-200 rounded-xl bg-slate-50 hover:bg-blue-50/40 hover:border-blue-200 transition-all duration-200 group disabled:opacity-50"
                  >
                    <div className="h-2 w-2 rounded-full bg-indigo-600 shrink-0 group-hover:scale-125 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 flex justify-between">
                        <span>Alex Rivera</span>
                        <span className="text-[10px] font-semibold text-indigo-600 tracking-wider uppercase bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">Admin</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">admin@detectify.com</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('recruiter@detectify.com')}
                    disabled={isLoading}
                    className="flex items-center gap-3 w-full p-3 text-left border border-slate-100 rounded-xl bg-slate-50 hover:bg-emerald-50/40 hover:border-emerald-200 transition-all duration-200 group disabled:opacity-50"
                  >
                    <div className="h-2 w-2 rounded-full bg-emerald-600 shrink-0 group-hover:scale-125 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 flex justify-between">
                        <span>Sarah Chen</span>
                        <span className="text-[10px] font-semibold text-emerald-600 tracking-wider uppercase bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">Partner</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">recruiter@detectify.com</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('applicant@detectify.com')}
                    disabled={isLoading}
                    className="flex items-center gap-3 w-full p-3 text-left border border-slate-100 rounded-xl bg-slate-50 hover:bg-violet-50/40 hover:border-violet-200 transition-all duration-200 group disabled:opacity-50"
                  >
                    <div className="h-2 w-2 rounded-full bg-violet-600 shrink-0 group-hover:scale-125 transition-transform" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 flex justify-between">
                        <span>Liam Johnson</span>
                        <span className="text-[10px] font-semibold text-violet-600 tracking-wider uppercase bg-violet-50 border border-violet-100 px-1.5 py-0.5 rounded">Candidate</span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">applicant@detectify.com</p>
                    </div>
                  </button>
                </div>
                
                <p className="text-[9px] leading-normal text-slate-400 font-medium text-center">
                  Persistent local sandbox active. Registration and records save to browser memory.
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-blue-600 hover:text-blue-500">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
