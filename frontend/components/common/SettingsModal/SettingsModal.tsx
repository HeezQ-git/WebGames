'use client';
import React, { useEffect, useMemo, useState } from 'react';
import styles from './SettingsModal.module.css';
import {
  Box,
  Group,
  Modal,
  NavLink,
  Stack,
  Divider,
  PasswordInput,
  UnstyledButton,
} from '@mantine/core';
import {
  MdOutlineDangerous,
  MdOutlineEditNote,
  MdOutlineLock,
  MdOutlinePerson,
} from 'react-icons/md';
import { useModalStore } from '@/stores/modal';
import { useSession } from 'next-auth/react';
import { useForm } from '@mantine/form';
import { useDebouncedValue, useViewportSize } from '@mantine/hooks';
import {
  checkUsername,
  validateConfirmPassword,
  validatePassword,
  validateUsername,
} from '@/lib/validation';
import { useSettingsStore } from '@/stores/settings';
import EditableField from './subcomponents/EditableField';
import { FormValues } from '@/types/settingsStore';
import UsernameInput from '../CustomInputs/UsernameInput';
import { fetcher } from '@/lib/fetcher';
import toast from 'react-hot-toast';

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
  const {
    editingElement,
    checkingUsername,
    setCheckingUsername,
    setSessionStatus,
    setForm,
    setEditingElement,
  } = useSettingsStore();

  const { width } = useViewportSize();

  const { data: userData, status, update } = useSession();

  const form = useForm<FormValues>({
    initialValues: {
      username: userData?.user?.name || '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      newPassword:
        editingElement === 'password' ? validatePassword : () => null,
    },
    validateInputOnChange: true,
  });

  const handleSubmit = async (data: FormValues) => {
    if (
      editingElement === 'username' &&
      data.username !== userData?.user?.name
    ) {
      if (await checkUsername(data?.username || '', setCheckingUsername)) {
        form.setFieldError('username', 'Username is already taken');
        return;
      } else {
        const validationResult = validateUsername(data.username);

        if (validationResult) {
          form.setFieldError('username', validationResult);
          return;
        } else {
          const response = await fetcher('POST', { wholeResponse: true })(
            'api/player/change-username',
            {
              username: data.username,
            }
          );

          if (response.status === 200) {
            toast.success('Username changed successfully');
            await update({ name: data.username });
            form.setFieldValue('username', data.username);
            setEditingElement(null);
            setIsSettingsModalOpen(false);
          } else {
            form.setFieldError('username', 'Something went wrong');
          }
        }
      }
    } else if (editingElement === 'password') {
      const validationNewPass = validatePassword(data.newPassword);
      const validationConfirmPass = validateConfirmPassword(
        data.newPassword,
        data.confirmPassword
      );

      if (validationNewPass) {
        form.setFieldError('newPassword', validationNewPass);
        return;
      } else if (validationConfirmPass) {
        form.setFieldError('confirmPassword', validationConfirmPass);
        return;
      } else {
        const response = await fetcher('POST', { wholeResponse: true })(
          'api/player/change-password',
          {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
          }
        );

        if (response.status === 200) {
          toast.success('Password changed successfully');
          setIsSettingsModalOpen(false);
        } else {
          form.setFieldError('oldPassword', 'Invalid password');
        }
      }
    }
  };

  const [debouncedUsername] = useDebouncedValue(form.values.username, 400);
  const [debouncedWidth] = useDebouncedValue(width, 400);

  useEffect(() => {
    setSessionStatus(status);
    setForm(form);

    const username = userData?.user?.name;

    if (status === 'authenticated' && form.values.username === '') {
      form.setFieldValue('username', username);
    }
  }, [status, userData, form.values.username]);

  useEffect(() => {
    if (!debouncedUsername || debouncedUsername === userData?.user?.name)
      return;

    (async () => {
      if (await checkUsername(debouncedUsername, setCheckingUsername)) {
        form.setFieldError('username', 'Username is already taken');
      }
    })();
  }, [debouncedUsername]);

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
            flexDirection: debouncedWidth < 768 ? 'column' : 'row',
          }}
        >
          <Box
            maw={debouncedWidth > 768 ? 225 : 1000}
            my={debouncedWidth > 768 ? 20 : 0}
            w="100%"
          >
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
            orientation={debouncedWidth < 768 ? 'horizontal' : 'vertical'}
            w={debouncedWidth < 768 ? '100%' : undefined}
          />
          <Stack
            flex={1}
            p={10}
            gap="xl"
            component="form"
            onSubmit={form.onSubmit(handleSubmit) as any}
          >
            <EditableField name="username" label="Change username">
              <UsernameInput
                checkingUsername={checkingUsername}
                form={form}
                disabled={editingElement !== 'username'}
              />
            </EditableField>
            <EditableField name="password" label="Change password">
              <PasswordInput
                placeholder="Old password"
                leftSection={<MdOutlineLock />}
                required
                key={form.key('oldPassword')}
                {...form.getInputProps('oldPassword')}
                disabled={status === 'loading' || editingElement !== 'password'}
              />
              {form.values.oldPassword && (
                <PasswordInput
                  placeholder="New password"
                  leftSection={<MdOutlineLock />}
                  required
                  key={form.key('newPassword')}
                  {...form.getInputProps('newPassword')}
                  disabled={
                    status === 'loading' || editingElement !== 'password'
                  }
                />
              )}
              {form.values.oldPassword && form.values.newPassword && (
                <PasswordInput
                  placeholder="Confirm password"
                  leftSection={<MdOutlineLock />}
                  required
                  key={form.key('confirmPassword')}
                  {...form.getInputProps('confirmPassword')}
                  disabled={
                    status === 'loading' || editingElement !== 'password'
                  }
                />
              )}
            </EditableField>
          </Stack>
        </Group>
      </Modal>
    ),
    [
      isSettingsModalOpen,
      active,
      debouncedWidth,
      status,
      userData,
      editingElement,
      form,
      checkingUsername,
    ]
  );
};

export default SettingsModal;
