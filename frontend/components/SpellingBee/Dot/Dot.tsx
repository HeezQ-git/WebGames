import React from 'react';
import styles from './Dot.module.css';
import clsx from 'clsx';

const Dot = ({
  active = false,
  achieved = false,
  score = 0,
}: {
  active?: boolean;
  achieved?: boolean;
  score?: number | string;
}) => {
  return (
    <div
      className={clsx(
        styles.dot,
        active && styles.dotActive,
        achieved && styles.achieved
      )}
    >
      {active ? score : null}
    </div>
  );
};

export default Dot;
