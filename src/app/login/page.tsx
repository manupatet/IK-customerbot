"use client";

import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { login, user, isLoading: authIsLoading } = useAuth(); // Renamed isLoading to authIsLoading
  const router = useRouter();

  useEffect(() => {
    if (!authIsLoading && user) {
      router.replace('/chat');
    }
  }, [user, authIsLoading, router]);

  const handleLogin = async (email: string, pass: string): Promise<boolean> => {
    const success = await login(email, pass);
    if (success) {
      router.push('/chat'); // Use push for navigation history, replace if no history needed
    }
    return success;
  };
  
  if (authIsLoading || (!authIsLoading && user)) {
     return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <AuthForm mode="login" onSubmit={handleLogin} />;
}
