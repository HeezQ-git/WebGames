import { useEffect } from 'react';
import { useForm } from '@mantine/form';
import { useDebouncedValue } from '@mantine/hooks';
import { checkUsername, validatePassword } from '@/lib/validation';
import { FormValues, useSettingsStore } from '@/stores/settingsStore';
import { useSessionStore } from '@/stores/sessionStore';

export const useAccountForm = () => {
  const { session } = useSessionStore();

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
      newPassword: editingElement === 'password' ? validatePassword : () => null,
    },
    validateInputOnChange: true,
  });

  const [debouncedUsername] = useDebouncedValue(form.values.username, 400);

  useEffect(() => {
    setForm(form);

    const username = session?.data?.user?.name;

    if (
      (session?.status === 'authenticated' && form.values.username === '') ||
      (username !== 'Guest' && session?.status === 'authenticated' && form.values.username === 'Guest')
    ) {
      form.setFieldValue('username', username);
    }
  }, [session?.status, session?.data?.user?.name, form.values.username]);

  useEffect(() => {
    if (!debouncedUsername || debouncedUsername === session?.data?.user?.name) return;

    (async () => {
      if (await checkUsername(debouncedUsername, setCheckingUsername)) {
        form.setFieldError('username', 'Username is already taken');
      }
    })();
  }, [debouncedUsername]);

  return { form, editingElement, checkingUsername, setEditingElement };
};
