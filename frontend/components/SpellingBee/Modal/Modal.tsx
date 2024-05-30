'use client';
import React from 'react';
import styles from './Modal.module.css';
import IconCloseOutline from '@/assets/icons/close';
import clsx from 'clsx';

export interface ModalProps {
  children: React.ReactNode;
  open: boolean;
  closeModal: () => void;
  title?: string;
  subtitle?: string;
  noContentPadding?: boolean;
  classNames?: string[];
}

const Modal = (props: ModalProps) => {
  const {
    children,
    open = true,
    title,
    subtitle,
    closeModal,
    noContentPadding,
    classNames,
  } = props;

  return open ? (
    <>
      <div
        className={styles.overlay}
        onClick={(e) => {
          e.stopPropagation();
          closeModal();
        }}
      />
      <div className={clsx(styles.modal, ...(classNames || []))}>
        <div className={styles.close}>
          <div className={styles.header}>
            <span className={styles.title}>{title}</span>
            <span className={styles.subtitle}>{subtitle}</span>
          </div>
          <div
            className={styles.closeButton}
            onClick={(e) => {
              e.stopPropagation();
              closeModal();
            }}
          >
            <IconCloseOutline height="1.5em" width="1.5em" />
          </div>
        </div>
        <div
          className={clsx(
            styles.content,
            noContentPadding && styles.noContentPadding
          )}
        >
          {children}
        </div>
      </div>
    </>
  ) : null;
};

export default Modal;
