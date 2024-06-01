'use client';
import SpellingBee from '@/pages/SpellingBee/SpellingBee';
import React from 'react';
import styles from './../../page.module.css';

const page = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  return (
    <div className={styles.container}>
      <SpellingBee invite={params.id} />
    </div>
  );
};

export default page;
