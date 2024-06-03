import React from 'react';
import styles from './Button.module.css';
import clsx from 'clsx';
import { UnstyledButton } from '@mantine/core';

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
    <UnstyledButton
      className={clsx(
        styles.button,
        type === 'icon' && styles.icon,
        size === 'small' && styles.small,
        color === 'warning' && styles.warning,
        fullWidth && styles.fullWidth
      )}
      onClick={onClick}
      aria-label={icon ? 'Button refresh' : `Button ${children}`}
    >
      {icon && <div className={styles.iconElement}>{icon}</div>}
      {children}
    </UnstyledButton>
  );
};

export default Button;
