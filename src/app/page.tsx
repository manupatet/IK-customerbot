"use client";

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/chat');
      } else {
        router.replace('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-center">
      <Loader2 className="mb-4 h-16 w-16 animate-spin text-primary" />
      <h1 className="text-2xl font-semibold text-foreground">ProductAssist</h1>
      <p className="mt-2 text-muted-foreground">Loading your experience...</p>
    </div>
  );
}
