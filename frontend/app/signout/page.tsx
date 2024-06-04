'use client';
import Loading from '@/components/common/Loading/Loading';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const page = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.back();
    window.location.reload();
  };

  useEffect(() => {
    handleSignOut();
  }, []);

  return <Loading />;
};

export default page;
