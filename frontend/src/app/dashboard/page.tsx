'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to invitations page by default
    router.push('/dashboard/invitations');
  }, [router]);

  return null;
}