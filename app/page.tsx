"use client"
import { useAuth } from '@/app/auth-provider';
import { redirect } from 'next/navigation';

export default function HomePage() {
  const { session } = useAuth()

  if (!session) {
    return redirect('/signin')
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="font-semibold text-6xl underline decoration-3">Helper</h1>
    </div>
  );
}
