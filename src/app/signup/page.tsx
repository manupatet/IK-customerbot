"use client";

import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const { signup, user, isLoading: authIsLoading } = useAuth(); // Renamed isLoading to authIsLoading
  const router = useRouter();

  useEffect(() => {
    if (!authIsLoading && user) {
      router.replace('/chat');
    }
  }, [user, authIsLoading, router]);

  const handleSignup = async (email: string, pass: string): Promise<boolean> => {
    const success = await signup(email, pass);
    if (success) {
      router.push('/chat'); // Use push for navigation history
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

  return <AuthForm mode="signup" onSubmit={handleSignup} />;
}
