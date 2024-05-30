import React from 'react';
import styles from './Button.module.css';
import clsx from 'clsx';

const Button = ({
  children,
  onClick,
  type = 'normal',
  size,
  color,
  fullWidth,
  icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'normal' | 'icon';
  size?: 'small' | 'medium' | 'large';
  color?: 'default' | 'warning';
  fullWidth?: boolean;
  icon?: React.ReactNode;
}) => {
  return (
    <button
      className={clsx(
        styles.button,
        type === 'icon' && styles.icon,
        size === 'small' && styles.small,
        color === 'warning' && styles.warning,
        fullWidth && styles.fullWidth
      )}
      onClick={onClick}
    >
      {icon && <div className={styles.iconElement}>{icon}</div>}
      {children}
    </button>
  );
};

export default Button;
