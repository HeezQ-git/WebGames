'use client';
import React, { useMemo, useState } from 'react';
import styles from './SettingsModal.module.css';
import {
  Box,
  Group,
  Modal,
  NavLink,
  Divider,
  UnstyledButton,
} from '@mantine/core';
import {
  MdOutlineDangerous,
  MdOutlineEditNote,
  MdOutlinePerson,
} from 'react-icons/md';
import { useModalStore } from '@/stores/modal';
import { useMediaQuery } from '@mantine/hooks';
import { useSettingsStore } from '@/stores/settings';
import Tabs from './Tabs/Tabs';
import { useGlobalStore } from '@/stores/global';

const data = [
  {
    icon: MdOutlinePerson,
    label: 'Account',
    description: 'Update your account details',
  },
  {
    icon: MdOutlineEditNote,
    label: 'Content',
    description: 'Manage your preferences',
  },
  {
    icon: MdOutlineDangerous,
    label: 'Danger zone',
    color: 'red',
    description: 'Manage your sensitive data',
  },
];

const SettingsModal = () => {
  const { isSettingsModalOpen, setIsSettingsModalOpen } = useModalStore();
  const [active, setActive] = useState(0);
  const { editingElement, checkingUsername, form, setEditingElement } =
    useSettingsStore();

  const isMobile = useMediaQuery('(max-width: 768px)');

  const { session } = useGlobalStore();

  return useMemo(
    () => (
      <Modal
        opened={isSettingsModalOpen}
        onClose={() => {
          setIsSettingsModalOpen(false);
          setEditingElement(null);
          form.reset();
        }}
        title={<span className="modalTitle">Settings</span>}
        className={styles.settings}
        centered
        size="xl"
        overlayProps={{
          backgroundOpacity: 0.3,
          blur: 3,
        }}
      >
        <Group
          align="flex-start"
          style={{
            flexDirection: isMobile ? 'column' : 'row',
          }}
        >
          <Box maw={!isMobile ? 225 : 1000} my={!isMobile ? 20 : 0} w="100%">
            {data.map((item, index) => (
              <UnstyledButton
                key={item.label}
                onClick={() => setActive(index)}
                w="100%"
              >
                <NavLink
                  active={index === active}
                  label={item.label}
                  description={index === active && item.description}
                  leftSection={<item.icon size={16} />}
                  color={item.color}
                />
              </UnstyledButton>
            ))}
          </Box>
          <Divider
            orientation={isMobile ? 'horizontal' : 'vertical'}
            w={isMobile ? '100%' : undefined}
          />
          <Tabs active={active} />
        </Group>
      </Modal>
    ),
    [
      isSettingsModalOpen,
      active,
      session?.status,
      session?.data,
      editingElement,
      checkingUsername,
      isMobile,
    ]
  );
};

export default SettingsModal;
