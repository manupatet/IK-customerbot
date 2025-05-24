"use client";

import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from 'next/link';
import { Loader2, KeyRound, AtSign } from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'signup';
  onSubmit: (email: string, pass: string) => Promise<boolean>; // onSubmit returns true on success
}

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email || !password) {
        // Basic validation, can be expanded with react-hook-form for better UX
        alert("Email and password are required.");
        return;
    }
    setIsLoading(true);
    await onSubmit(email, password);
    // setIsLoading(false) will be handled by page if navigation occurs or if an error is shown by toast
    // If onSubmit doesn't navigate, ensure isLoading is reset
    // For this setup, successful submit navigates, failed shows toast and form remains.
    // So, we should reset loading on failure. The promise boolean helps here.
    // The current setup in login/signup page.tsx handles navigation on success.
    // If it fails, it stays on the page, so isLoading must be reset.
    setIsLoading(false); 
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="w-full max-w-md rounded-xl shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M12 6c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm0 7c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
          <CardTitle className="text-3xl font-bold text-foreground">
            {mode === 'login' ? 'Welcome Back!' : 'Create Your Account'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {mode === 'login' ? 'Sign in to access ProductAssist.' : 'Sign up to get started with ProductAssist.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-medium">Email Address</Label>
              <div className="relative flex items-center">
                <AtSign className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 py-3 text-base border-input focus:border-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="font-medium">Password</Label>
               <div className="relative flex items-center">
                <KeyRound className="absolute left-3 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 py-3 text-base border-input focus:border-primary"
                />
              </div>
            </div>
            <Button type="submit" className="w-full text-lg py-3 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
              {mode === 'login' ? 'Sign In' : 'Sign Up'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="mt-4 flex flex-col items-center justify-center space-y-2">
          {mode === 'login' ? (
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link href="/signup" className="font-medium text-primary hover:underline hover:text-primary/80">
                Sign up
              </Link>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary hover:underline hover:text-primary/80">
                Sign in
              </Link>
            </p>
          )}
        </CardFooter>
      </Card>
       <p className="mt-8 text-center text-xs text-muted-foreground">
        ProductAssist &copy; {new Date().getFullYear()} <br/>
        Secure and AI-Powered Customer Support
      </p>
    </div>
  );
}
