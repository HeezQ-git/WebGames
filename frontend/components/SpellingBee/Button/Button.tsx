import React from 'react';
import styles from './Button.module.css';
import clsx from 'clsx';

const Button = ({
  children,
  onClick,
  type = 'normal',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'normal' | 'icon';
}) => {
  return (
    <button
      className={clsx(styles.button, type === 'icon' && styles.icon)}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
