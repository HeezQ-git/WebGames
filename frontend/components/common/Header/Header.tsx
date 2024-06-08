'use client';
import React from 'react';
import styles from './Header.module.css';
import {
  Avatar,
  Button,
  Menu,
  Tooltip,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import {
  MdOutlineDarkMode,
  MdOutlineLightMode,
  MdOutlineLogin,
  MdOutlineLogout,
  MdOutlineSettings,
} from 'react-icons/md';
import Link from 'next/link';
import { useModalStore } from '@/stores/modal';
import { useRouter } from 'next/navigation';
import { useGlobalStore } from '@/stores/global';

const Header = () => {
  const { session } = useGlobalStore();

  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { setOpenModal } = useModalStore();

  const router = useRouter();

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>NYT Games</h1>
      <div className={styles.rightSide}>
        <Button variant="subtle" color="orange" size="md">
          Games
        </Button>
        <Menu shadow="md" width={200} withArrow>
          <Menu.Target>
            <Avatar color="orange" variant="light" component={UnstyledButton} />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item
              leftSection={
                colorScheme === 'light' ? (
                  <MdOutlineDarkMode size={16} />
                ) : (
                  <MdOutlineLightMode size={16} />
                )
              }
              onClick={() =>
                setColorScheme(colorScheme === 'light' ? 'dark' : 'light')
              }
            >
              {colorScheme === 'light' ? 'Dark mode' : 'Light mode'}
            </Menu.Item>
            <Menu.Item
              leftSection={<MdOutlineSettings size={16} />}
              onClick={() => setOpenModal('SETTINGS')}
            >
              Settings
            </Menu.Item>
            {session?.data?.user?.name === 'Guest' ? (
              <Tooltip
                label="Sign in to save progress"
                position="left"
                withArrow
                offset={10}
                openDelay={500}
              >
                <Link href="/signin">
                  <Menu.Item
                    disabled={session?.status === 'loading'}
                    leftSection={<MdOutlineLogin size={16} />}
                  >
                    Sign in
                  </Menu.Item>
                </Link>
              </Tooltip>
            ) : (
              <Menu.Item
                disabled={session?.status === 'loading'}
                color="red"
                leftSection={<MdOutlineLogout size={16} />}
                onClick={() => router.push('/signout')}
              >
                Sign out
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
