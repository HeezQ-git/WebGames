'use client';

import Loading from '@/components/common/Loading/Loading';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/games');
  }, []);

  return <Loading label="Redirecting" />;
}
