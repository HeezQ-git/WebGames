import React from 'react';
import Key from '../Keys/Key/Key';
import styles from './InlineKeys.module.css';

const InlineKeys = ({
  centerLetter,
  letters,
}: {
  centerLetter: string;
  letters: string[];
}) => {
  return (
    <div className={styles.keys}>
      <Key letter={centerLetter} centerKey />
      {letters.map(
        (letter) =>
          letter !== centerLetter && <Key key={letter} letter={letter} />
      )}
    </div>
  );
};

export default InlineKeys;
