import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Monitor, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Logo } from '@/components/Logo';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          }
        }
      });

      if (authError) throw authError;

      // Note: In a production Supabase setup with email confirmation enabled,
      // the user won't be able to log in until they confirm their email.
      // If email confirmation is disabled, they are logged in immediately.
       
      if (authData.user) {
        // Explicitly create profile row as a fallback if SQL triggers aren't configured
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: authData.user.id, 
              full_name: data.fullName,
              role: 'staff' // Default role for new signups
            }
          ]);

        if (profileError) {
          console.error('Error creating profile:', profileError);
          // We don't throw here because the user is still created in Auth
          // and might be able to log in, but lack a profile.
        }

        toast.success('Registration successful! Please check your email for a verification link before logging in.');
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to register');
      console.error('Registration error:', error);
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
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h1>
          <p className="text-slate-500 font-medium">Join the Detectify Jobs talent network</p>
        </div>

        <Card className="border border-slate-200 shadow-xl rounded-2xl overflow-hidden bg-white">
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader className="border-b border-slate-50 pb-6">
              <CardTitle className="text-xl font-bold">Register</CardTitle>
              <CardDescription>Enter your details to create an account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="fullName" 
                    placeholder="John Doe" 
                    className="pl-9 h-11 border-slate-200 rounded-xl focus:ring-blue-500"
                    {...register('fullName')}
                  />
                </div>
                {errors.fullName && <p className="text-xs text-rose-500 font-medium">{errors.fullName.message}</p>}
              </div>

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
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</Label>
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="••••••••" 
                    className="pl-9 h-11 border-slate-200 rounded-xl focus:ring-blue-500"
                    {...register('confirmPassword')}
                  />
                </div>
                {errors.confirmPassword && <p className="text-xs text-rose-500 font-medium">{errors.confirmPassword.message}</p>}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-6 pt-2">
              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 uppercase tracking-widest text-xs" disabled={isLoading}>
                {isLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <div className="text-center w-full">
                <p className="text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500">
                    Sign In
                  </Link>
                </p>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
