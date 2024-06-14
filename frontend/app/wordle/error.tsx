'use client';
import React from 'react';

const error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) => {
  return (
    <div>
      <h1>Error</h1>
      <pre>{error.message}</pre>
      <pre>{error.stack}</pre>
      <pre>{error.digest}</pre>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

export default error;
