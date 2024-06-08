import { PasswordInput, Stack } from '@mantine/core';
import React, { useEffect } from 'react';
import EditableField from '../../subcomponents/EditableField';
import UsernameInput from '@/components/common/CustomInputs/UsernameInput';
import { MdOutlineLock } from 'react-icons/md';
import { fetcher } from '@/lib/fetcher';
import {
  checkUsername,
  validateConfirmPassword,
  validatePassword,
  validateUsername,
} from '@/lib/validation';
import { FormValues } from '@/types/settingsStore';
import { useSettingsStore } from '@/stores/settings';
import { useModalStore } from '@/stores/modal';
import toast from 'react-hot-toast';
import { useDebouncedValue, useMediaQuery } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import { useGlobalStore } from '@/stores/global';

const Account = () => {
  const { session } = useGlobalStore();
  const { setOpenModal } = useModalStore();
  const {
    editingElement,
    setEditingElement,
    checkingUsername,
    setCheckingUsername,
    setForm,
  } = useSettingsStore();

  const form = useForm<FormValues>({
    initialValues: {
      username: session?.data?.user?.name || '',
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

  const isMobile = useMediaQuery('(max-width: 768px)');
  const [debouncedUsername] = useDebouncedValue(form.values.username, 400);

  const handleSubmit = async (data: FormValues) => {
    if (
      editingElement === 'username' &&
      data.username !== session?.data?.user?.name
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
          const response = await fetcher('PATCH', { wholeResponse: true })(
            'api/player/change-username',
            {
              username: data.username,
            }
          );

          if (response.status === 200) {
            toast.success('Username changed successfully');
            await session?.update({ name: data.username });
            form.setFieldValue('username', data.username);
            setEditingElement(null);
            setOpenModal(null);
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
        const response = await fetcher('PATCH', { wholeResponse: true })(
          'api/player/change-password',
          {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
          }
        );

        if (response.status === 200) {
          toast.success('Password changed successfully');
          setOpenModal(null);
        } else {
          form.setFieldError('oldPassword', 'Invalid password');
        }
      }
    }
  };

  useEffect(() => {
    setForm(form);

    const username = session?.data?.user?.name;

    if (
      (session?.status === 'authenticated' && form.values.username === '') ||
      (username !== 'Guest' &&
        session?.status === 'authenticated' &&
        form.values.username === 'Guest')
    ) {
      form.setFieldValue('username', username);
    }
  }, [session?.status, session?.data?.user?.name, form.values.username]);

  useEffect(() => {
    if (!debouncedUsername || debouncedUsername === session?.data?.user?.name)
      return;

    (async () => {
      if (await checkUsername(debouncedUsername, setCheckingUsername)) {
        form.setFieldError('username', 'Username is already taken');
      }
    })();
  }, [debouncedUsername]);

  return (
    <Stack
      flex={1}
      gap="xl"
      component="form"
      onSubmit={form.onSubmit(handleSubmit) as any}
      w={isMobile ? '100%' : 'auto'}
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
          disabled={
            session?.status === 'loading' || editingElement !== 'password'
          }
        />
        {form.values.oldPassword && (
          <PasswordInput
            placeholder="New password"
            leftSection={<MdOutlineLock />}
            required
            key={form.key('newPassword')}
            {...form.getInputProps('newPassword')}
            disabled={
              session?.status === 'loading' || editingElement !== 'password'
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
              session?.status === 'loading' || editingElement !== 'password'
            }
          />
        )}
      </EditableField>
    </Stack>
  );
};

export default Account;
