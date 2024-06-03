'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import SessionManager from '../SessionManager/SessionManager';

const Session = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      {children}
      <SessionManager />
    </SessionProvider>
  );
};

export default Session;
